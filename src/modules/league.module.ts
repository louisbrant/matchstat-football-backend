import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LeagueController } from '../controllers/league.controller';
import { LeagueService } from '../services/league.service';

@Module({
  imports: [
    HttpModule,
  ],
  controllers: [LeagueController],
  providers: [LeagueService],
})
export class LeagueModule {}
