import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      username: process.env.DB_USER || 'bluequest',
      password: process.env.DB_PASS || 'bluequest',
      database: process.env.DB_NAME || 'bluequest',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [HealthController],
})
export class AppModule {}
