import { LeagueAndSeasonsService } from '../services/leagueAndSeasons.service';
import { LeagueAndSeasonByTeamDto } from '../dto/leagueAndSeasonByTeam.dto';
export declare class LeagueAndSeasonsController {
    private readonly leagueAndSeasonsService;
    constructor(leagueAndSeasonsService: LeagueAndSeasonsService);
    leagueAndSeason(body: LeagueAndSeasonByTeamDto): import("rxjs").Observable<import("../interfaces/team.interface").ReturnLeagueAndSeasons[]>;
}
