import { Module } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';
import { PlayerModule } from '../player/player.module';
import { EventEmitterModule } from '../event-emitter/event-emitter.module';

@Module({
  imports: [PlayerModule, EventEmitterModule],
  providers: [RankingService],
  controllers: [RankingController],
  exports: [RankingService],
})
export class RankingModule {}
