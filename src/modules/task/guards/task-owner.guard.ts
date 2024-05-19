import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import {Observable} from 'rxjs';
import {User} from '../../../entities/user.entity';
import { TaskService } from '../services';

@Injectable()
export class TaskOwnerGuard implements CanActivate {
  constructor(private readonly taskService: TaskService) {}
  /**
   * Check if user is task owner
   *
   * @param {User} user
   * @param {string} taskId
   * @returns {Promise<boolean>}
   */
  async isUserTaskOwner(user: User, taskId: string): Promise<boolean> {
    // get all the user's tasks
    const tasks = await this.taskService.findAll(user);
    return !!tasks.find(s => s.id === taskId);
  }

  /**
   * This will give a user permission over his own tasks
   *
   * @param {ExecutionContext} context
   * @returns {(boolean | Promise<boolean> | Observable<boolean>)}
   */
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const taskId = request.params?.id;
    const user: User = request.user;
    return this.isUserTaskOwner(user, taskId);
  }
}
