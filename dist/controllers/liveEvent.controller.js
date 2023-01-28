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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveEventController = void 0;
const common_1 = require("@nestjs/common");
const liveEvent_service_1 = require("../services/liveEvent.service");
const Fixture_ids_dto_1 = require("../dto/Fixture-ids.dto");
let LiveEventController = class LiveEventController {
    constructor(liveEventService) {
        this.liveEventService = liveEventService;
    }
    getLiveEvents() {
        return this.liveEventService.getLiveEvents();
    }
    getMatch(fixtureId) {
        return this.liveEventService.getMatch(fixtureId);
    }
    getFixtures(teamId) {
        return this.liveEventService.getFixtures(teamId);
    }
    generalInfo(body) {
        return this.liveEventService.getLineUps(body);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LiveEventController.prototype, "getLiveEvents", null);
__decorate([
    (0, common_1.Get)("/match/:fixtureId"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('fixtureId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LiveEventController.prototype, "getMatch", null);
__decorate([
    (0, common_1.Get)("/getFixtures/:teamId"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('teamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LiveEventController.prototype, "getFixtures", null);
__decorate([
    (0, common_1.Post)('lineUps'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Fixture_ids_dto_1.FixtureIdsDto]),
    __metadata("design:returntype", void 0)
], LiveEventController.prototype, "generalInfo", null);
LiveEventController = __decorate([
    (0, common_1.Controller)('football/api/v1/liveEvent'),
    __metadata("design:paramtypes", [liveEvent_service_1.LiveEventService])
], LiveEventController);
exports.LiveEventController = LiveEventController;
//# sourceMappingURL=liveEvent.controller.js.map