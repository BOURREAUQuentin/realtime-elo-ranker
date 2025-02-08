import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class PlayerEntity {
  @PrimaryGeneratedColumn()
  playerId: number;

  @Column()
  id: string;

  @Column()
  rank: number;
}