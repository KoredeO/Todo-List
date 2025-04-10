import { ConfigService } from '@nestjs/config';
export declare class EncryptionService {
    private configService;
    private readonly algorithm;
    private readonly key;
    constructor(configService: ConfigService);
    encrypt(text: string): {
        encryptedData: string;
        iv: string;
        authTag: string;
    };
    decrypt(encryptedData: string, iv: string, authTag: string): string;
    hashForSearch(text: string): string;
    generateKey(): string;
}
