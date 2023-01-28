"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.h2hCurrentPageCount1657876903799 = void 0;
class h2hCurrentPageCount1657876903799 {
    constructor() {
        this.name = "h2hCurrentPageCount1657876903799";
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "h2h_current_page_count" ("id" SERIAL NOT NULL, "currentPageCount" integer, PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "h2h_current_page_count"`);
    }
}
exports.h2hCurrentPageCount1657876903799 = h2hCurrentPageCount1657876903799;
//# sourceMappingURL=1657876903799-h2h_Current_Page_Count.js.map