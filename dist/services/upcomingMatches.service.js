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
exports.UpcomingMatchesService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const operators_1 = require("rxjs/operators");
let UpcomingMatchesService = class UpcomingMatchesService {
    constructor(httpService) {
        this.httpService = httpService;
        this.apiKey = process.env.API_KEY;
        this.apiUrl = process.env.API_URL;
    }
    upcomingMatches({ page, perPage, dateFrom, dateTo }) {
        return this.httpService.get(`${this.apiUrl}/fixtures/between/${dateFrom}/${dateTo}?api_token=${this.apiKey}&include=odds, localTeam, venue, visitorTeam, league&per_page=${perPage}&page=${page}&status=NS`).pipe((0, operators_1.map)(res => this.upcomingMatchesInterface(res.data.data, perPage)));
    }
    upcomingMatchesInterface(matches, perPage) {
        const upcomings = perPage === 50 ? matches === null || matches === void 0 ? void 0 : matches.filter(match => { var _a, _b; return new Date(`${(_b = (_a = match.time) === null || _a === void 0 ? void 0 : _a.starting_at) === null || _b === void 0 ? void 0 : _b.date_time} UTC`) > new Date; }) : matches;
        return upcomings === null || upcomings === void 0 ? void 0 : upcomings.map(m => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
            return {
                id: m.id,
                firstTeam: {
                    id: m.localTeam.data.id,
                    name: m.localTeam.data.name,
                    logo_path: m.localTeam.data.logo_path,
                },
                secondTeam: {
                    id: m.visitorTeam.data.id,
                    name: m.visitorTeam.data.name,
                    logo_path: m.visitorTeam.data.logo_path,
                },
                league: {
                    id: m.league.data.id,
                    name: m.league.data.name,
                    logo_path: m.league.data.logo_path
                },
                odds: {
                    oddFirstTeam: (_f = (_e = (_d = (_c = (_b = (_a = m.odds) === null || _a === void 0 ? void 0 : _a.data[0]) === null || _b === void 0 ? void 0 : _b.bookmaker) === null || _c === void 0 ? void 0 : _c.data[0]) === null || _d === void 0 ? void 0 : _d.odds) === null || _e === void 0 ? void 0 : _e.data[0]) === null || _f === void 0 ? void 0 : _f.value,
                    oddSecondTeam: (_m = (_l = (_k = (_j = (_h = (_g = m.odds) === null || _g === void 0 ? void 0 : _g.data[0]) === null || _h === void 0 ? void 0 : _h.bookmaker) === null || _j === void 0 ? void 0 : _j.data[0]) === null || _k === void 0 ? void 0 : _k.odds) === null || _l === void 0 ? void 0 : _l.data[2]) === null || _m === void 0 ? void 0 : _m.value,
                },
                date: m.time.starting_at.date,
                time: m.time.starting_at.time,
                city: (_p = (_o = m === null || m === void 0 ? void 0 : m.venue) === null || _o === void 0 ? void 0 : _o.data) === null || _p === void 0 ? void 0 : _p.city,
            };
        });
    }
};
UpcomingMatchesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], UpcomingMatchesService);
exports.UpcomingMatchesService = UpcomingMatchesService;
//# sourceMappingURL=upcomingMatches.service.js.map