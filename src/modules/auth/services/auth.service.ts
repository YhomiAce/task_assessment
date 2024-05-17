import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UsersRepository } from '../../user/repository';
import type { User } from 'src/entities';
import { SignUpDto } from '../dtos';
import { AppStrings } from 'src/common/messages/app.strings';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly userRepository: UsersRepository) {}

  /**
   * Register new user
   *
   * @async
   * @param {SignUpDto} inputData
   * @returns {Promise<User>}
   */
  async register(inputData: SignUpDto): Promise<User> {
    try {
      const { email } = inputData;
      const user = await this.userRepository.findUserByEmail(email);
      if (user) {
        throw new ConflictException(AppStrings.EXISTING_RESOURCE('User'));
      }
      const data: Partial<User> = {
        ...inputData,
      };
      const result = await this.userRepository.create(data);
      return result;
    } catch (error) {
      this.logger.debug(error);
      throw new BadRequestException(error);
    }
  }
}
