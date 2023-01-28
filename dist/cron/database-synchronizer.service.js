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
exports.DatabaseSynchronizerService = void 0;
const typeorm_1 = require("typeorm");
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let DatabaseSynchronizerService = class DatabaseSynchronizerService {
    constructor(httpService, connection) {
        this.httpService = httpService;
        this.connection = connection;
        this.apiKey = process.env.API_KEY;
        this.apiUrl = process.env.API_URL;
    }
    async parse() {
        console.log('--- Synchronize Start ', new Date(), ' ---');
        await this.synchronizeLeague().then(() => {
            console.log(new Date(), 'rating synchronize complete');
        });
        console.log('--- Synchronize Complete ', new Date(), ' ---');
    }
    async synchronizeLeague() {
        this.httpService.get(`${this.apiUrl}/leagues?api_token=${this.apiKey}`)
            .pipe((0, operators_1.map)(resp => resp.data));
        await this.connection.manager.query(`
        insert into public.player_atp (id, name, "countryAcronym")
        select distinct on (id_p_r) id_p_r, 'Unknown Player', 'N/A'
        from matchstatdb.ratings_atp
        where id_p_r not in (select id from public.player_atp);
        delete from public.rating_atp where extract(year from date) = extract(year from now());
        insert into public.rating_atp ("date", "point", "position", "playerId")
        select date_r, point_r, pos_r, id_p_r
        from matchstatdb.ratings_atp mr
            on conflict ("date", "playerId") do nothing;

        insert into public.player_wta (id, name, "countryAcronym")
        select distinct on (id_p_r) id_p_r, 'Unknown Player', 'N/A'
        from matchstatdb.ratings_wta
        where id_p_r not in (select id from public.player_wta);
        delete from public.rating_wta where extract(year from date) = extract(year from now());
        insert into public.rating_wta ("date", "point", "position", "playerId")
        select date_r, point_r, pos_r, id_p_r
        from matchstatdb.ratings_wta mr
            on conflict ("date", "playerId") do nothing;
    `);
    }
    async getLeagues(page) {
        await this.httpService.get(`${this.apiUrl}/leagues?api_token=${this.apiKey}&page=${page}&per_page=150`)
            .pipe((0, operators_1.map)(resp => resp.data))
            .toPromise();
    }
};
DatabaseSynchronizerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        typeorm_1.Connection])
], DatabaseSynchronizerService);
exports.DatabaseSynchronizerService = DatabaseSynchronizerService;
//# sourceMappingURL=database-synchronizer.service.js.map