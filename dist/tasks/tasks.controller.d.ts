import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, TaskFilterDto, CreateSubtaskDto } from './dto/task.dto';
import { Task, Priority } from './schemas/task.schema';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(createTaskDto: CreateTaskDto, req: any): Promise<Task>;
    findAll(filters: TaskFilterDto, req: any): Promise<Task[]>;
    findOne(id: string, req: any): Promise<Task>;
    update(id: string, updateTaskDto: UpdateTaskDto, req: any): Promise<Task>;
    remove(id: string, req: any): Promise<void>;
    addSubtask(taskId: string, subtask: CreateSubtaskDto, req: any): Promise<Task>;
    suggestPriority(id: string, req: any): Promise<Priority>;
}
