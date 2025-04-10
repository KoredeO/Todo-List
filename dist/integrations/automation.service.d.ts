import { Model, Types } from 'mongoose';
import { Automation, AutomationDocument, AutomationTrigger } from './schemas/automation.schema';
import { TasksService } from '../tasks/tasks.service';
import { MailService } from '../mail/mail.service';
export declare class AutomationService {
    private automationModel;
    private tasksService;
    private mailService;
    private readonly logger;
    constructor(automationModel: Model<AutomationDocument>, tasksService: TasksService, mailService: MailService);
    create(userId: Types.ObjectId, data: Partial<Automation>): Promise<Automation>;
    findAll(userId: Types.ObjectId): Promise<Automation[]>;
    update(id: string, userId: Types.ObjectId, data: Partial<Automation>): Promise<Automation>;
    delete(id: string, userId: Types.ObjectId): Promise<void>;
    processTrigger(trigger: AutomationTrigger, context: any, userId: Types.ObjectId): Promise<void>;
    private evaluateConditions;
    private executeActions;
    private getNestedValue;
    private interpolateTemplate;
}
