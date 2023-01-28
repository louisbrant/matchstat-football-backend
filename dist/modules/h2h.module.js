"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.H2hModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const h2h_controller_1 = require("../controllers/h2h.controller");
const h2h_service_1 = require("../services/h2h.service");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const h2h_entity_1 = require("../entities/h2h.entity");
const search_module_1 = require("./search.module");
let H2hModule = class H2hModule {
};
H2hModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule,
            schedule_1.ScheduleModule.forRoot(),
            typeorm_1.TypeOrmModule.forFeature([h2h_entity_1.H2h]),
            search_module_1.SearchModule],
        controllers: [h2h_controller_1.H2hController],
        providers: [h2h_service_1.H2hService],
    })
], H2hModule);
exports.H2hModule = H2hModule;
//# sourceMappingURL=h2h.module.js.map