import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private taskRooms;
    private userSockets;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleJoinTask(client: Socket, data: {
        taskId: string;
    }): Promise<void>;
    handleLeaveTask(client: Socket, data: {
        taskId: string;
    }): Promise<void>;
    handleTaskUpdate(client: Socket, data: {
        taskId: string;
        update: any;
    }): Promise<void>;
    handleNewComment(client: Socket, data: {
        taskId: string;
        comment: any;
    }): Promise<void>;
    private addUserToTaskRoom;
    private removeUserFromTaskRoom;
    private getTaskRoomUsers;
    private addUserSocket;
    private removeUserSocket;
}
