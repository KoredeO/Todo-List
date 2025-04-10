import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
export declare class TwoFactorService {
    private userModel;
    constructor(userModel: Model<User>);
    generateSecret(userId: string): Promise<{
        secret: string;
        otpAuthUrl: string;
        qrCode: string;
    }>;
    verifyCode(userId: string, code: string): Promise<boolean>;
    enableTwoFactor(userId: string, code: string): Promise<boolean>;
    disableTwoFactor(userId: string, code: string): Promise<boolean>;
    generateBackupCodes(userId: string): Promise<string[]>;
    verifyBackupCode(userId: string, code: string): Promise<boolean>;
}
