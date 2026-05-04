"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteTask, updateTaskStatus } from "./actions";
import { Button } from "@/components/ui/button";
import type { Task } from "@/lib/db/schema";
import { cn, formatDate } from "@/lib/utils";

const COLUMNS: { key: Task["status"]; label: string }[] = [
  { key: "todo", label: "To do" },
  { key: "in_progress", label: "In progress" },
  { key: "done", label: "Done" },
];

export function TaskBoard({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center bg-card">
        <p className="text-muted-foreground">
          No tasks yet. Add one above to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.key);
        return (
          <div key={col.key} className="rounded-lg border bg-card">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <h3 className="text-sm font-medium">{col.label}</h3>
              <span className="text-xs text-muted-foreground">
                {columnTasks.length}
              </span>
            </div>
            <div className="p-3 space-y-2 min-h-[120px]">
              {columnTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const [isPending, startTransition] = useTransition();

  function moveTo(status: Task["status"]) {
    startTransition(() => updateTaskStatus(task.id, status));
  }

  function remove() {
    startTransition(() => deleteTask(task.id));
  }

  const priorityColor = {
    low: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
    medium: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
    high: "bg-red-500/10 text-red-700 dark:text-red-300",
  }[task.priority];

  return (
    <div
      className={cn(
        "rounded-md border bg-background p-3 space-y-2 transition-opacity",
        isPending && "opacity-50",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-tight flex-1">{task.title}</p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={remove}
          disabled={isPending}
          aria-label="Delete task"
          className="-mr-1 -mt-1 h-7 w-7 text-muted-foreground hover:text-red-600"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      {task.description ? (
        <p className="text-xs text-muted-foreground line-clamp-2">
          {task.description}
        </p>
      ) : null}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={cn(
            "text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wide",
            priorityColor,
          )}
        >
          {task.priority}
        </span>
        {task.dueDate ? (
          <span className="text-[10px] text-muted-foreground">
            Due {formatDate(task.dueDate)}
          </span>
        ) : null}
      </div>
      <div className="flex gap-1 pt-1">
        {COLUMNS.filter((c) => c.key !== task.status).map((c) => (
          <Button
            key={c.key}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => moveTo(c.key)}
            disabled={isPending}
            className="text-[10px] h-6 px-2"
          >
            → {c.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
