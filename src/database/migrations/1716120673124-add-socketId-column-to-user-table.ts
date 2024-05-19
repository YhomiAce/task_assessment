import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSocketIdColumnToUserTable1716120673124 implements MigrationInterface {
    name = 'AddSocketIdColumnToUserTable1716120673124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "socketId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "socketId"`);
    }

}
