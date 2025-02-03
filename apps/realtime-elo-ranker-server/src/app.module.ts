import { Module } from '@nestjs/common';
import { PlayerModule } from './player/player.module';
import { MatchModule } from './match/match.module';
import { RankingModule } from './ranking/ranking.module';

@Module({
  imports: [PlayerModule, MatchModule, RankingModule],
})
export class AppModule {}
