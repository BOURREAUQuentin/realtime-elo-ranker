import { Test, TestingModule } from '@nestjs/testing';
import { RankingModule } from './ranking.module';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';
import { PlayerModule } from '../player/player.module';
import { EventEmitterModule } from '../event-emitter/event-emitter.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerEntity } from '../player/player.entity';
import { PlayerService } from '../player/player.service';
import { DataSource } from 'typeorm';

describe('RankingModule', () => {
  let module: TestingModule;
  let rankingService: RankingService;
  let rankingController: RankingController;
  let dataSource: DataSource;
  let playerService: PlayerService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        PlayerModule,
        EventEmitterModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [PlayerEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([PlayerEntity]),
        RankingModule,
      ],
    }).compile();

    rankingService = module.get<RankingService>(RankingService);
    rankingController = module.get<RankingController>(RankingController);
    playerService = module.get<PlayerService>(PlayerService);
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should contain RankingService', () => {
    expect(rankingService).toBeDefined();
  });

  it('should contain RankingController', () => {
    expect(rankingController).toBeDefined();
  });

  it('should load PlayerService as a dependency', () => {
    expect(playerService).toBeDefined();
  });

  it('should load EventEmitterModule as a dependency', () => {
    const eventEmitterModule = module.get(EventEmitterModule);
    expect(eventEmitterModule).toBeDefined();
  });
});
