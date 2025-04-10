import { Document, Types } from 'mongoose';
export declare enum Priority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT"
}
export declare enum TaskStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    ARCHIVED = "ARCHIVED"
}
export declare class Task {
    title: string;
    description: string;
    status: TaskStatus;
    priority: Priority;
    tags: string[];
    dueDate: Date;
    estimatedTime: number;
    owner: Types.ObjectId;
    assignees: Types.ObjectId[];
    isRecurring: boolean;
    recurrencePattern: string;
    subtasks: Types.ObjectId[];
    parentTask: Types.ObjectId;
    dependencies: Types.ObjectId[];
    delete_flag: number;
}
export type TaskDocument = Task & Document;
export declare const TaskSchema: import("mongoose").Schema<Task, import("mongoose").Model<Task, any, any, any, Document<unknown, any, Task> & Task & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Task, Document<unknown, {}, import("mongoose").FlatRecord<Task>> & import("mongoose").FlatRecord<Task> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
