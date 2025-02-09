import { Test, TestingModule } from '@nestjs/testing';
import { PlayerModule } from './player.module';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { EventEmitterModule } from '../event-emitter/event-emitter.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerEntity } from './player.entity';
import { DataSource } from 'typeorm';

describe('PlayerModule', () => {
  let module: TestingModule;
  let dataSource: DataSource;

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
      ],
    }).compile();

    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should contain PlayerService', () => {
    const playerService = module.get<PlayerService>(PlayerService);
    expect(playerService).toBeDefined();
  });

  it('should contain PlayerController', () => {
    const playerController = module.get<PlayerController>(PlayerController);
    expect(playerController).toBeDefined();
  });
});
