import {Body, Controller, HttpCode, HttpStatus, Post, Get, Param} from '@nestjs/common';
import {LiveEventService} from "../services/liveEvent.service";
import {FixtureIdsDto} from "../dto/Fixture-ids.dto";

@Controller('football/api/v1/liveEvent')
export class LiveEventController {

    constructor(
        private readonly liveEventService: LiveEventService
    ) {
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    getLiveEvents() {
        return this.liveEventService.getLiveEvents();
    }

    @Get("/match/:fixtureId")
    @HttpCode(HttpStatus.OK)
    getMatch(@Param('fixtureId') fixtureId){
        return this.liveEventService.getMatch(fixtureId);
    }

    @Get("/getFixtures/:teamId")
    @HttpCode(HttpStatus.OK)
    getFixtures(@Param('teamId') teamId){
        return this.liveEventService.getFixtures(teamId);
    }

    @Post('lineUps')
    @HttpCode(HttpStatus.OK)
    generalInfo(
        @Body() body: FixtureIdsDto
    ) {
        return this.liveEventService.getLineUps(body)
    }
}
