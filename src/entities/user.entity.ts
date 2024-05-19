import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import BaseEntity from './base.entity';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Task } from './task.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @Column({nullable: true})
  refreshToken: string;

  @Exclude()
  @Column({ nullable: true })
  lastLogin: Date;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @Exclude()
  @Column({nullable: true})
  socketId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // Ignore if password already hashed (when updating)
    if (this.password.startsWith('$2b$')) {
      return;
    }
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
