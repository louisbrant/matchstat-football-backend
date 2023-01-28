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
exports.LeagueAndSeasonsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const operators_1 = require("rxjs/operators");
let LeagueAndSeasonsService = class LeagueAndSeasonsService {
    constructor(httpService) {
        this.httpService = httpService;
        this.apiKey = process.env.API_KEY;
        this.apiUrl = process.env.API_URL;
    }
    getLeagueAndSeasons({ teamId }) {
        return this.httpService.get(`${this.apiUrl}/teams/${teamId}/history?api_token=${this.apiKey}`)
            .pipe((0, operators_1.map)(resp => this.returnLeagueAndSeason(resp.data)));
    }
    returnLeagueAndSeason(data) {
        const arr = [];
        data.data.forEach(item => {
            const curIndex = arr.findIndex(ar => ar.leagueId === item.league_id);
            if (curIndex < 0) {
                arr.push({
                    leagueId: item.league_id,
                    leagueName: item.league.data.name,
                    type: item.league.data.type,
                    seasons: [
                        {
                            seasonId: item.id,
                            seasonName: item.name
                        }
                    ]
                });
            }
            else {
                arr[curIndex].seasons.push({
                    seasonId: item.id,
                    seasonName: item.name
                });
            }
        });
        return arr;
    }
};
LeagueAndSeasonsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], LeagueAndSeasonsService);
exports.LeagueAndSeasonsService = LeagueAndSeasonsService;
//# sourceMappingURL=leagueAndSeasons.service.js.map