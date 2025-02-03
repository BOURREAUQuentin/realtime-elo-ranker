import { Injectable } from '@nestjs/common';

export interface Player {
  id: string;
  rank: number;
}

@Injectable()
export class PlayerService {
  private players: Player[] = [];

  createPlayer(id: string): Player | null {
    if (this.players.some((p) => p.id === id)) return null;

    const averageRank =
      this.players.length > 0
        ? this.players.reduce((sum, player) => sum + player.rank, 0) /
          this.players.length
        : 1000;

    const newPlayer: Player = { id, rank: Math.round(averageRank) };
    this.players.push(newPlayer);
    return newPlayer;
  }

  getPlayer(id: string): Player | undefined {
    return this.players.find((p) => p.id === id);
  }

  getAllPlayers(): Player[] {
    return [...this.players].sort((a, b) => b.rank - a.rank);
  }
}
