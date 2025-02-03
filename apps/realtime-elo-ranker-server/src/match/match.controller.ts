import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { MatchService, MatchResult } from './match.service';

@Controller('api/match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  createMatch(@Body() match: MatchResult, @Res() res: Response) {
    try {
      const result = this.matchService.processMatch(match);
      return res.status(HttpStatus.OK).json(result);
    } catch {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        code: 422,
        message: "Un des joueurs n'existe pas",
      });
    }
  }
}
