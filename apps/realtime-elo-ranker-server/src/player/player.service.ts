import { Injectable } from '@nestjs/common';
import { EventEmitterService } from '../event-emitter/event-emitter.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerEntity } from './player.entity';

export interface Player {
  id: string;
  rank: number;
}

@Injectable()
export class PlayerService {
  private players: Player[] = [];

  constructor(
    @InjectRepository(PlayerEntity) private readonly playerRepository: Repository<PlayerEntity>,
    private readonly eventEmitterService: EventEmitterService,
  ) {
    this.loadPlayersFromDatabase();
  }

  private loadPlayersFromDatabase() {
    console.log("chargement bd");
    this.playerRepository.find().then((playersFromDb) => {
      this.players = playersFromDb.map((p) => ({ id: p.id, rank: p.rank }));
    }).catch((error) => {
      console.error('Erreur lors du chargement des joueurs depuis la base:', error);
    });
  }

  createPlayer(id: string): Promise<Player | null> {
    if (this.players.some((p) => p.id === id)) {
      return Promise.resolve(null);
    }

    const averageRank =
        this.players.length > 0
            ? this.players.reduce((sum, player) => sum + player.rank, 0) /
              this.players.length
            : 1000;

    const newPlayer: Player = { id, rank: Math.round(averageRank) };
    this.players.push(newPlayer); // maj en mémoire vive

    // maj en base de données
    const newPlayerEntity = this.playerRepository.create({
        id: newPlayer.id,
        rank: newPlayer.rank,
    });

    return this.playerRepository.save(newPlayerEntity)
        .then(() => {
            this.eventEmitterService.emit('ranking.update', newPlayer);
            return newPlayer;
        });
  }

  getPlayer(id: string): Player | undefined {
    return this.players.find((p) => p.id === id);
  }

  getAllPlayers(): Player[] {
    return [...this.players].sort((a, b) => b.rank - a.rank);
  }
}
