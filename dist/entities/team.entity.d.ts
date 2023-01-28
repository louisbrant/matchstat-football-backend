import { Season } from './season.entity';
export declare class Team {
    id: number;
    sportMonksId: number;
    name: string;
    country: string;
    logo_path: string;
    season: Season;
    current_season_id: number;
}
