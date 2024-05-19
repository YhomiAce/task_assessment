import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import type { User } from 'src/entities';

export class TaskConnectionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class TaskEventDto {
  constructor(public user: User){}
}
