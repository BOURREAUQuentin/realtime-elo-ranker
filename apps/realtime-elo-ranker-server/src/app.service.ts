import { Injectable } from '@nestjs/common';

interface Player {
  id: string;
  rank: number;
}

@Injectable()
export class RankingService {
  private players: Player[] = [];

  createPlayer(player: Player): Player | null {
    if (this.players.some(p => p.id === player.id)) {
      return null;
    }
    const newPlayer: Player = { id: player.id, rank: 1000 }; // initialise par défaut à 0 (faudra changer suivant la moyenne des autres joueurs)
    this.players.push(newPlayer);
    return player;
  }

  getRanking(): Player[] {
    return [...this.players].sort((a, b) => b.rank - a.rank);
  }
}
