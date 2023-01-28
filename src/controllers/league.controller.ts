import {Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common';
import {GeneralInfoDto} from '../dto/general-info.dto';
import {LeagueService} from '../services/league.service';
import {LeagueOverallStatsDto} from '../dto/league-overall-stats.dto';
import {LeagueFixtureDto} from '../dto/league-fixture.dto';
import {LeagueDetailStatsDto} from '../dto/league-detail-stats.dto';
import {LeagueGeneralStatsDto} from '../dto/league-general-stats.dto';
import {SearchDto} from '../dto/search.dto';
import {LeagueAndSeasonByTeamDto} from '../dto/leagueAndSeasonByTeam.dto';
import {SeasonsOfLeagueDto} from '../dto/seasons-of-league.dto';
import {LeagueSeasonDto} from "../dto/leagueSeason.dto";
import {LeagueSeasonDatesDto} from "../dto/league-season-dates.dto";
import {LeagueSeasonsDto} from "../dto/league-seasons.dto";

@Controller('football/api/v1/league')
export class LeagueController {

    constructor(
        private readonly leagueService: LeagueService
    ) {
    }

    @Post('generalInfo')
    @HttpCode(HttpStatus.OK)
    generalInfo(
        @Body() body: GeneralInfoDto
    ) {
        return this.leagueService.generalInfo(body)
    }

    @Post('overallStats')
    @HttpCode(HttpStatus.OK)
    overallStats(
        @Body() body: LeagueOverallStatsDto
    ) {
        return this.leagueService.overallStats(body)
    }

    @Post('fixtures')
    @HttpCode(HttpStatus.OK)
    fixtures(
        @Body() body: LeagueFixtureDto
    ) {
        return this.leagueService.fixtures(body)
    }

    @Post('detailStats')
    @HttpCode(HttpStatus.OK)
    detailStats(
        @Body() body: LeagueDetailStatsDto
    ) {
        return this.leagueService.detailStats(body)
    }

    @Post('generalStats')
    @HttpCode(HttpStatus.OK)
    generalStats(
        @Body() body: LeagueGeneralStatsDto
    ) {
        return this.leagueService.generalStats(body)
    }

    // @Post('player/stats')
    // @HttpCode(HttpStatus.OK)
    // playerStats(@Body() body: PlayersLeagueDto) {
    //   return this.leagueService.playerStats(body)
    // }

    @Post('search')
    @HttpCode(HttpStatus.OK)
    search(
        @Body() body: SearchDto
    ) {
        return this.leagueService.search(body)
    }

    @Post('getLeagueSeasons')
    @HttpCode(HttpStatus.OK)
    getLeagueSeasons(
        @Body() body: LeagueSeasonDto
    ) {
        return this.leagueService.getLeagueSeasons(body)
    }

    @Post('seasons')
    @HttpCode(HttpStatus.OK)
    seasonsOfLeague(@Body() body: SeasonsOfLeagueDto) {
        return this.leagueService.seasonsOfLeague(body)
    }

    @Post('pastChampions')
    @HttpCode(HttpStatus.OK)
    pastChampions(@Body() body: LeagueSeasonsDto[]) {
        return this.leagueService.pastChampions(body)
    }

    @Post('seasonDates')
    @HttpCode(HttpStatus.OK)
    leagueSeasonDates(@Body() body: LeagueSeasonDatesDto) {
        return this.leagueService.leagueSeasonDates(body)
    }


}
