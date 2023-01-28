import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class League {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  sportMonksId: number;

  @Column()
  active: boolean;

  @Column()
  type: string;

  @Column()
  name: string;

  @Column()
  is_cup: boolean;
}
