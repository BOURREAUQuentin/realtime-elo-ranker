import { Test, TestingModule } from '@nestjs/testing';
import { RankingService } from './ranking.service';
import { PlayerService } from '../player/player.service';
import { EventEmitterService } from '../event-emitter/event-emitter.service';
import { PlayerEntity } from '../player/player.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MatchResult } from '../match/match.service';

describe('RankingService', () => {
  let rankingService: RankingService;
  let playerRepository: Repository<PlayerEntity>;
  let playerService: PlayerService;
  let eventEmitterService: EventEmitterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RankingService,
        {
          provide: getRepositoryToken(PlayerEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: PlayerService,
          useValue: {
            getPlayer: jest.fn(),
          },
        },
        {
          provide: EventEmitterService,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    rankingService = module.get<RankingService>(RankingService);
    playerRepository = module.get<Repository<PlayerEntity>>(getRepositoryToken(PlayerEntity));
    playerService = module.get<PlayerService>(PlayerService);
    eventEmitterService = module.get<EventEmitterService>(EventEmitterService);
  });

  it('devrait être défini', () => {
    expect(rankingService).toBeDefined();
  });

  describe('updateRanking', () => {
    const match: MatchResult = { winner: 'player1', loser: 'player2', draw: false };

    const winner: PlayerEntity = { id: 'player1', rank: 1200 } as PlayerEntity;
    const loser: PlayerEntity = { id: 'player2', rank: 1000 } as PlayerEntity;

    beforeEach(() => {
      jest.spyOn(playerRepository, 'findOne').mockImplementation(async ({ where }) => {
        if (!where || !('id' in where)) return null;
        return where.id === 'player1' ? winner : loser;
      });

      jest.spyOn(playerRepository, 'save').mockImplementation(async (player) => {
        return { ...player } as PlayerEntity;
      });      

      jest.spyOn(playerService, 'getPlayer').mockImplementation((id) => {
        return id === 'player1' ? { id: 'player1', rank: 1200 } : { id: 'player2', rank: 1000 };
      });
    });

    it('devrait mettre à jour le classement des joueurs', async () => {
      const result = await rankingService.updateRanking(match);

      expect(playerRepository.findOne).toHaveBeenCalledTimes(2);
      expect(playerRepository.save).toHaveBeenCalledTimes(2);
      expect(eventEmitterService.emit).toHaveBeenCalledTimes(2);
      expect(result.winner.rank).not.toBe(1200);
      expect(result.loser.rank).not.toBe(1000);
    });

    it("devrait lever une erreur si l'un des joueurs n'existe pas", async () => {
      jest.spyOn(playerRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(rankingService.updateRanking(match)).rejects.toThrow("Un des joueurs n'existe pas");
    });
  });
});
