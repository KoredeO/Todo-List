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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookSchema = exports.Webhook = exports.WebhookEvent = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var WebhookEvent;
(function (WebhookEvent) {
    WebhookEvent["TASK_CREATED"] = "task.created";
    WebhookEvent["TASK_UPDATED"] = "task.updated";
    WebhookEvent["TASK_DELETED"] = "task.deleted";
    WebhookEvent["COMMENT_CREATED"] = "comment.created";
    WebhookEvent["TASK_ASSIGNED"] = "task.assigned";
    WebhookEvent["TASK_COMPLETED"] = "task.completed";
})(WebhookEvent || (exports.WebhookEvent = WebhookEvent = {}));
let Webhook = class Webhook {
    name;
    url;
    secret;
    events;
    owner;
    isActive;
    headers;
    failureCount;
    lastFailure;
    lastSuccess;
};
exports.Webhook = Webhook;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Webhook.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Webhook.prototype, "url", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Webhook.prototype, "secret", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], enum: WebhookEvent, required: true }),
    __metadata("design:type", Array)
], Webhook.prototype, "events", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Webhook.prototype, "owner", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Webhook.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Webhook.prototype, "headers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Webhook.prototype, "failureCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Webhook.prototype, "lastFailure", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Webhook.prototype, "lastSuccess", void 0);
exports.Webhook = Webhook = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Webhook);
exports.WebhookSchema = mongoose_1.SchemaFactory.createForClass(Webhook);
//# sourceMappingURL=webhook.schema.js.map