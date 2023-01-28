import {Body, Controller, HttpCode, HttpStatus, Post, Get, Param} from '@nestjs/common';
import {H2hService} from '../services/h2h.service';
import {H2hFixtureDto} from '../dto/h2h-fixture.dto';

@Controller('football/api/v1/h2h')
export class H2hController {

    constructor(
        private readonly h2hService: H2hService
    ) {
    }

    @Post('fixtures')
    @HttpCode(HttpStatus.OK)
    generalInfo(
        @Body() body: H2hFixtureDto
    ) {
        return this.h2hService.fixtures(body)
    }

    @Get('fixtures')
    @HttpCode(HttpStatus.OK)
    getFixtures() {
        return this.h2hService.getFixturesH2hInteresting();
    }

    @Get('/:leagueId')
    getH2hLeague(@Param('leagueId') leagueId) {
        return this.h2hService.getH2hInterestingLeague(leagueId);
    }


    @Get('fixtures/:teamId')
    getH2hTeams(@Param('teamId') teamId) {
        return this.h2hService.getH2hInterestingTeams(teamId);
    }

    @Get('teams/:firstTeamId/:secondTeamId')
    h2hTeams(@Param('firstTeamId') firstTeamId: number, @Param('secondTeamId') secondTeamId ) {
        return this.h2hService.h2hTeams(firstTeamId, secondTeamId);
    }

    @Get('/team/comparision/:teamId/:seasonId')
    teamDataForComparision(@Param('teamId') teamId: number, @Param('seasonId') seasonId ) {
        return this.h2hService.teamDataForComparision(teamId, seasonId);
    }

    @Get('recently/:teamId/:isHomeAwayForm')
    teamRecentlyPlayed(@Param('teamId') teamId: number, @Param('isHomeAwayForm') isHomeAwayForm: string) {
        return this.h2hService.teamRecentlyPlayed(teamId, isHomeAwayForm);
    }
}
