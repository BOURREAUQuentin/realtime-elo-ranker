import { PlayerService, Player } from '../player/player.service';
import { RankingService } from '../ranking/ranking.service';
export interface MatchResult {
    winner: string;
    loser: string;
    draw: boolean;
}
export declare class MatchService {
    private readonly playerService;
    private readonly rankingService;
    constructor(playerService: PlayerService, rankingService: RankingService);
    processMatch(match: MatchResult): {
        winner: Player;
        loser: Player;
    };
}
