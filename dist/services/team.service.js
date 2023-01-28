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
exports.TeamService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const trophy_interface_1 = require("../interfaces/trophy.interface");
var ResultEnum;
(function (ResultEnum) {
    ResultEnum["RESULT"] = "RESULT";
    ResultEnum["FIXTURE"] = "FIXTURE";
})(ResultEnum || (ResultEnum = {}));
function replaceCharacters(name) {
    return name.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}
let TeamService = class TeamService {
    constructor(httpService) {
        this.httpService = httpService;
        this.apiKey = process.env.API_KEY;
        this.apiUrl = process.env.API_URL;
    }
    generalInfo({ teamName }) {
        const name = replaceCharacters(teamName);
        return this.httpService.get(`${this.apiUrl}/teams/search/${name}?api_token=${this.apiKey}&include=coach,venue,country,trophies,rivals,latest:limit(5|1)`)
            .pipe((0, rxjs_1.map)((resp) => this.convertToGeneralInfoInterface(resp.data, teamName)));
    }
    secondaryInfo({ teamId }) {
        return this.httpService.get(`${this.apiUrl}/teams/${teamId}?api_token=${this.apiKey}&include=goalscorers.player,league,stats`)
            .pipe((0, rxjs_1.map)((resp) => this.convertToSecondaryInfoInterface(resp.data)));
    }
    lastFixtures({ teamName }) {
        const name = replaceCharacters(teamName);
        return this.httpService.get(`${this.apiUrl}/teams/search/${name}?api_token=${this.apiKey}&include=latest:limit(20|1)`)
            .pipe((0, rxjs_1.map)((resp) => this.convertToLastFixturesInterface(resp.data)));
    }
    upcomingMatch({ teamName }) {
        const includes = [
            'upcoming',
            'upcoming.league',
            'upcoming.venue',
            'upcoming.visitorTeam',
            'upcoming.localTeam',
            'upcoming.odds'
        ];
        const name = replaceCharacters(teamName);
        return this.httpService.get(`${this.apiUrl}/teams/search/${name}?api_token=${this.apiKey}&include=${includes.join(',')}`)
            .pipe((0, rxjs_1.map)((resp) => this.convertToUpcomingMatchInterface(resp.data)));
    }
    async fixtures({ teamId, count, page, leagueId, seasonId, leagueResult }) {
        const include = [
            'localTeam',
            'visitorTeam',
            'league',
        ];
        return await new Promise(resolve => {
            const date = new Date();
            let month = date.getMonth() + 1;
            const day = date.getDate();
            let firstDay;
            let lastDay;
            if (leagueResult === ResultEnum.RESULT) {
                firstDay = `${seasonId}-01-01`;
                lastDay = `${seasonId}-12-31`;
            }
            else {
                firstDay = `${seasonId}-${month}-${day}`;
                lastDay = `${seasonId + 1}-12-31`;
            }
            this.httpService.get(`${this.apiUrl}/fixtures/between/${firstDay}/${lastDay}/${teamId}?api_token=${this.apiKey}&include=${include.join(',')}&per_page=${count}&page=${page}&leagues=${leagueId}`)
                .subscribe(res => {
                var _a, _b, _c, _d;
                let fixtures;
                if (leagueResult === ResultEnum.RESULT) {
                    fixtures = (_b = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.filter(fixture => new Date(`${fixture.time.starting_at.date_time} UTC`) < date);
                }
                else {
                    fixtures = (_d = (_c = res === null || res === void 0 ? void 0 : res.data) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.filter(fixture => { var _a, _b; return new Date(`${fixture.time.starting_at.date_time} UTC`) >= date && ((_a = fixture.scores) === null || _a === void 0 ? void 0 : _a.localteam_score) <= 0 && ((_b = fixture.scores) === null || _b === void 0 ? void 0 : _b.visitorteam_score) <= 0; });
                }
                if (fixtures.length) {
                    const data = this.convertToFixturesInterface(fixtures);
                    resolve(data);
                    return data;
                }
            });
        });
    }
    matchStatistics({ teamId, leagueId, seasonId }) {
        let promises = [];
        if (seasonId === null || seasonId === void 0 ? void 0 : seasonId.length) {
            for (let i = 0; i < (seasonId === null || seasonId === void 0 ? void 0 : seasonId.length); i++) {
                promises.push(new Promise((resolve) => {
                    return this.httpService.get(`${this.apiUrl}/teams/${teamId}?api_token=${this.apiKey}&include=stats,league&seasons=${seasonId[i]}, visitorFixtures localFixtures`).subscribe(res => {
                        resolve(res.data.data.stats.data);
                    });
                }));
            }
            return this.allMatchStatistics(Promise.all(promises));
        }
        else {
            const urlInclude = seasonId && typeof seasonId == "number" ? `league&seasons=${seasonId}` : '';
            return this.httpService.get(`${this.apiUrl}/teams/${teamId}?api_token=${this.apiKey}&include=stats,${urlInclude}, visitorFixtures localFixtures`)
                .pipe((0, rxjs_1.map)(resp => this.convertToMatchStatisticsInterface(resp.data)));
        }
    }
    async performance({ teamId, leagueId, seasonId, }) {
        if (seasonId === null || seasonId === void 0 ? void 0 : seasonId.length) {
            let promises = [];
            for (let i = 0; i < (seasonId === null || seasonId === void 0 ? void 0 : seasonId.length); i++) {
                promises.push(new Promise((resolve) => {
                    return this.httpService.get(`${this.apiUrl}/teams/${teamId}?api_token=${this.apiKey}&include=stats,league&seasons=${seasonId[i]}`).subscribe(res => {
                        resolve(res.data.data.stats.data);
                    });
                }));
            }
            return this.allPerformances(Promise.all(promises));
        }
        else {
            const urlInclude = seasonId && typeof seasonId == "number" ? `league&seasons=${seasonId}` : '';
            return this.httpService.get(`${this.apiUrl}/teams/${teamId}?api_token=${this.apiKey}&include=stats,${urlInclude}`)
                .pipe((0, rxjs_1.map)(resp => this.convertToPerformanceInterface(resp.data)));
        }
    }
    async allMatchStatistics(matchStatistics) {
        const result = {
            attacks: 0,
            dangerousAttacks: 0,
            avPossessionPercent: 0,
            fouls: 0,
            avFoulsPerGame: 0,
            offside: 0,
            redCards: 0,
            yellowCards: 0,
            shotsBlocked: 0,
            shotsOffTarget: 0,
            avShotsOffTarget: 0,
            shotsOnTarget: 0,
            avShotsOnTarget: 0,
            totalCorners: 0,
            avCorners: 0,
            btts: 0,
            avPlayerRatingPerMatch: 0,
            tackles: 0,
            goal_line: 0,
            win: 0,
            draw: 0,
            lost: 0,
            avg_goals_per_game_scored: 0,
        };
        const promise = await matchStatistics;
        const stats = [].concat.apply([], promise);
        stats === null || stats === void 0 ? void 0 : stats.forEach(stat => {
            result.attacks += (stat === null || stat === void 0 ? void 0 : stat.attacks) ? +(stat === null || stat === void 0 ? void 0 : stat.attacks) : 0,
                result.dangerousAttacks += (stat === null || stat === void 0 ? void 0 : stat.dangerous_attacks) ? +(stat === null || stat === void 0 ? void 0 : stat.dangerous_attacks) : 0,
                result.avPossessionPercent += (stat === null || stat === void 0 ? void 0 : stat.avg_ball_possession_percentage) ? +(stat === null || stat === void 0 ? void 0 : stat.avg_ball_possession_percentage) : 0,
                result.fouls += (stat === null || stat === void 0 ? void 0 : stat.fouls) ? +(stat === null || stat === void 0 ? void 0 : stat.fouls) : 0,
                result.avFoulsPerGame += (stat === null || stat === void 0 ? void 0 : stat.avg_fouls_per_game) ? +(stat === null || stat === void 0 ? void 0 : stat.avg_fouls_per_game) : 0,
                result.offside += (stat === null || stat === void 0 ? void 0 : stat.offsides) ? +(stat === null || stat === void 0 ? void 0 : stat.offsides) : 0,
                result.redCards += (stat === null || stat === void 0 ? void 0 : stat.redcards) ? +(stat === null || stat === void 0 ? void 0 : stat.redcards) : 0,
                result.yellowCards += (stat === null || stat === void 0 ? void 0 : stat.yellowcards) ? +(stat === null || stat === void 0 ? void 0 : stat.yellowcards) : 0,
                result.shotsBlocked += (stat === null || stat === void 0 ? void 0 : stat.shots_blocked) ? +(stat === null || stat === void 0 ? void 0 : stat.shots_blocked) : 0,
                result.shotsOffTarget += (stat === null || stat === void 0 ? void 0 : stat.shots_off_target) ? +(stat === null || stat === void 0 ? void 0 : stat.shots_off_target) : 0,
                result.avShotsOffTarget += (stat === null || stat === void 0 ? void 0 : stat.avg_shots_off_target_per_game) ? +(stats === null || stats === void 0 ? void 0 : stats.avg_shots_off_target_per_game) : 0,
                result.shotsOnTarget += (stat === null || stat === void 0 ? void 0 : stat.shots_on_target) ? +(stat === null || stat === void 0 ? void 0 : stat.shots_on_target) : 0,
                result.avShotsOnTarget += (stat === null || stat === void 0 ? void 0 : stat.avg_shots_on_target_per_game) ? +(stat === null || stat === void 0 ? void 0 : stat.avg_shots_on_target_per_game) : 0,
                result.totalCorners += (stat === null || stat === void 0 ? void 0 : stat.total_corners) ? +(stat === null || stat === void 0 ? void 0 : stat.total_corners) : 0,
                result.avCorners += (stat === null || stat === void 0 ? void 0 : stat.avg_corners) ? +(stat === null || stat === void 0 ? void 0 : stat.avg_corners) : 0,
                result.btts += (stat === null || stat === void 0 ? void 0 : stat.btts) ? +(stat === null || stat === void 0 ? void 0 : stat.btts) : 0,
                result.avPlayerRatingPerMatch += (stat === null || stat === void 0 ? void 0 : stat.avg_player_rating_per_match) ? +(stat === null || stat === void 0 ? void 0 : stat.avg_player_rating_per_match) : 0,
                result.tackles += (stat === null || stat === void 0 ? void 0 : stat.tackles) ? +(stat === null || stat === void 0 ? void 0 : stat.tackles) : 0;
        });
        return {
            stats: {
                attacks: result === null || result === void 0 ? void 0 : result.attacks,
                dangerousAttacks: result === null || result === void 0 ? void 0 : result.dangerousAttacks,
                avPossessionPercent: ((result === null || result === void 0 ? void 0 : result.avPossessionPercent) / stats.length).toFixed(2),
                fouls: result === null || result === void 0 ? void 0 : result.fouls,
                avFoulsPerGame: ((result === null || result === void 0 ? void 0 : result.avFoulsPerGame) / stats.length).toFixed(2),
                offside: result === null || result === void 0 ? void 0 : result.offside,
                redCards: result === null || result === void 0 ? void 0 : result.redCards,
                yellowCards: result === null || result === void 0 ? void 0 : result.yellowCards,
                shotsBlocked: result === null || result === void 0 ? void 0 : result.shotsBlocked,
                shotsOffTarget: result === null || result === void 0 ? void 0 : result.shotsOffTarget,
                avShotsOffTarget: ((stats === null || stats === void 0 ? void 0 : stats.avShotsOffTarget) / stats.length).toFixed(2),
                shotsOnTarget: result === null || result === void 0 ? void 0 : result.shotsOnTarget,
                avShotsOnTarget: ((result === null || result === void 0 ? void 0 : result.avShotsOnTarget) / stats.length).toFixed(2),
                totalCorners: result === null || result === void 0 ? void 0 : result.totalCorners,
                avCorners: ((result === null || result === void 0 ? void 0 : result.avCorners) / stats.length).toFixed(2),
                btts: result === null || result === void 0 ? void 0 : result.btts.toFixed(2),
                avPlayerRatingPerMatch: ((result === null || result === void 0 ? void 0 : result.avPlayerRatingPerMatch) / stats.length).toFixed(2),
                tackles: result === null || result === void 0 ? void 0 : result.tackles,
            },
        };
    }
    async allPerformances(performances) {
        var _a, _b, _c;
        const result = {
            winOveral: 0,
            winHome: 0,
            winAway: 0,
            drawOveral: 0,
            drawHome: 0,
            drawAway: 0,
            lostOveral: 0,
            lostHome: 0,
            lostAway: 0,
            goalsForOveral: 0,
            goalsForHome: 0,
            goalsForAway: 0,
            goalsAgainstOveral: 0,
            goalsAgainstHome: 0,
            goalsAgainstAway: 0,
            cleanSheetOveral: 0,
            cleanSheetHome: 0,
            cleanSheetAway: 0,
            failedToScoreOveral: 0,
            failedToScoreHome: 0,
            failedToScoreAway: 0,
            avgGoalsPerGameScoredOverall: 0,
            avgGoalsPerGameScoredHome: 0,
            avgGoalsPerGameScoredAway: 0,
            avGoalsConcededOverall: 0,
            avGoalsConcededHome: 0,
            avGoalsConcededAway: 0,
            avFirstGoalsScoredOverall: 0,
            avFirstGoalsScoredHome: 0,
            avFirstGoalsScoredAway: 0,
            avFirstGoalsConcededOverall: 0,
            avFirstGoalsConcededHome: 0,
            avFirstGoalsConcededAway: 0,
        };
        const promise = await performances;
        const stats = [].concat.apply([], promise);
        stats === null || stats === void 0 ? void 0 : stats.forEach(stat => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
            result.winOveral += +stat.win.total;
            result.winHome += +stat.win.home;
            result.winAway += +stat.win.away;
            result.drawOveral += +stat.draw.total;
            result.drawHome += +stat.draw.home;
            result.drawAway += +stat.draw.away;
            result.lostOveral += +stat.lost.total;
            result.lostHome += +stat.lost.home;
            result.lostAway += +stat.lost.away;
            result.goalsForOveral += +stat.goals_for.total;
            result.goalsForHome += +stat.goals_for.home;
            result.goalsForAway += +stat.goals_for.away;
            result.goalsAgainstOveral += +stat.goals_against.total;
            result.goalsAgainstHome += +stat.goals_against.home;
            result.goalsAgainstAway += +stat.goals_against.away;
            result.cleanSheetOveral += (stat === null || stat === void 0 ? void 0 : stat.clean_sheet) ? +((_a = stat === null || stat === void 0 ? void 0 : stat.clean_sheet) === null || _a === void 0 ? void 0 : _a.total) : 0;
            result.cleanSheetHome += (stat === null || stat === void 0 ? void 0 : stat.clean_sheet) ? +((_b = stat === null || stat === void 0 ? void 0 : stat.clean_sheet) === null || _b === void 0 ? void 0 : _b.home) : 0;
            result.cleanSheetAway += (stat === null || stat === void 0 ? void 0 : stat.clean_sheet) ? +((_c = stat === null || stat === void 0 ? void 0 : stat.clean_sheet) === null || _c === void 0 ? void 0 : _c.away) : 0;
            result.failedToScoreOveral += +((_d = stat === null || stat === void 0 ? void 0 : stat.failed_to_score) === null || _d === void 0 ? void 0 : _d.total);
            result.failedToScoreHome += +((_e = stat === null || stat === void 0 ? void 0 : stat.failed_to_score) === null || _e === void 0 ? void 0 : _e.home);
            result.failedToScoreAway += +((_f = stat === null || stat === void 0 ? void 0 : stat.failed_to_score) === null || _f === void 0 ? void 0 : _f.away);
            result.avgGoalsPerGameScoredOverall += (stat === null || stat === void 0 ? void 0 : stat.avg_goals_per_game_scored) ? +((_g = stat === null || stat === void 0 ? void 0 : stat.avg_goals_per_game_scored) === null || _g === void 0 ? void 0 : _g.total) : 0;
            result.avgGoalsPerGameScoredHome += (stat === null || stat === void 0 ? void 0 : stat.avg_goals_per_game_scored) ? +((_h = stat === null || stat === void 0 ? void 0 : stat.avg_goals_per_game_scored) === null || _h === void 0 ? void 0 : _h.home) : 0;
            result.avgGoalsPerGameScoredAway += (stat === null || stat === void 0 ? void 0 : stat.avg_goals_per_game_scored) ? +((_j = stat === null || stat === void 0 ? void 0 : stat.avg_goals_per_game_scored) === null || _j === void 0 ? void 0 : _j.away) : 0;
            result.avGoalsConcededOverall += (stat === null || stat === void 0 ? void 0 : stat.avg_goals_per_game_conceded) ? +((_k = stat === null || stat === void 0 ? void 0 : stat.avg_goals_per_game_conceded) === null || _k === void 0 ? void 0 : _k.total) : 0;
            result.avGoalsConcededHome += (stat === null || stat === void 0 ? void 0 : stat.avg_goals_per_game_conceded) ? +((_l = stat === null || stat === void 0 ? void 0 : stat.avg_goals_per_game_conceded) === null || _l === void 0 ? void 0 : _l.home) : 0;
            result.avGoalsConcededAway += (stat === null || stat === void 0 ? void 0 : stat.avg_goals_per_game_conceded) ? +((_m = stat === null || stat === void 0 ? void 0 : stat.avg_goals_per_game_conceded) === null || _m === void 0 ? void 0 : _m.away) : 0;
            result.avFirstGoalsScoredOverall += (stat === null || stat === void 0 ? void 0 : stat.avg_first_goal_scored) ? +((_o = stat === null || stat === void 0 ? void 0 : stat.avg_first_goal_scored.total.match(/(\d+)/)) === null || _o === void 0 ? void 0 : _o[0]) : 0;
            result.avFirstGoalsScoredHome += (stat === null || stat === void 0 ? void 0 : stat.avg_first_goal_scored) ? +((_p = stat === null || stat === void 0 ? void 0 : stat.avg_first_goal_scored.home.match(/(\d+)/)) === null || _p === void 0 ? void 0 : _p[0]) : 0;
            result.avFirstGoalsScoredAway += (stat === null || stat === void 0 ? void 0 : stat.avg_first_goal_scored) ? +((_q = stat === null || stat === void 0 ? void 0 : stat.avg_first_goal_scored.away.match(/(\d+)/)) === null || _q === void 0 ? void 0 : _q[0]) : 0;
            result.avFirstGoalsConcededOverall += (stat === null || stat === void 0 ? void 0 : stat.avg_first_goal_conceded) ? +((_r = stat === null || stat === void 0 ? void 0 : stat.avg_first_goal_conceded.total.match(/(\d+)/)) === null || _r === void 0 ? void 0 : _r[0]) : 0;
            result.avFirstGoalsConcededHome += (stat === null || stat === void 0 ? void 0 : stat.avg_first_goal_conceded) ? +((_s = stat === null || stat === void 0 ? void 0 : stat.avg_first_goal_conceded.home.match(/(\d+)/)) === null || _s === void 0 ? void 0 : _s[0]) : 0;
            result.avFirstGoalsConcededAway += (stat === null || stat === void 0 ? void 0 : stat.avg_first_goal_conceded) ? +((_t = stat === null || stat === void 0 ? void 0 : stat.avg_first_goal_conceded.away.match(/(\d+)/)) === null || _t === void 0 ? void 0 : _t[0]) : 0;
        });
        return {
            teamId: (_a = promise[0]) === null || _a === void 0 ? void 0 : _a.teamId,
            leagueId: (_c = (_b = promise[0]) === null || _b === void 0 ? void 0 : _b.league) === null || _c === void 0 ? void 0 : _c.data.id,
            wins: {
                overall: result.winOveral,
                home: result.winHome,
                away: result.winAway,
            },
            draw: {
                overall: result.drawOveral,
                home: result.drawHome,
                away: result.drawAway,
            },
            lost: {
                overall: result.lostOveral,
                home: result.lostHome,
                away: result.lostAway,
            },
            goalsFor: {
                overall: result.goalsForOveral,
                home: result.goalsAgainstHome,
                away: result.goalsForAway
            },
            goalsAgainst: {
                overall: result.goalsAgainstOveral,
                home: result.goalsAgainstHome,
                away: result.goalsForAway
            },
            cleanSheet: {
                overall: result.cleanSheetOveral,
                home: result.cleanSheetHome,
                away: result.cleanSheetAway
            },
            failedToScore: {
                overall: result.failedToScoreOveral,
                home: result.failedToScoreHome,
                away: result.failedToScoreAway,
            },
            avGoalsScored: {
                overall: (result.avgGoalsPerGameScoredOverall / (stats === null || stats === void 0 ? void 0 : stats.length)).toFixed(2),
                home: (result.avgGoalsPerGameScoredHome / (stats === null || stats === void 0 ? void 0 : stats.length)).toFixed(2),
                away: (result.avgGoalsPerGameScoredAway / (stats === null || stats === void 0 ? void 0 : stats.length)).toFixed(2),
            },
            avGoalsConceded: {
                overall: (result.avGoalsConcededOverall / stats.length).toFixed(2),
                home: (result.avGoalsConcededHome / stats.length).toFixed(2),
                away: (result.avGoalsConcededAway / stats.length).toFixed(2),
            },
            avFirstGoalsScored: {
                overall: (result.avFirstGoalsScoredOverall / stats.length).toFixed(2) + 'm',
                home: (result.avFirstGoalsScoredHome / stats.length).toFixed(2) + 'm',
                away: (result.avFirstGoalsScoredAway / stats.length).toFixed(2) + 'm',
            },
            avFirstGoalsConceded: {
                overall: (result.avFirstGoalsConcededOverall / stats.length).toFixed(2) + 'm',
                home: (result.avFirstGoalsConcededHome / stats.length).toFixed(2) + 'm',
                away: (result.avFirstGoalsConcededAway / stats.length).toFixed(2) + 'm',
            },
        };
    }
    goalsByMinutes({ teamId, leagueId, seasonId, }) {
        let promises = [];
        if (seasonId === null || seasonId === void 0 ? void 0 : seasonId.length) {
            for (let i = 0; i < (seasonId === null || seasonId === void 0 ? void 0 : seasonId.length); i++) {
                promises.push(new Promise((resolve) => {
                    return this.httpService.get(`${this.apiUrl}/teams/${teamId}?api_token=${this.apiKey}&include=stats,league&seasons=${seasonId[i]}`).subscribe(res => {
                        resolve(res.data.data.stats.data);
                    });
                }));
            }
            return this.allGoalMinutes(Promise.all(promises));
        }
        else {
            const urlInclude = seasonId && typeof seasonId == "number" ? `league&seasons=${seasonId}` : '';
            return this.httpService.get(`${this.apiUrl}/teams/${teamId}?api_token=${this.apiKey}&include=stats,${urlInclude}`)
                .pipe((0, rxjs_1.map)(resp => this.convertToGoalByMinutesInterface(resp.data)));
        }
    }
    async allGoalMinutes(data) {
        const promise = await data;
        const stats = [].concat.apply([], promise);
        let arr = [];
        let arr2 = [];
        stats === null || stats === void 0 ? void 0 : stats.forEach(stat => {
            var _a, _b;
            (_a = stat === null || stat === void 0 ? void 0 : stat.goals_conceded_minutes) === null || _a === void 0 ? void 0 : _a.forEach(p => arr.push(p === null || p === void 0 ? void 0 : p.period));
            (_b = stat === null || stat === void 0 ? void 0 : stat.scoring_minutes) === null || _b === void 0 ? void 0 : _b.forEach(p => arr2.push(p === null || p === void 0 ? void 0 : p.period));
        });
        const array = [].concat.apply([], arr);
        const array2 = [].concat.apply([], arr2);
        const resScored = [...array.reduce((map, item) => {
                const key = `${item.minute}`;
                const prev = map.get(key);
                map.set(key, !prev ? item : Object.assign(Object.assign({}, item), { count: +(prev === null || prev === void 0 ? void 0 : prev.count) + +(item === null || item === void 0 ? void 0 : item.count), percentage: +(prev === null || prev === void 0 ? void 0 : prev.percentage) + +(item === null || item === void 0 ? void 0 : item.percentage) }));
                return map;
            }, new Map)
                .values()
        ];
        const resConceded = [...array2.reduce((map, item) => {
                const key = `${item.minute}`;
                const prev = map.get(key);
                map.set(key, !prev ? item : Object.assign(Object.assign({}, item), { count: +(prev === null || prev === void 0 ? void 0 : prev.count) + +(item === null || item === void 0 ? void 0 : item.count), percentage: +(prev === null || prev === void 0 ? void 0 : prev.percentage) + +(item === null || item === void 0 ? void 0 : item.percentage) }));
                return map;
            }, new Map)
                .values()
        ];
        let resData = resScored.map((elem, index) => ({ minute: elem.minute, concededCount: (elem.count.toFixed(2) / stats.length).toFixed(2), concededPercent: (elem.percentage.toFixed(2) / stats.length).toFixed(2), scoringCount: (resConceded[index].count.toFixed(2) / stats.length).toFixed(2), scoringPercent: (resConceded[index].percentage.toFixed(2) / stats.length).toFixed(2) }));
        return {
            period: resData
        };
    }
    goalsProbabilities({ teamId, leagueId, seasonId, }) {
        let promises = [];
        if (seasonId === null || seasonId === void 0 ? void 0 : seasonId.length) {
            for (let i = 0; i < (seasonId === null || seasonId === void 0 ? void 0 : seasonId.length); i++) {
                promises.push(new Promise((resolve) => {
                    return this.httpService.get(`${this.apiUrl}/teams/${teamId}?api_token=${this.apiKey}&include=stats,league&seasons=${seasonId[i]}`).subscribe(res => {
                        resolve(res.data.data.stats.data);
                    });
                }));
            }
            return this.allProbabilities(Promise.all(promises));
        }
        else {
            const urlIncludeSeason = seasonId && typeof seasonId == "number" ? `seasons=${seasonId}` : '';
            const urlIncludeLeague = leagueId && typeof leagueId == "number" ? `league=${leagueId}` : '';
            return this.httpService.get(`${this.apiUrl}/teams/${teamId}?api_token=${this.apiKey}&include=stats,${urlIncludeLeague}&${urlIncludeSeason}`)
                .pipe((0, rxjs_1.map)(resp => this.convertToGoalsProbabilitiesInterface(resp.data)));
        }
    }
    async allProbabilities(performances) {
        var _a, _b, _c, _d, _e;
        const result = {
            home_over_0_5: 0,
            home_over_1_5: 0,
            home_over_2_5: 0,
            home_over_3_5: 0,
            home_over_4_5: 0,
            home_over_5_5: 0,
            home_under_0_5: 0,
            home_under_1_5: 0,
            home_under_2_5: 0,
            home_under_3_5: 0,
            home_under_4_5: 0,
            home_under_5_5: 0,
            away_over_0_5: 0,
            away_over_1_5: 0,
            away_over_2_5: 0,
            away_over_3_5: 0,
            away_over_4_5: 0,
            away_over_5_5: 0,
            away_under_0_5: 0,
            away_under_1_5: 0,
            away_under_2_5: 0,
            away_under_3_5: 0,
            away_under_4_5: 0,
            away_under_5_5: 0,
        };
        const promise = await performances;
        const stats = [].concat.apply([], promise);
        stats === null || stats === void 0 ? void 0 : stats.forEach(stat => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53;
            result.home_over_0_5 += ((_a = stat.goal_line) === null || _a === void 0 ? void 0 : _a.over) ? +((_c = (_b = stat.goal_line) === null || _b === void 0 ? void 0 : _b.over['0_5']) === null || _c === void 0 ? void 0 : _c.home) : 0;
            result.home_over_1_5 += ((_d = stat.goal_line) === null || _d === void 0 ? void 0 : _d.over) ? +((_f = (_e = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _e === void 0 ? void 0 : _e.over['1_5']) === null || _f === void 0 ? void 0 : _f.home) : 0;
            result.home_over_2_5 += ((_g = stat.goal_line) === null || _g === void 0 ? void 0 : _g.over) ? +((_j = (_h = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _h === void 0 ? void 0 : _h.over['2_5']) === null || _j === void 0 ? void 0 : _j.home) : 0;
            result.home_over_3_5 += (((_k = stat.goal_line) === null || _k === void 0 ? void 0 : _k.over) && ((_m = (_l = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _l === void 0 ? void 0 : _l.over['3_5']) === null || _m === void 0 ? void 0 : _m.home)) ? +((_p = (_o = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _o === void 0 ? void 0 : _o.over['3_5']) === null || _p === void 0 ? void 0 : _p.home) : 0;
            result.home_over_4_5 += (((_q = stat.goal_line) === null || _q === void 0 ? void 0 : _q.over) && ((_s = (_r = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _r === void 0 ? void 0 : _r.over['4_5']) === null || _s === void 0 ? void 0 : _s.home)) ? +((_u = (_t = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _t === void 0 ? void 0 : _t.over['4_5']) === null || _u === void 0 ? void 0 : _u.home) : 0;
            result.home_over_5_5 += (((_v = stat.goal_line) === null || _v === void 0 ? void 0 : _v.over) && ((_x = (_w = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _w === void 0 ? void 0 : _w.over['5_5']) === null || _x === void 0 ? void 0 : _x.home)) ? +((_z = (_y = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _y === void 0 ? void 0 : _y.over['5_5']) === null || _z === void 0 ? void 0 : _z.home) : 0;
            result.home_under_0_5 += ((_0 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _0 === void 0 ? void 0 : _0.under) ? +((_2 = (_1 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _1 === void 0 ? void 0 : _1.under['0_5']) === null || _2 === void 0 ? void 0 : _2.home) : 0;
            result.home_under_1_5 += ((_3 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _3 === void 0 ? void 0 : _3.under) ? +((_5 = (_4 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _4 === void 0 ? void 0 : _4.under['1_5']) === null || _5 === void 0 ? void 0 : _5.home) : 0;
            result.home_under_2_5 += ((_6 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _6 === void 0 ? void 0 : _6.under) ? +((_8 = (_7 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _7 === void 0 ? void 0 : _7.under['2_5']) === null || _8 === void 0 ? void 0 : _8.home) : 0;
            result.home_under_3_5 += ((_9 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _9 === void 0 ? void 0 : _9.under) ? +((_11 = (_10 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _10 === void 0 ? void 0 : _10.under['3_5']) === null || _11 === void 0 ? void 0 : _11.home) : 0;
            result.home_under_4_5 += ((_12 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _12 === void 0 ? void 0 : _12.under) ? +((_14 = (_13 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _13 === void 0 ? void 0 : _13.under['4_5']) === null || _14 === void 0 ? void 0 : _14.home) : 0;
            result.home_under_5_5 += ((_15 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _15 === void 0 ? void 0 : _15.under) ? +((_17 = (_16 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _16 === void 0 ? void 0 : _16.under['5_5']) === null || _17 === void 0 ? void 0 : _17.home) : 0;
            result.away_over_0_5 += ((_18 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _18 === void 0 ? void 0 : _18.over) ? +((_20 = (_19 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _19 === void 0 ? void 0 : _19.over['0_5']) === null || _20 === void 0 ? void 0 : _20.away) : 0;
            result.away_over_1_5 += ((_21 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _21 === void 0 ? void 0 : _21.over) ? +((_23 = (_22 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _22 === void 0 ? void 0 : _22.over['1_5']) === null || _23 === void 0 ? void 0 : _23.away) : 0;
            result.away_over_2_5 += ((_24 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _24 === void 0 ? void 0 : _24.over) ? +((_26 = (_25 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _25 === void 0 ? void 0 : _25.over['2_5']) === null || _26 === void 0 ? void 0 : _26.away) : 0;
            result.away_over_3_5 += ((_27 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _27 === void 0 ? void 0 : _27.over) ? +((_29 = (_28 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _28 === void 0 ? void 0 : _28.over['3_5']) === null || _29 === void 0 ? void 0 : _29.away) : 0;
            result.away_over_4_5 += ((_30 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _30 === void 0 ? void 0 : _30.over) ? +((_32 = (_31 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _31 === void 0 ? void 0 : _31.over['4_5']) === null || _32 === void 0 ? void 0 : _32.away) : 0;
            result.away_over_5_5 += ((_33 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _33 === void 0 ? void 0 : _33.over) ? +((_35 = (_34 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _34 === void 0 ? void 0 : _34.over['5_5']) === null || _35 === void 0 ? void 0 : _35.away) : 0;
            result.away_under_0_5 += ((_36 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _36 === void 0 ? void 0 : _36.under) ? +((_38 = (_37 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _37 === void 0 ? void 0 : _37.under['0_5']) === null || _38 === void 0 ? void 0 : _38.away) : 0;
            result.away_under_1_5 += ((_39 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _39 === void 0 ? void 0 : _39.under) ? +((_41 = (_40 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _40 === void 0 ? void 0 : _40.under['1_5']) === null || _41 === void 0 ? void 0 : _41.away) : 0;
            result.away_under_2_5 += ((_42 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _42 === void 0 ? void 0 : _42.under) ? +((_44 = (_43 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _43 === void 0 ? void 0 : _43.under['2_5']) === null || _44 === void 0 ? void 0 : _44.away) : 0;
            result.away_under_3_5 += ((_45 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _45 === void 0 ? void 0 : _45.under) ? +((_47 = (_46 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _46 === void 0 ? void 0 : _46.under['3_5']) === null || _47 === void 0 ? void 0 : _47.away) : 0;
            result.away_under_4_5 += ((_48 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _48 === void 0 ? void 0 : _48.under) ? +((_50 = (_49 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _49 === void 0 ? void 0 : _49.under['4_5']) === null || _50 === void 0 ? void 0 : _50.away) : 0;
            result.away_under_5_5 += ((_51 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _51 === void 0 ? void 0 : _51.under) ? +((_53 = (_52 = stat === null || stat === void 0 ? void 0 : stat.goal_line) === null || _52 === void 0 ? void 0 : _52.under['5_5']) === null || _53 === void 0 ? void 0 : _53.away) : 0;
        });
        return {
            teamId: (_a = stats[0]) === null || _a === void 0 ? void 0 : _a.team_id,
            leagueId: (_d = (_c = (_b = stats[0]) === null || _b === void 0 ? void 0 : _b.league) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.id,
            seasonId: (_e = stats[0]) === null || _e === void 0 ? void 0 : _e.season_id,
            stats: {
                home: {
                    over_0_5: (result.home_over_0_5 / stats.length).toFixed(2),
                    over_1_5: (result.home_over_1_5 / stats.length).toFixed(2),
                    over_2_5: (result.home_over_2_5 / stats.length).toFixed(2),
                    over_3_5: (result.home_over_3_5 / stats.length).toFixed(2),
                    over_4_5: (result.home_over_4_5 / stats.length).toFixed(2),
                    over_5_5: (result.home_over_5_5 / stats.length).toFixed(2),
                    under_0_5: (result.home_under_0_5 / stats.length).toFixed(2),
                    under_1_5: (result.home_under_1_5 / stats.length).toFixed(2),
                    under_2_5: (result.home_under_2_5 / stats.length).toFixed(2),
                    under_3_5: (result.home_under_3_5 / stats.length).toFixed(2),
                    under_4_5: (result.home_under_4_5 / stats.length).toFixed(2),
                    under_5_5: (result.home_under_5_5 / stats.length).toFixed(2),
                },
                away: {
                    over_0_5: (result.away_over_0_5 / stats.length).toFixed(2),
                    over_1_5: (result.away_over_1_5 / stats.length).toFixed(2),
                    over_2_5: (result.away_over_2_5 / stats.length).toFixed(2),
                    over_3_5: (result.away_over_3_5 / stats.length).toFixed(2),
                    over_4_5: (result.away_over_4_5 / stats.length).toFixed(2),
                    over_5_5: (result.away_over_5_5 / stats.length).toFixed(2),
                    under_0_5: (result.away_under_0_5 / stats.length).toFixed(2),
                    under_1_5: (result.away_under_1_5 / stats.length).toFixed(2),
                    under_2_5: (result.away_under_2_5 / stats.length).toFixed(2),
                    under_3_5: (result.away_under_3_5 / stats.length).toFixed(2),
                    under_4_5: (result.away_under_4_5 / stats.length).toFixed(2),
                    under_5_5: (result.away_under_5_5 / stats.length).toFixed(2),
                },
            }
        };
    }
    playerStatsLeague({ seasonId }) {
        let teams = [];
        let players = [];
        return this.httpService.get(`${this.apiUrl}/teams/season/${seasonId}?api_token=${this.apiKey}`)
            .pipe((0, rxjs_1.map)(resp => {
            teams = resp.data.data;
            for (let i = 0; i < teams.length; i++) {
                players.push(new Promise((resolve) => {
                    this.httpService.get(`${this.apiUrl}/squad/season/${seasonId}/team/${teams[i].id}?api_token=${this.apiKey}&include=player.team.coach`).subscribe(res => {
                        resolve(res.data.data);
                    });
                }));
            }
            return Promise.all(players);
        }));
    }
    playerStats({ teamId, seasonId }) {
        let players;
        return this.httpService.get(`${this.apiUrl}/squad/season/${seasonId}/team/${teamId}?api_token=${this.apiKey}&include=player`)
            .pipe((0, rxjs_1.map)(resp => resp.data), (0, operators_1.switchMap)((data) => {
            players = data;
            return this.httpService.get(`${this.apiUrl}/teams/${teamId}?api_token=${this.apiKey}&include=coach`);
        }), (0, rxjs_1.map)(resp => this.convertToPlayerStatsInterface(resp.data, players)));
    }
    competitionStandings({ count, offset, seasonId, leagueId, }) {
        return this.httpService.get(`${this.apiUrl}/standings/season/${seasonId}?api_token=${this.apiKey}&include=standings.team&leagues=${leagueId}`)
            .pipe((0, rxjs_1.map)(resp => this.convertToCompetitionStandingInterface(count, offset, resp.data)));
    }
    search({ name }) {
        const teamName = replaceCharacters(name);
        return this.httpService.get(`${this.apiUrl}/teams/search/${teamName}?api_token=${this.apiKey}&include=league`)
            .pipe((0, rxjs_1.map)(resp => this.convertToSearchTeamInterface(resp.data, name)));
    }
    convertToUpcomingMatchInterface(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        if ((data === null || data === void 0 ? void 0 : data.data) && ((_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.length)) {
            const curTeam = data.data[0];
            if (curTeam && ((_b = curTeam.upcoming) === null || _b === void 0 ? void 0 : _b.data.length)) {
                const teamUpcoming = curTeam.upcoming.data;
                const filteredUpcoming = teamUpcoming.filter(match => new Date(`${match.time.starting_at.date_time} UTC`) > new Date);
                const curUpcoming = filteredUpcoming && filteredUpcoming[0];
                const odds = (_g = (_f = (_e = (_d = (_c = curUpcoming === null || curUpcoming === void 0 ? void 0 : curUpcoming.odds) === null || _c === void 0 ? void 0 : _c.data[0]) === null || _d === void 0 ? void 0 : _d.bookmaker) === null || _e === void 0 ? void 0 : _e.data[0]) === null || _f === void 0 ? void 0 : _f.odds) === null || _g === void 0 ? void 0 : _g.data;
                return {
                    id: curUpcoming === null || curUpcoming === void 0 ? void 0 : curUpcoming.id,
                    firstTeam: {
                        id: (_h = curUpcoming === null || curUpcoming === void 0 ? void 0 : curUpcoming.localTeam) === null || _h === void 0 ? void 0 : _h.data.id,
                        name: (_j = curUpcoming === null || curUpcoming === void 0 ? void 0 : curUpcoming.localTeam) === null || _j === void 0 ? void 0 : _j.data.name,
                        logo_path: (_k = curUpcoming === null || curUpcoming === void 0 ? void 0 : curUpcoming.localTeam) === null || _k === void 0 ? void 0 : _k.data.logo_path,
                        odd: (_l = odds === null || odds === void 0 ? void 0 : odds[0]) === null || _l === void 0 ? void 0 : _l.value
                    },
                    secondTeam: {
                        id: (_m = curUpcoming === null || curUpcoming === void 0 ? void 0 : curUpcoming.visitorTeam) === null || _m === void 0 ? void 0 : _m.data.id,
                        name: (_o = curUpcoming === null || curUpcoming === void 0 ? void 0 : curUpcoming.visitorTeam) === null || _o === void 0 ? void 0 : _o.data.name,
                        logo_path: (_p = curUpcoming === null || curUpcoming === void 0 ? void 0 : curUpcoming.visitorTeam) === null || _p === void 0 ? void 0 : _p.data.logo_path,
                        odd: (_q = odds === null || odds === void 0 ? void 0 : odds[2]) === null || _q === void 0 ? void 0 : _q.value
                    },
                    league: {
                        id: (_r = curUpcoming === null || curUpcoming === void 0 ? void 0 : curUpcoming.league) === null || _r === void 0 ? void 0 : _r.data.id,
                        name: (_s = curUpcoming === null || curUpcoming === void 0 ? void 0 : curUpcoming.league) === null || _s === void 0 ? void 0 : _s.data.name,
                        logo_path: (_t = curUpcoming === null || curUpcoming === void 0 ? void 0 : curUpcoming.league) === null || _t === void 0 ? void 0 : _t.data.logo_path,
                    },
                    date: (_u = curUpcoming === null || curUpcoming === void 0 ? void 0 : curUpcoming.time) === null || _u === void 0 ? void 0 : _u.starting_at.date,
                    time: (_v = curUpcoming === null || curUpcoming === void 0 ? void 0 : curUpcoming.time) === null || _v === void 0 ? void 0 : _v.starting_at.time,
                    city: (_w = curUpcoming === null || curUpcoming === void 0 ? void 0 : curUpcoming.venue) === null || _w === void 0 ? void 0 : _w.data.city,
                };
            }
        }
        return null;
    }
    convertToFixturesInterface(data) {
        return data.map(item => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
            return {
                id: item.id,
                dateStart: (_b = (_a = item.time) === null || _a === void 0 ? void 0 : _a.starting_at) === null || _b === void 0 ? void 0 : _b.date_time,
                league: {
                    id: (_d = (_c = item.league) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.id,
                    logo_path: (_f = (_e = item.league) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.logo_path,
                },
                homeTeam: {
                    id: (_h = (_g = item.localTeam) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.id,
                    name: (_k = (_j = item.localTeam) === null || _j === void 0 ? void 0 : _j.data) === null || _k === void 0 ? void 0 : _k.name,
                    logo_path: (_m = (_l = item.localTeam) === null || _l === void 0 ? void 0 : _l.data) === null || _m === void 0 ? void 0 : _m.logo_path,
                    score: (_o = item.scores) === null || _o === void 0 ? void 0 : _o.localteam_score,
                },
                awayTeam: {
                    id: (_q = (_p = item.visitorTeam) === null || _p === void 0 ? void 0 : _p.data) === null || _q === void 0 ? void 0 : _q.id,
                    name: (_s = (_r = item.visitorTeam) === null || _r === void 0 ? void 0 : _r.data) === null || _s === void 0 ? void 0 : _s.name,
                    logo_path: (_u = (_t = item.visitorTeam) === null || _t === void 0 ? void 0 : _t.data) === null || _u === void 0 ? void 0 : _u.logo_path,
                    score: (_v = item.scores) === null || _v === void 0 ? void 0 : _v.visitorteam_score,
                },
            };
        });
    }
    convertToMatchStatisticsInterface(data) {
        var _a, _b, _c, _d, _e;
        const stats = ((_c = (_b = (_a = data.data) === null || _a === void 0 ? void 0 : _a.stats) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.length) && data.data.stats.data[0];
        if (stats) {
            return {
                teamId: data.data.id,
                leagueId: (_e = (_d = data.data) === null || _d === void 0 ? void 0 : _d.league) === null || _e === void 0 ? void 0 : _e.data.id,
                seasonId: stats === null || stats === void 0 ? void 0 : stats.season_id,
                stats: {
                    attacks: stats === null || stats === void 0 ? void 0 : stats.attacks,
                    dangerousAttacks: stats === null || stats === void 0 ? void 0 : stats.dangerous_attacks,
                    avPossessionPercent: stats === null || stats === void 0 ? void 0 : stats.avg_ball_possession_percentage,
                    fouls: stats === null || stats === void 0 ? void 0 : stats.fouls,
                    avFoulsPerGame: stats === null || stats === void 0 ? void 0 : stats.avg_fouls_per_game,
                    offside: stats === null || stats === void 0 ? void 0 : stats.offsides,
                    redCards: stats === null || stats === void 0 ? void 0 : stats.redcards,
                    yellowCards: stats === null || stats === void 0 ? void 0 : stats.yellowcards,
                    shotsBlocked: stats === null || stats === void 0 ? void 0 : stats.shots_blocked,
                    shotsOffTarget: stats === null || stats === void 0 ? void 0 : stats.shots_off_target,
                    avShotsOffTarget: stats === null || stats === void 0 ? void 0 : stats.avg_shots_off_target_per_game,
                    shotsOnTarget: stats === null || stats === void 0 ? void 0 : stats.shots_on_target,
                    avShotsOnTarget: stats === null || stats === void 0 ? void 0 : stats.avg_shots_on_target_per_game,
                    totalCorners: stats === null || stats === void 0 ? void 0 : stats.total_corners,
                    avCorners: stats === null || stats === void 0 ? void 0 : stats.avg_corners,
                    btts: stats === null || stats === void 0 ? void 0 : stats.btts,
                    avPlayerRatingPerMatch: stats === null || stats === void 0 ? void 0 : stats.avg_player_rating_per_match,
                    tackles: stats === null || stats === void 0 ? void 0 : stats.tackles,
                    goal_line: stats.goal_line,
                    win: stats.win,
                    draw: stats.draw,
                    lost: stats.lost,
                    avg_goals_per_game_scored: stats.avg_goals_per_game_scored
                },
            };
        }
        else {
            return {};
        }
    }
    convertToPerformanceInterface(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13;
        const stats = ((_c = (_b = (_a = data.data) === null || _a === void 0 ? void 0 : _a.stats) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.length) && data.data.stats.data[0];
        if (stats) {
            return {
                teamId: data.data.id,
                leagueId: (_e = (_d = data.data) === null || _d === void 0 ? void 0 : _d.league) === null || _e === void 0 ? void 0 : _e.data.id,
                wins: {
                    overall: (_f = stats === null || stats === void 0 ? void 0 : stats.win) === null || _f === void 0 ? void 0 : _f.total,
                    home: (_g = stats === null || stats === void 0 ? void 0 : stats.win) === null || _g === void 0 ? void 0 : _g.home,
                    away: (_h = stats === null || stats === void 0 ? void 0 : stats.win) === null || _h === void 0 ? void 0 : _h.away,
                },
                draw: {
                    overall: (_j = stats === null || stats === void 0 ? void 0 : stats.draw) === null || _j === void 0 ? void 0 : _j.total,
                    home: (_k = stats === null || stats === void 0 ? void 0 : stats.draw) === null || _k === void 0 ? void 0 : _k.home,
                    away: (_l = stats === null || stats === void 0 ? void 0 : stats.draw) === null || _l === void 0 ? void 0 : _l.away,
                },
                lost: {
                    overall: (_m = stats === null || stats === void 0 ? void 0 : stats.lost) === null || _m === void 0 ? void 0 : _m.total,
                    home: (_o = stats === null || stats === void 0 ? void 0 : stats.lost) === null || _o === void 0 ? void 0 : _o.home,
                    away: (_p = stats === null || stats === void 0 ? void 0 : stats.lost) === null || _p === void 0 ? void 0 : _p.away,
                },
                goalsFor: {
                    overall: (_q = stats === null || stats === void 0 ? void 0 : stats.goals_for) === null || _q === void 0 ? void 0 : _q.total,
                    home: (_r = stats === null || stats === void 0 ? void 0 : stats.goals_for) === null || _r === void 0 ? void 0 : _r.home,
                    away: (_s = stats === null || stats === void 0 ? void 0 : stats.goals_for) === null || _s === void 0 ? void 0 : _s.away,
                },
                goalsAgainst: {
                    overall: (_t = stats === null || stats === void 0 ? void 0 : stats.goals_against) === null || _t === void 0 ? void 0 : _t.total,
                    home: (_u = stats === null || stats === void 0 ? void 0 : stats.goals_against) === null || _u === void 0 ? void 0 : _u.home,
                    away: (_v = stats === null || stats === void 0 ? void 0 : stats.goals_against) === null || _v === void 0 ? void 0 : _v.away,
                },
                cleanSheet: {
                    overall: (_w = stats === null || stats === void 0 ? void 0 : stats.clean_sheet) === null || _w === void 0 ? void 0 : _w.total,
                    home: (_x = stats === null || stats === void 0 ? void 0 : stats.clean_sheet) === null || _x === void 0 ? void 0 : _x.home,
                    away: (_y = stats === null || stats === void 0 ? void 0 : stats.clean_sheet) === null || _y === void 0 ? void 0 : _y.away,
                },
                failedToScore: {
                    overall: (_z = stats === null || stats === void 0 ? void 0 : stats.failed_to_score) === null || _z === void 0 ? void 0 : _z.total,
                    home: (_0 = stats === null || stats === void 0 ? void 0 : stats.failed_to_score) === null || _0 === void 0 ? void 0 : _0.home,
                    away: (_1 = stats === null || stats === void 0 ? void 0 : stats.failed_to_score) === null || _1 === void 0 ? void 0 : _1.away,
                },
                avGoalsScored: {
                    overall: (_2 = stats === null || stats === void 0 ? void 0 : stats.avg_goals_per_game_scored) === null || _2 === void 0 ? void 0 : _2.total,
                    home: (_3 = stats === null || stats === void 0 ? void 0 : stats.avg_goals_per_game_scored) === null || _3 === void 0 ? void 0 : _3.home,
                    away: (_4 = stats === null || stats === void 0 ? void 0 : stats.avg_goals_per_game_scored) === null || _4 === void 0 ? void 0 : _4.away,
                },
                avGoalsConceded: {
                    overall: (_5 = stats === null || stats === void 0 ? void 0 : stats.avg_goals_per_game_conceded) === null || _5 === void 0 ? void 0 : _5.total,
                    home: (_6 = stats === null || stats === void 0 ? void 0 : stats.avg_goals_per_game_conceded) === null || _6 === void 0 ? void 0 : _6.home,
                    away: (_7 = stats === null || stats === void 0 ? void 0 : stats.avg_goals_per_game_conceded) === null || _7 === void 0 ? void 0 : _7.away,
                },
                avFirstGoalsScored: {
                    overall: (_8 = stats === null || stats === void 0 ? void 0 : stats.avg_first_goal_scored) === null || _8 === void 0 ? void 0 : _8.total,
                    home: (_9 = stats === null || stats === void 0 ? void 0 : stats.avg_first_goal_scored) === null || _9 === void 0 ? void 0 : _9.home,
                    away: (_10 = stats === null || stats === void 0 ? void 0 : stats.avg_first_goal_scored) === null || _10 === void 0 ? void 0 : _10.away,
                },
                avFirstGoalsConceded: {
                    overall: (_11 = stats === null || stats === void 0 ? void 0 : stats.avg_first_goal_conceded) === null || _11 === void 0 ? void 0 : _11.total,
                    home: (_12 = stats === null || stats === void 0 ? void 0 : stats.avg_first_goal_conceded) === null || _12 === void 0 ? void 0 : _12.home,
                    away: (_13 = stats === null || stats === void 0 ? void 0 : stats.avg_first_goal_conceded) === null || _13 === void 0 ? void 0 : _13.away,
                },
            };
        }
        else {
            return {};
        }
    }
    convertToGoalByMinutesInterface(data) {
        var _a, _b, _c, _d, _e, _f;
        const stats = ((_c = (_b = (_a = data.data) === null || _a === void 0 ? void 0 : _a.stats) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.length) && data.data.stats.data[0];
        const goals = ((_d = stats === null || stats === void 0 ? void 0 : stats.goals_conceded_minutes) === null || _d === void 0 ? void 0 : _d.length) && (stats === null || stats === void 0 ? void 0 : stats.goals_conceded_minutes[0]);
        if (goals) {
            return {
                name: data.data.name,
                teamId: data.data.id,
                leagueId: (_f = (_e = data.data) === null || _e === void 0 ? void 0 : _e.league) === null || _f === void 0 ? void 0 : _f.data.id,
                seasonId: stats === null || stats === void 0 ? void 0 : stats.season_id,
                period: (goals === null || goals === void 0 ? void 0 : goals.period.length) && goals.period.map((g, i) => {
                    return {
                        minute: g.minute,
                        scoringCount: stats.scoring_minutes[0].period[i].count,
                        scoringPercent: stats.scoring_minutes[0].period[i].percentage,
                        concededCount: g.count,
                        concededPercent: g.percentage,
                    };
                }),
            };
        }
        else {
            return {};
        }
    }
    convertToGoalsProbabilitiesInterface(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
        const stats = ((_c = (_b = (_a = data.data) === null || _a === void 0 ? void 0 : _a.stats) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.length) && data.data.stats.data[0];
        if (stats) {
            return {
                teamId: data.data.id,
                leagueId: (_e = (_d = data.data) === null || _d === void 0 ? void 0 : _d.league) === null || _e === void 0 ? void 0 : _e.data.id,
                seasonId: stats === null || stats === void 0 ? void 0 : stats.season_id,
                stats: {
                    home: {
                        over_0_5: (_f = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _f === void 0 ? void 0 : _f.over['0_5'].home,
                        over_1_5: (_g = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _g === void 0 ? void 0 : _g.over['1_5'].home,
                        over_2_5: (_h = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _h === void 0 ? void 0 : _h.over['2_5'].home,
                        over_3_5: (_j = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _j === void 0 ? void 0 : _j.over['3_5'].home,
                        over_4_5: (_k = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _k === void 0 ? void 0 : _k.over['4_5'].home,
                        over_5_5: (_l = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _l === void 0 ? void 0 : _l.over['5_5'].home,
                        under_0_5: (_m = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _m === void 0 ? void 0 : _m.under['0_5'].home,
                        under_1_5: (_o = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _o === void 0 ? void 0 : _o.under['1_5'].home,
                        under_2_5: (_p = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _p === void 0 ? void 0 : _p.under['2_5'].home,
                        under_3_5: (_q = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _q === void 0 ? void 0 : _q.under['3_5'].home,
                        under_4_5: (_r = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _r === void 0 ? void 0 : _r.under['4_5'].home,
                        under_5_5: (_s = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _s === void 0 ? void 0 : _s.under['5_5'].home,
                    },
                    away: {
                        over_0_5: (_t = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _t === void 0 ? void 0 : _t.over['0_5'].away,
                        over_1_5: (_u = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _u === void 0 ? void 0 : _u.over['1_5'].away,
                        over_2_5: (_v = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _v === void 0 ? void 0 : _v.over['2_5'].away,
                        over_3_5: (_w = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _w === void 0 ? void 0 : _w.over['3_5'].away,
                        over_4_5: (_x = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _x === void 0 ? void 0 : _x.over['4_5'].away,
                        over_5_5: (_y = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _y === void 0 ? void 0 : _y.over['5_5'].away,
                        under_0_5: (_z = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _z === void 0 ? void 0 : _z.under['0_5'].away,
                        under_1_5: (_0 = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _0 === void 0 ? void 0 : _0.under['1_5'].away,
                        under_2_5: (_1 = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _1 === void 0 ? void 0 : _1.under['2_5'].away,
                        under_3_5: (_2 = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _2 === void 0 ? void 0 : _2.under['3_5'].away,
                        under_4_5: (_3 = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _3 === void 0 ? void 0 : _3.under['4_5'].away,
                        under_5_5: (_4 = stats === null || stats === void 0 ? void 0 : stats.goal_line) === null || _4 === void 0 ? void 0 : _4.under['5_5'].away,
                    },
                },
            };
        }
        else {
            return {};
        }
    }
    convertToPlayerStatsInterface(team, players) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return {
            team: {
                id: team.data.id,
                logo_path: team.data.logo_path,
                name: team.data.name,
            },
            coach: {
                id: (_c = (_b = (_a = team === null || team === void 0 ? void 0 : team.data) === null || _a === void 0 ? void 0 : _a.coach) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.id,
                fullname: (_f = (_e = (_d = team === null || team === void 0 ? void 0 : team.data) === null || _d === void 0 ? void 0 : _d.coach) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.fullname,
                image_path: (_j = (_h = (_g = team === null || team === void 0 ? void 0 : team.data) === null || _g === void 0 ? void 0 : _g.coach) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.image_path,
            },
            players: (_k = players === null || players === void 0 ? void 0 : players.data) === null || _k === void 0 ? void 0 : _k.map(s => {
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
                    rating: s === null || s === void 0 ? void 0 : s.rating,
                };
            }),
        };
    }
    convertToGeneralInfoInterface(data, name) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        const team = (_b = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.filter(team => team.name.toLowerCase() === name.toLowerCase())) === null || _b === void 0 ? void 0 : _b[0];
        return {
            id: team === null || team === void 0 ? void 0 : team.id,
            name: team === null || team === void 0 ? void 0 : team.name,
            venue: {
                name: (_d = (_c = team === null || team === void 0 ? void 0 : team.venue) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.name,
                photo: (_f = (_e = team === null || team === void 0 ? void 0 : team.venue) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.image_path,
                capacity: (_h = (_g = team === null || team === void 0 ? void 0 : team.venue) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.capacity,
                city: (_k = (_j = team === null || team === void 0 ? void 0 : team.venue) === null || _j === void 0 ? void 0 : _j.data) === null || _k === void 0 ? void 0 : _k.city,
                country: (_m = (_l = team === null || team === void 0 ? void 0 : team.country) === null || _l === void 0 ? void 0 : _l.data) === null || _m === void 0 ? void 0 : _m.name,
            },
            coach: {
                id: (_p = (_o = team === null || team === void 0 ? void 0 : team.coach) === null || _o === void 0 ? void 0 : _o.data) === null || _p === void 0 ? void 0 : _p.id,
                lastName: (_r = (_q = team === null || team === void 0 ? void 0 : team.coach) === null || _q === void 0 ? void 0 : _q.data) === null || _r === void 0 ? void 0 : _r.fullname,
            },
            latest: team === null || team === void 0 ? void 0 : team.latest.data,
            trophies: team === null || team === void 0 ? void 0 : team.trophies.data.filter(d => d.status === trophy_interface_1.StatusTrophy.Winner).map(d => {
                return {
                    league_id: d.league_id,
                    league_name: d.league,
                    count: d.times,
                };
            }),
            rivals: team === null || team === void 0 ? void 0 : team.rivals.data.map(r => {
                return {
                    id: r.id,
                    name: r.name,
                };
            }),
        };
    }
    convertToCompetitionStandingInterface(count, offset, data) {
        var _a, _b;
        const standingsData = ((_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.length) && ((_b = data === null || data === void 0 ? void 0 : data.data) === null || _b === void 0 ? void 0 : _b.map(s => { var _a; return (_a = s === null || s === void 0 ? void 0 : s.standings) === null || _a === void 0 ? void 0 : _a.data; }));
        if (standingsData.length) {
            const standings = [].concat.apply([], standingsData);
            if (standings) {
                return standings.map(s => {
                    var _a, _b, _c, _d, _e, _f;
                    return {
                        id: (_b = (_a = s === null || s === void 0 ? void 0 : s.team) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.id,
                        name: (_d = (_c = s === null || s === void 0 ? void 0 : s.team) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.name,
                        logo_path: (_f = (_e = s.team) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.logo_path,
                        rank: s.position,
                        gamesPlayed: s.overall.games_played,
                        points: s.overall.points,
                        wins: s.overall.won,
                        draws: s.overall.draw,
                        losses: s.overall.lost,
                        goalsDifference: s.total.goal_difference,
                        goalsTotal: s.overall.goals_scored,
                        result: s.result,
                    };
                }).filter((_, i) => i >= offset - 1 && i < offset + count - 1);
            }
            else {
                return [];
            }
        }
    }
    convertToSearchTeamInterface(data, name) {
        var _a, _b, _c, _d;
        const team = (_b = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.filter(team => team.name.toLowerCase() === name.toLowerCase())) === null || _b === void 0 ? void 0 : _b[0];
        return {
            id: team === null || team === void 0 ? void 0 : team.id,
            leagueId: (_d = (_c = team === null || team === void 0 ? void 0 : team.league) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.id,
            seasonId: team === null || team === void 0 ? void 0 : team.current_season_id,
            name: team === null || team === void 0 ? void 0 : team.name,
        };
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
    convertToSecondaryInfoInterface(data) {
        var _a;
        const curData = (_a = data.data.goalscorers) === null || _a === void 0 ? void 0 : _a.data;
        const topScorer = curData === null || curData === void 0 ? void 0 : curData.find(d => d.goals === Math.max(...curData.map(obj => obj.goals)));
        if (data === null || data === void 0 ? void 0 : data.data) {
            return {
                topScorer: topScorer,
                league: data.data.league,
                name: data.data.name,
                seasonId: data.data.current_season_id,
                teamId: data.data.id
            };
        }
        return {};
    }
    convertToLastFixturesInterface(data) {
        var _a;
        const team = ((_a = data.data) === null || _a === void 0 ? void 0 : _a.length) && data.data[0];
        if (team) {
            return {
                homeForm: this.lastTeamForm(team.latest.data, team.id),
                awayForm: this.lastTeamForm(team.latest.data, team.id, 'visitorteam_id'),
            };
        }
        return {};
    }
};
TeamService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], TeamService);
exports.TeamService = TeamService;
//# sourceMappingURL=team.service.js.map