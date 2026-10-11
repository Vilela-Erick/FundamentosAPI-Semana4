import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1710000001000 implements MigrationInterface {
  name = 'InitialSchema1710000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Organizers
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "organizers" (
        "id" SERIAL PRIMARY KEY,
        "name" character varying NOT NULL,
        "email" character varying NOT NULL UNIQUE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // 2. Events
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "events" (
        "id" SERIAL PRIMARY KEY,
        "name" character varying NOT NULL,
        "description" text NOT NULL,
        "date" TIMESTAMP NOT NULL,
        "location" character varying NOT NULL,
        "capacity" integer NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "organizerId" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // Ensure organizerId column exists if table existed previously
    await queryRunner.query(`
      ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "organizerId" integer;
    `);

    // Foreign key for events.organizerId
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'FK_events_organizerId'
        ) THEN
          ALTER TABLE "events"
          ADD CONSTRAINT "FK_events_organizerId"
          FOREIGN KEY ("organizerId")
          REFERENCES "organizers"("id")
          ON DELETE SET NULL;
        END IF;
      END $$;
    `);

    // 3. Attendees
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "attendees" (
        "id" SERIAL PRIMARY KEY,
        "name" character varying NOT NULL,
        "email" character varying NOT NULL UNIQUE,
        "phone" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // 4. Registrations
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "registrations" (
        "id" SERIAL PRIMARY KEY,
        "eventId" integer NOT NULL,
        "attendeeId" integer NOT NULL,
        "status" character varying NOT NULL DEFAULT 'registered',
        "registrationDate" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_registrations_eventId_attendeeId" UNIQUE ("eventId", "attendeeId")
      );
    `);

    // Foreign keys for registrations
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'FK_registrations_eventId'
        ) THEN
          ALTER TABLE "registrations"
          ADD CONSTRAINT "FK_registrations_eventId"
          FOREIGN KEY ("eventId")
          REFERENCES "events"("id")
          ON DELETE CASCADE;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'FK_registrations_attendeeId'
        ) THEN
          ALTER TABLE "registrations"
          ADD CONSTRAINT "FK_registrations_attendeeId"
          FOREIGN KEY ("attendeeId")
          REFERENCES "attendees"("id")
          ON DELETE CASCADE;
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "registrations";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "attendees";`);
    await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT IF EXISTS "FK_events_organizerId";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "events";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "organizers";`);
  }
}
