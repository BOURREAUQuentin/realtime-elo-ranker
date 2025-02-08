import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { PlayerModule } from '../player/player.module';
import { RankingModule } from '../ranking/ranking.module';

@Module({
  imports: [PlayerModule, RankingModule],
  providers: [MatchService],
  controllers: [MatchController],
})
export class MatchModule {}
