import { GeneralInfoDto } from '../dto/general-info.dto';
import { LeagueService } from '../services/league.service';
import { LeagueOverallStatsDto } from '../dto/league-overall-stats.dto';
import { LeagueFixtureDto } from '../dto/league-fixture.dto';
import { LeagueDetailStatsDto } from '../dto/league-detail-stats.dto';
import { LeagueGeneralStatsDto } from '../dto/league-general-stats.dto';
import { SearchDto } from '../dto/search.dto';
import { SeasonsOfLeagueDto } from '../dto/seasons-of-league.dto';
import { LeagueSeasonDto } from "../dto/leagueSeason.dto";
import { LeagueSeasonDatesDto } from "../dto/league-season-dates.dto";
import { LeagueSeasonsDto } from "../dto/league-seasons.dto";
export declare class LeagueController {
    private readonly leagueService;
    constructor(leagueService: LeagueService);
    generalInfo(body: GeneralInfoDto): import("rxjs").Observable<any>;
    overallStats(body: LeagueOverallStatsDto): import("rxjs").Observable<{}>;
    fixtures(body: LeagueFixtureDto): Promise<unknown>;
    detailStats(body: LeagueDetailStatsDto): import("rxjs").Observable<import("../interfaces/stats.interface").ReturnDetailStats[]>;
    generalStats(body: LeagueGeneralStatsDto): import("rxjs").Observable<import("../interfaces/stats.interface").ReturnGeneralStats[]>;
    search(body: SearchDto): import("rxjs").Observable<import("../interfaces/league.interface").ReturnLeagueSearch>;
    getLeagueSeasons(body: LeagueSeasonDto): import("rxjs").Observable<any>;
    seasonsOfLeague(body: SeasonsOfLeagueDto): import("rxjs").Observable<import("../interfaces/season.interface").SeasonOfLeague[]>;
    pastChampions(body: LeagueSeasonsDto[]): Promise<any[]>;
    leagueSeasonDates(body: LeagueSeasonDatesDto): import("rxjs").Observable<import("../interfaces/SeasonsDateAndSatesOfLeague").SeasonsDateAndSatesOfLeague>;
}
