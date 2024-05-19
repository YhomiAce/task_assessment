import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import BaseEntity from './base.entity';
import { User } from './user.entity';
import { TaskStatus } from 'src/common/enums';

@Entity()
export class Task extends BaseEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  dateCompleted: Date;

  @Column({default: TaskStatus.PENDING})
  status: TaskStatus;

  @ManyToOne(() => User, (user) => user.tasks, { eager: true, cascade: true })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
