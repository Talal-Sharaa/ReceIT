import { z } from 'zod';
import { priorities, statuses } from './types';

export const receitSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().min(3, { message: "Description must be at least 3 characters." }).optional().or(z.literal('')),
  priority: z.enum(priorities),
  category: z.string().min(1, { message: "Category is required." }),
  effort: z.coerce.number().min(0, { message: "Effort must be a positive number." }),
  startDate: z.date(),
  dueDate: z.date(),
  status: z.enum(statuses).default('To-Do'),
  linkedReceits: z.array(z.string()).default([]),
}).refine(data => data.dueDate >= data.startDate, {
  message: "Due date cannot be earlier than start date.",
  path: ["dueDate"],
});
