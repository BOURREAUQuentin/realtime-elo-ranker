import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitterController } from './event-emitter.controller';

describe('EventEmitterController', () => {
  let controller: EventEmitterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventEmitterController],
    }).compile();

    controller = module.get<EventEmitterController>(EventEmitterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
