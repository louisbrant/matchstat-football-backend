import { Team, TeamData } from './team.interface';
import { Squad } from './stats.interface';
import { Country } from './country.interface';
export interface ReturnPlayer {
    id: number;
    number: number;
    fullName: string;
    image_path: string;
    position: string;
    gamesPlayed: number;
    goals: number;
    assists: number;
    cards: number;
    timePlayed: number;
    rating: string;
}
export interface Player {
    birthcountry: string;
    birthdate: string;
    birthplace: string;
    common_name: string;
    country_id: number;
    display_name: string;
    firstname: string;
    fullname: string;
    height: string;
    image_path: string;
    lastname: string;
    nationality: string;
    player_id: number;
    position_id: number;
    team_id: number;
    weight: string;
    team?: {
        data: Team;
    };
}
export interface PlayerByIdData {
    data: PlayerTeam;
}
export interface PlayerTeamData {
    data: PlayerTeam[];
}
export interface PlayerTeam extends PlayerStats {
    team: TeamData;
    country: Country;
}
export interface ReturnGeneralInfo {
    id: number;
    fullName: string;
    image_path: string;
    birthdate: string;
    age: number;
    birthplace: {
        country: string;
        flag_image_path: string;
        city: string;
    };
    position: string;
    team: Team;
    leagueName: string;
    rating: string;
    weight: string;
    height: string;
    number: number;
    leagueId: number;
    seasonId: number;
}
export interface PlayerStatsData {
    data: PlayerStats;
}
export interface PlayerStats extends Player {
    position: {
        data: {
            id: number;
            name: string;
        };
    };
    stats: {
        data: Squad[];
    };
    team: TeamData;
}
export interface ReturnPlayerStats {
    id: number;
    position: number;
    shirtNumber: number;
    statistics: {
        captain: boolean;
        injured: boolean;
        minutesPlayed: number;
        appearences: number;
        lineups: number;
        subbedIn: number;
        subbedOut: number;
        goals: number;
        ownGoals: number;
        assists: number;
        saves: number;
        insideBoxSaves: number;
        dispossessed: number;
        interceptions: number;
        yellowCards: number;
        yellowRed: number;
        directRedCards: number;
        tackles: number;
        blocks: number;
        hitPost: number;
        cleanSheets: number;
        rating: string;
        fouls: {
            committed: number;
            drawn: number;
        };
        crosses: {
            total: number;
            accurate: number;
        };
        dribble: {
            attempts: number;
            success: number;
            past: number;
        };
        duels: {
            total: number;
            won: number;
        };
        passes: {
            total: number;
            accuracy: number;
            key: number;
        };
        penalties: {
            won: number;
            scored: number;
            missed: number;
            committed: number;
            saves: number;
        };
        shots: {
            total: number;
            onTarget: number;
            offTarget: number;
        };
    };
}
