import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskEventDto } from '../dtos';
import { TaskActionEvent } from 'src/common/enums';
import { TaskSocketService } from '../socket';

@Injectable()
export class TaskEventHandler {
  private logger = new Logger(TaskEventHandler.name);
  constructor(private readonly taskSocketService: TaskSocketService) {}

  /**
   * Event listener for task event dispatch
   *
   * @async
   * @param {TaskEventDto} payload
   * @returns {Promise<void>}
   */
  @OnEvent(TaskActionEvent.TASK_EVENT, { async: true })
  async handlePostTaskEvent(payload: TaskEventDto): Promise<void> {
    this.logger.debug(
      `Started Handling ${TaskActionEvent.TASK_EVENT} event Dispatch.`,
      new Date(),
    );

    await this.taskSocketService.emitTaskRequestEvent(payload.user);

    this.logger.debug(
      `Finished Handling ${TaskActionEvent.TASK_EVENT}`,
      new Date(),
    );
  }
}
