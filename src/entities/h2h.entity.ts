import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
@Unique(["h2h_id"])
@Entity()
export class H2h {
    @PrimaryGeneratedColumn('increment')
    id: number;
    @Column()
    h2h_id: number;
    @Column()
    league_id: number;
    @Column()
    season_id: number;
    @Column()
    stage_id: number;
    @Column({ nullable: true })
    round_id: number;
    @Column({ nullable: true })
    group_id: number;
    @Column({ nullable: true })
    aggregate_id: number;
    @Column({ nullable: true })
    venue_id: number;
    @Column({ nullable: true })
    referee_id: number;
    @Column()
    localteam_id: number;
    @Column()
    visitorteam_id: number;
    @Column({ nullable: true })
    winner_team_id: number;
    @Column({ nullable: true })
    weather_report: string;
    @Column()
    commentaries: boolean;
    @Column({ nullable: true })
    attendance: string;
    @Column({ nullable: true })
    pitch: string;
    @Column({ nullable: true })
    details: string;
    @Column()
    neutral_venue: boolean;
    @Column()
    winning_odds_calculated: boolean;
    @Column({ nullable: true })
    localteam_score: number;
    @Column({ nullable: true })
    visitorteam_score: number;
    @Column({ nullable: true })
    ft_score: string;
    @Column('json')
    local_team: object;
    @Column('json')
    visitor_team: object;
    @Column('json')
    league: object;
}