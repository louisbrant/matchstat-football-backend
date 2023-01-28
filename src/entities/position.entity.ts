import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Position {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  sportMonksId: number;

  @Column()
  positionName: string;
}
