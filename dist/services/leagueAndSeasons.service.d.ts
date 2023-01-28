import { HttpService } from '@nestjs/axios';
import { LeagueAndSeasonByTeamDto } from '../dto/leagueAndSeasonByTeam.dto';
import { ReturnLeagueAndSeasons } from '../interfaces/team.interface';
export declare class LeagueAndSeasonsService {
    private httpService;
    private readonly apiKey;
    private readonly apiUrl;
    constructor(httpService: HttpService);
    getLeagueAndSeasons({ teamId }: LeagueAndSeasonByTeamDto): import("rxjs").Observable<ReturnLeagueAndSeasons[]>;
    private returnLeagueAndSeason;
}
