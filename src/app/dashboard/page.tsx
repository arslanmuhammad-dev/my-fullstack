import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { AiAssistant } from "./ai-assistant";
import { NewTaskForm } from "./new-task-form";
import { TaskBoard } from "./task-board";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  const allTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, user.id))
    .orderBy(desc(tasks.createdAt));

  const stats = {
    total: allTasks.length,
    done: allTasks.filter((t) => t.status === "done").length,
    inProgress: allTasks.filter((t) => t.status === "in_progress").length,
    todo: allTasks.filter((t) => t.status === "todo").length,
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome back, {user.name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s on your plate today.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="To do" value={stats.todo} />
        <StatCard label="In progress" value={stats.inProgress} />
        <StatCard label="Done" value={stats.done} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-lg border p-6 bg-card">
            <h2 className="font-medium mb-4">New task</h2>
            <NewTaskForm />
          </section>
          <section>
            <h2 className="font-medium mb-4">Your tasks</h2>
            <TaskBoard tasks={allTasks} />
          </section>
        </div>
        <aside className="rounded-lg border bg-card overflow-hidden h-[600px] sticky top-24">
          <AiAssistant />
        </aside>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border p-4 bg-card">
      <p className="text-xs text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}
