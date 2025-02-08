import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerModule } from '../src/player/player.module';
import { PlayerEntity } from '../src/player/player.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('PlayerController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<PlayerEntity>;

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
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    repository = moduleRef.get<Repository<PlayerEntity>>(getRepositoryToken(PlayerEntity));
  });

  beforeEach(async () => {
    await repository.clear();
  });

  it(`/POST api/player - crée un joueur`, async () => {
    const newPlayer = { id: 'newPlayer' };

    return request(app.getHttpServer())
      .post('/api/player')
      .send(newPlayer)
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: 'newPlayer',
            rank: expect.any(Number),
          })
        );
      });
  });

  it(`/POST api/player - erreur si l'ID est absent`, async () => {
    return request(app.getHttpServer())
      .post('/api/player')
      .send({})
      .expect(400)
      .expect({
        code: 400,
        message: "L'identifiant du joueur n'est pas valide",
      });
  });

  it(`/POST api/player - erreur si le joueur existe déjà`, async () => {
    const existingPlayer = { id: 'existingPlayer' };

    await request(app.getHttpServer()).post('/api/player').send(existingPlayer).expect(201);

    return request(app.getHttpServer())
      .post('/api/player')
      .send(existingPlayer)
      .expect(409)
      .expect({
        code: 409,
        message: 'Le joueur existe déjà',
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
