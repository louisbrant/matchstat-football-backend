import {MigrationInterface, QueryRunner} from "typeorm";

export class PostRefactoring1655459155096 implements MigrationInterface {
    name = 'PostRefactoring1655459155096'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "league" ("id" SERIAL NOT NULL, "sportMonksId" integer NOT NULL, "active" boolean NOT NULL, "type" character varying NOT NULL, "name" character varying NOT NULL, "is_cup" boolean NOT NULL, CONSTRAINT "PK_0bd74b698f9e28875df738f7864" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "season" ("id" SERIAL NOT NULL, "sportMonksId" integer NOT NULL, "name" character varying NOT NULL, "leagueId" integer NOT NULL, "is_current_season" boolean NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, CONSTRAINT "PK_8ac0d081dbdb7ab02d166bcda9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "team" ("id" SERIAL NOT NULL, "sportMonksId" integer NOT NULL, "name" character varying NOT NULL, "country" character varying NOT NULL, "logo_path" character varying NOT NULL, "current_season_id" integer NOT NULL, "seasonId" integer, CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "final_results" ("id" SERIAL NOT NULL, "winnerTeamId" integer NOT NULL, "seasonId" integer NOT NULL, "leagueId" integer NOT NULL, "teamId" integer, CONSTRAINT "PK_7d47fdf5ace2a4523a0094fae91" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "fixtures" ("id" SERIAL NOT NULL, "sportMonksId" integer NOT NULL, "localTeamId" integer NOT NULL, "visitorTeamId" integer NOT NULL, "dateTimeStart" TIMESTAMP NOT NULL, "leagueId" integer NOT NULL, "seasonId" integer NOT NULL, "localteam_score" integer NOT NULL, "visitorteam_score" integer NOT NULL, "city" integer NOT NULL, CONSTRAINT "PK_a84e62c0b5acf494007959e67e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "position" ("id" SERIAL NOT NULL, "sportMonksId" integer NOT NULL, "positionName" character varying NOT NULL, CONSTRAINT "PK_b7f483581562b4dc62ae1a5b7e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "team_player" ("id" SERIAL NOT NULL, "sportMonksId" integer NOT NULL, "teamId" integer NOT NULL, "positionId" integer NOT NULL, "firstName" character varying NOT NULL, "secondName" character varying NOT NULL, "fullName" character varying NOT NULL, "shirtNumber" character varying NOT NULL, "birthdate" integer NOT NULL, "birthcountry" integer NOT NULL, "birthplace" integer NOT NULL, "height" integer NOT NULL, "weight" integer NOT NULL, "goals" integer NOT NULL, CONSTRAINT "PK_e0e94c07a2898080511249550b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "season" ADD CONSTRAINT "FK_35d66d938909b5d6a089f03d8d8" FOREIGN KEY ("leagueId") REFERENCES "league"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_20d85cf5a9c2477eae5bb563877" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "final_results" ADD CONSTRAINT "FK_3bfc2452d4f6b10b6d0462ce074" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "final_results" ADD CONSTRAINT "FK_4f08c2fd2d224df37ff5bf4936c" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "final_results" ADD CONSTRAINT "FK_c71a7ebf8e2e5565a3ac0c643e0" FOREIGN KEY ("leagueId") REFERENCES "league"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fixtures" ADD CONSTRAINT "FK_70ec8cb7e73c50104b8ba35eb7d" FOREIGN KEY ("localTeamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fixtures" ADD CONSTRAINT "FK_c1cb5008dd843bad51e2f8a456f" FOREIGN KEY ("visitorTeamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fixtures" ADD CONSTRAINT "FK_1bc8cef8b35579818ac67825b40" FOREIGN KEY ("leagueId") REFERENCES "league"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fixtures" ADD CONSTRAINT "FK_b9aca4d86e78ba6cc21c3611afc" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_player" ADD CONSTRAINT "FK_ba439df2ee27e9bf3dd1e380b65" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_player" ADD CONSTRAINT "FK_4d550adea8aa1b44d06b7972e42" FOREIGN KEY ("positionId") REFERENCES "position"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team_player" DROP CONSTRAINT "FK_4d550adea8aa1b44d06b7972e42"`);
        await queryRunner.query(`ALTER TABLE "team_player" DROP CONSTRAINT "FK_ba439df2ee27e9bf3dd1e380b65"`);
        await queryRunner.query(`ALTER TABLE "fixtures" DROP CONSTRAINT "FK_b9aca4d86e78ba6cc21c3611afc"`);
        await queryRunner.query(`ALTER TABLE "fixtures" DROP CONSTRAINT "FK_1bc8cef8b35579818ac67825b40"`);
        await queryRunner.query(`ALTER TABLE "fixtures" DROP CONSTRAINT "FK_c1cb5008dd843bad51e2f8a456f"`);
        await queryRunner.query(`ALTER TABLE "fixtures" DROP CONSTRAINT "FK_70ec8cb7e73c50104b8ba35eb7d"`);
        await queryRunner.query(`ALTER TABLE "final_results" DROP CONSTRAINT "FK_c71a7ebf8e2e5565a3ac0c643e0"`);
        await queryRunner.query(`ALTER TABLE "final_results" DROP CONSTRAINT "FK_4f08c2fd2d224df37ff5bf4936c"`);
        await queryRunner.query(`ALTER TABLE "final_results" DROP CONSTRAINT "FK_3bfc2452d4f6b10b6d0462ce074"`);
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_20d85cf5a9c2477eae5bb563877"`);
        await queryRunner.query(`ALTER TABLE "season" DROP CONSTRAINT "FK_35d66d938909b5d6a089f03d8d8"`);
        await queryRunner.query(`DROP TABLE "team_player"`);
        await queryRunner.query(`DROP TABLE "position"`);
        await queryRunner.query(`DROP TABLE "fixtures"`);
        await queryRunner.query(`DROP TABLE "final_results"`);
        await queryRunner.query(`DROP TABLE "team"`);
        await queryRunner.query(`DROP TABLE "season"`);
        await queryRunner.query(`DROP TABLE "league"`);
    }

}
