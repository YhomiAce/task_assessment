import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponse } from 'src/common/responses';
import { AccessTokenGuard } from 'src/modules/auth/guards';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  /**
   * Get loggedIn User
   *
   * @param {*} req
   * @returns {UserResponse}
   */
  @ApiOperation({
    summary: 'Get Loggedin user',
    description: 'Get Loggedin user',
  })
  @ApiOkResponse({ type: UserResponse })
  @UseGuards(AccessTokenGuard)
  @Get()
  refreshTokens(@Request() req: any): UserResponse {
    return {
      data: req.user,
    };
  }
}
