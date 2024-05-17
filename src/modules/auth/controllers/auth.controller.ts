import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../services';
import { SignUpDto } from '../dtos';
import { SuccessResponse } from 'src/common/responses';
import { AppStrings } from 'src/common/messages/app.strings';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  /**
   * Creates an instance of AuthController.
   *
   * @constructor
   * @param {AuthService} authService
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Create new user
   *
   * @async
   * @param {SignUpDto} signupDto
   * @returns {Promise<SuccessResponse>}
   */
  @ApiOperation({
    summary: 'Register User',
    description: 'Register a new user',
  })
  @ApiResponse({ type: SuccessResponse })
  @ApiBadRequestResponse()
  @Post('signup')
  async register(@Body() signupDto: SignUpDto): Promise<SuccessResponse> {
    return {
      message: AppStrings.USER_CREATED,
      data: await this.authService.register(signupDto),
    };
  }
}
