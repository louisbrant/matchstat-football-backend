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
exports.PlayerController = void 0;
const common_1 = require("@nestjs/common");
const search_dto_1 = require("../dto/search.dto");
const player_service_1 = require("../services/player.service");
const player_stats_dto_1 = require("../dto/player-stats.dto");
let PlayerController = class PlayerController {
    constructor(playerService) {
        this.playerService = playerService;
    }
    generalInfo(body) {
        return this.playerService.generalInfo(body);
    }
    stats(body) {
        return this.playerService.stats(body);
    }
};
__decorate([
    (0, common_1.Post)('generalInfo'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_dto_1.SearchDto]),
    __metadata("design:returntype", void 0)
], PlayerController.prototype, "generalInfo", null);
__decorate([
    (0, common_1.Post)('stats'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [player_stats_dto_1.PlayerStatsDto]),
    __metadata("design:returntype", void 0)
], PlayerController.prototype, "stats", null);
PlayerController = __decorate([
    (0, common_1.Controller)('football/api/v1/players'),
    __metadata("design:paramtypes", [player_service_1.PlayerService])
], PlayerController);
exports.PlayerController = PlayerController;
//# sourceMappingURL=player.controller.js.map