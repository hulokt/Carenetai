import React, { useEffect, useState, useRef } from "react";
import KanbanBoard from "../components/KanbanBoard";
import { useStateContext } from "../context";

const ScreeningSchedule = () => {
  const { records, user, fetchUserRecords } = useStateContext();
  const [combinedData, setCombinedData] = useState({ columns: [], tasks: [] });
  const [loading, setLoading] = useState(true);
  const hasLoadedRef = useRef(false);

  // Disable page scroll when component mounts - MUST be before conditional returns
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const loadAllTreatmentPlans = async () => {
      // Prevent infinite loop - only load once
      if (hasLoadedRef.current) return;
      
      setLoading(true);
      
      // Fetch all user records if not already loaded
      if (user?.email?.address && records.length === 0) {
        await fetchUserRecords(user.email.address);
        hasLoadedRef.current = true;
        return; // Wait for next render with loaded records
      }

      // Load columns from first record with kanban data, or use defaults
      let loadedColumns = [
        { id: "todo", title: "Todo" },
        { id: "doing", title: "Work in progress" },
        { id: "done", title: "Done" }
      ];

      // Try to load columns from the first record that has them
      for (const record of records) {
        if (record.kanbanRecords && record.kanbanRecords.trim() !== "") {
          try {
            const parsedKanban = JSON.parse(record.kanbanRecords);
            if (parsedKanban.columns && Array.isArray(parsedKanban.columns) && parsedKanban.columns.length > 0) {
              loadedColumns = parsedKanban.columns;
              break; // Use columns from first record
            }
          } catch (error) {
            console.error(`Error parsing columns from ${record.recordName}:`, error);
          }
        }
      }

      // Combine all kanban records from all medical records
      const allTasks = [];
      let taskIdCounter = 1;

      records.forEach((record) => {
        if (record.kanbanRecords && record.kanbanRecords.trim() !== "") {
          try {
            const parsedKanban = JSON.parse(record.kanbanRecords);
            
            // Add tasks from this record with record name prefix
            if (parsedKanban.tasks && Array.isArray(parsedKanban.tasks)) {
              parsedKanban.tasks.forEach((task) => {
                allTasks.push({
                  id: `${record.id}-${task.id}-${taskIdCounter++}`,
                  columnId: task.columnId,
                  content: `[${record.recordName}] ${task.content}`,
                  originalRecordId: record.id,
                  originalTaskId: task.id
                });
              });
            }
          } catch (error) {
            console.error(`Error parsing kanban records for ${record.recordName}:`, error);
          }
        }
      });

      console.log("Combined treatment plans loaded:", { 
        totalRecords: records.length, 
        totalTasks: allTasks.length 
      });

      setCombinedData({
        columns: loadedColumns,
        tasks: allTasks
      });
      setLoading(false);
      hasLoadedRef.current = true;
    };

    loadAllTreatmentPlans();
  }, [records.length, user?.email?.address]); // Only depend on length, not the array itself

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">⏳</span>
          </div>
          <p className="text-xl font-bold text-gray-900 mb-2 font-jakarta">Loading Treatment Plans</p>
          <p className="text-gray-600">Please wait while we fetch your data...</p>
          <div className="mt-6 spinner mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden">
      <KanbanBoard 
        state={combinedData} 
        recordId="all" 
        isMultiRecord={true}
        availableRecords={records}
      />
    </div>
  );
};

export default ScreeningSchedule;
