import { League } from './league.entity';
export declare class Season {
    id: number;
    sportMonksId: number;
    name: string;
    league: League;
    leagueId: number;
    is_current_season: boolean;
    startDate: Date;
    endDate: Date;
}
