import { Module } from '@nestjs/common';
import { BoltService } from './bolt.service';
import { MiddlewareModule } from './middleware/middleware.module';
import { EventModule } from './event/event.module';
import { BlockModule } from './block/block.module';

@Module({
  providers: [BoltService],
  imports: [MiddlewareModule, EventModule, BlockModule],
  exports: [BoltService],
})
export class BoltModule {}
