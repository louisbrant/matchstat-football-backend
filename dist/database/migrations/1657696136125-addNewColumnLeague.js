"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewColumnLeague1657696136125 = void 0;
class addNewColumnLeague1657696136125 {
    constructor() {
        this.name = 'addNewColumnLeague1657696136125';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "h2h" ADD COLUMN "league" json`);
    }
    async down(queryRunner) {
    }
}
exports.addNewColumnLeague1657696136125 = addNewColumnLeague1657696136125;
//# sourceMappingURL=1657696136125-addNewColumnLeague.js.map