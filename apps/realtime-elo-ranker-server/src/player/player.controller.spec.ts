import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { EventEmitterService } from '../event-emitter/event-emitter.service';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

describe('PlayerController', () => {
  let playerController: PlayerController;
  let playerService: PlayerService;
  let eventEmitterService: EventEmitterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        PlayerService,
        EventEmitterService,
      ],
    })
    .overrideProvider(PlayerService)
    .useValue({
      createPlayer: jest.fn().mockResolvedValue({ id: '123', rank: 1000 }),
    })
    .compile();

    playerController = module.get<PlayerController>(PlayerController);
    playerService = module.get<PlayerService>(PlayerService);
    eventEmitterService = module.get<EventEmitterService>(EventEmitterService);
  });

  it('should be defined', () => {
    expect(playerController).toBeDefined();
  });

  describe('createPlayer', () => {
    it('should return 201 if the player is successfully created', async () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const newPlayer = { id: '123', rank: 1000 };
      await playerController.createPlayer(newPlayer.id, res as Response);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);

      expect(res.json).toHaveBeenCalledWith(newPlayer);
    });
  });
});
