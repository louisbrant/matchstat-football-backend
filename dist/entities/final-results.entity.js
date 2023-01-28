"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinalResults = void 0;
const typeorm_1 = require("typeorm");
const league_entity_1 = require("./league.entity");
const season_entity_1 = require("./season.entity");
const team_entity_1 = require("./team.entity");
let FinalResults = class FinalResults {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], FinalResults.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => team_entity_1.Team),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", team_entity_1.Team)
], FinalResults.prototype, "team", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], FinalResults.prototype, "winnerTeamId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => season_entity_1.Season),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", season_entity_1.Season)
], FinalResults.prototype, "season", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], FinalResults.prototype, "seasonId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => league_entity_1.League),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", league_entity_1.League)
], FinalResults.prototype, "league", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], FinalResults.prototype, "leagueId", void 0);
FinalResults = __decorate([
    (0, typeorm_1.Entity)()
], FinalResults);
exports.FinalResults = FinalResults;
//# sourceMappingURL=final-results.entity.js.map