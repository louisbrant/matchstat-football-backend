import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LeagueAndSeasonsController } from '../controllers/leagueAndSeasons.controller';
import { LeagueAndSeasonsService } from '../services/leagueAndSeasons.service';

@Module({
  imports: [HttpModule],
  controllers: [LeagueAndSeasonsController],
  providers: [LeagueAndSeasonsService],
})
export class LeagueAndSeasonsModule {}
