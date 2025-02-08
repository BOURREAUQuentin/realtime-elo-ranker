import { Injectable } from '@nestjs/common';
import { PlayerService, Player } from '../player/player.service';
import { MatchResult } from '../match/match.service';
import { EventEmitterService } from '../event-emitter/event-emitter.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerEntity } from '../player/player.entity';

@Injectable()
export class RankingService {
  private readonly K = 32;

  constructor(@InjectRepository(PlayerEntity) private readonly playerRepository: Repository<PlayerEntity>,
      private readonly playerService: PlayerService, private readonly eventEmitterService: EventEmitterService) {}

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

  updateRanking(match: MatchResult): Promise<{ winner: Player; loser: Player }> {
    return Promise.all([
        this.playerRepository.findOne({ where: { id: match.winner } }),
        this.playerRepository.findOne({ where: { id: match.loser } })
    ])
    .then(([winner, loser]) => {
        if (!winner || !loser) {
            throw new Error("Un des joueurs n'existe pas");
        }

        const expectedWinner = this.calculateExpectedScore(winner.rank, loser.rank);
        const expectedLoser = 1 - expectedWinner;
        const actualWinner = match.draw ? 0.5 : 1;
        const actualLoser = match.draw ? 0.5 : 0;

        // calcule les nouveaux rangs
        winner.rank = this.calculateNewRating(winner.rank, expectedWinner, actualWinner);
        loser.rank = this.calculateNewRating(loser.rank, expectedLoser, actualLoser);

        // maj les joueurs en base de données
        return Promise.all([
            this.playerRepository.save(winner),
            this.playerRepository.save(loser)
        ]).then(() => {
            // maj en mémoire vive
            const winnerMemory = this.playerService.getPlayer(match.winner);
            const loserMemory = this.playerService.getPlayer(match.loser);
            if (winnerMemory){
              winnerMemory.rank = winner.rank;
            }
            if (loserMemory){
              loserMemory.rank = loser.rank; 
            }

            // emet les événements après la maj
            this.eventEmitterService.emit('ranking.update', winner);
            this.eventEmitterService.emit('ranking.update', loser);

            return { winner, loser };
        });
    });
  }
}
