import { Model, Types } from 'mongoose';
import { Webhook, WebhookDocument, WebhookEvent } from './schemas/webhook.schema';
export declare class WebhookService {
    private webhookModel;
    private readonly logger;
    constructor(webhookModel: Model<WebhookDocument>);
    create(userId: Types.ObjectId, data: {
        name: string;
        url: string;
        events: WebhookEvent[];
        headers?: Record<string, string>;
    }): Promise<Webhook>;
    findAll(userId: Types.ObjectId): Promise<Webhook[]>;
    update(id: string, userId: Types.ObjectId, data: Partial<Webhook>): Promise<Webhook>;
    delete(id: string, userId: Types.ObjectId): Promise<void>;
    triggerWebhooks(event: WebhookEvent, payload: any): Promise<void>;
    private generateSignature;
}
