import React from "react";
import Modal from "./Modal";
import { IconProgress, IconCloudUpload, IconFileText } from "@tabler/icons-react";

const FileUploadModal = ({
  isOpen,
  onClose,
  onFileChange,
  onFileUpload,
  uploading,
  uploadSuccess,
  filename,
  filePreview,
  filetype,
}) => {
  return (
    <Modal
      title="Upload Medical Reports"
      isOpen={isOpen}
      onClose={onClose}
      onAction={onFileUpload}
      actionLabel={uploading ? "Analyzing..." : "Upload and Analyze"}
      disabled={!filename || uploading}
    >
      {/* Image Preview */}
      {filePreview && filePreview !== "word-doc" && (
        <div className="mb-6 rounded-2xl border-2 border-blue-200/60 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="flex-shrink-0">
              <img
                src={filePreview}
                alt="Document preview"
                className="max-h-64 w-auto max-w-full rounded-xl border-2 border-white object-contain shadow-lg"
              />
            </div>
            <div className="w-full text-center">
              <p className="truncate text-sm font-semibold text-gray-900">
                {filename}
              </p>
              <p className="mt-1 text-xs text-gray-600">
                {filetype || "Document preview"}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Word Document Preview */}
      {filePreview === "word-doc" && (
        <div className="mb-6 rounded-2xl border-2 border-blue-200/60 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
              <IconFileText size={32} className="text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">
                {filename}
              </p>
              <p className="mt-1 text-xs text-gray-600">
                Word Document
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* File Upload Area */}
      <label
        htmlFor="fileInputDragDrop"
        className={`flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 transition-all duration-200 ${
          filePreview 
            ? "border-blue-400 bg-blue-50/50 hover:bg-blue-50" 
            : "border-gray-300 bg-gray-50/50 hover:border-blue-400 hover:bg-blue-50/50"
        }`}
        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      >
        <input
          id="fileInputDragDrop"
          type="file"
          className="sr-only"
          aria-describedby="validFileFormats"
          onChange={onFileChange}
          accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
          disabled={uploading}
        />
        <IconCloudUpload size={48} className="text-blue-600 opacity-75 pointer-events-none" />
        <div className="pointer-events-none text-center">
          <span className="font-semibold text-blue-700">
            Click to browse{" "}
          </span>
          <span className="text-gray-600">or drag and drop</span>
        </div>
        <small id="validFileFormats" className="pointer-events-none text-xs text-gray-500 font-medium">
          PNG, PDF, JPEG, DOC, DOCX • Max 5MB
        </small>
      </label>
      
      {/* Loading State */}
      {uploading && (
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-blue-50 border border-blue-200 px-4 py-3">
          <IconProgress className="h-5 w-5 animate-spin text-blue-600" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-900">Analyzing document...</p>
            <p className="text-xs text-blue-700">This may take a few moments</p>
          </div>
        </div>
      )}

      {/* Success State */}
      {uploadSuccess && (
        <div className="mt-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3">
          <p className="text-sm font-semibold text-green-800">✓ Analysis complete!</p>
        </div>
      )}
    </Modal>
  );
};

export default FileUploadModal;
