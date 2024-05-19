import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTaskDto, UpdateTaskDto } from '../dtos';
import { ErrorResponse, SuccessResponse } from '../../../common/responses';
import { AppStrings } from '../../../common/messages/app.strings';
import { AccessTokenGuard } from '../../auth/guards';
import { TaskService } from '../services';
import { TaskOwnerGuard } from '../guards';

@ApiTags('Task')
@ApiBearerAuth()
@Controller('task')
@UseGuards(AccessTokenGuard)
export class TaskController {
  /**
   * Creates an instance of TaskController.
   * Inject TaskService
   *
   * @constructor
   * @param {TaskService} taskService
   */
  constructor(private readonly taskService: TaskService) {}

  /**
   * Create a task
   *
   * @async
   * @param {*} req
   * @param {CreateTaskDto} createDto
   * @returns {Promise<SuccessResponse>}
   */
  @ApiOperation({
    summary: 'Create a task',
    description: 'Create a task',
  })
  @ApiResponse({ type: SuccessResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @Post()
  async create(
    @Request() req: any,
    @Body() createDto: CreateTaskDto,
  ): Promise<SuccessResponse> {
    return {
      message: AppStrings.TASK_CREATED,
      data: await this.taskService.create(req.user, createDto),
    };
  }

  /**
   * List all user task
   *
   * @async
   * @param {*} req
   * @returns {Promise<SuccessResponse>}
   */
  @ApiOperation({
    summary: 'List all user tasks',
    description: 'List all user tasks',
  })
  @ApiResponse({ type: SuccessResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @Get()
  async findAll(@Request() req: any): Promise<SuccessResponse> {
    return {
      data: await this.taskService.findAll(req.user),
    };
  }

  /**
   * Find task by Id
   *
   * @async
   * @param {string} taskId
   * @returns {Promise<SuccessResponse>}
   */
  @ApiOperation({
    summary: 'Find task by Id',
    description: 'Find task by Id',
  })
  @ApiResponse({ type: SuccessResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @Get(':id')
  @UseGuards(TaskOwnerGuard)
  async find(@Param('id') taskId: string): Promise<SuccessResponse> {
    return {
      data: await this.taskService.find(taskId),
    };
  }

  /**
   * Update a task
   *
   * @async
   * @param {string} taskId
   * @param {UpdateTaskDto} updateDto
   * @returns {Promise<SuccessResponse>}
   */
  @ApiOperation({
    summary: 'Update a task',
    description: 'Update a task',
  })
  @ApiResponse({ type: SuccessResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @Patch(':id')
  @UseGuards(TaskOwnerGuard)
  async update(
    @Param('id') taskId: string,
    @Body() updateDto: UpdateTaskDto,
  ): Promise<SuccessResponse> {
    return {
      message: AppStrings.TASK_UPDATED,
      data: await this.taskService.update(taskId, updateDto),
    };
  }

  /**
   * Delete a task
   *
   * @async
   * @param {string} id
   * @returns {Promise<SuccessResponse>}
   */
  @ApiOperation({
    summary: 'Delete a task',
    description: 'Delete a task',
  })
  @ApiResponse({ type: SuccessResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @Delete(':id')
  @UseGuards(TaskOwnerGuard)
  async delete(@Param('id') id: string): Promise<SuccessResponse> {
    return {
      message: await this.taskService.delete(id),
    };
  }
}
