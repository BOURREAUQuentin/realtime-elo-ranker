import { Response } from 'express';
import { PlayerService } from '../player/player.service';
import { Observable } from 'rxjs';
import { EventEmitterService } from '../event-emitter/event-emitter.service';
export declare class RankingController {
    private readonly playerService;
    private readonly eventEmitterService;
    constructor(playerService: PlayerService, eventEmitterService: EventEmitterService);
    getRanking(res: Response): Response<any, Record<string, any>>;
    getRankingEvents(): Observable<MessageEvent>;
}
