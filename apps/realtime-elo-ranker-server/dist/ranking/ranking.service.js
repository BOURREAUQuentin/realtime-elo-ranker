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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankingService = void 0;
const common_1 = require("@nestjs/common");
const player_service_1 = require("../player/player.service");
const event_emitter_service_1 = require("../event-emitter/event-emitter.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const player_entity_1 = require("../player/player.entity");
let RankingService = class RankingService {
    constructor(playerRepository, playerService, eventEmitterService) {
        this.playerRepository = playerRepository;
        this.playerService = playerService;
        this.eventEmitterService = eventEmitterService;
        this.K = 32;
    }
    calculateExpectedScore(playerRank, opponentRank) {
        return 1 / (1 + Math.pow(10, (opponentRank - playerRank) / 400));
    }
    calculateNewRating(oldRating, expectedScore, actualScore) {
        return Math.round(oldRating + this.K * (actualScore - expectedScore));
    }
    updateRanking(match) {
        return Promise.all([
            this.playerRepository.findOne({ where: { id: match.winner } }),
            this.playerRepository.findOne({ where: { id: match.loser } })
        ])
            .then(([winner, loser]) => {
            if (!winner || !loser) {
                throw new Error("Un des joueurs n'existe pas");
            }
            const expectedWinner = this.calculateExpectedScore(winner.rank, loser.rank);
            const expectedLoser = 1 - expectedWinner;
            const actualWinner = match.draw ? 0.5 : 1;
            const actualLoser = match.draw ? 0.5 : 0;
            winner.rank = this.calculateNewRating(winner.rank, expectedWinner, actualWinner);
            loser.rank = this.calculateNewRating(loser.rank, expectedLoser, actualLoser);
            return Promise.all([
                this.playerRepository.save(winner),
                this.playerRepository.save(loser)
            ]).then(() => {
                const winnerMemory = this.playerService.getPlayer(match.winner);
                const loserMemory = this.playerService.getPlayer(match.loser);
                if (winnerMemory) {
                    winnerMemory.rank = winner.rank;
                }
                if (loserMemory) {
                    loserMemory.rank = loser.rank;
                }
                this.eventEmitterService.emit('ranking.update', winner);
                this.eventEmitterService.emit('ranking.update', loser);
                return { winner, loser };
            });
        });
    }
};
exports.RankingService = RankingService;
exports.RankingService = RankingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(player_entity_1.PlayerEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        player_service_1.PlayerService, event_emitter_service_1.EventEmitterService])
], RankingService);
//# sourceMappingURL=ranking.service.js.map