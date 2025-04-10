import { Document, Types } from 'mongoose';
export declare class Comment {
    author: Types.ObjectId;
    content: string;
    taskId: Types.ObjectId;
    parentComment?: Types.ObjectId;
    mentions: Types.ObjectId[];
}
export type CommentDocument = Comment & Document;
export declare const CommentSchema: import("mongoose").Schema<Comment, import("mongoose").Model<Comment, any, any, any, Document<unknown, any, Comment> & Comment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Comment, Document<unknown, {}, import("mongoose").FlatRecord<Comment>> & import("mongoose").FlatRecord<Comment> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
