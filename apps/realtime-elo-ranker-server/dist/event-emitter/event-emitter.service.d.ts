import { EventEmitter2 } from 'eventemitter2';
export declare class EventEmitterService {
    private eventEmitter;
    constructor();
    getEmitter(): EventEmitter2;
    emit(event: string, payload: any): boolean;
}
