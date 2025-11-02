import React, { useState } from "react";
import Modal from "./Modal";
import { IconFolder } from "@tabler/icons-react";

const CreateRecordModal = ({ isOpen, onClose, onCreate }) => {
  const [foldername, setFoldername] = useState("");

  const handleCreate = () => {
    if (foldername.trim()) {
      onCreate(foldername);
      setFoldername("");
    }
  };

  return (
    <Modal
      title="Create New Medical Record"
      isOpen={isOpen}
      onClose={onClose}
      onAction={handleCreate}
      actionLabel="Create Record"
      disabled={!foldername.trim()}
    >
      <div className="space-y-6">
        {/* Icon */}
        <div className="flex justify-center mb-2">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <IconFolder size={32} className="text-white" />
          </div>
        </div>

        {/* Form */}
        <div>
          <label
            htmlFor="folder-name"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Record Name
          </label>
          <div className="relative">
            <input
              id="folder-name"
              value={foldername}
              onChange={(e) => setFoldername(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && foldername.trim()) {
                  handleCreate();
                }
              }}
              type="text"
              placeholder="Enter record name (e.g., Annual Checkup 2024)"
              className="block w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 hover:border-gray-300"
              required
              autoFocus
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Give your medical record a descriptive name to easily identify it later.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default CreateRecordModal;
