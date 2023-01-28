"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConfig = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.DatabaseConfig = {
    type: 'postgres',
    host: `${process.env.POSTGRES_HOST}`,
    username: `${process.env.POSTGRES_USER}`,
    password: `${process.env.POSTGRES_PASSWORD}`,
    database: `${process.env.POSTGRES_DB}`,
    port: 5432,
    synchronize: false,
    migrationsRun: false,
    entities: ["dist/**/*.entity{.ts,.js}"],
    migrations: ["dist/database/migrations/**/*{.ts,.js}"],
    cli: { "migrationsDir": "src/database/migrations" }
};
exports.default = exports.DatabaseConfig;
//# sourceMappingURL=database.config.js.map