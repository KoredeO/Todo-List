import { Model, Types } from 'mongoose';
import { Task, TaskDocument, Priority } from './schemas/task.schema';
import { CreateTaskDto, UpdateTaskDto, TaskFilterDto, CreateSubtaskDto } from './dto/task.dto';
export declare class TasksService {
    private taskModel;
    private readonly logger;
    constructor(taskModel: Model<TaskDocument>);
    private handleDatabaseError;
    create(createTaskDto: CreateTaskDto, userId: Types.ObjectId): Promise<Task>;
    findAll(userId: Types.ObjectId, filters: TaskFilterDto): Promise<Task[]>;
    findOne(id: string, userId: Types.ObjectId): Promise<Task>;
    update(id: string, updateTaskDto: UpdateTaskDto, userId: Types.ObjectId): Promise<Task>;
    remove(id: string, userId: Types.ObjectId): Promise<void>;
    addSubtask(taskId: string, createSubtaskDto: CreateSubtaskDto, userId: Types.ObjectId): Promise<Task>;
    suggestPriority(id: string, userId: Types.ObjectId): Promise<Priority>;
}
