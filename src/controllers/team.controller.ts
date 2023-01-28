import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { TeamService } from '../services/team.service';
import { MatchStatisticsDto } from '../dto/match-statistics.dto';
import { UpcomingMatchDto } from '../dto/upcoming-match.dto';
import { FixturesDto } from '../dto/fixtures.dto';
import { PerdormanceDto } from '../dto/perdormance.dto';
import { GoalByMinutesDto } from '../dto/goal-by-minutes.dto';
import { GoalsProbabilitiesDto } from '../dto/goals-probabilities.dto';
import { CompitationStandingDto } from '../dto/compitation-standing.dto';
import { SearchDto } from '../dto/search.dto';
import { GeneralInfoTeamDto } from '../dto/general-info-team.dto';
import { PlayersDto } from '../dto/players.dto';
import { SecondaryInfoTeamDto } from '../dto/secondary-info-team.dto';
import { LastFixturesDto } from '../dto/last-fixtures.dto';
import {LeaguePlayersDto} from "../dto/league-players.dto";

@Controller('football/api/v1/teams')
export class TeamController {

  constructor(
    private readonly teamService: TeamService
  ) {}

  @Post('profile/generalInfo')
  @HttpCode(HttpStatus.OK)
  generalInfo(@Body() body: GeneralInfoTeamDto) {
    return this.teamService.generalInfo(body)
  }

  @Post('profile/secondaryInfo')
  @HttpCode(HttpStatus.OK)
  secondaryInfo(@Body() body: SecondaryInfoTeamDto) {
    return this.teamService.secondaryInfo(body);
  }
  //
  // @Post('lastFixtures')
  // @HttpCode(HttpStatus.OK)
  // lastFixtures(@Body() body: LastFixturesDto) {
  //   return this.teamService.lastFixtures(body)
  // }

  @Post('fixtures')
  @HttpCode(HttpStatus.OK)
  fixtures(@Body() body: FixturesDto) {
    return this.teamService.fixtures(body)
  }

  @Post('upcomingMatch')
  @HttpCode(HttpStatus.OK)
  upcomingMatch(@Body() body: UpcomingMatchDto) {
    return this.teamService.upcomingMatch(body);
  }

  @Post('matchStatistics')
  @HttpCode(HttpStatus.OK)
  matchStatistics(@Body() body: MatchStatisticsDto) {
    return this.teamService.matchStatistics(body)
  }

  @Post('performance')
  @HttpCode(HttpStatus.OK)
  performance(@Body() body: PerdormanceDto) {
    return this.teamService.performance(body)
  }

  @Post('goals/byMinutes')
  @HttpCode(HttpStatus.OK)
  goalsByMinutes(@Body() body: GoalByMinutesDto) {
    return this.teamService.goalsByMinutes(body)
  }

  @Post('goals/probabilities')
  @HttpCode(HttpStatus.OK)
  goalsProbabilities(@Body() body: GoalsProbabilitiesDto) {
    return this.teamService.goalsProbabilities(body)
  }

  @Post('player/stats')
  @HttpCode(HttpStatus.OK)
  playerStats(@Body() body: PlayersDto) {
    return this.teamService.playerStats(body)
  }

  @Post('player/leagueStats')
  @HttpCode(HttpStatus.OK)
  playerStatsLeague(@Body() body: LeaguePlayersDto) {
    return this.teamService.playerStatsLeague(body)
  }

  @Post('competitionStandings')
  @HttpCode(HttpStatus.OK)
  competitionStandings(@Body() body: CompitationStandingDto) {
    return this.teamService.competitionStandings(body)
  }

  @Post('search')
  @HttpCode(HttpStatus.OK)
  search(@Body() body: SearchDto) {
    return this.teamService.search(body)
  }
}
