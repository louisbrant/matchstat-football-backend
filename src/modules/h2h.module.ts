import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { H2hController } from '../controllers/h2h.controller';
import { H2hService } from '../services/h2h.service';
import {ScheduleModule} from "@nestjs/schedule";
import { TypeOrmModule } from '@nestjs/typeorm';
import {H2h} from "../entities/h2h.entity";
import {SearchModule} from "./search.module";


@Module({
  imports: [HttpModule ,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([H2h]),
    SearchModule],
  controllers: [H2hController],
  providers: [H2hService],
})
export class H2hModule {}
