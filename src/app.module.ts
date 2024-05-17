import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

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
  ],
})
export class AppModule {}
