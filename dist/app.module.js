"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const team_module_1 = require("./modules/team.module");
const league_module_1 = require("./modules/league.module");
const leagueAndSeasons_module_1 = require("./modules/leagueAndSeasons.module");
const h2h_module_1 = require("./modules/h2h.module");
const player_module_1 = require("./modules/player.module");
const database_config_1 = require("./database/database.config");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const database_cron_module_1 = require("./cron/database-cron.module");
const liveEvent_module_1 = require("./modules/liveEvent.module");
const search_module_1 = require("./modules/search.module");
const upcomingMatches_module_1 = require("./modules/upcomingMatches.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            team_module_1.TeamModule,
            league_module_1.LeagueModule,
            leagueAndSeasons_module_1.LeagueAndSeasonsModule,
            h2h_module_1.H2hModule,
            liveEvent_module_1.LiveEventModule,
            player_module_1.PlayerModule,
            database_cron_module_1.DatabaseCronModule,
            upcomingMatches_module_1.UpcomingMatchesModule,
            search_module_1.SearchModule,
            typeorm_1.TypeOrmModule.forRoot(database_config_1.default),
            config_1.ConfigModule,
            config_1.ConfigModule.forRoot({
                envFilePath: ['.env'],
                isGlobal: true,
            }),
            schedule_1.ScheduleModule.forRoot(),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map