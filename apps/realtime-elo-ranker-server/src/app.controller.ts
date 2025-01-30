import { Controller, Post, Get, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { RankingService, Player, MatchResult } from './app.service';

@Controller()
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Post('/api/match')
  createMatch(@Body() match: MatchResult, @Res() res: Response) {
    // Vérifier que les deux joueurs existent
    const winner = this.rankingService.getPlayer(match.winner);
    const loser = this.rankingService.getPlayer(match.loser);

    if (!winner || !loser) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        code: 422,
        message: "Un des joueurs n'existe pas",
      });
    }

    const result = this.rankingService.processMatch(match);
    return res.status(HttpStatus.OK).json(result);
  }

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
    if (ranking.length == 0) {
      return res.status(HttpStatus.CONFLICT).json({
        code: 404,
        message: "Le classement n'est pas disponible car aucun joueur n'existe",
      });
    }
    return res.status(200).json(ranking);
  }
}
