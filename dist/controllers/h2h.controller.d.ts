import { H2hService } from '../services/h2h.service';
import { H2hFixtureDto } from '../dto/h2h-fixture.dto';
export declare class H2hController {
    private readonly h2hService;
    constructor(h2hService: H2hService);
    generalInfo(body: H2hFixtureDto): import("rxjs").Observable<import("../interfaces/fixtures.interface").ReturnFixture[]>;
    getFixtures(): Promise<import("../entities/h2h.entity").H2h[]>;
    getH2hLeague(leagueId: any): Promise<import("../entities/h2h.entity").H2h[]>;
    getH2hTeams(teamId: any): Promise<import("../entities/h2h.entity").H2h[]>;
    h2hTeams(firstTeamId: number, secondTeamId: any): import("rxjs").Observable<{
        id: number;
        dateStart: string;
        stats: [];
        homeTeam: {
            id: number;
            logo_path: string;
            name: string;
            score: 1;
        };
        awayTeam: {
            id: number;
            logo_path: string;
            name: string;
            score: 4;
        };
        league: {
            id: number;
            logo_path: string;
        };
    }[]>;
    teamDataForComparision(teamId: number, seasonId: any): import("rxjs").Observable<any>;
    teamRecentlyPlayed(teamId: number, isHomeAwayForm: string): import("rxjs").Observable<{
        homeForm: any;
        awayForm: any;
        id?: undefined;
        latest?: undefined;
        logo_path?: undefined;
        name?: undefined;
        short_code?: undefined;
    } | {
        id: number;
        latest: {}[];
        logo_path: string;
        name: string;
        short_code: string;
        homeForm?: undefined;
        awayForm?: undefined;
    } | {
        homeForm?: undefined;
        awayForm?: undefined;
        id?: undefined;
        latest?: undefined;
        logo_path?: undefined;
        name?: undefined;
        short_code?: undefined;
    }>;
}
