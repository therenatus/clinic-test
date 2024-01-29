import { MigrationInterface, QueryRunner } from "typeorm";

export class NameOfMyMigration1706202999500 implements MigrationInterface {
    name = 'NameOfMyMigration1706202999500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "userId" uuid NOT NULL, "isRevoked" boolean NOT NULL, "expires" TIMESTAMP NOT NULL, "device" character varying NOT NULL, CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "appointments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "doctorId" uuid, "patientId" uuid, CONSTRAINT "PK_4a437a9a27e948726b8bb3e36ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "emailConfirmation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isConfirmed" boolean NOT NULL DEFAULT false, "expirationDate" TIMESTAMP, "confirmationCode" character varying, CONSTRAINT "PK_a46f72520561a423dca2534082b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."account_roles_enum" AS ENUM('superadmin', 'admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "fullName" character varying NOT NULL, "roles" "public"."account_roles_enum" NOT NULL DEFAULT 'user', "password" character varying NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accountDataId" uuid, "emailConfirmationId" uuid, CONSTRAINT "REL_c00a68c6248bf973fc8417580d" UNIQUE ("accountDataId"), CONSTRAINT "REL_366ba2077e7bc352c0b6f4d024" UNIQUE ("emailConfirmationId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_0c1af27b469cb8dca420c160d65" FOREIGN KEY ("doctorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_13c2e57cb81b44f062ba24df57d" FOREIGN KEY ("patientId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_c00a68c6248bf973fc8417580d2" FOREIGN KEY ("accountDataId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_366ba2077e7bc352c0b6f4d0243" FOREIGN KEY ("emailConfirmationId") REFERENCES "emailConfirmation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_366ba2077e7bc352c0b6f4d0243"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_c00a68c6248bf973fc8417580d2"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_13c2e57cb81b44f062ba24df57d"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_0c1af27b469cb8dca420c160d65"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP TYPE "public"."account_roles_enum"`);
        await queryRunner.query(`DROP TABLE "emailConfirmation"`);
        await queryRunner.query(`DROP TABLE "appointments"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    }

}
