import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitterService } from './event-emitter.service';
import { EventEmitter2 } from 'eventemitter2';

describe('EventEmitterService', () => {
  let eventEmitterService: EventEmitterService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventEmitterService],
    }).compile();

    eventEmitterService = module.get<EventEmitterService>(EventEmitterService);
    eventEmitter = eventEmitterService.getEmitter();
  });

  it('devrait être défini', () => {
    expect(eventEmitterService).toBeDefined();
    expect(eventEmitter).toBeDefined();
  });

  it('devrait émettre un événement', () => {
    const emitSpy = jest.spyOn(eventEmitter, 'emit');
  
    const eventName = 'ranking.update';
    const payload = { id: 'player1', rank: 1200 };
  
    eventEmitter.on(eventName, (receivedPayload) => {
      expect(receivedPayload).toEqual(payload);
    });
  
    const result = eventEmitterService.emit(eventName, payload);
  
    expect(emitSpy).toHaveBeenCalledWith(eventName, payload);
    expect(result).toBe(true);
  });  

  it('devrait récupérer l\'instance de EventEmitter2', () => {
    expect(eventEmitterService.getEmitter()).toBeInstanceOf(EventEmitter2);
  });
});
