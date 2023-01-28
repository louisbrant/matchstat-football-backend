export interface EventInterface {
    id: number;
    league_id: number;
    season_id: number;
    stage_id: number;
    round_id: number;
    group_id: null;
    aggregate_id: null;
    venue_id: number;
    referee_id: null;
    localteam_id: number;
    visitorteam_id: number;
    winner_team_id: number;
    weather_report: {};
    commentaries: boolean;
    attendance: null;
    pitch: null;
    details: null;
    neutral_venue: boolean;
    winning_odds_calculated: boolean;
    formations: {};
    scores: {};
    time: {};
    coaches: {};
    standings: {};
    assistants: {};
    leg: string;
    colors: {};
    deleted: boolean;
    is_placeholder: boolean;
    league: {
        data: League[];
    };
    stats: {
        data: [];
    };
    events: {
        data: [];
    };
    localTeam: {
        data: [];
    };
    visitorTeam: {
        data: [];
    };
}
export interface League {
    active: boolean;
    country: {};
    country_id: number;
    coverage: {};
    current_round_id: number;
    current_season_id: number;
    current_stage_id: number;
    id: number;
    is_cup: boolean;
    is_friendly: boolean;
    legacy_id: null;
    live_standings: boolean;
    logo_path: string;
    name: string;
    type: string;
}
export interface LiveEventInterface {
    data: EventInterface[];
}
export interface MatchInterface {
    stats: {
        data: {
            stats: [];
        };
    };
    events: {
        data: {
            events: [];
        };
    };
    lineup: {
        data: {
            lineup: [];
        };
    };
    bench: {
        data: {
            bench: [];
        };
    };
    localTeam: {
        data: {
            localTeam: [];
        };
    };
    visitorTeam: {
        data: {
            visitorTeam: [];
        };
    };
    formations: {
        localteam_formation: string;
        visitorteam_formation: string;
    };
    scores: {
        ft_score: string;
    };
    referee: {
        data: {
            referee: [];
        };
    };
    league: {
        data: {
            league: [];
        };
    };
    venue: {
        data: {
            venue: [];
        };
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
    weather_report: {
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
}
