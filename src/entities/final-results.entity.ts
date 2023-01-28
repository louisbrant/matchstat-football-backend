import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { League } from './league.entity';
import { Season } from './season.entity';
import { Team } from './team.entity';

@Entity()
export class FinalResults {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Team)
  @JoinColumn()
  team: Team;

  @Column()
  winnerTeamId: number;

  @ManyToOne(() => Season)
  @JoinColumn()
  season: Season;

  @Column()
  seasonId: number;

  @ManyToOne(() => League)
  @JoinColumn()
  league: League;

  @Column()
  leagueId: number;
}
