import { Controller, Get, Res, HttpStatus, Sse } from '@nestjs/common';
import { Response } from 'express';
import { Player, PlayerService } from '../player/player.service';
import { fromEvent, map, Observable } from 'rxjs';
import { EventEmitterService } from '../event-emitter/event-emitter.service';

@Controller('api/ranking')
export class RankingController {
  constructor(private readonly playerService: PlayerService, private readonly eventEmitterService: EventEmitterService) {}

  @Get()
  getRanking(@Res() res: Response) {
    const ranking = this.playerService.getAllPlayers();
    return res.status(HttpStatus.OK).json(ranking);
  }

  @Sse('events')
  getRankingEvents(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitterService.getEmitter(), 'ranking.update').pipe(
      map((player: Player) => {
        return <MessageEvent>{
          data: {
            type: 'RankingUpdate',
            player: player,
          }
        }
      })
    );
  }
}
