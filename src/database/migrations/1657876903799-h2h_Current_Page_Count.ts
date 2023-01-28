import {MigrationInterface, QueryRunner} from "typeorm";

export class h2hCurrentPageCount1657876903799 implements MigrationInterface {
    name="h2hCurrentPageCount1657876903799";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "h2h_current_page_count" ("id" SERIAL NOT NULL, "currentPageCount" integer, PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "h2h_current_page_count"`);
    }

}
