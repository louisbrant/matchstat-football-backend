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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeagueService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
var ResultEnum;
(function (ResultEnum) {
    ResultEnum["RESULT"] = "RESULT";
    ResultEnum["FIXTURE"] = "FIXTURE";
})(ResultEnum || (ResultEnum = {}));
let LeagueService = class LeagueService {
    constructor(httpService) {
        this.httpService = httpService;
        this.apiKey = process.env.API_KEY;
        this.apiUrl = process.env.API_URL;
    }
    generalInfo({ leagueName }) {
        return this.httpService.get(`${this.apiUrl}/leagues/search/${leagueName}?api_token=${this.apiKey}&include=country,season.stats`)
            .pipe((0, operators_1.map)(resp => this.convertToGeneralInfoInterface(resp.data)));
    }
    overallStats({ leagueId, seasonId }) {
        return this.httpService.get(`${this.apiUrl}/leagues/${leagueId}?api_token=${this.apiKey}&include=seasons.stats&seasons=${seasonId}`)
            .pipe((0, operators_1.map)(resp => resp.data), (0, operators_1.switchMap)((res) => {
            const curSeasonStat = this.curSeason(seasonId, res);
            if (curSeasonStat === null || curSeasonStat === void 0 ? void 0 : curSeasonStat.stats) {
                return (0, rxjs_1.forkJoin)({
                    data: (0, rxjs_1.of)(curSeasonStat),
                    teamWithMostGoals: this.getTeamById(curSeasonStat.stats.data.team_with_most_goals_id),
                    teamWithMostCleanSheets: this.getTeamById(curSeasonStat.stats.data.team_most_cleansheets_id),
                    goalkeeperMostCleansheets: this.getPlayerById(curSeasonStat.stats.data.goalkeeper_most_cleansheets_id),
                    teamWithMostGoalsPerMatch: this.getTeamById(curSeasonStat.stats.data.team_with_most_goals_per_match_id),
                    topscorerPlayer: this.getPlayerById(curSeasonStat.stats.data.season_assist_topscorer_id),
                    mostConcededGoalsClub: this.getTeamById(curSeasonStat.stats.data.team_with_most_conceded_goals_id),
                    mostAssistsPlayer: this.getPlayerById(curSeasonStat.stats.data.season_assist_topscorer_id),
                    teamMostCorners: this.getTeamById(curSeasonStat.stats.data.team_most_corners_id)
                });
            }
            return (0, rxjs_1.of)(null);
        }), (0, operators_1.map)(resp => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
            if (resp) {
                return this.convertToOverallStatsInterface(resp.data, (_b = (_a = resp.teamWithMostGoals) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.name, (_d = (_c = resp.teamWithMostCleanSheets) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.name, (_f = (_e = resp.goalkeeperMostCleansheets) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.lastname, (_h = (_g = resp.teamWithMostGoalsPerMatch) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.name, (_k = (_j = resp.topscorerPlayer) === null || _j === void 0 ? void 0 : _j.data) === null || _k === void 0 ? void 0 : _k.lastname, (_m = (_l = resp.mostConcededGoalsClub) === null || _l === void 0 ? void 0 : _l.data) === null || _m === void 0 ? void 0 : _m.name, (_p = (_o = resp.mostAssistsPlayer) === null || _o === void 0 ? void 0 : _o.data) === null || _p === void 0 ? void 0 : _p.lastname, (_r = (_q = resp.teamMostCorners) === null || _q === void 0 ? void 0 : _q.data) === null || _r === void 0 ? void 0 : _r.name);
            }
            return {};
        }));
    }
    async fixtures({ count, page, leagueId, seasonId, leagueResult }) {
        return await new Promise(resolve => {
            const interval = setInterval(() => {
                this.httpService.get(`${this.apiUrl}/leagues/${leagueId}?api_token=${this.apiKey}&include=seasons.fixtures:limit(${count}|${page}),seasons.fixtures.localTeam,seasons.fixtures.visitorTeam&seasons=${seasonId}`).subscribe(res => {
                    var _a;
                    const curSeason = (_a = res.data.data) === null || _a === void 0 ? void 0 : _a.seasons.data.find(s => s.id === seasonId);
                    let fixtures;
                    if (curSeason.fixtures.data.length) {
                        if (leagueResult === ResultEnum.FIXTURE) {
                            fixtures = curSeason.fixtures.data.filter(fixture => { var _a, _b, _c, _d; return new Date(`${(_b = (_a = fixture === null || fixture === void 0 ? void 0 : fixture.time) === null || _a === void 0 ? void 0 : _a.starting_at) === null || _b === void 0 ? void 0 : _b.date_time} UTC`) >= new Date && ((_c = fixture.scores) === null || _c === void 0 ? void 0 : _c.localteam_score) <= 0 && ((_d = fixture.scores) === null || _d === void 0 ? void 0 : _d.visitorteam_score) <= 0; });
                        }
                        else {
                            fixtures = curSeason.fixtures.data.filter(fixture => { var _a, _b; return new Date(`${(_b = (_a = fixture === null || fixture === void 0 ? void 0 : fixture.time) === null || _a === void 0 ? void 0 : _a.starting_at) === null || _b === void 0 ? void 0 : _b.date_time} UTC`) < new Date; });
                        }
                        if (fixtures === null || fixtures === void 0 ? void 0 : fixtures.length) {
                            const data = this.convertToFixturesInterface(page, fixtures);
                            resolve(data);
                            clearInterval(interval);
                            return data;
                        }
                        else {
                            page++;
                        }
                    }
                });
            }, 500);
        });
    }
    detailStats({ leagueId, seasonId }) {
        return this.httpService.get(`${this.apiUrl}/standings/season/${seasonId}?api_token=${this.apiKey}&include=standings.team.stats&seasons=${seasonId}`)
            .pipe((0, operators_1.map)(resp => this.convertToDetailStatsInterface(resp.data)));
    }
    generalStats({ leagueId, seasonId }) {
        return this.httpService.get(`${this.apiUrl}/standings/season/${seasonId}?api_token=${this.apiKey}&include=standings.team`)
            .pipe((0, operators_1.map)(resp => this.convertToGeneralStatsInterface(resp.data)));
    }
    search({ name }) {
        return this.httpService.get(`${this.apiUrl}/leagues/search/${name}?api_token=${this.apiKey}&include=season`)
            .pipe((0, operators_1.map)(resp => this.convertToSearchLeagueInterface(resp.data)));
    }
    getTeamById(teamId) {
        if (teamId) {
            return this.httpService.get(`${this.apiUrl}/teams/${teamId}?api_token=${this.apiKey}`)
                .pipe((0, operators_1.map)(resp => resp.data));
        }
        return (0, rxjs_1.of)({});
    }
    getPlayerById(playerId) {
        if (playerId) {
            return this.httpService.get(`${this.apiUrl}/players/${playerId}?api_token=${this.apiKey}`)
                .pipe((0, operators_1.map)(resp => resp.data));
        }
        return (0, rxjs_1.of)({});
    }
    seasonsOfLeague({ leagueId }) {
        return this.httpService.get(`${this.apiUrl}/leagues/${leagueId}?api_token=${this.apiKey}&include=seasons`)
            .pipe((0, operators_1.map)(resp => this.convertToSeasonsOfLeagueInterface(resp.data)));
    }
    pastChampions(seasonsIds) {
        let seasonChampions = [];
        for (let i = 0; i < (seasonsIds === null || seasonsIds === void 0 ? void 0 : seasonsIds.length); i++) {
            seasonChampions.push(new Promise((resolve) => {
                this.httpService.get(`${this.apiUrl}/standings/season/${seasonsIds[i]}?api_token=${this.apiKey}&include=standings.season`).subscribe(res => {
                    var _a, _b, _c;
                    const champion = (_c = (_b = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.data[0]) === null || _b === void 0 ? void 0 : _b.standings) === null || _c === void 0 ? void 0 : _c.data.find(d => d.position === 1);
                    resolve(champion);
                });
            }));
        }
        return Promise.all(seasonChampions);
    }
    leagueSeasonDates({ seasonId }) {
        return this.httpService.get(`${this.apiUrl}/seasons/${seasonId}?api_token=${this.apiKey}&include=rounds, stats`)
            .pipe((0, operators_1.map)(resp => this.convertToSeasonsDateOfLeagueInterface(resp.data)));
    }
    convertToSeasonsDateOfLeagueInterface(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const seasonDate = data.data;
        const stats = (_a = seasonDate.stats) === null || _a === void 0 ? void 0 : _a.data;
        const numberOfMatchesPlayed = stats === null || stats === void 0 ? void 0 : stats.number_of_matches_played;
        const numberOfMatches = stats === null || stats === void 0 ? void 0 : stats.number_of_matches;
        const progress = numberOfMatchesPlayed && numberOfMatches && (Math.round(numberOfMatchesPlayed / numberOfMatches * 100 * 100) / 100 + '%');
        if (seasonDate) {
            return {
                numberOfMatchesPlayed,
                numberOfMatches,
                progress,
                startDate: (_d = (_c = (_b = data === null || data === void 0 ? void 0 : data.data) === null || _b === void 0 ? void 0 : _b.rounds) === null || _c === void 0 ? void 0 : _c.data[0]) === null || _d === void 0 ? void 0 : _d.start,
                endDate: (_j = ((_f = (_e = data === null || data === void 0 ? void 0 : data.data) === null || _e === void 0 ? void 0 : _e.rounds) === null || _f === void 0 ? void 0 : _f.data[((_h = (_g = data === null || data === void 0 ? void 0 : data.data) === null || _g === void 0 ? void 0 : _g.rounds) === null || _h === void 0 ? void 0 : _h.data.length) - 1])) === null || _j === void 0 ? void 0 : _j.end
            };
        }
        return null;
    }
    convertToGeneralInfoInterface(data) {
        var _a, _b, _c, _d, _e, _f, _g;
        const curLeague = data.data && data.data[0];
        if (curLeague) {
            const stats = (_b = (_a = curLeague.season.data) === null || _a === void 0 ? void 0 : _a.stats) === null || _b === void 0 ? void 0 : _b.data;
            const numberOfMatchesPlayed = stats === null || stats === void 0 ? void 0 : stats.number_of_matches_played;
            const numberOfMatches = stats === null || stats === void 0 ? void 0 : stats.number_of_matches;
            const progress = numberOfMatchesPlayed && numberOfMatches && (Math.round(numberOfMatchesPlayed / numberOfMatches * 100 * 100) / 100 + '%');
            return {
                id: curLeague.id,
                name: curLeague.name,
                logo_path: curLeague.logo_path,
                country: (_d = (_c = curLeague.country) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.name,
                country_flag: (_f = (_e = curLeague.country) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.image_path,
                numberOfMatchesPlayed,
                numberOfMatches,
                progress: progress,
                type: curLeague.type,
                predictability: (_g = curLeague.coverage) === null || _g === void 0 ? void 0 : _g.predictions
            };
        }
        return null;
    }
    curSeason(seasonId, data) {
        return data.data.seasons.data.find(d => d.id === seasonId);
    }
    convertToOverallStatsInterface(curSeasonStat, teamWithMostGoals, teamWithMostCleanSheets, goalkeeperMostCleansheets, teamWithMostGoalsPerMatch, topscorerPlayer, mostConcededGoalsClub, mostAssistsPlayer, teamMostCorners) {
        return {
            leagueId: curSeasonStat.league_id,
            seasonId: curSeasonStat.id,
            stats: {
                numberOfClubs: curSeasonStat.stats.data.number_of_clubs,
                numberOfMatches: curSeasonStat.stats.data.number_of_matches,
                matchesAlreadyPlayed: curSeasonStat.stats.data.number_of_matches_played,
                numberOfGoals: curSeasonStat.stats.data.number_of_goals,
                avgGoalsPerMatch: curSeasonStat.stats.data.avg_goals_per_match,
                goalScoredEveryMins: curSeasonStat.stats.data.goal_scored_every_minutes,
                mostGoalsByTeam: curSeasonStat.stats.data.team_with_most_goals_number,
                teamWithMostGoals,
                avgHomegoalsPerMatch: curSeasonStat.stats.data.avg_homegoals_per_match,
                avgAwaygoalsPerMatch: curSeasonStat.stats.data.avg_awaygoals_per_match,
                bttsPercentage: curSeasonStat.stats.data.btts,
                mostCleanSheets: curSeasonStat.stats.data.team_most_cleansheets_number,
                teamWithMostCleanSheets,
                goalkeeperMostCleansheetsNumber: curSeasonStat.stats.data.goalkeeper_most_cleansheets_number,
                goalkeeperMostCleansheets,
                avgLeaguePlayerRating: curSeasonStat.stats.data.avg_player_rating,
                teamWithMostGoalsPerMatchNumber: curSeasonStat.stats.data.team_with_most_goals_per_match_number,
                teamWithMostGoalsPerMatch,
                seasonTopscorerNumber: curSeasonStat.stats.data.season_topscorer_number,
                topscorerPlayer,
                teamWithMostConcededGoalsNumber: curSeasonStat.stats.data.team_with_most_conceded_goals_number,
                mostConcededGoalsClub,
                seasonAssistTopscorerNumber: curSeasonStat.stats.data.season_assist_topscorer_number,
                mostAssistsPlayer,
                yellowCards: curSeasonStat.stats.data.number_of_yellowcards,
                avgYellowcardsPerMatch: curSeasonStat.stats.data.avg_yellowcards_per_match,
                yellowReds: curSeasonStat.stats.data.number_of_yellowredcards,
                avgYellowredcardsPerMatch: curSeasonStat.stats.data.avg_yellowredcards_per_match,
                directReds: curSeasonStat.stats.data.number_of_redcards,
                avgRedcardsPerMatch: curSeasonStat.stats.data.avg_redcards_per_match,
                avgCornersPerMatch: curSeasonStat.stats.data.avg_corners_per_match,
                teamMostCornersCount: curSeasonStat.stats.data.team_most_corners_count,
                teamMostCorners,
            }
        };
    }
    convertToFixturesInterface(page, fixtures) {
        if (fixtures.length) {
            const data = fixtures === null || fixtures === void 0 ? void 0 : fixtures.map(item => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
                return {
                    id: item.id,
                    dateStart: (_b = (_a = item.time) === null || _a === void 0 ? void 0 : _a.starting_at) === null || _b === void 0 ? void 0 : _b.date_time,
                    league: {
                        id: fixtures === null || fixtures === void 0 ? void 0 : fixtures.id,
                        logo_path: fixtures === null || fixtures === void 0 ? void 0 : fixtures.logo_path
                    },
                    homeTeam: {
                        id: (_d = (_c = item.localTeam) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.id,
                        name: (_f = (_e = item.localTeam) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.name,
                        logo_path: (_h = (_g = item.localTeam) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.logo_path,
                        score: (_j = item.scores) === null || _j === void 0 ? void 0 : _j.localteam_score
                    },
                    awayTeam: {
                        id: (_l = (_k = item.visitorTeam) === null || _k === void 0 ? void 0 : _k.data) === null || _l === void 0 ? void 0 : _l.id,
                        name: (_o = (_m = item.visitorTeam) === null || _m === void 0 ? void 0 : _m.data) === null || _o === void 0 ? void 0 : _o.name,
                        logo_path: (_q = (_p = item.visitorTeam) === null || _p === void 0 ? void 0 : _p.data) === null || _q === void 0 ? void 0 : _q.logo_path,
                        score: (_r = item.scores) === null || _r === void 0 ? void 0 : _r.visitorteam_score
                    }
                };
            });
            return { data: data, page };
        }
        return null;
    }
    convertToDetailStatsInterface(data) {
        var _a;
        const curSeason = ((_a = data.data) === null || _a === void 0 ? void 0 : _a.length) && data.data[0];
        if (curSeason) {
            return curSeason.standings.data
                .filter(item => item.team.data.stats.data.length)
                .map(item => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
                const teamStat = item.team.data;
                const stats = teamStat.stats.data;
                return {
                    id: teamStat.id,
                    name: teamStat.name,
                    logo_path: teamStat.logo_path,
                    position: item === null || item === void 0 ? void 0 : item.position,
                    result: item === null || item === void 0 ? void 0 : item.result,
                    stats: {
                        btts: (_a = stats[0]) === null || _a === void 0 ? void 0 : _a.btts,
                        over_2_5: {
                            home: (_d = (_c = (_b = stats[0]) === null || _b === void 0 ? void 0 : _b.goal_line) === null || _c === void 0 ? void 0 : _c.over['2_5']) === null || _d === void 0 ? void 0 : _d.home,
                            away: (_g = (_f = (_e = stats[0]) === null || _e === void 0 ? void 0 : _e.goal_line) === null || _f === void 0 ? void 0 : _f.over['2_5']) === null || _g === void 0 ? void 0 : _g.away,
                        },
                        under_2_5: {
                            home: (_k = (_j = (_h = stats[0]) === null || _h === void 0 ? void 0 : _h.goal_line) === null || _j === void 0 ? void 0 : _j.under['2_5']) === null || _k === void 0 ? void 0 : _k.home,
                            away: (_o = (_m = (_l = stats[0]) === null || _l === void 0 ? void 0 : _l.goal_line) === null || _m === void 0 ? void 0 : _m.under['2_5']) === null || _o === void 0 ? void 0 : _o.away,
                        },
                        failedToScore: {
                            total: (_p = stats[0]) === null || _p === void 0 ? void 0 : _p.failed_to_score.total,
                            home: (_q = stats[0]) === null || _q === void 0 ? void 0 : _q.failed_to_score.home,
                            away: (_r = stats[0]) === null || _r === void 0 ? void 0 : _r.failed_to_score.away,
                        },
                        cleanSheet: {
                            total: (_s = stats[0]) === null || _s === void 0 ? void 0 : _s.clean_sheet.total,
                            home: (_t = stats[0]) === null || _t === void 0 ? void 0 : _t.clean_sheet.home,
                            away: (_u = stats[0]) === null || _u === void 0 ? void 0 : _u.clean_sheet.away,
                        },
                        corners: {
                            total: (_v = stats[0]) === null || _v === void 0 ? void 0 : _v.total_corners,
                            avPerGame: (_w = stats[0]) === null || _w === void 0 ? void 0 : _w.avg_corners,
                        },
                        cards: {
                            red: (_x = stats[0]) === null || _x === void 0 ? void 0 : _x.redcards,
                            yellow: (_y = stats[0]) === null || _y === void 0 ? void 0 : _y.yellowcards
                        }
                    }
                };
            });
        }
        return null;
    }
    convertToGeneralStatsInterface(data) {
        var _a;
        const curSeason = ((_a = data.data) === null || _a === void 0 ? void 0 : _a.length) && data.data[0];
        if (curSeason) {
            return curSeason.standings.data.map(item => {
                return {
                    id: item.team.data.id,
                    name: item.team.data.name,
                    logo_path: item.team.data.logo_path,
                    position: item.position,
                    result: item.result,
                    recent_form: item.recent_form,
                    stats: {
                        gamesPlayed: item.overall.games_played,
                        wins: item.overall.won,
                        draws: item.overall.draw,
                        losses: item.overall.lost,
                        goalsScored: item.overall.goals_scored,
                        goalsAgainst: item.overall.goals_against,
                        points: item.overall.points,
                    }
                };
            });
        }
        return null;
    }
    convertToSearchLeagueInterface(data) {
        var _a;
        const curLeague = ((_a = data.data) === null || _a === void 0 ? void 0 : _a.length) && data.data[0];
        if (curLeague) {
            return {
                id: curLeague.id,
                name: curLeague.name,
                currentSeasonId: curLeague.current_season_id,
            };
        }
        return null;
    }
    getLeagueSeasons({ leagueId }) {
        return this.httpService.get(`${this.apiUrl}/leagues/${leagueId}?api_token=${this.apiKey}&include=seasons`)
            .pipe((0, operators_1.map)(resp => this.convertToLeagueSeasonInterface(resp.data)));
    }
    convertToLeagueSeasonInterface(data) {
        var _a;
        const curLeagueSeasons = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.seasons;
        return curLeagueSeasons === null || curLeagueSeasons === void 0 ? void 0 : curLeagueSeasons.data.map(item => {
            return {
                seasonId: item.id,
                seasonName: item.name
            };
        });
    }
    convertToPlayerStatsInterface(team, players) {
        return {
            team: {
                id: team.data.id,
                logo_path: team.data.logo_path,
                name: team.data.name,
            },
            coach: {
                id: team.data.coach.data.id,
                fullname: team.data.coach.data.fullname,
                image_path: team.data.coach.data.image_path
            },
            players: players.data.map(s => {
                var _a, _b, _c, _d, _e, _f;
                return {
                    id: s === null || s === void 0 ? void 0 : s.player_id,
                    number: s === null || s === void 0 ? void 0 : s.number,
                    fullName: (_b = (_a = s === null || s === void 0 ? void 0 : s.player) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.fullname,
                    image_path: (_d = (_c = s === null || s === void 0 ? void 0 : s.player) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.image_path,
                    position: (_f = (_e = s === null || s === void 0 ? void 0 : s.position) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.name,
                    gamesPlayed: s === null || s === void 0 ? void 0 : s.appearences,
                    goals: s === null || s === void 0 ? void 0 : s.goals,
                    assists: s === null || s === void 0 ? void 0 : s.assists,
                    cards: ((s === null || s === void 0 ? void 0 : s.yellowcards) || 0) + ((s === null || s === void 0 ? void 0 : s.redcards) || 0),
                    timePlayed: s === null || s === void 0 ? void 0 : s.minutes,
                    rating: s === null || s === void 0 ? void 0 : s.rating
                };
            })
        };
    }
    convertToSeasonsOfLeagueInterface(data) {
        return data.data.seasons.data.map(item => {
            return {
                seasonId: item.id,
                seasonName: item.name
            };
        });
    }
};
LeagueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], LeagueService);
exports.LeagueService = LeagueService;
//# sourceMappingURL=league.service.js.map