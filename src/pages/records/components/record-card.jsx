import React from "react";
import { IconChevronRight, IconFolder, IconFileText, IconCalendar } from "@tabler/icons-react";

const RecordCard = ({ record, onNavigate }) => {
  // Parse kanban data to get task counts
  let taskCount = 0;
  let completedTasks = 0;
  
  if (record.kanbanRecords) {
    try {
      const kanban = JSON.parse(record.kanbanRecords);
      taskCount = kanban.tasks?.length || 0;
      completedTasks = kanban.tasks?.filter(task => task.columnId === "done").length || 0;
    } catch (error) {
      console.error("Failed to parse kanban records:", error);
    }
  }

  const completionPercentage = taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0;

  return (
    <div 
      onClick={() => onNavigate(record.recordName)}
      className="group relative bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 p-6 hover:shadow-premium hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden card-hover"
    >
      {/* Background Gradient on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Icon and Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
            <IconFolder size={28} className="text-white" />
          </div>
          
          {taskCount > 0 && (
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              {completionPercentage}%
            </div>
          )}
        </div>

        {/* Record Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 font-jakarta line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {record.recordName}
        </h3>

        {/* Stats */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <IconFileText size={16} className="text-gray-400" />
            <span>{taskCount} {taskCount === 1 ? 'task' : 'tasks'}</span>
          </div>
          
          {record.createdAt && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <IconCalendar size={16} className="text-gray-400" />
              <span>{new Date(record.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {taskCount > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>Progress</span>
              <span className="font-semibold">{completedTasks}/{taskCount}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* View Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 group-hover:border-blue-200 transition-colors duration-300">
          <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
            View Details
          </span>
          <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
            <IconChevronRight size={18} className="text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordCard;
