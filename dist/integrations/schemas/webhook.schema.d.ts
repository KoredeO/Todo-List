import { Document, Types } from 'mongoose';
export declare enum WebhookEvent {
    TASK_CREATED = "task.created",
    TASK_UPDATED = "task.updated",
    TASK_DELETED = "task.deleted",
    COMMENT_CREATED = "comment.created",
    TASK_ASSIGNED = "task.assigned",
    TASK_COMPLETED = "task.completed"
}
export declare class Webhook {
    name: string;
    url: string;
    secret: string;
    events: WebhookEvent[];
    owner: Types.ObjectId;
    isActive: boolean;
    headers: Record<string, string>;
    failureCount: number;
    lastFailure: Date;
    lastSuccess: Date;
}
export type WebhookDocument = Webhook & Document;
export declare const WebhookSchema: import("mongoose").Schema<Webhook, import("mongoose").Model<Webhook, any, any, any, Document<unknown, any, Webhook> & Webhook & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Webhook, Document<unknown, {}, import("mongoose").FlatRecord<Webhook>> & import("mongoose").FlatRecord<Webhook> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
