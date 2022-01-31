import { Module } from '@nestjs/common';
import { BoltService } from './bolt.service';
import { BoltController } from './bolt.controller';

@Module({
  providers: [BoltService],
  controllers: [BoltController],
})
export class BoltModule {}
