"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.h2h1657539221441 = void 0;
class h2h1657539221441 {
    constructor() {
        this.name = 'h2h1657539221441';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "h2h" ("id" SERIAL NOT NULL, "h2h_id" integer NOT NULL, "league_id" integer NOT NULL,  "season_id" integer NOT NULL, "stage_id" integer NOT NULL,  "round_id" integer NULL, "group_id" integer NULL, "aggregate_id" integer NULL,  "venue_id" integer NULL, "referee_id" integer NULL, "localteam_id" integer NOT NULL, "visitorteam_id" integer  NULL,  "winner_team_id" integer  NULL,  "weather_report" character varying, "commentaries" boolean, "attendance" character varying,  "pitch" character varying, "details" character varying, "neutral_venue" boolean,  "winning_odds_calculated" boolean, "localteam_score" integer NOT NULL, "visitorteam_score" integer NOT NULL, "ft_score" character varying, "local_team" json, "visitor_team" json, UNIQUE ("h2h_id"), PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "h2h"`);
    }
}
exports.h2h1657539221441 = h2h1657539221441;
//# sourceMappingURL=1657539221441-h2h.js.map