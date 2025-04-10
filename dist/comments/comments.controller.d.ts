import { CommentsService } from './comments.service';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(taskId: string, createCommentDto: {
        content: string;
        parentCommentId?: string;
        mentions?: string[];
    }, req: any): Promise<import("./schemas/comment.schema").Comment>;
    findByTask(taskId: string): Promise<import("./schemas/comment.schema").Comment[]>;
    update(id: string, updateCommentDto: {
        content: string;
    }, req: any): Promise<import("./schemas/comment.schema").Comment>;
    remove(id: string, req: any): Promise<void>;
    getThreadComments(parentCommentId: string): Promise<import("./schemas/comment.schema").Comment[]>;
}
