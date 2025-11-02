import React, { useState } from "react";
import {
  IconChevronRight,
  IconFileUpload,
  IconProgress,
} from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/index";
import ReactMarkdown from "react-markdown";
import FileUploadModal from "./components/file-upload-modal";
import RecordDetailsHeader from "./components/record-details-header";
import { GoogleGenerativeAI } from "@google/generative-ai";
import mammoth from "mammoth";
import { jsPDF } from "jspdf";

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

function SingleRecordDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [processing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(
    state.analysisResult || "",
  );
  const [filename, setFilename] = useState("");
  const [filetype, setFileType] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { updateRecord, fetchRecordById } = useStateContext();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const generatePreview = async (file) => {
    const fileType = file.type;
    
    // For images, directly use as preview
    if (fileType.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      return;
    }
    
    // For PDFs, render first page
    if (fileType === "application/pdf") {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;
        
        setFilePreview(canvas.toDataURL());
      } catch (error) {
        console.error("Error generating PDF preview:", error);
        setFilePreview(null);
      }
      return;
    }
    
    // For Word docs, show document icon (no preview)
    if (
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileType === "application/msword"
    ) {
      setFilePreview("word-doc");
      return;
    }
    
    setFilePreview(null);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    console.log("Selected file:", file);
    setFileType(file.type);
    setFilename(file.name);
    setFile(file);
    
    // Generate preview
    await generatePreview(file);
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const convertWordToPdf = async (file) => {
    try {
      // Read Word document as array buffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Convert Word document to HTML using mammoth
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const htmlContent = result.value;
      
      // Create a temporary div to parse HTML and extract text
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;
      
      // Extract text content (remove HTML tags but preserve structure)
      const textContent = tempDiv.innerText || tempDiv.textContent || "";
      
      // Create PDF using jsPDF
      const pdf = new jsPDF();
      
      // Split text into chunks that fit on a page
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const maxWidth = pageWidth - 2 * margin;
      
      // Split text into lines that fit
      const lines = pdf.splitTextToSize(textContent, maxWidth);
      
      let y = margin;
      const lineHeight = 7;
      
      lines.forEach((line) => {
        if (y + lineHeight > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
        pdf.text(line, margin, y);
        y += lineHeight;
      });
      
      // Convert PDF to blob
      const pdfBlob = pdf.output("blob");
      
      // Convert blob to File object
      const pdfFile = new File(
        [pdfBlob],
        file.name.replace(/\.(docx?|doc)$/i, ".pdf"),
        { type: "application/pdf" }
      );
      
      return pdfFile;
    } catch (error) {
      console.error("Error converting Word to PDF:", error);
      throw new Error(
        `Failed to convert Word document to PDF: ${error.message}`
      );
    }
  };

  const handleFileUpload = async () => {
    setUploading(true);
    setUploadSuccess(false);

    const genAI = new GoogleGenerativeAI(geminiApiKey);

    try {
      // Using gemini-2.0-flash for cost-effective medical analysis
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `You are an expert cancer and any disease diagnosis analyst. Use your knowledge base to answer questions about giving personalized recommended treatments.
        give a detailed treatment plan for me, make it more readable, clear and easy to understand make it paragraphs to make it more readable
        `;

      let result;
      
      // Check file type
      const isImage = filetype.startsWith("image/");
      const isPdf = filetype === "application/pdf";
      const isWordDoc = 
        filetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        filetype === "application/msword" ||
        filename.toLowerCase().endsWith(".docx") ||
        filename.toLowerCase().endsWith(".doc");
      
      let fileToProcess = file;
      let finalMimeType = filetype;
      
      // Automatically convert Word documents to PDF
      if (isWordDoc) {
        try {
          console.log("Converting Word document to PDF...");
          fileToProcess = await convertWordToPdf(file);
          finalMimeType = "application/pdf";
          console.log("Word document converted to PDF successfully");
        } catch (error) {
          console.error("Conversion error:", error);
          throw error;
        }
      }
      
      if (isImage) {
        // Handle images with inlineData
        const base64Data = await readFileAsBase64(fileToProcess);
        const imageParts = [
          {
            inlineData: {
              data: base64Data,
              mimeType: finalMimeType,
            },
          },
        ];
        result = await model.generateContent([prompt, ...imageParts]);
      } else if (isPdf || isWordDoc) {
        // Handle PDF documents (including converted Word docs) - convert to base64 and use inlineData
        const base64Data = await readFileAsBase64(fileToProcess);
        const documentParts = [
          {
            inlineData: {
              data: base64Data,
              mimeType: "application/pdf",
            },
          },
        ];
        result = await model.generateContent([prompt, ...documentParts]);
      } else {
        // For other unsupported formats, show error
        throw new Error(
          `Unsupported file type: ${filetype || "unknown"}. Please upload an image (JPG, PNG, WEBP), PDF, or Word document (DOCX, DOC).`
        );
      }

      const response = await result.response;
      const text = response.text();
      setAnalysisResult(text);
      const updatedRecord = await updateRecord({
        documentID: state.id,
        analysisResult: text,
        kanbanRecords: "",
      });
      setUploadSuccess(true);
      setIsModalOpen(false); // Close the modal after a successful upload
      setFilename("");
      setFile(null);
      setFileType("");
      setFilePreview(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(
        error.message ||
          "Failed to upload file. Please ensure you're uploading an image, PDF, or Word document (DOCX, DOC)."
      );
      setUploadSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  const extractJsonFromText = (text) => {
    // Remove markdown code blocks (```json ... ```)
    let cleanedText = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    // Try to find JSON object boundaries
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }
    
    return cleanedText;
  };

  const processTreatmentPlan = async () => {
    setIsProcessing(true);

    try {
      // Fetch the latest record data from database to get any updates
      const latestRecord = await fetchRecordById(state.id);
      
      // Check if kanbanRecords already exists - if yes, just navigate
      if (latestRecord?.kanbanRecords && latestRecord.kanbanRecords.trim() !== "") {
        console.log("Treatment plan exists, navigating to screening-schedules");
        navigate("/screening-schedules");
        setIsProcessing(false);
        return;
      }

      // If no existing plan, generate a new one
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Your role and goal is to be an that will be using this treatment plan ${analysisResult} to create Columns:
                  - Todo: Tasks that need to be started
                  - Doing: Tasks that are in progress
                  - Done: Tasks that are completed
            
                  Each task should include a brief description. The tasks should be categorized appropriately based on the stage of the treatment process.
            
                  IMPORTANT: Return ONLY valid JSON without any markdown code blocks, backticks, or additional text. Return pure JSON that can be directly parsed.
            
                  Return the results in this exact format:

                  {
                    "columns": [
                      { "id": "todo", "title": "Todo" },
                      { "id": "doing", "title": "Work in progress" },
                      { "id": "done", "title": "Done" }
                    ],
                    "tasks": [
                      { "id": "1", "columnId": "todo", "content": "Example task 1" },
                      { "id": "2", "columnId": "todo", "content": "Example task 2" },
                      { "id": "3", "columnId": "doing", "content": "Example task 3" },
                      { "id": "4", "columnId": "doing", "content": "Example task 4" },
                      { "id": "5", "columnId": "done", "content": "Example task 5" }
                    ]
                  }
                              
                  `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log("Raw response text:", text);
      
      // Extract JSON from the response (removing markdown code blocks)
      const jsonText = extractJsonFromText(text);
      console.log("Extracted JSON:", jsonText);
      
      const parsedResponse = JSON.parse(jsonText);

      console.log("Parsed response:", parsedResponse);
      
      const updatedRecord = await updateRecord({
        documentID: state.id,
        kanbanRecords: jsonText,
      });
      console.log("Treatment plan generated and saved:", updatedRecord);
      
      // Navigate to screening-schedules to show all plans
      navigate("/screening-schedules");
    } catch (error) {
      console.error("Error processing treatment plan:", error);
      alert(
        `Failed to process treatment plan: ${error.message}\n\nPlease try again.`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Upload Button */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <RecordDetailsHeader recordName={state.recordName} />
        <button
          type="button"
          onClick={handleOpenModal}
          className="btn-primary inline-flex items-center gap-x-2"
        >
          <IconFileUpload size={20} />
          Upload Reports
        </button>
      </div>

      <FileUploadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onFileChange={handleFileChange}
        onFileUpload={handleFileUpload}
        uploading={uploading}
        uploadSuccess={uploadSuccess}
        filename={filename}
        filePreview={filePreview}
        filetype={filetype}
      />

      {/* Treatment Plan Card */}
      <div className="w-full animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/40 shadow-premium overflow-hidden">
          {/* Card Header */}
          <div className="relative px-8 py-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-200/60">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 font-jakarta">
                    Personalized AI-Driven Treatment Plan
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    A tailored medical strategy leveraging advanced AI insights
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="px-8 py-6">
            {analysisResult ? (
              <div>
                <h3 className="text-lg font-bold text-gray-900 font-jakarta mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></span>
                  Analysis Result
                </h3>
                <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-li:text-gray-700">
                  <ReactMarkdown>{analysisResult}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <IconFileUpload size={40} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No analysis yet</h3>
                <p className="text-gray-600">Upload a medical report to get started</p>
              </div>
            )}

            {/* Action Button */}
            {analysisResult && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={processTreatmentPlan}
                  disabled={!analysisResult || processing}
                  className="btn-primary inline-flex items-center gap-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>
                      <IconProgress className="h-5 w-5 animate-spin" />
                      Generating Treatment Plan...
                    </>
                  ) : (
                    <>
                      View Treatment Plan
                      <IconChevronRight size={20} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleRecordDetails;
