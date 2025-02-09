import { Test, TestingModule } from '@nestjs/testing';
import { MatchService, MatchResult } from './match.service';
import { RankingService } from '../ranking/ranking.service';
import { Player } from '../player/player.service';

describe('MatchService', () => {
  let matchService: MatchService;
  let rankingService: RankingService;

  const mockRankingService = {
    updateRanking: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        {
          provide: RankingService,
          useValue: mockRankingService,
        },
      ],
    }).compile();

    matchService = module.get<MatchService>(MatchService);
    rankingService = module.get<RankingService>(RankingService);
  });

  it('should be defined', () => {
    expect(matchService).toBeDefined();
  });

  describe('processMatch', () => {
    const match: MatchResult = { winner: 'player1', loser: 'player2', draw: false };

    const winner: Player = { id: 'player1', rank: 1200 };
    const loser: Player = { id: 'player2', rank: 1000 };

    it('should call updateRanking with the match result', async () => {
      mockRankingService.updateRanking.mockResolvedValue({ winner, loser });

      const result = await matchService.processMatch(match);

      expect(rankingService.updateRanking).toHaveBeenCalledWith(match);
      expect(result).toEqual({ winner, loser });
    });

    it('should raise an error if updateRanking fails', async () => {
      mockRankingService.updateRanking.mockRejectedValue(new Error('Erreur lors de la mise à jour du classement'));

      await expect(matchService.processMatch(match)).rejects.toThrow('Erreur lors de la mise à jour du classement');
    });
  });
});
