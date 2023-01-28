import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Season } from './season.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  sportMonksId: number;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column()
  logo_path: string;

  @ManyToOne(() => Season)
  @JoinColumn()
  season: Season;

  @Column()
  current_season_id	: number;
}
