import { Module } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';
import { PlayerModule } from '../player/player.module';
import { EventEmitterModule } from '../event-emitter/event-emitter.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerEntity } from '../player/player.entity';

@Module({
  imports: [PlayerModule, EventEmitterModule, TypeOrmModule.forFeature([PlayerEntity])],
  providers: [RankingService],
  controllers: [RankingController],
  exports: [RankingService],
})
export class RankingModule {}
