import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { PlayerService } from './player.service';

@Controller('api/player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  createPlayer(@Body('id') id: string, @Res() res: Response) {
    if (!id) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        code: 400,
        message: "L'identifiant du joueur n'est pas valide",
      });
    }

    return this.playerService.createPlayer(id)
      .then(player => {
        if (!player) {
          return res.status(HttpStatus.CONFLICT).json({
            code: 409,
            message: 'Le joueur existe déjà',
          });
        }
        return res.status(HttpStatus.CREATED).json(player);
      });
  }
}
