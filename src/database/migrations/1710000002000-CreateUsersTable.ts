import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1710000002000 implements MigrationInterface {
  name = 'CreateUsersTable1710000002000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "name" character varying NOT NULL,
        "email" character varying NOT NULL UNIQUE,
        "password" character varying NOT NULL,
        "role" character varying NOT NULL DEFAULT 'user',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "users";`);
  }
}
