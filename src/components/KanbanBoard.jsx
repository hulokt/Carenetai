import React, { useMemo, useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import ColumnContainer from "./ColumnContainer";
import TaskCard from "./TaskCard";
import { IconPlus } from "@tabler/icons-react";
import { useStateContext } from "../context";

function KanbanBoard({ state, recordId, isMultiRecord = false, availableRecords = [] }) {
  const { updateRecord } = useStateContext();
  
  const defaultCols =
    state?.columns?.map((col) => ({
      id: col?.id,
      title: col?.title,
    })) || [];

  const defaultTasks =
    state?.tasks?.map((task) => ({
      id: task?.id,
      columnId: task?.columnId,
      content: task?.content,
      originalRecordId: task?.originalRecordId, // Preserve record tracking
      originalTaskId: task?.originalTaskId,     // Preserve task tracking
    })) || [];

  const [columns, setColumns] = useState(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [tasks, setTasks] = useState(defaultTasks);
  const [activeColumn, setActiveColumn] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
  );

  // Sync state with props when they change (from parent component)
  useEffect(() => {
    if (state?.columns && state?.tasks) {
      setColumns(state.columns.map((col) => ({ id: col?.id, title: col?.title })));
      setTasks(state.tasks.map((task) => ({
        id: task?.id,
        columnId: task?.columnId,
        content: task?.content,
        originalRecordId: task?.originalRecordId,
        originalTaskId: task?.originalTaskId,
      })));
      setIsInitialLoad(true); // Reset flag when new data loads
      // Mark as loaded after a short delay to prevent saving initial state
      const timer = setTimeout(() => {
    setIsInitialLoad(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state?.columns?.length, state?.tasks?.length]);

  // Save kanban state to database whenever columns or tasks change (but not on initial load)
  useEffect(() => {
    // Skip saving on initial load
    if (isInitialLoad) {
      console.log("⏸️ Skipping save - initial load");
      return;
    }
    
    // Don't save if no columns or tasks
    if (columns.length === 0 && tasks.length === 0) {
      console.log("⏸️ Skipping save - no data");
      return;
    }
    
    const saveToDatabase = async () => {
      console.log("💾 Starting save...", { 
        columns: columns.length, 
        tasks: tasks.length,
        isMultiRecord,
        recordId 
      });
      // Single record mode - save normally
      if (!isMultiRecord && recordId && recordId !== "all") {
        const kanbanData = {
          columns: columns,
          tasks: tasks,
        };
        
        try {
          const result = await updateRecord({
            documentID: recordId,
            kanbanRecords: JSON.stringify(kanbanData),
          });
          console.log("✅ Kanban saved successfully");
        } catch (error) {
          console.error("Error saving kanban state:", error);
        }
        return;
      }
      
      // Multi-record mode - group tasks by record and save each
      if (isMultiRecord) {
        try {
          // Group tasks by their original record ID
          const tasksByRecord = {};
          
          tasks.forEach(task => {
            if (task.originalRecordId) {
              if (!tasksByRecord[task.originalRecordId]) {
                tasksByRecord[task.originalRecordId] = [];
              }
              // Store task without the record name prefix
              const contentWithoutPrefix = task.content.replace(/^\[.*?\]\s*/, '');
              tasksByRecord[task.originalRecordId].push({
                id: task.originalTaskId || task.id,
                columnId: task.columnId,
                content: contentWithoutPrefix,
              });
            }
          });
          
          // Get all available records to ensure we save even if a record has no tasks
          if (!availableRecords || availableRecords.length === 0) {
            console.warn("⚠️ No available records to save to");
            return;
          }
          
          const allRecordIds = availableRecords.map(r => r.id);
          
          // Save each record's tasks (or empty array if no tasks)
          for (let i = 0; i < allRecordIds.length; i++) {
            const recordIdKey = allRecordIds[i];
            const kanbanData = {
              columns: columns,
              tasks: tasksByRecord[recordIdKey] || [], // Empty array if no tasks for this record
            };
            
            // Skip state update for all but the last record to avoid unnecessary re-renders
            const skipStateUpdate = i < allRecordIds.length - 1;
            
            console.log(`💾 Saving record ${recordIdKey}:`, {
              columns: columns.length,
              tasks: tasksByRecord[recordIdKey]?.length || 0,
            });
            
            await updateRecord({
              documentID: recordIdKey,
              kanbanRecords: JSON.stringify(kanbanData),
            }, skipStateUpdate);
          }
          
          console.log(`✅ Multi-record save complete: ${allRecordIds.length} records updated`);
        } catch (error) {
          console.error("❌ Error saving multi-record kanban state:", error);
        }
      }
    };

    // Debounce the save to avoid too many database calls
    const timeoutId = setTimeout(saveToDatabase, 1000);
    return () => clearTimeout(timeoutId);
  }, [columns, tasks, recordId, updateRecord, isInitialLoad, isMultiRecord, availableRecords?.length]);

  // Show message if no columns/tasks loaded
  if (columns.length === 0 && tasks.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-xl shadow-premium p-8 text-center">
          <div className="mb-4 text-5xl">📋</div>
          <h3 className="mb-2 text-xl font-bold text-gray-900 font-jakarta">No Treatment Plan Found</h3>
          <p className="text-gray-600">
            Go to a medical record and click "View Treatment Plan" to generate your plan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-x-auto overflow-y-hidden p-4">
      {isMultiRecord && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50/80 backdrop-blur-sm p-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-700">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">
              Viewing all treatment plans combined. Changes are auto-saved to their respective records.
            </span>
          </div>
        </div>
      )}
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="flex gap-4 min-w-max">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => createNewColumn()}
            className="flex h-[60px] w-[350px] min-w-[350px] cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 text-gray-700 font-medium p-4 ring-blue-500 hover:ring-2 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-all duration-200"
          >
            <IconPlus size={20} />
            <span>Add Column</span>
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id,
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  );

  function createTask(columnId) {
    const newTask = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    
    // In multi-record mode, assign to first available record
    if (isMultiRecord && availableRecords.length > 0) {
      const firstRecord = availableRecords[0];
      newTask.originalRecordId = firstRecord.id;
      newTask.originalTaskId = newTask.id;
      newTask.content = `[${firstRecord.recordName}] Task ${tasks.length + 1}`;
    }
    
    console.log("➕ Creating new task:", newTask);
    setTasks([...tasks, newTask]);
  }

  function deleteTask(id) {
    console.log("🗑️ Deleting task:", id);
    setTasks(tasks.filter((task) => task.id !== id));
  }

  function updateTask(id, content) {
    console.log("✏️ Updating task:", id, content.substring(0, 50));
    const newTasks = tasks.map((task) =>
      task.id === id ? { ...task, content } : task,
    );
    setTasks(newTasks);
  }

  function createNewColumn() {
    const newColumn = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    console.log("➕ Creating new column:", newColumn);
    setColumns([...columns, newColumn]);
  }

  function deleteColumn(id) {
    console.log("🗑️ Deleting column:", id);
    setColumns(columns.filter((col) => col.id !== id));
    setTasks(tasks.filter((task) => task.columnId !== id));
  }

  function updateColumn(id, title) {
    console.log("✏️ Updating column:", id, title);
    setColumns(columns.map((col) => (col.id === id ? { ...col, title } : col)));
  }

  function onDragStart(event) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
    } else if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  }

  function onDragEnd(event) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    if (active.id === over.id) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (isActiveAColumn) {
      console.log("🔄 Moving column:", active.id, "to position of", over.id);
      setColumns((columns) => {
        const activeIndex = columns.findIndex((col) => col.id === active.id);
        const overIndex = columns.findIndex((col) => col.id === over.id);
        return arrayMove(columns, activeIndex, overIndex);
      });
    } else {
      const isActiveATask = active.data.current?.type === "Task";
      const isOverATask = over.data.current?.type === "Task";
      if (isActiveATask && isOverATask) {
        console.log("🔄 Moving task within/between columns");
        setTasks((tasks) => {
          const activeIndex = tasks.findIndex((t) => t.id === active.id);
          const overIndex = tasks.findIndex((t) => t.id === over.id);
          if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
            console.log("📦 Task moved to new column:", tasks[overIndex].columnId);
            // Create new array to preserve all properties
            const newTasks = [...tasks];
            newTasks[activeIndex] = { ...newTasks[activeIndex], columnId: tasks[overIndex].columnId };
            return arrayMove(newTasks, activeIndex, overIndex - 1);
          }
          return arrayMove(tasks, activeIndex, overIndex);
        });
      } else if (isActiveATask) {
        console.log("📦 Task moved to column:", over.id);
        setTasks((tasks) => {
          const activeIndex = tasks.findIndex((t) => t.id === active.id);
          // Create new array and preserve all properties
          const newTasks = [...tasks];
          newTasks[activeIndex] = { ...newTasks[activeIndex], columnId: over.id };
          return arrayMove(newTasks, activeIndex, activeIndex);
        });
      }
    }
  }

  function onDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    if (active.id === over.id) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === active.id);
        const overIndex = tasks.findIndex((t) => t.id === over.id);
        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          // Create new array to preserve all properties
          const newTasks = [...tasks];
          newTasks[activeIndex] = { ...newTasks[activeIndex], columnId: tasks[overIndex].columnId };
          return arrayMove(newTasks, activeIndex, overIndex - 1);
        }
        return arrayMove(tasks, activeIndex, overIndex);
      });
    } else if (isActiveATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === active.id);
        // Create new array and preserve all properties
        const newTasks = [...tasks];
        newTasks[activeIndex] = { ...newTasks[activeIndex], columnId: over.id };
        return arrayMove(newTasks, activeIndex, activeIndex);
      });
    }
  }
}

function generateId() {
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;
