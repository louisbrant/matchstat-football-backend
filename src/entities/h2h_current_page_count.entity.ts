import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class H2h_current_page_count {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  currentPageCount: number;
}