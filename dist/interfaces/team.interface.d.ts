import { LeagueData } from './league.interface';
import { Squad, TeamStatData } from './stats.interface';
import { CoachData } from './coach.interface';
import { Country } from './country.interface';
import { VenueData } from './venue.interface';
import { Rivals } from './rival.interface';
import { Trophies } from './trophy.interface';
import { FixturesData } from './fixtures.interface';
import { Player } from './player.interface';
export interface Team {
    id: number;
    logo_path: string;
    name: string;
    score?: number;
    league?: LeagueData;
    current_season_id?: number;
    stats?: TeamStatData;
    squad?: {
        data: Squad[];
    };
    coach?: CoachData;
    country?: Country;
    venue?: VenueData;
    rivals?: Rivals;
    trophies?: Trophies;
    latest?: FixturesData;
}
export interface TeamData {
    data: Team;
}
export interface ReturnTeam {
    id: number;
    logo_path: string;
    name: string;
    odd?: string;
}
export interface Scores {
    localteam_score: 1;
    visitorteam_score: 4;
}
export interface Time {
    starting_at: {
        date: string;
        time: string;
        timestamp: number;
        date_time: string;
    };
}
export interface ReturnSearchTeam {
    id: number;
    leagueId: number;
    seasonId: number;
    name: string;
}
export interface SearchTeamData {
    data: SearchTeam[];
}
export interface SearchTeam {
    current_season_id: number;
    founded: number;
    id: number;
    league: LeagueData;
    name: string;
    odd?: string;
}
export interface LeagueAndSeasonsData {
    data: LeagueAndSeasons[];
}
export interface LeagueAndSeasons {
    current_round_id: number;
    current_stage_id: number;
    id: number;
    is_current_season: boolean;
    league: LeagueData;
    league_id: number;
    name: string;
}
export interface ReturnLeagueAndSeasons {
    leagueId: number;
    leagueName: string;
    type: string;
    seasons: {
        seasonId: number;
        seasonName: string;
    }[];
}
export interface GeneralInfo {
    data: Team[];
}
export interface SecondaryInfo {
    data: {
        league: {};
        name: string;
        current_season_id: number;
        id: number;
        stats: {};
        goalscorers: {
            data: {
                goals: number;
                penalty_goals: number;
                player: {
                    data: Player;
                };
                player_id: number;
                position: number;
                season_id: number;
                stage_id: number;
                team_id: number;
                type: string;
                team: {
                    data: {
                        id: number;
                        legacy_id: number;
                        name: string;
                        short_code: string;
                        twitter: string;
                        country_id: number;
                        national_team: boolean;
                        founded: number;
                        logo_path: string;
                        venue_id: number;
                        current_season_id: number;
                        is_placeholder: boolean;
                    };
                };
            }[];
        };
    };
}
export interface ReturnSecondaryInfo {
    id: number;
    name: string;
    topScorer: {
        id: number;
        fullName: string;
        goals: number;
    };
}
export interface ReturnLastFixtures {
    homeForm: string;
    awayForm: string;
}
export interface ReturnGeneralInfo {
    id: number;
    name: string;
    venue: {
        name: string;
        photo: string;
        capacity: number;
        city: string;
        country: string;
    };
    coach: {
        id: number;
        lastName: string;
    };
    trophies: {
        league_id: number;
        league_name: string;
        count: number;
    }[];
    rivals: {
        id: number;
        name: string;
    }[];
}
