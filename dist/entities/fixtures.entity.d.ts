import { Team } from './team.entity';
import { League } from './league.entity';
import { Season } from './season.entity';
export declare class Fixtures {
    id: number;
    sportMonksId: number;
    localTeam: Team;
    localTeamId: number;
    visitorTeam: Team;
    visitorTeamId: number;
    dateTimeStart: Date;
    league: League;
    leagueId: number;
    season: Season;
    seasonId: number;
    localteam_score: number;
    visitorteam_score: number;
    city: number;
}
