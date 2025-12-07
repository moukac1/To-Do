"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const tasks_service_1 = require("../src/tasks/tasks.service");
const tasks_repository_1 = require("../src/tasks/tasks.repository");
const common_1 = require("@nestjs/common");
describe('TasksService', () => {
    let service;
    let repository;
    const mockTasksRepository = {
        create: jest.fn(),
        findManyByOwner: jest.fn(),
        findByIdAndOwner: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };
    const mockTask = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        done: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: 123,
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                tasks_service_1.TasksService,
                {
                    provide: tasks_repository_1.TasksRepository,
                    useValue: mockTasksRepository,
                },
            ],
        }).compile();
        service = module.get(tasks_service_1.TasksService);
        repository = module.get(tasks_repository_1.TasksRepository);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('create', () => {
        it('should create a new task', async () => {
            const createTaskDto = {
                title: 'Test Task',
                description: 'Test Description',
            };
            const userId = 123;
            mockTasksRepository.create.mockResolvedValue(mockTask);
            const result = await service.create(userId, createTaskDto);
            expect(repository.create).toHaveBeenCalledWith({
                title: createTaskDto.title,
                description: createTaskDto.description,
                ownerId: userId,
            });
            expect(result).toEqual(mockTask);
        });
    });
    describe('findAll', () => {
        it('should return all tasks for a user', async () => {
            const userId = 123;
            const tasks = [mockTask];
            mockTasksRepository.findManyByOwner.mockResolvedValue(tasks);
            const result = await service.findAll(userId);
            expect(repository.findManyByOwner).toHaveBeenCalledWith(userId, undefined);
            expect(result).toEqual(tasks);
        });
        it('should filter tasks by done status', async () => {
            const userId = 123;
            const doneTasks = [{ ...mockTask, done: true }];
            mockTasksRepository.findManyByOwner.mockResolvedValue(doneTasks);
            const result = await service.findAll(userId, true);
            expect(repository.findManyByOwner).toHaveBeenCalledWith(userId, true);
            expect(result).toEqual(doneTasks);
        });
    });
    describe('findOne', () => {
        it('should return a single task', async () => {
            const taskId = 1;
            const userId = 123;
            mockTasksRepository.findByIdAndOwner.mockResolvedValue(mockTask);
            const result = await service.findOne(taskId, userId);
            expect(repository.findByIdAndOwner).toHaveBeenCalledWith(taskId, userId);
            expect(result).toEqual(mockTask);
        });
        it('should throw NotFoundException if task not found', async () => {
            const taskId = 999;
            const userId = 123;
            mockTasksRepository.findByIdAndOwner.mockResolvedValue(null);
            await expect(service.findOne(taskId, userId)).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('update', () => {
        it('should update a task', async () => {
            const taskId = 1;
            const userId = 123;
            const updateDto = { title: 'Updated Title' };
            const updatedTask = { ...mockTask, ...updateDto };
            mockTasksRepository.update.mockResolvedValue(updatedTask);
            const result = await service.update(taskId, userId, updateDto);
            expect(repository.update).toHaveBeenCalledWith(taskId, userId, updateDto);
            expect(result).toEqual(updatedTask);
        });
        it('should throw NotFoundException if task not found', async () => {
            const taskId = 999;
            const userId = 123;
            const updateDto = { title: 'Updated Title' };
            mockTasksRepository.update.mockResolvedValue(null);
            await expect(service.update(taskId, userId, updateDto)).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('remove', () => {
        it('should delete a task', async () => {
            const taskId = 1;
            const userId = 123;
            mockTasksRepository.delete.mockResolvedValue(mockTask);
            await service.remove(taskId, userId);
            expect(repository.delete).toHaveBeenCalledWith(taskId, userId);
        });
        it('should throw NotFoundException if task not found', async () => {
            const taskId = 999;
            const userId = 123;
            mockTasksRepository.delete.mockResolvedValue(null);
            await expect(service.remove(taskId, userId)).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('toggleDone', () => {
        it('should toggle task done status', async () => {
            const taskId = 1;
            const userId = 123;
            const toggledTask = { ...mockTask, done: true };
            mockTasksRepository.findByIdAndOwner.mockResolvedValue(mockTask);
            mockTasksRepository.update.mockResolvedValue(toggledTask);
            const result = await service.toggleDone(taskId, userId);
            expect(repository.findByIdAndOwner).toHaveBeenCalledWith(taskId, userId);
            expect(repository.update).toHaveBeenCalledWith(taskId, userId, { done: true });
            expect(result.done).toBe(true);
        });
    });
});
//# sourceMappingURL=tasks.service.spec.js.map