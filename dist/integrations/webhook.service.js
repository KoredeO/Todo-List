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
var WebhookService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const webhook_schema_1 = require("./schemas/webhook.schema");
const crypto = require("crypto");
const axios_1 = require("axios");
let WebhookService = WebhookService_1 = class WebhookService {
    webhookModel;
    logger = new common_1.Logger(WebhookService_1.name);
    constructor(webhookModel) {
        this.webhookModel = webhookModel;
    }
    async create(userId, data) {
        const secret = crypto.randomBytes(32).toString('hex');
        const webhook = new this.webhookModel({
            ...data,
            owner: userId,
            secret,
        });
        return webhook.save();
    }
    async findAll(userId) {
        return this.webhookModel.find({ owner: userId }).exec();
    }
    async update(id, userId, data) {
        const webhook = await this.webhookModel
            .findOneAndUpdate({ _id: id, owner: userId }, { $set: data }, { new: true })
            .exec();
        if (!webhook) {
            throw new common_1.NotFoundException('Webhook not found');
        }
        return webhook;
    }
    async delete(id, userId) {
        await this.webhookModel.deleteOne({ _id: id, owner: userId }).exec();
    }
    async triggerWebhooks(event, payload) {
        const webhooks = await this.webhookModel
            .find({ events: event, isActive: true })
            .exec();
        const promises = webhooks.map(async (webhook) => {
            try {
                const signature = this.generateSignature(webhook.secret, payload);
                const headers = {
                    'Content-Type': 'application/json',
                    'X-Webhook-Signature': signature,
                    ...webhook.headers,
                };
                const response = await axios_1.default.post(webhook.url, payload, { headers });
                if (response.status >= 200 && response.status < 300) {
                    await this.webhookModel.updateOne({ _id: webhook._id }, {
                        $set: { lastSuccess: new Date() },
                        $inc: { executionCount: 1 },
                    });
                }
                else {
                    throw new Error(`HTTP ${response.status}`);
                }
            }
            catch (error) {
                this.logger.error(`Failed to trigger webhook ${webhook._id}: ${error.message}`);
                await this.webhookModel.updateOne({ _id: webhook._id }, {
                    $set: { lastFailure: new Date() },
                    $inc: { failureCount: 1 },
                });
            }
        });
        await Promise.all(promises);
    }
    generateSignature(secret, payload) {
        const hmac = crypto.createHmac('sha256', secret);
        hmac.update(JSON.stringify(payload));
        return hmac.digest('hex');
    }
};
exports.WebhookService = WebhookService;
exports.WebhookService = WebhookService = WebhookService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(webhook_schema_1.Webhook.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], WebhookService);
//# sourceMappingURL=webhook.service.js.map