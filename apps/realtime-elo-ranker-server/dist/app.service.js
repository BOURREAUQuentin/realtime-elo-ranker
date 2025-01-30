"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankingService = void 0;
const common_1 = require("@nestjs/common");
let RankingService = class RankingService {
    constructor() {
        this.players = [];
        this.K = 32;
    }
    createPlayer(player) {
        if (this.players.some((p) => p.id === player.id)) {
            return null;
        }
        const newPlayer = { id: player.id, rank: 1000 };
        this.players.push(newPlayer);
        return player;
    }
    getRanking() {
        return [...this.players].sort((a, b) => b.rank - a.rank);
    }
    getPlayer(id) {
        return this.players.find((p) => p.id === id);
    }
    calculateExpectedScore(playerRank, opponentRank) {
        return 1 / (1 + Math.pow(10, (opponentRank - playerRank) / 400));
    }
    calculateNewRating(oldRating, expectedScore, actualScore) {
        return Math.round(oldRating + this.K * (actualScore - expectedScore));
    }
    processMatch(match) {
        const winner = this.getPlayer(match.winner);
        const loser = this.getPlayer(match.loser);
        if (!winner || !loser) {
            throw new Error("Un des joueurs n'existe pas");
        }
        const expectedScoreWinner = this.calculateExpectedScore(winner.rank, loser.rank);
        const expectedScoreLoser = 1 - expectedScoreWinner;
        const actualScoreWinner = match.draw ? 0.5 : 1;
        const actualScoreLoser = match.draw ? 0.5 : 0;
        const newWinnerRating = this.calculateNewRating(winner.rank, expectedScoreWinner, actualScoreWinner);
        const newLoserRating = this.calculateNewRating(loser.rank, expectedScoreLoser, actualScoreLoser);
        winner.rank = newWinnerRating;
        loser.rank = newLoserRating;
        this.players = this.players.map(p => {
            if (p.id === winner.id)
                return winner;
            if (p.id === loser.id)
                return loser;
            return p;
        });
        return {
            winner: { ...winner },
            loser: { ...loser },
        };
    }
};
exports.RankingService = RankingService;
exports.RankingService = RankingService = __decorate([
    (0, common_1.Injectable)()
], RankingService);
//# sourceMappingURL=app.service.js.map