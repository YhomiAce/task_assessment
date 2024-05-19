import { Injectable } from '@nestjs/common';
import type { Task, User } from '../../../entities';
import { TaskRepository } from '../repository';
import { AppStrings } from '../../../common/messages/app.strings';
import { CreateTaskDto, TaskEventDto, UpdateTaskDto } from '../dtos';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TaskActionEvent } from '../../../common/enums';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Create Task
   *
   * @async
   * @param {User} user
   * @param {CreateTaskDto} createDto
   * @returns {Promise<Task>}
   */
  async create(user: User, createDto: CreateTaskDto): Promise<Task> {
    const data: Partial<Task> = {
      ...createDto,
      user,
    };
    const task = await this.taskRepository.create(data);
    this.emitTaskRequestEvent(user);
    return task;
  }

  /**
   * List user's Task
   *
   * @async
   * @param {User} user
   * @returns {Promise<Task[]>}
   */
  async findAll(user: User): Promise<Task[]> {
    const tasks = await this.taskRepository.findAll({
      where: { user: { id: user.id } },
    });
    return tasks;
  }

  /**
   * Find Task
   *
   * @async
   * @param {string} id
   * @returns {Promise<Task>}
   */
  async find(id: string): Promise<Task> {
    return await this.taskRepository.findByIdOrFail(id);
  }

  /**
   * Update Task
   *
   * @async
   * @param {string} taskId
   * @param {UpdateTaskDto} updateDto
   * @returns {Promise<Task>}
   */
  async update(taskId: string, updateDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findByIdOrFail(taskId); // user is eager loaded
    const data: Partial<Task> = {
      ...updateDto,
    };
    const updatedTask = await this.taskRepository.update(task.id, data);
    this.emitTaskRequestEvent(task.user);
    return updatedTask;
  }

  /**
   * Delete Task
   *
   * @async
   * @param {string} id
   * @returns {Promise<string>}
   */
  async delete(id: string): Promise<string> {
    const task = await this.taskRepository.findByIdOrFail(id); // user is eager loaded
    await this.taskRepository.delete(id);
    this.emitTaskRequestEvent(task.user);
    return AppStrings.TASK_DELETED;
  }

  /**
   * Emit Event when a database operation is performed on a task
   *
   * @async
   * @param {User} user
   * @returns {void}
   */
  emitTaskRequestEvent(user: User): void {
    this.eventEmitter.emit(TaskActionEvent.TASK_EVENT, new TaskEventDto(user));
  }
}
