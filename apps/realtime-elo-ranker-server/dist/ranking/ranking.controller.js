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
const player_service_1 = require("../player/player.service");
const rxjs_1 = require("rxjs");
const event_emitter_service_1 = require("../event-emitter/event-emitter.service");
let RankingController = class RankingController {
    constructor(playerService, eventEmitterService) {
        this.playerService = playerService;
        this.eventEmitterService = eventEmitterService;
    }
    getRanking(res) {
        const ranking = this.playerService.getAllPlayers();
        return res.status(common_1.HttpStatus.OK).json(ranking);
    }
    getRankingEvents() {
        return (0, rxjs_1.fromEvent)(this.eventEmitterService.getEmitter(), 'ranking.update').pipe((0, rxjs_1.map)((player) => {
            return {
                data: {
                    type: 'RankingUpdate',
                    player: player,
                }
            };
        }));
    }
};
exports.RankingController = RankingController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RankingController.prototype, "getRanking", null);
__decorate([
    (0, common_1.Sse)('events'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", rxjs_1.Observable)
], RankingController.prototype, "getRankingEvents", null);
exports.RankingController = RankingController = __decorate([
    (0, common_1.Controller)('api/ranking'),
    __metadata("design:paramtypes", [player_service_1.PlayerService, event_emitter_service_1.EventEmitterService])
], RankingController);
//# sourceMappingURL=ranking.controller.js.map