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
exports.H2hController = void 0;
const common_1 = require("@nestjs/common");
const h2h_service_1 = require("../services/h2h.service");
const h2h_fixture_dto_1 = require("../dto/h2h-fixture.dto");
let H2hController = class H2hController {
    constructor(h2hService) {
        this.h2hService = h2hService;
    }
    generalInfo(body) {
        return this.h2hService.fixtures(body);
    }
    getFixtures() {
        return this.h2hService.getFixturesH2hInteresting();
    }
    getH2hLeague(leagueId) {
        return this.h2hService.getH2hInterestingLeague(leagueId);
    }
    getH2hTeams(teamId) {
        return this.h2hService.getH2hInterestingTeams(teamId);
    }
    h2hTeams(firstTeamId, secondTeamId) {
        return this.h2hService.h2hTeams(firstTeamId, secondTeamId);
    }
    teamDataForComparision(teamId, seasonId) {
        return this.h2hService.teamDataForComparision(teamId, seasonId);
    }
    teamRecentlyPlayed(teamId, isHomeAwayForm) {
        return this.h2hService.teamRecentlyPlayed(teamId, isHomeAwayForm);
    }
};
__decorate([
    (0, common_1.Post)('fixtures'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [h2h_fixture_dto_1.H2hFixtureDto]),
    __metadata("design:returntype", void 0)
], H2hController.prototype, "generalInfo", null);
__decorate([
    (0, common_1.Get)('fixtures'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], H2hController.prototype, "getFixtures", null);
__decorate([
    (0, common_1.Get)('/:leagueId'),
    __param(0, (0, common_1.Param)('leagueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], H2hController.prototype, "getH2hLeague", null);
__decorate([
    (0, common_1.Get)('fixtures/:teamId'),
    __param(0, (0, common_1.Param)('teamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], H2hController.prototype, "getH2hTeams", null);
__decorate([
    (0, common_1.Get)('teams/:firstTeamId/:secondTeamId'),
    __param(0, (0, common_1.Param)('firstTeamId')),
    __param(1, (0, common_1.Param)('secondTeamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], H2hController.prototype, "h2hTeams", null);
__decorate([
    (0, common_1.Get)('/team/comparision/:teamId/:seasonId'),
    __param(0, (0, common_1.Param)('teamId')),
    __param(1, (0, common_1.Param)('seasonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], H2hController.prototype, "teamDataForComparision", null);
__decorate([
    (0, common_1.Get)('recently/:teamId/:isHomeAwayForm'),
    __param(0, (0, common_1.Param)('teamId')),
    __param(1, (0, common_1.Param)('isHomeAwayForm')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], H2hController.prototype, "teamRecentlyPlayed", null);
H2hController = __decorate([
    (0, common_1.Controller)('football/api/v1/h2h'),
    __metadata("design:paramtypes", [h2h_service_1.H2hService])
], H2hController);
exports.H2hController = H2hController;
//# sourceMappingURL=h2h.controller.js.map