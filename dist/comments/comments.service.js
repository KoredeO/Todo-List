"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const comment_schema_1 = require("./schemas/comment.schema");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
let CommentsService = class CommentsService {
    commentModel;
    realtimeGateway;
    constructor(commentModel, realtimeGateway) {
        this.commentModel = commentModel;
        this.realtimeGateway = realtimeGateway;
    }
    async create(taskId, userId, content, parentCommentId, mentions = []) {
        const comment = new this.commentModel({
            author: userId,
            content,
            taskId: new mongoose_2.Types.ObjectId(taskId),
            parentComment: parentCommentId ? new mongoose_2.Types.ObjectId(parentCommentId) : undefined,
            mentions: mentions.map(id => new mongoose_2.Types.ObjectId(id)),
        });
        const savedComment = await comment.save();
        const populatedComment = await this.commentModel.findById(savedComment._id)
            .populate('author', 'email name')
            .populate('mentions', 'email name')
            .exec();
        this.realtimeGateway.server.to(`task:${taskId}`).emit('commentAdded', {
            taskId,
            comment: populatedComment,
        });
        if (!populatedComment) {
            throw new common_1.NotFoundException('Comment not found after creation');
        }
        return populatedComment;
    }
    async findByTask(taskId) {
        return this.commentModel
            .find({ taskId: new mongoose_2.Types.ObjectId(taskId) })
            .populate('author', 'email name')
            .populate('mentions', 'email name')
            .populate('parentComment')
            .sort({ createdAt: 1 })
            .exec();
    }
    async update(commentId, userId, content) {
        const comment = await this.commentModel
            .findOneAndUpdate({ _id: commentId, author: userId }, { content }, { new: true })
            .populate('author', 'email name')
            .populate('mentions', 'email name')
            .exec();
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found or unauthorized');
        }
        this.realtimeGateway.server.to(`task:${comment.taskId}`).emit('commentUpdated', {
            taskId: comment.taskId,
            comment,
        });
        return comment;
    }
    async delete(commentId, userId) {
        const comment = await this.commentModel.findOne({ _id: commentId });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        if (comment.author.toString() !== userId.toString()) {
            throw new common_1.NotFoundException('Unauthorized to delete this comment');
        }
        await this.commentModel.deleteOne({ _id: commentId });
        this.realtimeGateway.server.to(`task:${comment.taskId}`).emit('commentDeleted', {
            taskId: comment.taskId,
            commentId,
        });
    }
    async getThreadComments(parentCommentId) {
        return this.commentModel
            .find({ parentComment: new mongoose_2.Types.ObjectId(parentCommentId) })
            .populate('author', 'email name')
            .populate('mentions', 'email name')
            .sort({ createdAt: 1 })
            .exec();
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(comment_schema_1.Comment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        realtime_gateway_1.RealtimeGateway])
], CommentsService);
//# sourceMappingURL=comments.service.js.map