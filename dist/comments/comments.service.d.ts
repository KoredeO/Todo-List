import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { RealtimeGateway } from '../realtime/realtime.gateway';
export declare class CommentsService {
    private commentModel;
    private realtimeGateway;
    constructor(commentModel: Model<CommentDocument>, realtimeGateway: RealtimeGateway);
    create(taskId: string, userId: Types.ObjectId, content: string, parentCommentId?: string, mentions?: string[]): Promise<Comment>;
    findByTask(taskId: string): Promise<Comment[]>;
    update(commentId: string, userId: Types.ObjectId, content: string): Promise<Comment>;
    delete(commentId: string, userId: Types.ObjectId): Promise<void>;
    getThreadComments(parentCommentId: string): Promise<Comment[]>;
}
