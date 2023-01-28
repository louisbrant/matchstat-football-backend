import { HttpService } from '@nestjs/axios';
import { H2hFixtureDto } from '../dto/h2h-fixture.dto';
import { FixturesData, ReturnFixture, TeamRecentlyInterface } from '../interfaces/fixtures.interface';
import { H2h } from "../entities/h2h.entity";
import { Repository } from "typeorm";
export declare class H2hService {
    private httpService;
    private h2hRepository;
    private readonly apiKey;
    private readonly apiUrl;
    constructor(httpService: HttpService, h2hRepository: Repository<H2h>);
    fixtures({ count, page, firstTeamId, secondTeamId }: H2hFixtureDto): import("rxjs").Observable<ReturnFixture[]>;
    private convertToH2hFixturesInterface;
    getFixturesH2hInteresting(): Promise<H2h[]>;
    getH2hInterestingLeague(leagueId: any): Promise<H2h[]>;
    getH2hInterestingTeams(teamId: any): Promise<H2h[]>;
    h2hTeams(firstTeamId: number, secondTeamId: number): import("rxjs").Observable<{
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
    teamDataForComparision(teamId: number, seasonId: number): import("rxjs").Observable<any>;
    convertToTeamData(data: any): any;
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
    convertToTeamRecently(data: TeamRecentlyInterface, isHomeAwayForm: boolean): {
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
    };
    private lastTeamForm;
    convertToH2hTeamsInterface(data: FixturesData): {
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
    }[];
}
