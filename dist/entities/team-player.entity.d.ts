import { Team } from './team.entity';
import { Position } from './position.entity';
export declare class TeamPlayer {
    id: number;
    sportMonksId: number;
    team: Team;
    teamId: number;
    position: Position;
    positionId: number;
    firstName: string;
    secondName: string;
    fullName: string;
    shirtNumber: string;
    birthdate: number;
    birthcountry: number;
    birthplace: number;
    height: number;
    weight: number;
    goals: number;
}
