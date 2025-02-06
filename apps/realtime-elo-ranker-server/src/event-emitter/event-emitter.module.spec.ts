import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitterModule } from './event-emitter.module';
import { EventEmitterService } from './event-emitter.service';

describe('EventEmitterModule', () => {
  let module: TestingModule;
  let eventEmitterService: EventEmitterService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [EventEmitterModule],
    }).compile();

    eventEmitterService = module.get<EventEmitterService>(EventEmitterService);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should contain EventEmitterService', () => {
    expect(eventEmitterService).toBeDefined();
  });

  it('should be able to emit events', () => {
    const emitSpy = jest.spyOn(eventEmitterService, 'emit');
    const event = 'event_name';
    const payload = { data: 'test data' };

    eventEmitterService.emit(event, payload);

    expect(emitSpy).toHaveBeenCalledWith(event, payload);
  });
});
