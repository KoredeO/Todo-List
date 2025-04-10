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
exports.AutomationSchema = exports.Automation = exports.AutomationAction = exports.AutomationTrigger = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var AutomationTrigger;
(function (AutomationTrigger) {
    AutomationTrigger["TASK_CREATED"] = "task.created";
    AutomationTrigger["TASK_UPDATED"] = "task.updated";
    AutomationTrigger["TASK_COMPLETED"] = "task.completed";
    AutomationTrigger["DUE_DATE_APPROACHING"] = "due_date.approaching";
    AutomationTrigger["COMMENT_ADDED"] = "comment.added";
    AutomationTrigger["TASK_ASSIGNED"] = "task.assigned";
})(AutomationTrigger || (exports.AutomationTrigger = AutomationTrigger = {}));
var AutomationAction;
(function (AutomationAction) {
    AutomationAction["UPDATE_TASK"] = "update_task";
    AutomationAction["CREATE_TASK"] = "create_task";
    AutomationAction["SEND_EMAIL"] = "send_email";
    AutomationAction["SEND_NOTIFICATION"] = "send_notification";
    AutomationAction["ASSIGN_TASK"] = "assign_task";
    AutomationAction["SET_PRIORITY"] = "set_priority";
})(AutomationAction || (exports.AutomationAction = AutomationAction = {}));
let Automation = class Automation {
    name;
    trigger;
    conditions;
    actions;
    owner;
    isActive;
    executionCount;
    lastExecution;
};
exports.Automation = Automation;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Automation.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: AutomationTrigger }),
    __metadata("design:type", String)
], Automation.prototype, "trigger", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Array)
], Automation.prototype, "conditions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{
                type: {
                    type: String,
                    enum: AutomationAction,
                    required: true
                },
                params: {
                    type: Object,
                    required: true
                }
            }], required: true }),
    __metadata("design:type", Array)
], Automation.prototype, "actions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Automation.prototype, "owner", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Automation.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Automation.prototype, "executionCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Automation.prototype, "lastExecution", void 0);
exports.Automation = Automation = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Automation);
exports.AutomationSchema = mongoose_1.SchemaFactory.createForClass(Automation);
//# sourceMappingURL=automation.schema.js.map