import { CanActivate, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: any): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient();
      const token = this.extractToken(client);
      
      if (!token) {
        throw new WsException('Unauthorized access');
      }

      const payload = this.jwtService.verify(token);
      client.data.user = payload;
      
      return true;
    } catch (err) {
      throw new WsException('Unauthorized access');
    }
  }

  private extractToken(client: Socket): string | undefined {
    const auth = client.handshake?.auth?.token || 
                 client.handshake?.headers?.authorization;
    
    if (!auth) return undefined;
    
    const [type, token] = auth.split(' ');
    return type === 'Bearer' ? token : auth;
  }
}
