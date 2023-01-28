import { LiveEventService } from "../services/liveEvent.service";
import { FixtureIdsDto } from "../dto/Fixture-ids.dto";
export declare class LiveEventController {
    private readonly liveEventService;
    constructor(liveEventService: LiveEventService);
    getLiveEvents(): import("rxjs").Observable<{
        league: import("../interfaces/live-event.interface").League[];
    }[]>;
    getMatch(fixtureId: any): import("rxjs").Observable<{
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
    getFixtures(teamId: any): import("rxjs").Observable<{
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
    generalInfo(body: FixtureIdsDto): Promise<any[]>;
}
