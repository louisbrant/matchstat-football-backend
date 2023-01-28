import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from '@nestjs/typeorm';
import { H2h } from "../entities/h2h.entity";
import { SearchModule } from "./search.module";
import { UpcomingMatchesController } from "../controllers/upcomingMatches.controller";
import { UpcomingMatchesService } from "../services/upcomingMatches.service";


@Module({
  imports: [HttpModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([H2h]),
    SearchModule],
  controllers: [UpcomingMatchesController],
  providers: [UpcomingMatchesService],
})
export class UpcomingMatchesModule { }
