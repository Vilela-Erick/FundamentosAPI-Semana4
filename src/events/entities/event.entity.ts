import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Organizer } from '../../organizers/entities/organizer.entity.js';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  location: string;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', nullable: true })
  organizerId: number | null;

  @ManyToOne(() => Organizer, (organizer) => organizer.events, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'organizerId' })
  organizer: Organizer | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
