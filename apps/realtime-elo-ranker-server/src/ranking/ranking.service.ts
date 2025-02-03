import { Injectable } from '@nestjs/common';
import { PlayerService, Player } from '../player/player.service';
import { MatchResult } from '../match/match.service';

@Injectable()
export class RankingService {
  private readonly K = 32;

  constructor(private readonly playerService: PlayerService) {}

  private calculateExpectedScore(
    playerRank: number,
    opponentRank: number,
  ): number {
    return 1 / (1 + Math.pow(10, (opponentRank - playerRank) / 400));
  }

  private calculateNewRating(
    oldRating: number,
    expectedScore: number,
    actualScore: number,
  ): number {
    return Math.round(oldRating + this.K * (actualScore - expectedScore));
  }

  updateRanking(match: MatchResult): { winner: Player; loser: Player } {
    const winner = this.playerService.getPlayer(match.winner);
    const loser = this.playerService.getPlayer(match.loser);

    if (!winner || !loser) throw new Error("Un des joueurs n'existe pas");

    const expectedWinner = this.calculateExpectedScore(winner.rank, loser.rank);
    const expectedLoser = 1 - expectedWinner;
    const actualWinner = match.draw ? 0.5 : 1;
    const actualLoser = match.draw ? 0.5 : 0;

    winner.rank = this.calculateNewRating(
      winner.rank,
      expectedWinner,
      actualWinner,
    );
    loser.rank = this.calculateNewRating(
      loser.rank,
      expectedLoser,
      actualLoser,
    );

    return { winner, loser };
  }
}
