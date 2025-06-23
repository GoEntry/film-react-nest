import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Film } from './film.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryColumn()
  id: string;

  @Column()
  daytime: string;

  @Column()
  hall: string;

  @Column('int')
  rows: number;

  @Column('int')
  seats: number;

  @Column('numeric')
  price: number;

  @Column('varchar', { array: true, default: [] })
  taken: string[];

  @Column()
  film_id: string;

  @ManyToOne(() => Film, (film) => film.schedule)
  @JoinColumn({ name: 'film_id' })
  film: Film;
}
