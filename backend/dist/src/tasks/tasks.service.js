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
var TasksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const tasks_repository_1 = require("./tasks.repository");
let TasksService = TasksService_1 = class TasksService {
    constructor(tasksRepository) {
        this.tasksRepository = tasksRepository;
        this.logger = new common_1.Logger(TasksService_1.name);
    }
    async create(userId, createTaskDto) {
        this.logger.log(`Creating task for user ${userId}: ${createTaskDto.title}`);
        return this.tasksRepository.create({
            title: createTaskDto.title,
            description: createTaskDto.description,
            ownerId: userId,
        });
    }
    async findAll(userId, done) {
        this.logger.log(`Fetching tasks for user ${userId}, done filter: ${done}`);
        return this.tasksRepository.findManyByOwner(userId, done);
    }
    async findOne(id, userId) {
        const task = await this.tasksRepository.findByIdAndOwner(id, userId);
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found or access denied`);
        }
        return task;
    }
    async update(id, userId, updateTaskDto) {
        this.logger.log(`Updating task ${id} for user ${userId}`);
        const task = await this.tasksRepository.update(id, userId, updateTaskDto);
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found or access denied`);
        }
        return task;
    }
    async remove(id, userId) {
        this.logger.log(`Deleting task ${id} for user ${userId}`);
        const task = await this.tasksRepository.delete(id, userId);
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found or access denied`);
        }
    }
    async toggleDone(id, userId) {
        const task = await this.findOne(id, userId);
        return this.update(id, userId, { done: !task.done });
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = TasksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tasks_repository_1.TasksRepository])
], TasksService);
//# sourceMappingURL=tasks.service.js.map