import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../../config/configuration';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { TaskModule } from '../task/task.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      load: configuration,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        configService.get<TypeOrmModuleOptions>('db.postgres', {
          type: 'postgres',
        }),
      inject: [ConfigService],
    }),
    AuthModule,
    TaskModule,
    EventEmitterModule.forRoot(),
  ],
})
export class AppModule {}
