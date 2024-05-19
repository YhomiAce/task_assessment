import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { TaskSocketEvent } from 'src/common/enums';
import { UsersRepository } from 'src/modules/user/repository';
import type { User } from 'src/entities';
import { TaskService } from '../services';
import { TaskConnectionDto } from '../dtos';

@WebSocketGateway({ cors: true })
export class TaskSocketService
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(TaskSocketService.name);
  private socketId: string;
  private userId: string;
  constructor(
    private taskService: TaskService,
    private usersRepository: UsersRepository,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.debug('Initialized');
  }

  /**
   * Handles socket connection
   *
   * @async
   * @param {*} client
   * @param {*} args
   * @returns {Promise<void>}
   */
  async handleConnection(client: any, ...args: any[]): Promise<void> {
    const { sockets } = this.server.sockets;
    this.socketId = client.id;
    this.userId = client.handshake.query.userId;
    await this.findAndUpdateUserSocket();

    this.logger.debug(`Client id: ${client.id} connected`, this.userId);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  /**
   * Handles socket disconnect
   *
   * @param {*} client
   * @returns {void}
   */
  handleDisconnect(client: any): void {
    this.logger.debug(`Cliend id:${client.id} disconnected`, this.userId);
  }

  /**
   * Subscribe to task request event
   * Emit task request
   *
   * @async
   * @param {TaskConnectionDto} body
   * @returns {Promise<void>}
   */
  @SubscribeMessage(TaskSocketEvent.TASK_EVENT)
  async handleTaskRequestConnection(
    @MessageBody() body: TaskConnectionDto,
  ): Promise<void> {
    this.userId = body.userId;
    await this.findAndUpdateUserSocket();
  }

  /**
   * Emit task request for a user
   *
   * @async
   * @param {User} user
   * @returns {Promise<void>}
   */
  async emitTaskRequestEvent(user: User): Promise<void> {
    const tasks = await this.taskService.findAll(user);
    this.server.to(user.socketId).emit(TaskSocketEvent.TASK_EVENT, {
      data: tasks,
    });
  }

  /**
   * Update user socketId and emit task request event
   *
   * @async
   * @returns {Promise<void>}
   */
  async findAndUpdateUserSocket(): Promise<void> {
    let user = await this.usersRepository.findById(this.userId);
    if (!user) {
      this.logger.error(`${this.userId} is not found`);
      return;
    }
    user = await this.usersRepository.update(this.userId, {
      socketId: this.socketId,
    });
    await this.emitTaskRequestEvent(user);
  }
}
