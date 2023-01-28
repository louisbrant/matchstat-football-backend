import { League } from './league.entity';
import { Season } from './season.entity';
import { Team } from './team.entity';
export declare class FinalResults {
    id: number;
    team: Team;
    winnerTeamId: number;
    season: Season;
    seasonId: number;
    league: League;
    leagueId: number;
}
