import { Controller, Post, Get, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { RankingService } from './app.service';

interface Player {
  id: string;
  rank: number;
}

@Controller()
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Post('/api/player')
  createPlayer(@Body() player: Player, @Res() res: Response) {
    if (!player.id) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        code: 400,
        message: "L'identifiant du joueur n'est pas valide",
      });
    }

    const newPlayer = this.rankingService.createPlayer(player);

    if (!newPlayer) {
      return res.status(HttpStatus.CONFLICT).json({
        code: 409,
        message: 'Le joueur existe déjà',
      });
    }

    return res.status(HttpStatus.OK).json(newPlayer);
  }

  @Get('/api/ranking')
  getRanking(@Res() res: Response) {
    const ranking = this.rankingService.getRanking();
    return res.status(200).json(ranking);
  }
}
