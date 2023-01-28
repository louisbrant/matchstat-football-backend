import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Team } from './team.entity';
import { Position } from './position.entity';

@Entity()
export class TeamPlayer {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  sportMonksId: number;

  @ManyToOne(() => Team)
  @JoinColumn()
  team: Team;

  @Column()
  teamId: number;

  @ManyToOne(() => Position)
  @JoinColumn()
  position: Position;

  @Column()
  positionId: number;

  @Column()
  firstName: string;

  @Column()
  secondName: string;

  @Column()
  fullName: string;

  @Column()
  shirtNumber: string;

  @Column()
  birthdate: number;

  @Column()
  birthcountry: number;

  @Column()
  birthplace: number;

  @Column()
  height: number;

  @Column()
  weight: number;

  @Column()
  goals	: number;
}
