"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankingService = void 0;
const common_1 = require("@nestjs/common");
const player_service_1 = require("../player/player.service");
let RankingService = class RankingService {
    constructor(playerService) {
        this.playerService = playerService;
        this.K = 32;
    }
    calculateExpectedScore(playerRank, opponentRank) {
        return 1 / (1 + Math.pow(10, (opponentRank - playerRank) / 400));
    }
    calculateNewRating(oldRating, expectedScore, actualScore) {
        return Math.round(oldRating + this.K * (actualScore - expectedScore));
    }
    updateRanking(match) {
        const winner = this.playerService.getPlayer(match.winner);
        const loser = this.playerService.getPlayer(match.loser);
        if (!winner || !loser)
            throw new Error("Un des joueurs n'existe pas");
        const expectedWinner = this.calculateExpectedScore(winner.rank, loser.rank);
        const expectedLoser = 1 - expectedWinner;
        const actualWinner = match.draw ? 0.5 : 1;
        const actualLoser = match.draw ? 0.5 : 0;
        winner.rank = this.calculateNewRating(winner.rank, expectedWinner, actualWinner);
        loser.rank = this.calculateNewRating(loser.rank, expectedLoser, actualLoser);
        return { winner, loser };
    }
};
exports.RankingService = RankingService;
exports.RankingService = RankingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [player_service_1.PlayerService])
], RankingService);
//# sourceMappingURL=ranking.service.js.map