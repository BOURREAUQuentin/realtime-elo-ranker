import { EventEmitterService } from '../event-emitter/event-emitter.service';
export interface Player {
    id: string;
    rank: number;
}
export declare class PlayerService {
    private readonly eventEmitterService;
    private players;
    constructor(eventEmitterService: EventEmitterService);
    createPlayer(id: string): Player | null;
    getPlayer(id: string): Player | undefined;
    getAllPlayers(): Player[];
}
