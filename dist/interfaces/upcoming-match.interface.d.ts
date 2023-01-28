import { LeagueData, ReturnLeague } from './league.interface';
import { ReturnTeam, Team, TeamData, Time } from './team.interface';
import { VenueData } from './venue.interface';
export interface UpcomingMatch {
    id: number;
    league: LeagueData;
    localTeam: TeamData;
    time: Time;
    venue: VenueData;
    visitorTeam: TeamData;
    odds: {
        data: {};
    };
}
export interface UpcomingMatchData {
    data: UpcomingMatch[];
}
export interface TeamUpcomingMatch extends Team {
    upcoming: UpcomingMatchData;
}
export interface TeamUpcomingMatchData extends Team {
    data: TeamUpcomingMatch[];
}
export interface ReturnUpcoming {
    id: number;
    firstTeam: ReturnTeam;
    secondTeam: ReturnTeam;
    date: string;
    time: string;
    league: ReturnLeague;
    city: string;
}
