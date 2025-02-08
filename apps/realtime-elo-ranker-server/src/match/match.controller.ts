import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { MatchService, MatchResult } from './match.service';

@Controller('api/match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  createMatch(@Body() match: MatchResult, @Res() res: Response) {
    this.matchService.processMatch(match)
      .then((result) => res.status(HttpStatus.OK).json(result))
      .catch(() => res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        code: 422,
        message: "Un des joueurs n'existe pas",
      }));
  }
}
