import { Response } from 'express';
import { PlayerService } from './player.service';
export declare class PlayerController {
    private readonly playerService;
    constructor(playerService: PlayerService);
    createPlayer(id: string, res: Response): Response<any, Record<string, any>> | Promise<Response<any, Record<string, any>>>;
}
