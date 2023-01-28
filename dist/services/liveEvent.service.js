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
exports.LiveEventService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const operators_1 = require("rxjs/operators");
let LiveEventService = class LiveEventService {
    constructor(httpService) {
        this.httpService = httpService;
        this.apiKey = process.env.API_KEY;
        this.apiUrl = process.env.API_URL;
    }
    getLiveEvents() {
        return this.httpService.get(`${this.apiUrl}/livescores/now?api_token=${this.apiKey}&include=league.country, stats, events.player, localTeam,visitorTeam`)
            .pipe((0, operators_1.map)(resp => this.convertToH2hFixturesInterface(resp.data)));
    }
    getLineUps(fixtureIds) {
        let lineUps = [];
        for (let i = 0; i < (fixtureIds === null || fixtureIds === void 0 ? void 0 : fixtureIds.length); i++) {
            lineUps.push(new Promise((resolve) => {
                this.httpService.get(`${this.apiUrl}/fixtures/${fixtureIds[i]}?api_token=${this.apiKey}&include=lineup.team,bench,sidelined`).subscribe(res => {
                    resolve({ lineup: res.data.data.lineup.data, bench: res.data.data.bench.data, formations: res.data.data.formations });
                });
            }));
        }
        return Promise.all(lineUps);
    }
    getMatch(fixtureId) {
        return this.httpService.get(`${this.apiUrl}/fixtures/${fixtureId}?api_token=${this.apiKey}&include=stats,referee,league,venue,lineup,bench,events,localTeam.country,visitorTeam.country`)
            .pipe((0, operators_1.map)(resp => { var _a; return this.convertToMatchFixturesInterface((_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.data); }));
    }
    getFixtures(teamId) {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const today = [year, month, day].join('-');
        return this.httpService.get(`${this.apiUrl}/fixtures/between/${today}/${today}/${teamId}?api_token=${this.apiKey}&include=stats, referee, league, venue, localTeam, visitorTeam, goals, events, corners, lineup, bench`)
            .pipe((0, operators_1.map)(resp => { var _a; return this.convertToMatchLiveFixturesInterface((_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.data); }));
    }
    convertToMatchLiveFixturesInterface(data) {
        return data === null || data === void 0 ? void 0 : data.map(item => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            return {
                stats: (_a = item === null || item === void 0 ? void 0 : item.stats) === null || _a === void 0 ? void 0 : _a.data,
                events: (_b = item === null || item === void 0 ? void 0 : item.events) === null || _b === void 0 ? void 0 : _b.data,
                lineup: (_c = item === null || item === void 0 ? void 0 : item.lineup) === null || _c === void 0 ? void 0 : _c.data,
                bench: (_d = item === null || item === void 0 ? void 0 : item.bench) === null || _d === void 0 ? void 0 : _d.data,
                localTeam: (_e = item === null || item === void 0 ? void 0 : item.localTeam) === null || _e === void 0 ? void 0 : _e.data,
                visitorTeam: (_f = item === null || item === void 0 ? void 0 : item.visitorTeam) === null || _f === void 0 ? void 0 : _f.data,
                formations: item === null || item === void 0 ? void 0 : item.formations,
                matchEnd: (_g = item === null || item === void 0 ? void 0 : item.scores) === null || _g === void 0 ? void 0 : _g.ft_score,
                referee: (_h = item === null || item === void 0 ? void 0 : item.referee) === null || _h === void 0 ? void 0 : _h.data,
                league: (_j = item === null || item === void 0 ? void 0 : item.league) === null || _j === void 0 ? void 0 : _j.data,
                venue: (_k = item === null || item === void 0 ? void 0 : item.venue) === null || _k === void 0 ? void 0 : _k.data,
                time: item === null || item === void 0 ? void 0 : item.time,
                weather: item === null || item === void 0 ? void 0 : item.weather_report,
            };
        });
    }
    convertToMatchFixturesInterface(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return {
            stats: (_a = data === null || data === void 0 ? void 0 : data.stats) === null || _a === void 0 ? void 0 : _a.data,
            events: (_b = data === null || data === void 0 ? void 0 : data.events) === null || _b === void 0 ? void 0 : _b.data,
            lineup: (_c = data === null || data === void 0 ? void 0 : data.lineup) === null || _c === void 0 ? void 0 : _c.data,
            bench: (_d = data === null || data === void 0 ? void 0 : data.bench) === null || _d === void 0 ? void 0 : _d.data,
            localTeam: (_e = data === null || data === void 0 ? void 0 : data.localTeam) === null || _e === void 0 ? void 0 : _e.data,
            visitorTeam: (_f = data === null || data === void 0 ? void 0 : data.visitorTeam) === null || _f === void 0 ? void 0 : _f.data,
            formations: data === null || data === void 0 ? void 0 : data.formations,
            matchEnd: data === null || data === void 0 ? void 0 : data.scores.ft_score,
            referee: (_g = data === null || data === void 0 ? void 0 : data.referee) === null || _g === void 0 ? void 0 : _g.data,
            league: (_h = data === null || data === void 0 ? void 0 : data.league) === null || _h === void 0 ? void 0 : _h.data,
            venue: (_j = data === null || data === void 0 ? void 0 : data.venue) === null || _j === void 0 ? void 0 : _j.data,
            time: data === null || data === void 0 ? void 0 : data.time,
            weather: data === null || data === void 0 ? void 0 : data.weather_report,
        };
    }
    convertToH2hFixturesInterface(data) {
        var _a;
        return (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.map(item => {
            return {
                item: item,
                league: item.league.data,
                stats: item.stats.data,
                events: item.events.data,
                localTeam: item.localTeam.data,
                visitorTeam: item.visitorTeam.data,
            };
        });
    }
};
LiveEventService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], LiveEventService);
exports.LiveEventService = LiveEventService;
//# sourceMappingURL=liveEvent.service.js.map