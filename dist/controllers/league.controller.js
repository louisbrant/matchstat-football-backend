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
exports.LeagueController = void 0;
const common_1 = require("@nestjs/common");
const general_info_dto_1 = require("../dto/general-info.dto");
const league_service_1 = require("../services/league.service");
const league_overall_stats_dto_1 = require("../dto/league-overall-stats.dto");
const league_fixture_dto_1 = require("../dto/league-fixture.dto");
const league_detail_stats_dto_1 = require("../dto/league-detail-stats.dto");
const league_general_stats_dto_1 = require("../dto/league-general-stats.dto");
const search_dto_1 = require("../dto/search.dto");
const seasons_of_league_dto_1 = require("../dto/seasons-of-league.dto");
const leagueSeason_dto_1 = require("../dto/leagueSeason.dto");
const league_season_dates_dto_1 = require("../dto/league-season-dates.dto");
let LeagueController = class LeagueController {
    constructor(leagueService) {
        this.leagueService = leagueService;
    }
    generalInfo(body) {
        return this.leagueService.generalInfo(body);
    }
    overallStats(body) {
        return this.leagueService.overallStats(body);
    }
    fixtures(body) {
        return this.leagueService.fixtures(body);
    }
    detailStats(body) {
        return this.leagueService.detailStats(body);
    }
    generalStats(body) {
        return this.leagueService.generalStats(body);
    }
    search(body) {
        return this.leagueService.search(body);
    }
    getLeagueSeasons(body) {
        return this.leagueService.getLeagueSeasons(body);
    }
    seasonsOfLeague(body) {
        return this.leagueService.seasonsOfLeague(body);
    }
    pastChampions(body) {
        return this.leagueService.pastChampions(body);
    }
    leagueSeasonDates(body) {
        return this.leagueService.leagueSeasonDates(body);
    }
};
__decorate([
    (0, common_1.Post)('generalInfo'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [general_info_dto_1.GeneralInfoDto]),
    __metadata("design:returntype", void 0)
], LeagueController.prototype, "generalInfo", null);
__decorate([
    (0, common_1.Post)('overallStats'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [league_overall_stats_dto_1.LeagueOverallStatsDto]),
    __metadata("design:returntype", void 0)
], LeagueController.prototype, "overallStats", null);
__decorate([
    (0, common_1.Post)('fixtures'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [league_fixture_dto_1.LeagueFixtureDto]),
    __metadata("design:returntype", void 0)
], LeagueController.prototype, "fixtures", null);
__decorate([
    (0, common_1.Post)('detailStats'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [league_detail_stats_dto_1.LeagueDetailStatsDto]),
    __metadata("design:returntype", void 0)
], LeagueController.prototype, "detailStats", null);
__decorate([
    (0, common_1.Post)('generalStats'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [league_general_stats_dto_1.LeagueGeneralStatsDto]),
    __metadata("design:returntype", void 0)
], LeagueController.prototype, "generalStats", null);
__decorate([
    (0, common_1.Post)('search'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_dto_1.SearchDto]),
    __metadata("design:returntype", void 0)
], LeagueController.prototype, "search", null);
__decorate([
    (0, common_1.Post)('getLeagueSeasons'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [leagueSeason_dto_1.LeagueSeasonDto]),
    __metadata("design:returntype", void 0)
], LeagueController.prototype, "getLeagueSeasons", null);
__decorate([
    (0, common_1.Post)('seasons'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [seasons_of_league_dto_1.SeasonsOfLeagueDto]),
    __metadata("design:returntype", void 0)
], LeagueController.prototype, "seasonsOfLeague", null);
__decorate([
    (0, common_1.Post)('pastChampions'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], LeagueController.prototype, "pastChampions", null);
__decorate([
    (0, common_1.Post)('seasonDates'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [league_season_dates_dto_1.LeagueSeasonDatesDto]),
    __metadata("design:returntype", void 0)
], LeagueController.prototype, "leagueSeasonDates", null);
LeagueController = __decorate([
    (0, common_1.Controller)('football/api/v1/league'),
    __metadata("design:paramtypes", [league_service_1.LeagueService])
], LeagueController);
exports.LeagueController = LeagueController;
//# sourceMappingURL=league.controller.js.map