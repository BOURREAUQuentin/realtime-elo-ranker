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
exports.PlayerService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_service_1 = require("../event-emitter/event-emitter.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const player_entity_1 = require("./player.entity");
let PlayerService = class PlayerService {
    constructor(playerRepository, eventEmitterService) {
        this.playerRepository = playerRepository;
        this.eventEmitterService = eventEmitterService;
        this.players = [];
        this.loadPlayersFromDatabase();
    }
    loadPlayersFromDatabase() {
        console.log("chargement bd");
        this.playerRepository.find().then((playersFromDb) => {
            this.players = playersFromDb.map((p) => ({ id: p.id, rank: p.rank }));
        }).catch((error) => {
            console.error('Erreur lors du chargement des joueurs depuis la base:', error);
        });
    }
    createPlayer(id) {
        if (this.players.some((p) => p.id === id)) {
            return Promise.resolve(null);
        }
        const averageRank = this.players.length > 0
            ? this.players.reduce((sum, player) => sum + player.rank, 0) /
                this.players.length
            : 1000;
        const newPlayer = { id, rank: Math.round(averageRank) };
        this.players.push(newPlayer);
        const newPlayerEntity = this.playerRepository.create({
            id: newPlayer.id,
            rank: newPlayer.rank,
        });
        return this.playerRepository.save(newPlayerEntity)
            .then(() => {
            this.eventEmitterService.emit('ranking.update', newPlayer);
            return newPlayer;
        });
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
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(player_entity_1.PlayerEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        event_emitter_service_1.EventEmitterService])
], PlayerService);
//# sourceMappingURL=player.service.js.map