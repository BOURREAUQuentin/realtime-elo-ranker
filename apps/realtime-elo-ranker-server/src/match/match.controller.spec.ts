import { Test, TestingModule } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

describe('MatchController', () => {
  let matchController: MatchController;
  let matchService: MatchService;

  const mockMatchService = {
    processMatch: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchController],
      providers: [
        {
          provide: MatchService,
          useValue: mockMatchService,
        },
      ],
    }).compile();

    matchController = module.get<MatchController>(MatchController);
    matchService = module.get<MatchService>(MatchService);
  });

  it('devrait être défini', () => {
    expect(matchController).toBeDefined();
  });

  describe('createMatch', () => {
    const match = {
      winner: 'player1',
      loser: 'player2',
      draw: false,
    };

    it('devrait retourner un statut 200 et les résultats du match lorsque le match est valide', async () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mockMatchService.processMatch.mockReturnValue(Promise.resolve({
        winner: 'player1',
        loser: 'player2',
        result: 'Match processed',
      }));

      await matchController.createMatch(match, res as Response);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        winner: 'player1',
        loser: 'player2',
        result: 'Match processed',
      });
    });
  });
});
