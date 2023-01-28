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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const operators_1 = require("rxjs/operators");
let SearchService = class SearchService {
    constructor(httpService) {
        this.httpService = httpService;
        this.apiKey = process.env.API_KEY;
        this.apiUrl = process.env.API_URL;
    }
    search({ name, isTeam }) {
        const searchString = name.trim();
        if (isTeam) {
            return this.httpService.get(`${this.apiUrl}/teams/search/${searchString}?api_token=${this.apiKey}`)
                .pipe((0, operators_1.map)(resp => this.returnTeams(resp.data)));
        }
        else {
            let players;
            let teams;
            return this.httpService.get(`${this.apiUrl}/players/search/${searchString}?api_token=${this.apiKey}`)
                .pipe((0, operators_1.switchMap)((player) => {
                players = player;
                return this.httpService.get(`${this.apiUrl}/teams/search/${searchString}?api_token=${this.apiKey}`);
            }), (0, operators_1.switchMap)((team) => {
                teams = team;
                return this.httpService.get(`${this.apiUrl}/leagues/search/${searchString}?api_token=${this.apiKey}`);
            }), (0, operators_1.map)(resp => this.returnSearchResult(resp.data, players, teams, searchString)));
        }
    }
    returnTeams(data) {
        return data.data.map(item => {
            return {
                id: item === null || item === void 0 ? void 0 : item.id,
                name: item === null || item === void 0 ? void 0 : item.name,
                type: 'team'
            };
        });
    }
    returnSearchResult(leagues, players, teams, searchString) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        let searchData = [];
        ((_b = (_a = players === null || players === void 0 ? void 0 : players.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.length) && ((_d = (_c = players === null || players === void 0 ? void 0 : players.data) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.map(p => {
            searchData === null || searchData === void 0 ? void 0 : searchData.push({
                id: p === null || p === void 0 ? void 0 : p.player_id,
                name: (p === null || p === void 0 ? void 0 : p.firstname) + ' ' + (p === null || p === void 0 ? void 0 : p.lastname),
                type: 'player'
            });
        }));
        ((_f = (_e = teams === null || teams === void 0 ? void 0 : teams.data) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.length) && ((_h = (_g = teams === null || teams === void 0 ? void 0 : teams.data) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.map(t => {
            searchData === null || searchData === void 0 ? void 0 : searchData.push({
                id: t === null || t === void 0 ? void 0 : t.id,
                name: t === null || t === void 0 ? void 0 : t.name,
                type: 'team'
            });
        }));
        ((_j = leagues === null || leagues === void 0 ? void 0 : leagues.data) === null || _j === void 0 ? void 0 : _j.length) && ((_k = leagues === null || leagues === void 0 ? void 0 : leagues.data) === null || _k === void 0 ? void 0 : _k.map(l => {
            searchData === null || searchData === void 0 ? void 0 : searchData.push({
                id: l === null || l === void 0 ? void 0 : l.id,
                name: l === null || l === void 0 ? void 0 : l.name,
                type: 'league'
            });
        }));
        searchData = searchData === null || searchData === void 0 ? void 0 : searchData.filter(item => { var _a; return ((_a = item === null || item === void 0 ? void 0 : item.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().indexOf(searchString === null || searchString === void 0 ? void 0 : searchString.toLowerCase())) > -1; });
        return searchData;
    }
    ;
};
SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], SearchService);
exports.SearchService = SearchService;
//# sourceMappingURL=search.service.js.map