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
exports.RealtimeGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const ws_jwt_guard_1 = require("../auth/ws-jwt.guard");
let RealtimeGateway = class RealtimeGateway {
    server;
    taskRooms = new Map();
    userSockets = new Map();
    async handleConnection(client) {
        const userId = client.data.user._id;
        this.addUserSocket(userId.toString(), client.id);
        client.emit('connected', { status: 'connected' });
    }
    async handleDisconnect(client) {
        const userId = client.data?.user?._id;
        if (userId) {
            this.removeUserSocket(userId.toString(), client.id);
        }
    }
    async handleJoinTask(client, data) {
        const userId = client.data.user._id;
        const roomId = `task:${data.taskId}`;
        await client.join(roomId);
        this.addUserToTaskRoom(data.taskId, userId.toString());
        const users = this.getTaskRoomUsers(data.taskId);
        this.server.to(roomId).emit('userJoined', {
            taskId: data.taskId,
            userId: userId.toString(),
            activeUsers: Array.from(users),
        });
    }
    async handleLeaveTask(client, data) {
        const userId = client.data.user._id;
        const roomId = `task:${data.taskId}`;
        await client.leave(roomId);
        this.removeUserFromTaskRoom(data.taskId, userId.toString());
        const users = this.getTaskRoomUsers(data.taskId);
        this.server.to(roomId).emit('userLeft', {
            taskId: data.taskId,
            userId: userId.toString(),
            activeUsers: Array.from(users),
        });
    }
    async handleTaskUpdate(client, data) {
        const roomId = `task:${data.taskId}`;
        this.server.to(roomId).emit('taskUpdated', {
            taskId: data.taskId,
            update: data.update,
            userId: client.data.user._id,
        });
    }
    async handleNewComment(client, data) {
        const roomId = `task:${data.taskId}`;
        this.server.to(roomId).emit('commentAdded', {
            taskId: data.taskId,
            comment: data.comment,
            userId: client.data.user._id,
        });
    }
    addUserToTaskRoom(taskId, userId) {
        if (!this.taskRooms.has(taskId)) {
            this.taskRooms.set(taskId, { taskId, users: new Set() });
        }
        const room = this.taskRooms.get(taskId);
        if (room) {
            room.users.add(userId);
        }
    }
    removeUserFromTaskRoom(taskId, userId) {
        const room = this.taskRooms.get(taskId);
        if (room) {
            room.users.delete(userId);
            if (room.users.size === 0) {
                this.taskRooms.delete(taskId);
            }
        }
    }
    getTaskRoomUsers(taskId) {
        return this.taskRooms.get(taskId)?.users || new Set();
    }
    addUserSocket(userId, socketId) {
        if (!this.userSockets.has(userId)) {
            this.userSockets.set(userId, new Set());
        }
        const sockets = this.userSockets.get(userId);
        if (sockets) {
            sockets.add(socketId);
        }
    }
    removeUserSocket(userId, socketId) {
        const userSockets = this.userSockets.get(userId);
        if (userSockets) {
            userSockets.delete(socketId);
            if (userSockets.size === 0) {
                this.userSockets.delete(userId);
            }
        }
    }
};
exports.RealtimeGateway = RealtimeGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RealtimeGateway.prototype, "server", void 0);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], RealtimeGateway.prototype, "handleConnection", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], RealtimeGateway.prototype, "handleDisconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinTask'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], RealtimeGateway.prototype, "handleJoinTask", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveTask'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], RealtimeGateway.prototype, "handleLeaveTask", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('taskUpdate'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], RealtimeGateway.prototype, "handleTaskUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('newComment'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], RealtimeGateway.prototype, "handleNewComment", null);
exports.RealtimeGateway = RealtimeGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    })
], RealtimeGateway);
//# sourceMappingURL=realtime.gateway.js.map