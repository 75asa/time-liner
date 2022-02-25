import { Module } from '@nestjs/common';
import { BoltService } from './bolt.service';
import { BoltController } from './bolt.controller';
import { EnvironmentModule } from '../config/environment/environment.module';
import { MiddlewareModule } from './middleware/middleware.module';

@Module({
  imports: [EnvironmentModule, MiddlewareModule],
  providers: [BoltService],
  controllers: [BoltController],
})
export class BoltModule {}
