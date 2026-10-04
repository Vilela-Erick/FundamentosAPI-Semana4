import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

import type { Relation } from 'typeorm';

import { Event } from '../../events/entities/event.entity.js';
import { Attendee } from '../../attendees/entities/attendee.entity.js';

@Entity('registrations')
@Unique(['eventId', 'attendeeId'])
export class Registration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  eventId: number;

  @Column()
  attendeeId: number;

  @Column({ default: 'registered' })
  status: string;

  @CreateDateColumn()
  registrationDate: Date;

  @ManyToOne(() => Event, (event) => event.registrations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'eventId' })
  event: Relation<Event>;

  @ManyToOne(() => Attendee, (attendee) => attendee.registrations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attendeeId' })
  attendee: Relation<Attendee>;
}
