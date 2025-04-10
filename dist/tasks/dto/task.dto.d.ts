import { Priority, TaskStatus } from '../schemas/task.schema';
import { Types } from 'mongoose';
export declare class CreateTaskDto {
    title: string;
    description?: string;
    priority?: Priority;
    tags?: string[];
    dueDate?: Date;
    estimatedTime?: number;
    assignees?: Types.ObjectId[];
    isRecurring?: boolean;
    recurrencePattern?: string;
    parentTask?: Types.ObjectId;
    dependencies?: Types.ObjectId[];
}
export declare class UpdateTaskDto {
    status?: TaskStatus;
    title?: string;
    description?: string;
    priority?: Priority;
    tags?: string[];
    dueDate?: Date;
    estimatedTime?: number;
    assignees?: Types.ObjectId[];
    isRecurring?: boolean;
    recurrencePattern?: string;
    parentTask?: Types.ObjectId;
    dependencies?: Types.ObjectId[];
}
export declare class TaskFilterDto {
    status?: TaskStatus;
    priority?: Priority;
    tags?: string[];
    dueDateStart?: Date;
    dueDateEnd?: Date;
    isRecurring?: boolean;
}
export declare class CreateSubtaskDto {
    title: string;
    description?: string;
}
