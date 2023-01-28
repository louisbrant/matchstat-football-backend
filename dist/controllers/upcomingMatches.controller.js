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
exports.UpcomingMatchesController = void 0;
const common_1 = require("@nestjs/common");
const upcomingMatches_service_1 = require("../services/upcomingMatches.service");
const upcoming_matches_dto_1 = require("../dto/upcoming-matches.dto");
let UpcomingMatchesController = class UpcomingMatchesController {
    constructor(upcomingMatchesService) {
        this.upcomingMatchesService = upcomingMatchesService;
    }
    competitionStandings(body) {
        return this.upcomingMatchesService.upcomingMatches(body);
    }
};
__decorate([
    (0, common_1.Post)('upcoming'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upcoming_matches_dto_1.UpcomingMatchesDto]),
    __metadata("design:returntype", void 0)
], UpcomingMatchesController.prototype, "competitionStandings", null);
UpcomingMatchesController = __decorate([
    (0, common_1.Controller)('football/api/v1/matches'),
    __metadata("design:paramtypes", [upcomingMatches_service_1.UpcomingMatchesService])
], UpcomingMatchesController);
exports.UpcomingMatchesController = UpcomingMatchesController;
//# sourceMappingURL=upcomingMatches.controller.js.map