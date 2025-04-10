import { MailerService } from '@nestjs-modules/mailer';
export declare class MailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendEmail(options: {
        to: string;
        subject: string;
        text: string;
    }): Promise<void>;
    sendVerificationEmail(email: string, token: string): Promise<void>;
}
