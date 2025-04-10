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
var AutomationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const automation_schema_1 = require("./schemas/automation.schema");
const tasks_service_1 = require("../tasks/tasks.service");
const mail_service_1 = require("../mail/mail.service");
let AutomationService = AutomationService_1 = class AutomationService {
    automationModel;
    tasksService;
    mailService;
    logger = new common_1.Logger(AutomationService_1.name);
    constructor(automationModel, tasksService, mailService) {
        this.automationModel = automationModel;
        this.tasksService = tasksService;
        this.mailService = mailService;
    }
    async create(userId, data) {
        const automation = new this.automationModel({
            ...data,
            owner: userId,
        });
        return automation.save();
    }
    async findAll(userId) {
        return this.automationModel.find({ owner: userId }).exec();
    }
    async update(id, userId, data) {
        const automation = await this.automationModel
            .findOneAndUpdate({ _id: id, owner: userId }, { $set: data }, { new: true })
            .exec();
        if (!automation) {
            throw new common_1.NotFoundException('Automation not found');
        }
        return automation;
    }
    async delete(id, userId) {
        await this.automationModel.deleteOne({ _id: id, owner: userId }).exec();
    }
    async processTrigger(trigger, context, userId) {
        const automations = await this.automationModel
            .find({ trigger, isActive: true })
            .exec();
        for (const automation of automations) {
            try {
                if (this.evaluateConditions(automation.conditions, context)) {
                    await this.executeActions(automation.actions, context, userId);
                    await this.automationModel.updateOne({ _id: automation._id }, {
                        $inc: { executionCount: 1 },
                        $set: { lastExecution: new Date() },
                    });
                }
            }
            catch (error) {
                this.logger.error(`Failed to process automation ${automation._id}: ${error.message}`);
            }
        }
    }
    evaluateConditions(conditions, context) {
        return conditions.every((condition) => {
            const value = this.getNestedValue(context, condition.field);
            switch (condition.operator) {
                case 'equals':
                    return value === condition.value;
                case 'contains':
                    return value?.includes(condition.value);
                case 'greater_than':
                    return value > condition.value;
                case 'less_than':
                    return value < condition.value;
                case 'in':
                    return condition.value.includes(value);
                case 'not_in':
                    return !condition.value.includes(value);
                default:
                    return false;
            }
        });
    }
    async executeActions(actions, context, userId) {
        for (const action of actions) {
            try {
                switch (action.type) {
                    case automation_schema_1.AutomationAction.CREATE_TASK:
                        await this.tasksService.create(action.params, userId);
                        break;
                    case automation_schema_1.AutomationAction.UPDATE_TASK:
                        if (context.taskId) {
                            await this.tasksService.update(context.taskId, action.params, userId);
                        }
                        break;
                    case automation_schema_1.AutomationAction.SEND_EMAIL:
                        await this.mailService.sendEmail({
                            to: action.params.to,
                            subject: this.interpolateTemplate(action.params.subject, context),
                            text: this.interpolateTemplate(action.params.body, context),
                        });
                        break;
                    case automation_schema_1.AutomationAction.ASSIGN_TASK:
                        if (context.taskId) {
                            await this.tasksService.update(context.taskId, { ...action.params, title: context.title || 'Task Update' }, userId);
                        }
                        break;
                    case automation_schema_1.AutomationAction.SET_PRIORITY:
                        if (context.taskId) {
                            await this.tasksService.update(context.taskId, { ...action.params, title: context.title || 'Task Update' }, userId);
                        }
                        break;
                }
            }
            catch (error) {
                this.logger.error(`Failed to execute action ${action.type}: ${error.message}`);
            }
        }
    }
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
    interpolateTemplate(template, context) {
        return template.replace(/\{\{(.*?)\}\}/g, (match, path) => {
            return this.getNestedValue(context, path.trim()) ?? match;
        });
    }
};
exports.AutomationService = AutomationService;
exports.AutomationService = AutomationService = AutomationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(automation_schema_1.Automation.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        tasks_service_1.TasksService,
        mail_service_1.MailService])
], AutomationService);
//# sourceMappingURL=automation.service.js.map