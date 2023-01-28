import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseSynchronizerService } from './database-synchronizer.service';
import {ScheduleModule} from "@nestjs/schedule";
import {H2hSynchronizerService} from "./h2h.synchronizer.service";
import {HttpModule} from "@nestjs/axios";
import { H2h_current_page_count } from '../entities/h2h_current_page_count.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    ScheduleModule.forRoot(),
    HttpModule,
    TypeOrmModule.forFeature([H2h_current_page_count])
  ],
  providers: [DatabaseSynchronizerService,
    H2hSynchronizerService],
})
export class DatabaseCronModule {}
