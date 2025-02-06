import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { EventEmitterService } from './event-emitter/event-emitter.service';
import { PlayerService } from './player/player.service';
import { MatchService } from './match/match.service';
import { RankingService } from './ranking/ranking.service';
import { EventEmitterController } from './event-emitter/event-emitter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PlayerEntity } from './player/player.entity';

describe('AppModule', () => {
  let app: TestingModule;
  let eventEmitterService: EventEmitterService;
  let playerService: PlayerService;
  let matchService: MatchService;
  let rankingService: RankingService;
  let dataSource: DataSource;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [PlayerEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([PlayerEntity]),
      ],
    }).compile();

    eventEmitterService = app.get<EventEmitterService>(EventEmitterService);
    playerService = app.get<PlayerService>(PlayerService);
    matchService = app.get<MatchService>(MatchService);
    rankingService = app.get<RankingService>(RankingService);
    dataSource = app.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should contain EventEmitterService', () => {
    expect(eventEmitterService).toBeDefined();
  });

  it('should contain PlayerService', () => {
    expect(playerService).toBeDefined();
  });

  it('should contain MatchService', () => {
    expect(matchService).toBeDefined();
  });

  it('should contain RankingService', () => {
    expect(rankingService).toBeDefined();
  });

  it('should contain EventEmitterController', () => {
    const controller = app.get<EventEmitterController>(EventEmitterController);
    expect(controller).toBeDefined();
  });

  it('should load the TypeOrm connection', async () => {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    const connection = queryRunner.connection;
  
    expect(connection.isConnected).toBeTruthy();
    await queryRunner.release();
  });  
});
