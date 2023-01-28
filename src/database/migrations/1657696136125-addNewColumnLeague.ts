import {MigrationInterface, QueryRunner} from "typeorm";

export class addNewColumnLeague1657696136125 implements MigrationInterface {
    name = 'addNewColumnLeague1657696136125'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "h2h" ADD COLUMN "league" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
