import React from "react";
import { IconFolderOpen } from "@tabler/icons-react";

const RecordDetailsHeader = ({ recordName }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
        <IconFolderOpen size={24} className="text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-jakarta">{recordName}</h1>
        <p className="text-sm text-gray-600">Medical Record Details</p>
      </div>
    </div>
  );
};

export default RecordDetailsHeader;
