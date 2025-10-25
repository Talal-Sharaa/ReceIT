import { z } from 'zod';

export type Priority = 'Low' | 'Medium' | 'High';
export const priorities: [Priority, ...Priority[]] = ['Low', 'Medium', 'High'];

export type Status = 'To-Do' | 'Done';
export const statuses: [Status, ...Status[]] = ['To-Do', 'Done'];

export const receitSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().min(3, { message: "Description must be at least 3 characters." }).optional().or(z.literal('')),
  priority: z.enum(priorities),
  category: z.string().min(1, { message: "Category is required." }),
  effort: z.coerce.number().min(0, { message: "Effort must be a positive number." }),
  startDate: z.date(),
  dueDate: z.date(),
  status: z.enum(statuses).default('To-Do'),
  linkedReceits: z.array(z.string()).default([]),
  notes: z.array(z.string()).default([]),
}).refine(data => data.dueDate >= data.startDate, {
  message: "Due date cannot be earlier than start date.",
  path: ["dueDate"],
});

export type Receit = z.infer<typeof receitSchema>;
