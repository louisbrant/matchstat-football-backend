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
exports.PlayerService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
let PlayerService = class PlayerService {
    constructor(httpService) {
        this.httpService = httpService;
        this.apiKey = process.env.API_KEY;
        this.apiUrl = process.env.API_URL;
    }
    generalInfo({ name }) {
        let curPlayer;
        return this.httpService.get(`${this.apiUrl}/players/search/${name}?api_token=${this.apiKey}`)
            .pipe((0, operators_1.map)(resp => resp.data), (0, operators_1.switchMap)((res) => {
            var _a;
            curPlayer = ((_a = res.data) === null || _a === void 0 ? void 0 : _a.length) && res.data[0];
            if (curPlayer) {
                return this.getPlayerById(curPlayer.player_id);
            }
            return rxjs_1.EMPTY;
        }), (0, operators_1.map)(resp => this.returnGeneralInfo(resp.data)));
    }
    stats({ playerId, leagueId, seasonId }) {
        return this.httpService.get(`${this.apiUrl}/players/${playerId}?api_token=${this.apiKey}&include=team.squad,stats,position&seasons=${seasonId}`)
            .pipe((0, operators_1.map)(resp => this.returnPlayerStats(resp.data)));
    }
    getPlayerById(id) {
        return this.httpService.get(`${this.apiUrl}/players/${id}?api_token=${this.apiKey}&include=country,position,team,stats,team.league,team.squad`)
            .pipe((0, operators_1.map)(resp => resp.data));
    }
    returnGeneralInfo(curPlayer) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
        const rating = Math.max(...(_b = (_a = curPlayer === null || curPlayer === void 0 ? void 0 : curPlayer.stats) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.map(o => Number(o === null || o === void 0 ? void 0 : o.rating)));
        const squad = (_f = (_e = (_d = (_c = curPlayer === null || curPlayer === void 0 ? void 0 : curPlayer.team) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.squad) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.find(s => s.player_id === curPlayer.player_id);
        return {
            id: curPlayer.player_id,
            fullName: curPlayer.fullname,
            image_path: curPlayer.image_path,
            birthdate: this.dateFormat(curPlayer.birthdate),
            age: this.calculateAge(curPlayer.birthdate),
            birthplace: {
                country: curPlayer === null || curPlayer === void 0 ? void 0 : curPlayer.birthcountry,
                flag_image_path: (_h = (_g = curPlayer === null || curPlayer === void 0 ? void 0 : curPlayer.country) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.image_path,
                city: curPlayer === null || curPlayer === void 0 ? void 0 : curPlayer.birthplace,
            },
            position: curPlayer.position.data.name,
            team: {
                id: (_k = (_j = curPlayer === null || curPlayer === void 0 ? void 0 : curPlayer.team) === null || _j === void 0 ? void 0 : _j.data) === null || _k === void 0 ? void 0 : _k.id,
                name: (_m = (_l = curPlayer === null || curPlayer === void 0 ? void 0 : curPlayer.team) === null || _l === void 0 ? void 0 : _l.data) === null || _m === void 0 ? void 0 : _m.name,
                logo_path: (_p = (_o = curPlayer === null || curPlayer === void 0 ? void 0 : curPlayer.team) === null || _o === void 0 ? void 0 : _o.data) === null || _p === void 0 ? void 0 : _p.logo_path,
            },
            leagueName: (_t = (_s = (_r = (_q = curPlayer === null || curPlayer === void 0 ? void 0 : curPlayer.team) === null || _q === void 0 ? void 0 : _q.data) === null || _r === void 0 ? void 0 : _r.league) === null || _s === void 0 ? void 0 : _s.data) === null || _t === void 0 ? void 0 : _t.name,
            rating: rating === null || rating === void 0 ? void 0 : rating.toString(),
            weight: curPlayer === null || curPlayer === void 0 ? void 0 : curPlayer.weight,
            height: curPlayer === null || curPlayer === void 0 ? void 0 : curPlayer.height,
            number: squad === null || squad === void 0 ? void 0 : squad.number,
            leagueId: (_x = (_w = (_v = (_u = curPlayer === null || curPlayer === void 0 ? void 0 : curPlayer.team) === null || _u === void 0 ? void 0 : _u.data) === null || _v === void 0 ? void 0 : _v.league) === null || _w === void 0 ? void 0 : _w.data) === null || _x === void 0 ? void 0 : _x.id,
            seasonId: (_z = (_y = curPlayer === null || curPlayer === void 0 ? void 0 : curPlayer.team) === null || _y === void 0 ? void 0 : _y.data) === null || _z === void 0 ? void 0 : _z.current_season_id,
        };
    }
    returnPlayerStats(data) {
        var _a, _b, _c, _d, _e;
        const stats = data.data.stats.data[0];
        const squad = (_e = (_d = (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.team) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.squad) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.find(it => it.player_id === data.data.player_id);
        if (squad) {
            return {
                id: data.data.player_id,
                position: data.data.position.data.id,
                shirtNumber: squad === null || squad === void 0 ? void 0 : squad.number,
                statistics: {
                    captain: !!(stats === null || stats === void 0 ? void 0 : stats.captain),
                    injured: squad === null || squad === void 0 ? void 0 : squad.injured,
                    minutesPlayed: stats === null || stats === void 0 ? void 0 : stats.minutes,
                    appearences: stats === null || stats === void 0 ? void 0 : stats.appearences,
                    lineups: stats === null || stats === void 0 ? void 0 : stats.lineups,
                    subbedIn: stats === null || stats === void 0 ? void 0 : stats.substitute_in,
                    subbedOut: stats === null || stats === void 0 ? void 0 : stats.substitute_out,
                    goals: stats === null || stats === void 0 ? void 0 : stats.goals,
                    ownGoals: stats === null || stats === void 0 ? void 0 : stats.owngoals,
                    assists: stats === null || stats === void 0 ? void 0 : stats.assists,
                    saves: stats === null || stats === void 0 ? void 0 : stats.saves,
                    insideBoxSaves: stats === null || stats === void 0 ? void 0 : stats.inside_box_saves,
                    dispossessed: stats === null || stats === void 0 ? void 0 : stats.dispossesed,
                    interceptions: stats === null || stats === void 0 ? void 0 : stats.interceptions,
                    yellowCards: stats === null || stats === void 0 ? void 0 : stats.yellowcards,
                    yellowRed: stats === null || stats === void 0 ? void 0 : stats.yellowred,
                    directRedCards: stats === null || stats === void 0 ? void 0 : stats.redcards,
                    tackles: stats === null || stats === void 0 ? void 0 : stats.tackles,
                    blocks: stats === null || stats === void 0 ? void 0 : stats.blocks,
                    hitPost: stats === null || stats === void 0 ? void 0 : stats.hit_post,
                    cleanSheets: stats === null || stats === void 0 ? void 0 : stats.cleansheets,
                    rating: stats === null || stats === void 0 ? void 0 : stats.rating,
                    fouls: {
                        committed: stats === null || stats === void 0 ? void 0 : stats.fouls.committed,
                        drawn: stats === null || stats === void 0 ? void 0 : stats.fouls.drawn,
                    },
                    crosses: {
                        total: stats === null || stats === void 0 ? void 0 : stats.crosses.total,
                        accurate: stats === null || stats === void 0 ? void 0 : stats.crosses.accurate,
                    },
                    dribble: {
                        attempts: stats === null || stats === void 0 ? void 0 : stats.dribbles.attempts,
                        success: stats === null || stats === void 0 ? void 0 : stats.dribbles.success,
                        past: stats === null || stats === void 0 ? void 0 : stats.dribbles.dribbled_past,
                    },
                    duels: {
                        total: stats === null || stats === void 0 ? void 0 : stats.duels.total,
                        won: stats === null || stats === void 0 ? void 0 : stats.duels.won,
                    },
                    passes: {
                        total: stats === null || stats === void 0 ? void 0 : stats.passes.total,
                        accuracy: stats === null || stats === void 0 ? void 0 : stats.passes.accuracy,
                        key: stats === null || stats === void 0 ? void 0 : stats.passes.key_passes,
                    },
                    penalties: {
                        won: stats === null || stats === void 0 ? void 0 : stats.penalties.won,
                        scored: stats === null || stats === void 0 ? void 0 : stats.penalties.scores,
                        missed: stats === null || stats === void 0 ? void 0 : stats.penalties.missed,
                        committed: stats === null || stats === void 0 ? void 0 : stats.penalties.committed,
                        saves: stats === null || stats === void 0 ? void 0 : stats.penalties.saves
                    },
                    shots: {
                        total: stats === null || stats === void 0 ? void 0 : stats.shots.shots_total,
                        onTarget: stats === null || stats === void 0 ? void 0 : stats.shots.shots_on_target,
                        offTarget: stats === null || stats === void 0 ? void 0 : stats.shots.shots_off_target,
                    }
                }
            };
        }
        return {};
    }
    calculateAge(date) {
        const ageDifMs = Date.now() - new Date(this.dateFormat(date)).getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
    dateFormat(date) {
        if (date) {
            const arr = date.split('/');
            return `${arr[2]}-${arr[1]}-${arr[0]}`;
        }
        return date;
    }
};
PlayerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], PlayerService);
exports.PlayerService = PlayerService;
//# sourceMappingURL=player.service.js.map