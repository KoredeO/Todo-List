import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { SignUpDto, LoginDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
export declare class AuthService {
    private userModel;
    private jwtService;
    private mailService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService, mailService: MailService);
    signUp(signUpDto: SignUpDto): Promise<{
        message: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
    }>;
    googleLogin(req: any): Promise<{
        message: string;
        token: string;
        user: {
            email: string;
            firstName: string | undefined;
            lastName: string | undefined;
            picture: string | undefined;
        };
    }>;
    validateUser(userId: string): Promise<UserDocument>;
}
