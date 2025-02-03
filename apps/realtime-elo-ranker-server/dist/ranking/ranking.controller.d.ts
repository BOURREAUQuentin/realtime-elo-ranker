import { Response } from 'express';
import { PlayerService } from '../player/player.service';
export declare class RankingController {
    private readonly playerService;
    constructor(playerService: PlayerService);
    getRanking(res: Response): Response<any, Record<string, any>>;
}
