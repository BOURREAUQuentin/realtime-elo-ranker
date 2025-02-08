
import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { EventEmitterModule } from '../event-emitter/event-emitter.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerEntity } from './player.entity';

@Module({
  imports: [EventEmitterModule, TypeOrmModule.forFeature([PlayerEntity])],
  providers: [PlayerService],
  controllers: [PlayerController],
  exports: [PlayerService],
})
export class PlayerModule {}
