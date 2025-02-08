import { Test, TestingModule } from '@nestjs/testing';
import { MatchModule } from './match.module';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { PlayerModule } from '../player/player.module';
import { RankingModule } from '../ranking/ranking.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerEntity } from '../player/player.entity';
import { DataSource } from 'typeorm';
import { PlayerService } from '../player/player.service';
import { EventEmitterModule } from '../event-emitter/event-emitter.module';

describe('MatchModule', () => {
  let module: TestingModule;
  let matchService: MatchService;
  let matchController: MatchController;
  let playerService: PlayerService;
  let dataSource: DataSource;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        PlayerModule,
        RankingModule,
        EventEmitterModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [PlayerEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([PlayerEntity]),
        MatchModule,
      ],
    }).compile();

    matchService = module.get<MatchService>(MatchService);
    matchController = module.get<MatchController>(MatchController);
    playerService = module.get<PlayerService>(PlayerService);
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should contain MatchService', () => {
    expect(matchService).toBeDefined();
  });

  it('should contain MatchController', () => {
    expect(matchController).toBeDefined();
  });

  it('should load PlayerService as a dependency', () => {
    expect(playerService).toBeDefined();
  });

  it('should load RankingModule as a dependency', () => {
    const rankingModule = module.get(RankingModule);
    expect(rankingModule).toBeDefined();
  });

  it('should load EventEmitterModule as a dependency', () => {
    const eventEmitterModule = module.get(EventEmitterModule);
    expect(eventEmitterModule).toBeDefined();
  });

  it('should load PlayerModule as a dependency', () => {
    const playerModule = module.get(PlayerModule);
    expect(playerModule).toBeDefined();
  });
});
