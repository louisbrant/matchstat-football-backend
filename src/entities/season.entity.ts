import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { League } from './league.entity';

@Entity()
export class Season {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  sportMonksId: number;

  @Column()
  name: string;

  @ManyToOne(() => League)
  @JoinColumn()
  league: League;

  @Column()
  leagueId: number;

  @Column()
  is_current_season: boolean;

  @Column()
  startDate	: Date;

  @Column()
  endDate	: Date;
}
