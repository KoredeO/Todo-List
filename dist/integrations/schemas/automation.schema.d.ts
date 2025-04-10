import { Document, Types } from 'mongoose';
export declare enum AutomationTrigger {
    TASK_CREATED = "task.created",
    TASK_UPDATED = "task.updated",
    TASK_COMPLETED = "task.completed",
    DUE_DATE_APPROACHING = "due_date.approaching",
    COMMENT_ADDED = "comment.added",
    TASK_ASSIGNED = "task.assigned"
}
export declare enum AutomationAction {
    UPDATE_TASK = "update_task",
    CREATE_TASK = "create_task",
    SEND_EMAIL = "send_email",
    SEND_NOTIFICATION = "send_notification",
    ASSIGN_TASK = "assign_task",
    SET_PRIORITY = "set_priority"
}
export declare class Automation {
    name: string;
    trigger: AutomationTrigger;
    conditions: {
        field: string;
        operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
        value: any;
    }[];
    actions: {
        type: AutomationAction;
        params: Record<string, any>;
    }[];
    owner: Types.ObjectId;
    isActive: boolean;
    executionCount: number;
    lastExecution: Date;
}
export type AutomationDocument = Automation & Document;
export declare const AutomationSchema: import("mongoose").Schema<Automation, import("mongoose").Model<Automation, any, any, any, Document<unknown, any, Automation> & Automation & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Automation, Document<unknown, {}, import("mongoose").FlatRecord<Automation>> & import("mongoose").FlatRecord<Automation> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
