import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import TaskCard from "./TaskCard";
import { IconPlus, IconTrash } from "@tabler/icons-react";

function ColumnContainer({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}) {
  const [editMode, setEditMode] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex h-[500px] max-h-[500px] w-[350px] flex-col rounded-md border-2 border-pink-500 bg-white/80 backdrop-blur-xl opacity-40 shadow-lg"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex h-[500px] max-h-[500px] w-[350px] flex-col rounded-2xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-premium"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="text-md m-2 flex h-[60px] cursor-grab items-center justify-between rounded-xl bg-white/90 backdrop-blur-sm border border-gray-200 p-3 font-bold text-gray-900 hover:bg-white transition-colors"
      >
        <div className="flex gap-2">
          {!editMode && <span className="text-gray-900 font-jakarta">{column.title}</span>}
          {editMode && (
            <input
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteColumn(column.id);
          }}
          className="rounded-lg stroke-gray-500 px-2 py-1.5 hover:bg-red-50 hover:stroke-red-600 transition-colors"
        >
          <IconTrash size={18} />
        </button>
      </div>

      <div className="flex flex-grow flex-col gap-4 overflow-y-auto overflow-x-hidden p-2 custom-scrollbar">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>

      <button
        className="m-2 flex items-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-4 text-gray-700 font-medium hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-all duration-200 active:bg-blue-100"
        onClick={() => {
          createTask(column.id);
        }}
      >
        <IconPlus size={20} />
        <span>Add task</span>
      </button>
    </div>
  );
}

export default ColumnContainer;

