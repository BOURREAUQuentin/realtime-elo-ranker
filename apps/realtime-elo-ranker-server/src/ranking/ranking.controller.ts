import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { PlayerService } from '../player/player.service';

@Controller('api/ranking')
export class RankingController {
  constructor(private readonly playerService: PlayerService) {}

  @Get()
  getRanking(@Res() res: Response) {
    const ranking = this.playerService.getAllPlayers();
    return res.status(HttpStatus.OK).json(ranking);
  }
}
