import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '../../user/repository';
import type { User } from 'src/entities';
import { LoginDto, SignUpDto } from '../dtos';
import { AppStrings } from 'src/common/messages/app.strings';
import { JwtTokenWithUserResponse } from 'src/common/responses';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtInterface, JWTPayload } from 'src/common/interfaces';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

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

  /**
   * Login user
   *
   * @async
   * @param {AuthLoginDto} authLoginDto
   * @returns {Promise<JwtTokenWithUserResponse>}
   */
  async login(authLoginDto: LoginDto): Promise<JwtTokenWithUserResponse> {
    const { email, password } = authLoginDto;
    const user = await this.validateUserCredentials(email, password);
    if (!user) {
      throw new UnauthorizedException(AppStrings.INVALID_EMAIL_OR_PASSWORD);
    }
    // get login token
    const tokens = await this.issueTokens(user);
    // save hashed value of refresh token
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    // update user lastLogin
    await this.updateLastLogin(user.id);

    // Return the user and the access tokens
    return {
      user,
      tokens,
    };
  }

  /**
   * Validate user password
   *
   * @async
   * @param {string} email
   * @param {string} password
   * @returns {Promise<User>}
   */
  async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<User> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return user;
    }
    return null;
  }

  /**
   * Get JWT token
   *
   * @async
   * @param {User} user
   * @returns {Promise<AuthJwtInterface>}
   */
  async issueTokens(user: User): Promise<AuthJwtInterface> {
    // JWT payload to identify the user
    const payload: JWTPayload = {
      username: user.email,
      sub: user.id,
    };

    // Generate JWT tokens for access and refresh tokens
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_TTL'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_TTL'),
      }),
    ]);

    // Return the tokens
    return {
      accessToken: `Bearer ${accessToken}`,
      refreshToken: `Bearer ${refreshToken}`,
    };
  }

  /**
   * Update user refresh token
   *
   * @async
   * @param {string} userId
   * @param {string} refreshToken
   * @returns {Promise<void>}
   */
  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(
      refreshToken,
      await bcrypt.genSalt(),
    );
    await this.userRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  /**
   * Refresh token
   *
   * @async
   * @param {string} userId
   * @param {Promise<AuthJwtInterface>} refreshToken
   * @returns {unknown}
   */
  async refreshTokens(
    userId: string,
    refreshToken: string
  ): Promise<AuthJwtInterface> {
    const user = await this.userRepository.findByIdOrFail(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException();
    }
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken
    );
    if (!refreshTokenMatches) {
      throw new UnauthorizedException(AppStrings.WRONG_REFRESH_TOKEN);
    }
    const tokens = await this.issueTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

   /**
   * update last login
   *
   * @async
   * @param {string} userId
   * @returns {Promise<void>}
   */
   async updateLastLogin(userId: string): Promise<void> {
    await this.userRepository.update(userId, {lastLogin: new Date()});
  }
}
