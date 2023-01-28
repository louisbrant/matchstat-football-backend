"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseCronModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const database_synchronizer_service_1 = require("./database-synchronizer.service");
const schedule_1 = require("@nestjs/schedule");
const h2h_synchronizer_service_1 = require("./h2h.synchronizer.service");
const axios_1 = require("@nestjs/axios");
const h2h_current_page_count_entity_1 = require("../entities/h2h_current_page_count.entity");
let DatabaseCronModule = class DatabaseCronModule {
};
DatabaseCronModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([]),
            schedule_1.ScheduleModule.forRoot(),
            axios_1.HttpModule,
            typeorm_1.TypeOrmModule.forFeature([h2h_current_page_count_entity_1.H2h_current_page_count])
        ],
        providers: [database_synchronizer_service_1.DatabaseSynchronizerService,
            h2h_synchronizer_service_1.H2hSynchronizerService],
    })
], DatabaseCronModule);
exports.DatabaseCronModule = DatabaseCronModule;
//# sourceMappingURL=database-cron.module.js.map