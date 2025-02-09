import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlayerEntity } from './player.entity';
import { Repository } from 'typeorm';
import { EventEmitterService } from '../event-emitter/event-emitter.service';

describe('PlayerService', () => {
  let playerService: PlayerService;
  let playerRepository: Repository<PlayerEntity>;
  let eventEmitterService: EventEmitterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: getRepositoryToken(PlayerEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([{ id: 'existingPlayer', rank: 1300 }]),
            create: jest.fn().mockReturnValue({ id: '', rank: 1200 }),
            save: jest.fn().mockResolvedValue({ id: '', rank: 1200 }),
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

    playerService = module.get<PlayerService>(PlayerService);
    playerRepository = module.get<Repository<PlayerEntity>>(getRepositoryToken(PlayerEntity));
    eventEmitterService = module.get<EventEmitterService>(EventEmitterService);

    await playerService['loadPlayersFromDatabase']();
  });

  it('should be defined', () => {
    expect(playerService).toBeDefined();
  });

  describe('createPlayer', () => {
    it('should return null if the player already exists', async () => {
      const existingPlayer = { id: 'existingPlayer', rank: 1300 };

      const result = await playerService.createPlayer(existingPlayer.id);

      expect(result).toBeNull();
      expect(playerRepository.save).not.toHaveBeenCalled();
      expect(eventEmitterService.emit).not.toHaveBeenCalled();
    });
  });

  describe('loadPlayersFromDatabase', () => {
    it('should load players from the database', async () => {
      const mockPlayersFromDb: PlayerEntity[] = [
        { id: 'player1', rank: 1200 } as PlayerEntity,
        { id: 'player2', rank: 1100 } as PlayerEntity,
      ];
      jest.spyOn(playerRepository, 'find').mockResolvedValue(mockPlayersFromDb);
  
      await playerService['loadPlayersFromDatabase']();
  
      expect(playerService.getAllPlayers()).toEqual([
        { id: 'player1', rank: 1200 },
        { id: 'player2', rank: 1100 },
      ]);
    });
  });

  describe('PlayerService - Additional tests', () => {
    describe('loadPlayersFromDatabase', () => {
      it('should not crash if the base is empty', async () => {
        jest.spyOn(playerRepository, 'find').mockResolvedValue([]);
  
        await playerService['loadPlayersFromDatabase']();
  
        expect(playerService.getAllPlayers()).toEqual([]);
      });
  
      it('should load players correctly', async () => {
        const mockPlayersFromDb: PlayerEntity[] = [
          { id: 'player1', rank: 1200 } as PlayerEntity,
          { id: 'player2', rank: 1100 } as PlayerEntity,
        ];
        jest.spyOn(playerRepository, 'find').mockResolvedValue(mockPlayersFromDb);
  
        await playerService['loadPlayersFromDatabase']();
  
        expect(playerService.getAllPlayers()).toEqual([
          { id: 'player1', rank: 1200 },
          { id: 'player2', rank: 1100 },
        ]);
      });
    });
  
    describe('createPlayer', () => {
      it('should create a player with an average rank', async () => {
        playerService['players'] = [
          { id: 'existing1', rank: 1500 },
          { id: 'existing2', rank: 1000 },
        ];
  
        const saveMock = jest.spyOn(playerRepository, 'save').mockResolvedValue({ id: 'newPlayer', rank: 1250 } as PlayerEntity);
  
        const result = await playerService.createPlayer('newPlayer');
  
        expect(result).toEqual({ id: 'newPlayer', rank: 1250 });
        expect(saveMock).toHaveBeenCalled();
        expect(eventEmitterService.emit).toHaveBeenCalledWith('ranking.update', { id: 'newPlayer', rank: 1250 });
      });
  
      it('should assign a rank of 1000 if no existing player', async () => {
        playerService['players'] = [];
  
        const saveMock = jest.spyOn(playerRepository, 'save').mockResolvedValue({ id: 'newPlayer', rank: 1000 } as PlayerEntity);
  
        const result = await playerService.createPlayer('newPlayer');
  
        expect(result).toEqual({ id: 'newPlayer', rank: 1000 });
        expect(saveMock).toHaveBeenCalled();
        expect(eventEmitterService.emit).toHaveBeenCalledWith('ranking.update', { id: 'newPlayer', rank: 1000 });
      });
    });
  
    describe('getPlayer', () => {
      it('should return an existing player', () => {
        playerService['players'] = [{ id: 'player1', rank: 1200 }];
  
        const result = playerService.getPlayer('player1');
  
        expect(result).toEqual({ id: 'player1', rank: 1200 });
      });
  
      it('should return undefined if the player does not exist', () => {
        playerService['players'] = [{ id: 'player1', rank: 1200 }];
  
        const result = playerService.getPlayer('unknown');
  
        expect(result).toBeUndefined();
      });
    });
  
    describe('getAllPlayers', () => {
      it('should return a list sorted by rank', () => {
        playerService['players'] = [
          { id: 'p1', rank: 1000 },
          { id: 'p2', rank: 1200 },
          { id: 'p3', rank: 1100 },
        ];
  
        const result = playerService.getAllPlayers();
  
        expect(result).toEqual([
          { id: 'p2', rank: 1200 },
          { id: 'p3', rank: 1100 },
          { id: 'p1', rank: 1000 },
        ]);
      });
    });
  });  
  
});
