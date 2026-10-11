import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';

import { Organizer } from '../organizers/entities/organizer.entity.js';
import { Event } from '../events/entities/event.entity.js';
import { Attendee } from '../attendees/entities/attendee.entity.js';
import { Registration } from '../registrations/entities/registration.entity.js';
import { User } from '../users/entities/user.entity.js';
import { InitialSchema1710000001000 } from './migrations/1710000001000-InitialSchema.js';
import { CreateUsersTable1710000002000 } from './migrations/1710000002000-CreateUsersTable.js';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'api_eventos',
  synchronize: false,
  entities: [Organizer, Event, Attendee, Registration, User],
  migrations: [InitialSchema1710000001000, CreateUsersTable1710000002000],
  migrationsTableName: 'migrations',
};

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
