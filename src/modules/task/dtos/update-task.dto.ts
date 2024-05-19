import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends CreateTaskDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  dateCompleted: Date;
}
