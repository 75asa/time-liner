import { Module } from '@nestjs/common';
import { BoltService } from './bolt.service';
import { BoltController } from './bolt.controller';
import { EnvironmentModule } from '../config/environment/environment.module';

@Module({
  imports: [EnvironmentModule],
  providers: [BoltService],
  controllers: [BoltController],
})
export class BoltModule {}
