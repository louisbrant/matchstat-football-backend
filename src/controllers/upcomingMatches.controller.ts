import { Body, Controller, HttpCode, HttpStatus, Post, Get, Param } from '@nestjs/common';
import { UpcomingMatchesService } from "../services/upcomingMatches.service";
import { UpcomingMatchesDto } from "../dto/upcoming-matches.dto";

@Controller('football/api/v1/matches')
export class UpcomingMatchesController {

    constructor(
        private readonly upcomingMatchesService: UpcomingMatchesService
    ) {
    }

    @Post('upcoming')
    @HttpCode(HttpStatus.OK)
    competitionStandings(@Body() body: UpcomingMatchesDto) {
        return this.upcomingMatchesService.upcomingMatches(body);
    }

}
