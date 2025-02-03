export interface Player {
    id: string;
    rank: number;
}
export declare class PlayerService {
    private players;
    createPlayer(id: string): Player | null;
    getPlayer(id: string): Player | undefined;
    getAllPlayers(): Player[];
}
