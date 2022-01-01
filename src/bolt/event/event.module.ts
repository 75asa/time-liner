import { Module } from '@nestjs/common';
import { EventService } from './event.service';

@Module({
  providers: [EventService]
})
export class EventModule {}
