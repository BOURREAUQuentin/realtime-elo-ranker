import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerModule } from '../src/player/player.module';
import { RankingModule } from '../src/ranking/ranking.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlayerEntity } from '../src/player/player.entity';
import { EventEmitterService } from '../src/event-emitter/event-emitter.service';

describe('RankingController (e2e)', () => {
  let app: INestApplication;
  let eventEmitterService: EventEmitterService;

  const mockPlayerRepository = {
    save: jest.fn().mockResolvedValue({ id: 'newPlayer', rank: 1200 }),
    findOne: jest.fn().mockResolvedValue({ id: 'existingPlayer', rank: 1300 }),
    find: jest.fn().mockResolvedValue([
      { id: 'player1', rank: 1500 },
      { id: 'player2', rank: 1400 },
    ]),
    clear: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [PlayerEntity],
          synchronize: true,
        }),
        PlayerModule,
        RankingModule,
      ],
    })
      .overrideProvider(getRepositoryToken(PlayerEntity))
      .useValue(mockPlayerRepository)
      .compile();

    app = moduleRef.createNestApplication();
    eventEmitterService = moduleRef.get<EventEmitterService>(EventEmitterService);

    await app.init();
  });

  beforeEach(async () => {
    await mockPlayerRepository.clear();

    await mockPlayerRepository.save([
      { id: 'player1', rank: 1500 },
      { id: 'player2', rank: 1400 },
    ]);
  });

  it(`/GET api/ranking - retourne le classement`, async () => {
    return request(app.getHttpServer())
      .get('/api/ranking')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual([
          { id: 'player1', rank: 1500 },
          { id: 'player2', rank: 1400 },
        ]);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
