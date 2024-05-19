import { Injectable } from '@nestjs/common';
import { EntityRepository } from '../../core/base.classes/entity.repository';
import { Task } from '../../../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TaskRepository extends EntityRepository<Task> {
  constructor(
    @InjectRepository(Task)
    private readonly repository: Repository<Task>,
  ) {
    super(repository);
  }

}
