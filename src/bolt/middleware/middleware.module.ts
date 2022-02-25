import { Module } from '@nestjs/common';
import { MiddlewareService } from './middleware.service';

@Module({
  providers: [MiddlewareService],
  exports: [MiddlewareService],
})
export class MiddlewareModule {}
