interface Player {
    id: string;
    rank: number;
}
export declare class RankingService {
    private players;
    createPlayer(player: Player): Player | null;
    getRanking(): Player[];
}
export {};
