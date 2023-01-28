import { HttpService } from '@nestjs/axios';
import { League } from "../interfaces/live-event.interface";
export declare class LiveEventService {
    private httpService;
    private readonly apiKey;
    private readonly apiUrl;
    constructor(httpService: HttpService);
    getLiveEvents(): import("rxjs").Observable<{
        league: League[];
    }[]>;
    getLineUps(fixtureIds: any): Promise<any[]>;
    getMatch(fixtureId: number): import("rxjs").Observable<{
        stats: {
            stats: [];
        };
        events: {
            events: [];
        };
        lineup: {
            lineup: [];
        };
        bench: {
            bench: [];
        };
        localTeam: {
            localTeam: [];
        };
        visitorTeam: {
            visitorTeam: [];
        };
        formations: {
            localteam_formation: string;
            visitorteam_formation: string;
        };
        matchEnd: string;
        referee: {
            referee: [];
        };
        league: {
            league: [];
        };
        venue: {
            venue: [];
        };
        time: {
            status: string;
            starting_at: {
                date_time: string;
                date: string;
                time: string;
                timestamp: number;
                timezone: string;
            };
            minute: number;
            second: null;
            added_time: null;
            extra_minute: null;
            injury_time: null;
        };
        weather: {
            code: string;
            type: string;
            icon: string;
            temperature: {
                temp: number;
                unit: string;
            };
            temperature_celcius: {
                temp: number;
                unit: string;
            };
            clouds: string;
            humidity: string;
            pressure: number;
            wind: {
                speed: string;
                degree: number;
            };
            coordinates: {
                lat: number;
                lon: number;
            };
        };
    }>;
    getFixtures(teamId: number): import("rxjs").Observable<{
        stats: {
            stats: [];
        };
        events: {
            events: [];
        };
        lineup: {
            lineup: [];
        };
        bench: {
            bench: [];
        };
        localTeam: {
            localTeam: [];
        };
        visitorTeam: {
            visitorTeam: [];
        };
        formations: {
            localteam_formation: string;
            visitorteam_formation: string;
        };
        matchEnd: string;
        referee: {
            referee: [];
        };
        league: {
            league: [];
        };
        venue: {
            venue: [];
        };
        time: {
            status: string;
            starting_at: {
                date_time: string;
                date: string;
                time: string;
                timestamp: number;
                timezone: string;
            };
            minute: number;
            second: null;
            added_time: null;
            extra_minute: null;
            injury_time: null;
        };
        weather: {
            code: string;
            type: string;
            icon: string;
            temperature: {
                temp: number;
                unit: string;
            };
            temperature_celcius: {
                temp: number;
                unit: string;
            };
            clouds: string;
            humidity: string;
            pressure: number;
            wind: {
                speed: string;
                degree: number;
            };
            coordinates: {
                lat: number;
                lon: number;
            };
        };
    }[]>;
    private convertToMatchLiveFixturesInterface;
    private convertToMatchFixturesInterface;
    private convertToH2hFixturesInterface;
}
