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
exports.RankingController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
let RankingController = class RankingController {
    constructor(rankingService) {
        this.rankingService = rankingService;
    }
    createMatch(match, res) {
        const winner = this.rankingService.getPlayer(match.winner);
        const loser = this.rankingService.getPlayer(match.loser);
        if (!winner || !loser) {
            return res.status(common_1.HttpStatus.UNPROCESSABLE_ENTITY).json({
                code: 422,
                message: "Un des joueurs n'existe pas",
            });
        }
        const result = this.rankingService.processMatch(match);
        return res.status(common_1.HttpStatus.OK).json(result);
    }
    createPlayer(player, res) {
        if (!player.id) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                code: 400,
                message: "L'identifiant du joueur n'est pas valide",
            });
        }
        const newPlayer = this.rankingService.createPlayer(player);
        if (!newPlayer) {
            return res.status(common_1.HttpStatus.CONFLICT).json({
                code: 409,
                message: 'Le joueur existe déjà',
            });
        }
        return res.status(common_1.HttpStatus.OK).json(newPlayer);
    }
    getRanking(res) {
        const ranking = this.rankingService.getRanking();
        if (ranking.length == 0) {
            return res.status(common_1.HttpStatus.CONFLICT).json({
                code: 404,
                message: "Le classement n'est pas disponible car aucun joueur n'existe",
            });
        }
        return res.status(200).json(ranking);
    }
};
exports.RankingController = RankingController;
__decorate([
    (0, common_1.Post)('/api/match'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RankingController.prototype, "createMatch", null);
__decorate([
    (0, common_1.Post)('/api/player'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RankingController.prototype, "createPlayer", null);
__decorate([
    (0, common_1.Get)('/api/ranking'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RankingController.prototype, "getRanking", null);
exports.RankingController = RankingController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.RankingService])
], RankingController);
//# sourceMappingURL=app.controller.js.map