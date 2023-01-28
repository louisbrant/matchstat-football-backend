import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LeagueAndSeasonsService } from '../services/leagueAndSeasons.service';
import { LeagueAndSeasonByTeamDto } from '../dto/leagueAndSeasonByTeam.dto';

@Controller('football/api/v1/leagueAndSeasons')
export class LeagueAndSeasonsController {

  constructor(
    private readonly leagueAndSeasonsService: LeagueAndSeasonsService
  ){}

  @Post('')
  @HttpCode(HttpStatus.OK)
  leagueAndSeason(@Body() body: LeagueAndSeasonByTeamDto) {
    return this.leagueAndSeasonsService.getLeagueAndSeasons(body)
  }
}
