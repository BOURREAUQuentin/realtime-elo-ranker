import { PlayerService, Player } from '../player/player.service';
import { MatchResult } from '../match/match.service';
import { EventEmitterService } from '../event-emitter/event-emitter.service';
import { Repository } from 'typeorm';
import { PlayerEntity } from '../player/player.entity';
export declare class RankingService {
    private readonly playerRepository;
    private readonly playerService;
    private readonly eventEmitterService;
    private readonly K;
    constructor(playerRepository: Repository<PlayerEntity>, playerService: PlayerService, eventEmitterService: EventEmitterService);
    private calculateExpectedScore;
    private calculateNewRating;
    updateRanking(match: MatchResult): Promise<{
        winner: Player;
        loser: Player;
    }>;
}
