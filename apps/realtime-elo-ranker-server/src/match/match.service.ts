import { Injectable } from '@nestjs/common';
import { Player } from '../player/player.service';
import { RankingService } from '../ranking/ranking.service';

export interface MatchResult {
  winner: string;
  loser: string;
  draw: boolean;
}

@Injectable()
export class MatchService {
  constructor(
    private readonly rankingService: RankingService,
  ) {}

  processMatch(match: MatchResult): Promise<{ winner: Player; loser: Player }> {
    return this.rankingService.updateRanking(match);
  }
}
