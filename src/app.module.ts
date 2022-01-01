import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoltModule } from './bolt/bolt.module';

@Module({
  imports: [ConfigModule.forRoot(), BoltModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
