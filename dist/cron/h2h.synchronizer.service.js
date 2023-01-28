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
exports.H2hSynchronizerService = void 0;
const typeorm_1 = require("typeorm");
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("@nestjs/typeorm");
const h2h_current_page_count_entity_1 = require("../entities/h2h_current_page_count.entity");
let H2hSynchronizerService = class H2hSynchronizerService {
    constructor(httpService, connection, h2hPageRepository) {
        this.httpService = httpService;
        this.connection = connection;
        this.h2hPageRepository = h2hPageRepository;
        this.apiKey = process.env.API_KEY;
        this.apiUrl = process.env.API_URL;
    }
    async parse() {
        console.log('--- Synchronize H2H Start ', new Date(), ' ---');
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        let perPage = 150;
        let page = 1;
        const today = [year, month, day].join('-');
        const currentPageCount = await this.h2hPageRepository.findOne();
        if (currentPageCount) {
            page = currentPageCount === null || currentPageCount === void 0 ? void 0 : currentPageCount.currentPageCount;
        }
        const interval = setInterval(() => {
            this.httpService.get(`${this.apiUrl}/fixtures/between/2006-07-07/${today}?api_token=${this.apiKey}&include=localTeam,visitorTeam,league&per_page=${perPage}&page=${page}`).subscribe(async (resp) => {
                var _a;
                if (resp.data.data.length) {
                    for (let i = 0; i < resp.data.data.length; i++) {
                        this.connection.query('INSERT INTO h2h (h2h_id, league_id,  season_id, stage_id, round_id, group_id, aggregate_id,' +
                            ' venue_id, referee_id, localteam_id, visitorteam_id, winner_team_id, weather_report, commentaries, attendance,\n' +
                            ' pitch, details, neutral_venue, winning_odds_calculated,  localteam_score, visitorteam_score, ft_score,' +
                            ' local_team, visitor_team, league)' +
                            ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, ' +
                            '$18, $19, $20, $21, $22, $23, $24, $25) on conflict (h2h_id) do nothing  RETURNING *', [resp.data.data[i].id,
                            resp.data.data[i].league_id, resp.data.data[i].season_id, resp.data.data[i].stage_id, resp.data.data[i].round_id,
                            resp.data.data[i].group_id, resp.data.data[i].aggregate_id,
                            resp.data.data[i].venue_id, resp.data.data[i].referee_id, resp.data.data[i].localteam_id, resp.data.data[i].visitorteam_id,
                            resp.data.data[i].winner_team_id,
                            resp.data.data[i].weather_report, resp.data.data[i].commentaries, resp.data.data[i].attendance,
                            resp.data.data[i].pitch, resp.data.data[i].details, resp.data.data[i].neutral_venue, resp.data.data[i].winning_odds_calculated, (_a = resp.data.data[i].scores) === null || _a === void 0 ? void 0 : _a.localteam_score, resp.data.data[i].scores.visitorteam_score, resp.data.data[i].scores.ft_score,
                            resp.data.data[i].localTeam.data, resp.data.data[i].visitorTeam.data, resp.data.data[i].league.data]);
                    }
                    page++;
                }
                else {
                    if (currentPageCount === null || currentPageCount === void 0 ? void 0 : currentPageCount.currentPageCount) {
                        currentPageCount.currentPageCount = page;
                        await this.h2hPageRepository.update(currentPageCount.id, currentPageCount);
                    }
                    else {
                        const newCount = await this.h2hPageRepository.create({ currentPageCount: page });
                        await this.h2hPageRepository.save(newCount);
                    }
                    clearInterval(interval);
                }
            }, async (error) => {
                if (currentPageCount === null || currentPageCount === void 0 ? void 0 : currentPageCount.currentPageCount) {
                    currentPageCount.currentPageCount = page;
                    await this.h2hPageRepository.update(currentPageCount.id, currentPageCount);
                }
                else {
                    const newCount = await this.h2hPageRepository.create({ currentPageCount: page });
                    await this.h2hPageRepository.save(newCount);
                }
                clearInterval(interval);
            });
        }, 1000);
        console.log('--- Synchronize H2H Complete ', new Date(), ' ---');
    }
};
H2hSynchronizerService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_2.InjectRepository)(h2h_current_page_count_entity_1.H2h_current_page_count)),
    __metadata("design:paramtypes", [axios_1.HttpService,
        typeorm_1.Connection,
        typeorm_1.Repository])
], H2hSynchronizerService);
exports.H2hSynchronizerService = H2hSynchronizerService;
//# sourceMappingURL=h2h.synchronizer.service.js.map