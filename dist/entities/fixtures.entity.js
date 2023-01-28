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
exports.Fixtures = void 0;
const typeorm_1 = require("typeorm");
const team_entity_1 = require("./team.entity");
const league_entity_1 = require("./league.entity");
const season_entity_1 = require("./season.entity");
let Fixtures = class Fixtures {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], Fixtures.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Fixtures.prototype, "sportMonksId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => team_entity_1.Team),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", team_entity_1.Team)
], Fixtures.prototype, "localTeam", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Fixtures.prototype, "localTeamId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => team_entity_1.Team),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", team_entity_1.Team)
], Fixtures.prototype, "visitorTeam", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Fixtures.prototype, "visitorTeamId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Fixtures.prototype, "dateTimeStart", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => league_entity_1.League),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", league_entity_1.League)
], Fixtures.prototype, "league", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Fixtures.prototype, "leagueId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => season_entity_1.Season),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", season_entity_1.Season)
], Fixtures.prototype, "season", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Fixtures.prototype, "seasonId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Fixtures.prototype, "localteam_score", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Fixtures.prototype, "visitorteam_score", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Fixtures.prototype, "city", void 0);
Fixtures = __decorate([
    (0, typeorm_1.Entity)()
], Fixtures);
exports.Fixtures = Fixtures;
//# sourceMappingURL=fixtures.entity.js.map