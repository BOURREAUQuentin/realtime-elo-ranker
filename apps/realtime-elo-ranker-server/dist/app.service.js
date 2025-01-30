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
    }
    createPlayer(player) {
        if (this.players.some(p => p.id === player.id)) {
            return null;
        }
        const newPlayer = { id: player.id, rank: 1000 };
        this.players.push(newPlayer);
        return player;
    }
    getRanking() {
        return [...this.players].sort((a, b) => b.rank - a.rank);
    }
};
exports.RankingService = RankingService;
exports.RankingService = RankingService = __decorate([
    (0, common_1.Injectable)()
], RankingService);
//# sourceMappingURL=app.service.js.map