import { EventEmitterService } from '../event-emitter/event-emitter.service';
import { Repository } from 'typeorm';
import { PlayerEntity } from './player.entity';
export interface Player {
    id: string;
    rank: number;
}
export declare class PlayerService {
    private readonly playerRepository;
    private readonly eventEmitterService;
    private players;
    constructor(playerRepository: Repository<PlayerEntity>, eventEmitterService: EventEmitterService);
    private loadPlayersFromDatabase;
    createPlayer(id: string): Promise<Player | null>;
    getPlayer(id: string): Player | undefined;
    getAllPlayers(): Player[];
}
