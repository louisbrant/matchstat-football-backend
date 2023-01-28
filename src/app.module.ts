import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TeamModule} from './modules/team.module';
import {LeagueModule} from './modules/league.module';
import {LeagueAndSeasonsModule} from './modules/leagueAndSeasons.module';
import {H2hModule} from './modules/h2h.module';
import {PlayerModule} from './modules/player.module';
import DatabaseConfig from './database/database.config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config';
import {ScheduleModule} from "@nestjs/schedule";
import {DatabaseCronModule} from "./cron/database-cron.module";
import {LiveEventModule} from "./modules/liveEvent.module";
import {SearchModule} from "./modules/search.module";
import {UpcomingMatchesModule} from "./modules/upcomingMatches.module";

@Module({
    imports: [
        TeamModule,
        LeagueModule,
        LeagueAndSeasonsModule,
        H2hModule,
        LiveEventModule,
        PlayerModule,
        DatabaseCronModule,
        UpcomingMatchesModule,
        SearchModule,
        TypeOrmModule.forRoot(DatabaseConfig),
        ConfigModule,
        ConfigModule.forRoot({
            envFilePath: ['.env'],
            isGlobal: true,
        }),
        ScheduleModule.forRoot(),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
