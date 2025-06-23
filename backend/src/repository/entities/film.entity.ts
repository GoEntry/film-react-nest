import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Schedule } from './schedule.entity';

@Entity('films')
export class Film {
  @PrimaryColumn()
  id: string;

  @Column('numeric')
  rating: number;

  @Column()
  director: string;

  @Column('varchar', { array: true })
  tags: string[];

  @Column()
  title: string;

  @Column('text')
  about: string;

  @Column('text')
  description: string;

  @Column()
  image: string;

  @Column()
  cover: string;

  @OneToMany(() => Schedule, (schedule) => schedule.film)
  schedule: Schedule[];
}
