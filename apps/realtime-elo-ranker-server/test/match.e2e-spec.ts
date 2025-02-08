import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MatchModule } from '../src/match/match.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerEntity } from '../src/player/player.entity';
import { MatchService } from '../src/match/match.service';
import { RankingService } from '../src/ranking/ranking.service';

describe('MatchController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [PlayerEntity],
          synchronize: true,
        }),
        MatchModule,
      ],
    })
      .overrideProvider(MatchService)
      .useValue({ processMatch: jest.fn().mockResolvedValue({ winner: { id: 'player1', rank: 1200 }, loser: { id: 'player2', rank: 1000 } }) })
      .overrideProvider(RankingService)
      .useValue({ updateRanking: jest.fn() })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/match - devrait retourner 200 et le résultat du match', async () => {
    const matchData = { winner: 'player1', loser: 'player2', draw: false };
    const response = await request(app.getHttpServer()).post('/api/match').send(matchData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('winner');
    expect(response.body).toHaveProperty('loser');
  });
});
