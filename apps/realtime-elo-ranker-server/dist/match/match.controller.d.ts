import { Response } from 'express';
import { MatchService, MatchResult } from './match.service';
export declare class MatchController {
    private readonly matchService;
    constructor(matchService: MatchService);
    createMatch(match: MatchResult, res: Response): void;
}
