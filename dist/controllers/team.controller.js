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
exports.TeamController = void 0;
const common_1 = require("@nestjs/common");
const team_service_1 = require("../services/team.service");
const match_statistics_dto_1 = require("../dto/match-statistics.dto");
const upcoming_match_dto_1 = require("../dto/upcoming-match.dto");
const fixtures_dto_1 = require("../dto/fixtures.dto");
const perdormance_dto_1 = require("../dto/perdormance.dto");
const goal_by_minutes_dto_1 = require("../dto/goal-by-minutes.dto");
const goals_probabilities_dto_1 = require("../dto/goals-probabilities.dto");
const compitation_standing_dto_1 = require("../dto/compitation-standing.dto");
const search_dto_1 = require("../dto/search.dto");
const general_info_team_dto_1 = require("../dto/general-info-team.dto");
const players_dto_1 = require("../dto/players.dto");
const secondary_info_team_dto_1 = require("../dto/secondary-info-team.dto");
const league_players_dto_1 = require("../dto/league-players.dto");
let TeamController = class TeamController {
    constructor(teamService) {
        this.teamService = teamService;
    }
    generalInfo(body) {
        return this.teamService.generalInfo(body);
    }
    secondaryInfo(body) {
        return this.teamService.secondaryInfo(body);
    }
    fixtures(body) {
        return this.teamService.fixtures(body);
    }
    upcomingMatch(body) {
        return this.teamService.upcomingMatch(body);
    }
    matchStatistics(body) {
        return this.teamService.matchStatistics(body);
    }
    performance(body) {
        return this.teamService.performance(body);
    }
    goalsByMinutes(body) {
        return this.teamService.goalsByMinutes(body);
    }
    goalsProbabilities(body) {
        return this.teamService.goalsProbabilities(body);
    }
    playerStats(body) {
        return this.teamService.playerStats(body);
    }
    playerStatsLeague(body) {
        return this.teamService.playerStatsLeague(body);
    }
    competitionStandings(body) {
        return this.teamService.competitionStandings(body);
    }
    search(body) {
        return this.teamService.search(body);
    }
};
__decorate([
    (0, common_1.Post)('profile/generalInfo'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [general_info_team_dto_1.GeneralInfoTeamDto]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "generalInfo", null);
__decorate([
    (0, common_1.Post)('profile/secondaryInfo'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [secondary_info_team_dto_1.SecondaryInfoTeamDto]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "secondaryInfo", null);
__decorate([
    (0, common_1.Post)('fixtures'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fixtures_dto_1.FixturesDto]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "fixtures", null);
__decorate([
    (0, common_1.Post)('upcomingMatch'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upcoming_match_dto_1.UpcomingMatchDto]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "upcomingMatch", null);
__decorate([
    (0, common_1.Post)('matchStatistics'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [match_statistics_dto_1.MatchStatisticsDto]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "matchStatistics", null);
__decorate([
    (0, common_1.Post)('performance'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [perdormance_dto_1.PerdormanceDto]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "performance", null);
__decorate([
    (0, common_1.Post)('goals/byMinutes'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [goal_by_minutes_dto_1.GoalByMinutesDto]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "goalsByMinutes", null);
__decorate([
    (0, common_1.Post)('goals/probabilities'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [goals_probabilities_dto_1.GoalsProbabilitiesDto]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "goalsProbabilities", null);
__decorate([
    (0, common_1.Post)('player/stats'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [players_dto_1.PlayersDto]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "playerStats", null);
__decorate([
    (0, common_1.Post)('player/leagueStats'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [league_players_dto_1.LeaguePlayersDto]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "playerStatsLeague", null);
__decorate([
    (0, common_1.Post)('competitionStandings'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [compitation_standing_dto_1.CompitationStandingDto]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "competitionStandings", null);
__decorate([
    (0, common_1.Post)('search'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_dto_1.SearchDto]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "search", null);
TeamController = __decorate([
    (0, common_1.Controller)('football/api/v1/teams'),
    __metadata("design:paramtypes", [team_service_1.TeamService])
], TeamController);
exports.TeamController = TeamController;
//# sourceMappingURL=team.controller.js.map