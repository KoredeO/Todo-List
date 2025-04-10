import { AuthService } from './auth.service';
import { SignUpDto, LoginDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    signUp(signUpDto: SignUpDto): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    googleAuth(): Promise<{
        url: string;
    }>;
    googleAuthRedirect(req: any, res: any): Promise<void>;
    getProfile(req: any): any;
}
