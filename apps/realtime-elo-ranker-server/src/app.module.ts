import { Module } from '@nestjs/common';
import { PlayerModule } from './player/player.module';
import { MatchModule } from './match/match.module';
import { RankingModule } from './ranking/ranking.module';
import { EventEmitterService } from './event-emitter/event-emitter.service';
import { EventEmitterController } from './event-emitter/event-emitter.controller';
import { EventEmitterModule } from './event-emitter/event-emitter.module';

@Module({
  imports: [PlayerModule, MatchModule, RankingModule, EventEmitterModule],
  providers: [EventEmitterService],
  controllers: [EventEmitterController],
})
export class AppModule {}
