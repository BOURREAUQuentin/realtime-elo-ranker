export interface Player {
    id: string;
    rank: number;
}
export interface MatchResult {
    winner: string;
    loser: string;
    draw: boolean;
}
export declare class RankingService {
    private players;
    private readonly K;
    createPlayer(player: Player): Player | null;
    getRanking(): Player[];
    getPlayer(id: string): Player | undefined;
    private calculateExpectedScore;
    private calculateNewRating;
    processMatch(match: MatchResult): {
        winner: Player;
        loser: Player;
    };
}
