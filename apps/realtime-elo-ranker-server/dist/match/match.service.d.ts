import { Player } from '../player/player.service';
import { RankingService } from '../ranking/ranking.service';
export interface MatchResult {
    winner: string;
    loser: string;
    draw: boolean;
}
export declare class MatchService {
    private readonly rankingService;
    constructor(rankingService: RankingService);
    processMatch(match: MatchResult): Promise<{
        winner: Player;
        loser: Player;
    }>;
}
