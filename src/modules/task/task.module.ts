import { Module } from '@nestjs/common';
import { TaskController } from './controllers';
import { TaskService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/entities';
import { TaskRepository } from './repository';
import { TaskSocketService } from './socket';
import { TaskEventHandler } from './events';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), UserModule],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository, TaskSocketService, TaskEventHandler],
})
export class TaskModule {}
