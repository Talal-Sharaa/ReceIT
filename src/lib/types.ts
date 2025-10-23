import type { z } from 'zod';
import { receitSchema } from './schemas';

export type Priority = 'Low' | 'Medium' | 'High';
export const priorities: [Priority, ...Priority[]] = ['Low', 'Medium', 'High'];

export type Status = 'To-Do' | 'Done';
export const statuses: [Status, ...Status[]] = ['To-Do', 'Done'];

export type Receit = z.infer<typeof receitSchema>;
