import { Test, TestingModule } from '@nestjs/testing';
import { RankingController } from './ranking.controller';
import { PlayerService } from '../player/player.service';
import { EventEmitterService } from '../event-emitter/event-emitter.service';
import { HttpStatus } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';

describe('RankingController', () => {
  let controller: RankingController;
  let playerService: PlayerService;
  let eventEmitterService: EventEmitterService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankingController],
      providers: [
        {
          provide: PlayerService,
          useValue: {
            getAllPlayers: jest.fn().mockReturnValue([{ id: 'player1', rank: 1200 }, { id: 'player2', rank: 1000 }]),
          },
        },
        {
          provide: EventEmitterService,
          useValue: {
            getEmitter: jest.fn().mockReturnValue(new EventEmitter2()),
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RankingController>(RankingController);
    playerService = module.get<PlayerService>(PlayerService);
    eventEmitterService = module.get<EventEmitterService>(EventEmitterService);
    eventEmitter = eventEmitterService.getEmitter();
  });

  it('devrait être défini', () => {
    expect(controller).toBeDefined();
  });

  describe('getRanking', () => {
    it('devrait renvoyer le classement des joueurs', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as any;

      await controller.getRanking(res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith([{ id: 'player1', rank: 1200 }, { id: 'player2', rank: 1000 }]);
    });
  });

  describe('getRankingEvents', () => {
    it('devrait renvoyer un événement SSE avec les mises à jour de classement', async () => {
      const mockEvent = { id: 'player1', rank: 1300 };
      const eventSpy = jest.spyOn(eventEmitter, 'emit');

      const eventPromise = new Promise<MessageEvent>((resolve) => {
        controller.getRankingEvents().subscribe((message: MessageEvent) => {
          expect(message.data.type).toBe('RankingUpdate');
          expect(message.data.player.rank).toBe(1300);
          expect(eventSpy).toHaveBeenCalledWith('ranking.update', mockEvent);
          resolve(message);
        });
      });

      eventEmitter.emit('ranking.update', mockEvent);

      await eventPromise;
    }, 10000);
  });
});
