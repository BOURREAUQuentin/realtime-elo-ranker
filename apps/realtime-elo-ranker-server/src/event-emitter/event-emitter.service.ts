import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';

@Injectable()
export class EventEmitterService {
  private eventEmitter: EventEmitter2;

  constructor() {
    this.eventEmitter = new EventEmitter2();
  }

  getEmitter(): EventEmitter2 {
    return this.eventEmitter;
  }

  emit(event: string, payload: any): boolean {
    return this.eventEmitter.emit(event, payload);
  }
}
