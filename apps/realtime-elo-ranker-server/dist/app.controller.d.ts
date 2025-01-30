import { Response } from 'express';
import { RankingService, Player, MatchResult } from './app.service';
export declare class RankingController {
    private readonly rankingService;
    constructor(rankingService: RankingService);
    createMatch(match: MatchResult, res: Response): Response<any, Record<string, any>>;
    createPlayer(player: Player, res: Response): Response<any, Record<string, any>>;
    getRanking(res: Response): Response<any, Record<string, any>>;
}
