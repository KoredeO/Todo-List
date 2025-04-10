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
var TasksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const task_schema_1 = require("./schemas/task.schema");
let TasksService = TasksService_1 = class TasksService {
    taskModel;
    logger = new common_1.Logger(TasksService_1.name);
    constructor(taskModel) {
        this.taskModel = taskModel;
    }
    handleDatabaseError(error, message) {
        this.logger.error(`${message}: ${error.message}`, error.stack);
        if (error instanceof mongoose_2.Error.ValidationError) {
            throw new common_1.BadRequestException(Object.values(error.errors)
                .map(err => err.message)
                .join(', '));
        }
        if (error instanceof mongoose_2.Error.CastError) {
            throw new common_1.BadRequestException('Invalid ID format');
        }
        if (error.code === 11000) {
            throw new common_1.BadRequestException('A task with these details already exists');
        }
        throw new common_1.InternalServerErrorException(message);
    }
    async create(createTaskDto, userId) {
        try {
            const task = new this.taskModel({
                ...createTaskDto,
                owner: userId,
            });
            const savedTask = await task.save();
            this.logger.log(`Task created with ID: ${savedTask._id}`);
            return savedTask;
        }
        catch (error) {
            throw this.handleDatabaseError(error, 'Error creating task');
        }
    }
    async findAll(userId, filters) {
        try {
            const query = { owner: userId };
            if (filters.status)
                query.status = filters.status;
            if (filters.priority)
                query.priority = filters.priority;
            if (filters.tags?.length)
                query.tags = { $in: filters.tags };
            if (filters.isRecurring !== undefined)
                query.isRecurring = filters.isRecurring;
            if (filters.dueDateStart || filters.dueDateEnd) {
                query.dueDate = {};
                if (filters.dueDateStart)
                    query.dueDate.$gte = filters.dueDateStart;
                if (filters.dueDateEnd)
                    query.dueDate.$lte = filters.dueDateEnd;
            }
            query.delete_flag = { $ne: 1 };
            const tasks = await this.taskModel
                .find(query)
                .populate('assignees', 'email name')
                .populate('subtasks')
                .populate('dependencies')
                .exec();
            this.logger.log(`Found ${tasks.length} tasks for user ${userId}`);
            return tasks;
        }
        catch (error) {
            throw this.handleDatabaseError(error, 'Error fetching tasks');
        }
    }
    async findOne(id, userId) {
        try {
            const task = await this.taskModel
                .findOne({ _id: id, owner: userId })
                .populate('assignees', 'email name')
                .populate('subtasks')
                .populate('dependencies')
                .exec();
            if (!task) {
                this.logger.warn(`Task ${id} not found for user ${userId}`);
                throw new common_1.NotFoundException(`Task with ID ${id} not found`);
            }
            return task;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw this.handleDatabaseError(error, 'Error fetching task');
        }
    }
    async update(id, updateTaskDto, userId) {
        try {
            const task = await this.taskModel
                .findOneAndUpdate({ _id: id, owner: userId }, { $set: updateTaskDto }, { new: true, runValidators: true })
                .populate('assignees', 'email name')
                .populate('subtasks')
                .populate('dependencies')
                .exec();
            if (!task) {
                this.logger.warn(`Task ${id} not found for user ${userId}`);
                throw new common_1.NotFoundException(`Task with ID ${id} not found`);
            }
            this.logger.log(`Task ${id} updated successfully`);
            return task;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw this.handleDatabaseError(error, 'Error updating task');
        }
    }
    async remove(id, userId) {
        try {
            const result = await this.taskModel.findOneAndUpdate({ _id: id, owner: userId }, { $set: { delete_flag: 1 } }, { new: true });
            if (!result) {
                this.logger.warn(`Task ${id} not found for user ${userId}`);
                throw new common_1.NotFoundException(`Task with ID ${id} not found`);
            }
            this.logger.log(`Task ${id} deleted successfully`);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw this.handleDatabaseError(error, 'Error deleting task');
        }
    }
    async addSubtask(taskId, createSubtaskDto, userId) {
        const task = await this.taskModel.findById(taskId).exec();
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID ${taskId} not found`);
        }
        const subtask = new this.taskModel({
            ...createSubtaskDto,
            priority: task.priority,
            status: task.status,
            owner: userId,
            parentTask: task._id,
        });
        await subtask.save();
        task.subtasks.push(subtask._id);
        await task.save();
        return subtask;
    }
    async suggestPriority(id, userId) {
        const task = await this.taskModel.findById(id).exec();
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found`);
        }
        const currentDate = new Date();
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        if (dueDate) {
            if (dueDate < currentDate) {
                return task_schema_1.Priority.URGENT;
            }
            const timeDifference = dueDate.getTime() - currentDate.getTime();
            const hoursRemaining = timeDifference / (1000 * 3600);
            if (hoursRemaining <= 24) {
                return task_schema_1.Priority.HIGH;
            }
            const daysRemaining = hoursRemaining / 24;
            if (daysRemaining <= 7) {
                return task_schema_1.Priority.MEDIUM;
            }
            return task.priority || task_schema_1.Priority.LOW;
        }
        return task.priority || task_schema_1.Priority.LOW;
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = TasksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(task_schema_1.Task.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TasksService);
//# sourceMappingURL=tasks.service.js.map