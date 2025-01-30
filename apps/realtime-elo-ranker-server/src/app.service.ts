import { Injectable } from '@nestjs/common';

export interface Player {
  id: string;
  rank: number;
}

export interface MatchResult {
  winner: string;
  loser: string;
  draw: boolean;
}

@Injectable()
export class RankingService {
  private players: Player[] = [];
  private readonly K = 32; // Coefficient de pondération

  createPlayer(player: Player): Player | null {
    if (this.players.some((p) => p.id === player.id)) {
      return null;
    }
    const newPlayer: Player = { id: player.id, rank: 1000 }; // initialise par défaut à 1000 (faudra changer suivant la moyenne des autres joueurs)
    this.players.push(newPlayer);
    return player;
  }

  getRanking(): Player[] {
    return [...this.players].sort((a, b) => b.rank - a.rank);
  }

  getPlayer(id: string): Player | undefined {
    return this.players.find((p) => p.id === id);
  }

  private calculateExpectedScore(
    playerRank: number,
    opponentRank: number,
  ): number {
    return 1 / (1 + Math.pow(10, (opponentRank - playerRank) / 400));
  }

  private calculateNewRating(
    oldRating: number,
    expectedScore: number,
    actualScore: number,
  ): number {
    return Math.round(oldRating + this.K * (actualScore - expectedScore));
  }

  processMatch(match: MatchResult): { winner: Player; loser: Player } {
    const winner = this.getPlayer(match.winner);
    const loser = this.getPlayer(match.loser);

    if (!winner || !loser) {
      throw new Error("Un des joueurs n'existe pas");
    }

    // Calcul des probabilités de victoire
    const expectedScoreWinner = this.calculateExpectedScore(
      winner.rank,
      loser.rank,
    );
    const expectedScoreLoser = 1 - expectedScoreWinner;

    // Scores réels (1 pour victoire, 0.5 pour match nul, 0 pour défaite)
    const actualScoreWinner = match.draw ? 0.5 : 1;
    const actualScoreLoser = match.draw ? 0.5 : 0;

    // Calcul des nouveaux classements
    const newWinnerRating = this.calculateNewRating(
      winner.rank,
      expectedScoreWinner,
      actualScoreWinner,
    );

    const newLoserRating = this.calculateNewRating(
      loser.rank,
      expectedScoreLoser,
      actualScoreLoser,
    );

    // Mise à jour des joueurs
    winner.rank = newWinnerRating;
    loser.rank = newLoserRating;

    // Mise à jour de la liste des joueurs
    this.players = this.players.map(p => {
      if (p.id === winner.id) return winner;
      if (p.id === loser.id) return loser;
      return p;
    });

    return {
      winner: { ...winner },
      loser: { ...loser },
    };
  }
}
