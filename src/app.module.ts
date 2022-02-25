import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoltModule } from './bolt/bolt.module';
import { EnvironmentModule } from './config/environment/environment.module';

@Module({
  imports: [EnvironmentModule, BoltModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
