import { UpcomingMatchesService } from "../services/upcomingMatches.service";
import { UpcomingMatchesDto } from "../dto/upcoming-matches.dto";
export declare class UpcomingMatchesController {
    private readonly upcomingMatchesService;
    constructor(upcomingMatchesService: UpcomingMatchesService);
    competitionStandings(body: UpcomingMatchesDto): import("rxjs").Observable<any>;
}
