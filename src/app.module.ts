import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validateEnv } from './config/env.validation';
import { User } from './auth/entities/user.entity';
import { Challenge } from './challenges/entities/challenge.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChallengesModule } from './challenges/challenges.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT || 3306),
        username: process.env.DB_USER || 'bluequest',
        password: process.env.DB_PASS || 'bluequest',
        database: process.env.DB_NAME || 'bluequest',
        entities: [User, Challenge],
        synchronize: false,
        logging: ['error'],
      }),
    }),
    AuthModule,
    UsersModule,
    ChallengesModule,
  ],
})
export class AppModule {}
