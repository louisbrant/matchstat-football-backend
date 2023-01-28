import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Team } from './team.entity';
import { League } from './league.entity';
import { Season } from './season.entity';

@Entity()
export class Fixtures {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  sportMonksId: number;

  @ManyToOne(() => Team)
  @JoinColumn()
  localTeam: Team;

  @Column()
  localTeamId: number;

  @ManyToOne(() => Team)
  @JoinColumn()
  visitorTeam: Team;

  @Column()
  visitorTeamId: number;

  @Column()
  dateTimeStart: Date;

  @ManyToOne(() => League)
  @JoinColumn()
  league: League;

  @Column()
  leagueId: number;

  @ManyToOne(() => Season)
  @JoinColumn()
  season: Season;

  @Column()
  seasonId: number;

  @Column()
  localteam_score: number;

  @Column()
  visitorteam_score: number;

  @Column()
  city: number;
}
