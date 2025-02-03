"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerService = void 0;
const common_1 = require("@nestjs/common");
let PlayerService = class PlayerService {
    constructor() {
        this.players = [];
    }
    createPlayer(id) {
        if (this.players.some((p) => p.id === id))
            return null;
        const averageRank = this.players.length > 0
            ? this.players.reduce((sum, player) => sum + player.rank, 0) /
                this.players.length
            : 1000;
        const newPlayer = { id, rank: Math.round(averageRank) };
        this.players.push(newPlayer);
        return newPlayer;
    }
    getPlayer(id) {
        return this.players.find((p) => p.id === id);
    }
    getAllPlayers() {
        return [...this.players].sort((a, b) => b.rank - a.rank);
    }
};
exports.PlayerService = PlayerService;
exports.PlayerService = PlayerService = __decorate([
    (0, common_1.Injectable)()
], PlayerService);
//# sourceMappingURL=player.service.js.map