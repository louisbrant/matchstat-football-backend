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
exports.H2hService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const operators_1 = require("rxjs/operators");
const h2h_entity_1 = require("../entities/h2h.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let H2hService = class H2hService {
    constructor(httpService, h2hRepository) {
        this.httpService = httpService;
        this.h2hRepository = h2hRepository;
        this.apiKey = process.env.API_KEY;
        this.apiUrl = process.env.API_URL;
    }
    fixtures({ count, page, firstTeamId, secondTeamId }) {
        return this.httpService.get(`${this.apiUrl}/head2head/${firstTeamId}/${secondTeamId}?api_token=${this.apiKey}&include=league,localTeam,visitorTeam`)
            .pipe((0, operators_1.map)(resp => this.convertToH2hFixturesInterface(resp.data)));
    }
    convertToH2hFixturesInterface(data) {
        return data.data.map(item => {
            return {
                id: item.id,
                dateStart: item.time.starting_at.date_time,
                homeTeam: {
                    id: item.localTeam.data.id,
                    logo_path: item.localTeam.data.logo_path,
                    name: item.localTeam.data.name,
                    score: item.scores.localteam_score
                },
                awayTeam: {
                    id: item.visitorTeam.data.id,
                    logo_path: item.visitorTeam.data.logo_path,
                    name: item.visitorTeam.data.name,
                    score: item.scores.visitorteam_score
                },
                league: {
                    id: item.league.data.id,
                    logo_path: item.league.data.logo_path
                }
            };
        });
    }
    async getFixturesH2hInteresting() {
        return await this.h2hRepository.find({
            where: {
                ft_score: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()),
            },
            order: {
                ft_score: "DESC",
            },
            take: 10,
        });
    }
    async getH2hInterestingLeague(leagueId) {
        return await this.h2hRepository.find({
            where: {
                league_id: leagueId,
            },
            order: {
                ft_score: "DESC",
            },
            take: 10,
        });
    }
    async getH2hInterestingTeams(teamId) {
        return await this.h2hRepository.find({
            where: [
                { localteam_id: teamId },
                { visitorteam_id: teamId },
            ],
            order: {
                ft_score: "DESC",
            },
            take: 20,
        });
    }
    h2hTeams(firstTeamId, secondTeamId) {
        return this.httpService.get(`${this.apiUrl}/head2head/${firstTeamId}/${secondTeamId}?api_token=${this.apiKey}&include=league,localTeam,visitorTeam,stats.fixture.probability`)
            .pipe((0, operators_1.map)(resp => this.convertToH2hTeamsInterface(resp.data)));
    }
    teamDataForComparision(teamId, seasonId) {
        return this.httpService.get(`${this.apiUrl}/squad/season/${seasonId}/team/${teamId}?api_token=${this.apiKey}&include=player.team,`)
            .pipe((0, operators_1.map)(resp => this.convertToTeamData(resp.data.data)));
    }
    convertToTeamData(data) {
        return data;
    }
    teamRecentlyPlayed(teamId, isHomeAwayForm) {
        const isTrueSet = (isHomeAwayForm === 'true');
        const urlIncludes = isTrueSet ? 'latest.league:limit(50|1)' : 'latest.league';
        return this.httpService.get(`${this.apiUrl}/teams/${teamId}?api_token=${this.apiKey}&include=${urlIncludes}`)
            .pipe((0, operators_1.map)(resp => this.convertToTeamRecently(resp.data.data, isTrueSet)));
    }
    convertToTeamRecently(data, isHomeAwayForm) {
        var _a, _b;
        if ((_b = (_a = data === null || data === void 0 ? void 0 : data.latest) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.length) {
            if (isHomeAwayForm) {
                return {
                    homeForm: this.lastTeamForm(data.latest.data, data.id),
                    awayForm: this.lastTeamForm(data.latest.data, data.id, 'visitorteam_id'),
                };
            }
            else {
                return {
                    id: data.id,
                    latest: data.latest.data,
                    logo_path: data.logo_path,
                    name: data.name,
                    short_code: data.short_code,
                };
            }
        }
        else {
            return {};
        }
    }
    lastTeamForm(data, teamId, column = 'localteam_id') {
        let count = 1;
        return data.filter(d => {
            if (d[column] === teamId && count < 6) {
                count++;
                return true;
            }
            return false;
        })
            .map(d => {
            if (!d.winner_team_id) {
                return 'D';
            }
            else if (d.winner_team_id === teamId) {
                return 'W';
            }
            else {
                return 'L';
            }
        })
            .reverse()
            .join('');
    }
    convertToH2hTeamsInterface(data) {
        return data.data.map(item => {
            var _a, _b, _c, _d;
            return {
                id: item.id,
                dateStart: item.time.starting_at.date_time,
                stats: item.stats.data,
                homeTeam: {
                    id: item.localTeam.data.id,
                    logo_path: item.localTeam.data.logo_path,
                    name: item.localTeam.data.name,
                    score: item.scores.localteam_score
                },
                awayTeam: {
                    id: item.visitorTeam.data.id,
                    logo_path: item.visitorTeam.data.logo_path,
                    name: item.visitorTeam.data.name,
                    score: item.scores.visitorteam_score
                },
                league: {
                    id: (_b = (_a = item.league) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.id,
                    logo_path: (_d = (_c = item.league) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.logo_path
                }
            };
        });
    }
};
H2hService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(h2h_entity_1.H2h)),
    __metadata("design:paramtypes", [axios_1.HttpService,
        typeorm_2.Repository])
], H2hService);
exports.H2hService = H2hService;
//# sourceMappingURL=h2h.service.js.map