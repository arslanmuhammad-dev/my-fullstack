"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";
import { randomId } from "@/lib/utils";

const createSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.string().optional(),
});

export async function createTask(formData: FormData) {
  const user = await requireUser();
  const parsed = createSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    priority: formData.get("priority") || "medium",
    dueDate: formData.get("dueDate") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await db.insert(tasks).values({
    id: randomId(),
    userId: user.id,
    title: parsed.data.title,
    description: parsed.data.description || null,
    priority: parsed.data.priority,
    dueDate: parsed.data.dueDate || null,
  });

  revalidatePath("/dashboard");
}

export async function updateTaskStatus(
  taskId: string,
  status: "todo" | "in_progress" | "done",
) {
  const user = await requireUser();
  await db
    .update(tasks)
    .set({ status, updatedAt: new Date().toISOString() })
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.id)));

  revalidatePath("/dashboard");
}

export async function deleteTask(taskId: string) {
  const user = await requireUser();
  await db
    .delete(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.id)));

  revalidatePath("/dashboard");
}
