import { Response } from 'express';
import { RankingService } from './app.service';
interface Player {
    id: string;
    rank: number;
}
export declare class RankingController {
    private readonly rankingService;
    constructor(rankingService: RankingService);
    createPlayer(player: Player, res: Response): Response<any, Record<string, any>>;
    getRanking(res: Response): Response<any, Record<string, any>>;
}
export {};
