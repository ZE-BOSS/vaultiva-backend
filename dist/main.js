/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const config_1 = __webpack_require__(4);
const helmet_1 = __importDefault(__webpack_require__(5));
const compression_1 = __importDefault(__webpack_require__(6));
const app_module_1 = __webpack_require__(7);
const all_exceptions_filter_1 = __webpack_require__(178);
const response_interceptor_1 = __webpack_require__(179);
const logging_interceptor_1 = __webpack_require__(181);
function installProcessGuards(logger) {
    process.on('unhandledRejection', (reason) => {
        logger.error('Unhandled promise rejection — the request that caused it may have failed silently', reason instanceof Error ? reason.stack : String(reason));
    });
    process.on('uncaughtException', (error) => {
        logger.error('Uncaught exception', error.stack);
    });
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const logger = new common_1.Logger('Bootstrap');
    installProcessGuards(logger);
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    const isProd = configService.get('NODE_ENV') === 'production';
    const allowedOrigins = (configService.get('ALLOWED_ORIGINS') ?? '')
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);
    if (isProd && allowedOrigins.length === 0) {
        logger.warn('ALLOWED_ORIGINS is not set — browser clients will be blocked by CORS. ' +
            'Set it to your frontend origins, comma separated.');
    }
    const originMatchers = allowedOrigins.map((pattern) => {
        const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^.]+');
        return new RegExp(`^${escaped}$`);
    });
    app.enableCors({
        origin: isProd
            ? (origin, callback) => {
                if (!origin)
                    return callback(null, true);
                const allowed = originMatchers.some((re) => re.test(origin));
                if (!allowed)
                    logger.warn(`Blocked CORS request from origin: ${origin}`);
                return callback(null, allowed);
            }
            : true,
        credentials: true,
    });
    app.setGlobalPrefix(configService.get('API_PREFIX', 'api/v1'));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor(), new logging_interceptor_1.LoggingInterceptor());
    if (process.env.NODE_ENV !== 'production') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Vaultiva API')
            .setDescription('Comprehensive Fintech APP (Vautiva) API with clean architecture')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('docs', app, document);
    }
    const port = configService.get('PORT', 3000);
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}`);
    logger.log(`Swagger documentation: http://localhost:${port}/docs`);
}
bootstrap();


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("helmet");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("compression");

/***/ }),
/* 7 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(8);
const bullmq_1 = __webpack_require__(9);
const throttler_1 = __webpack_require__(10);
const schedule_1 = __webpack_require__(11);
const event_emitter_1 = __webpack_require__(12);
const nest_winston_1 = __webpack_require__(13);
const winston = __importStar(__webpack_require__(14));
const database_config_1 = __webpack_require__(15);
const redis_config_1 = __webpack_require__(60);
const env_validation_1 = __webpack_require__(61);
const auth_module_1 = __webpack_require__(62);
const users_module_1 = __webpack_require__(113);
const wallet_module_1 = __webpack_require__(127);
const bills_module_1 = __webpack_require__(136);
const notifications_module_1 = __webpack_require__(124);
const payments_module_1 = __webpack_require__(131);
const health_module_1 = __webpack_require__(140);
const kyc_module_1 = __webpack_require__(143);
const escrow_module_1 = __webpack_require__(145);
const bill_splitting_module_1 = __webpack_require__(150);
const crowdfunding_module_1 = __webpack_require__(154);
const shared_wallets_module_1 = __webpack_require__(159);
const ai_insights_module_1 = __webpack_require__(164);
const rewards_module_1 = __webpack_require__(167);
const ledger_module_1 = __webpack_require__(170);
const transfers_module_1 = __webpack_require__(173);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
                validate: env_validation_1.validateEnv,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useClass: database_config_1.DatabaseConfig,
            }),
            bullmq_1.BullModule.forRootAsync({
                useClass: redis_config_1.RedisConfig,
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: parseInt(process.env.RATE_LIMIT_TTL) || 60000,
                    limit: parseInt(process.env.RATE_LIMIT_LIMIT) || 100,
                },
            ]),
            schedule_1.ScheduleModule.forRoot(),
            event_emitter_1.EventEmitterModule.forRoot(),
            nest_winston_1.WinstonModule.forRoot({
                transports: [
                    new winston.transports.Console({
                        format: winston.format.combine(winston.format.timestamp(), winston.format.colorize(), winston.format.simple()),
                    }),
                    new winston.transports.File({
                        filename: 'logs/error.log',
                        level: 'error',
                        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
                    }),
                    new winston.transports.File({
                        filename: 'logs/combined.log',
                        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
                    }),
                ],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            bills_module_1.BillsModule,
            notifications_module_1.NotificationsModule,
            payments_module_1.PaymentsModule,
            wallet_module_1.WalletModule,
            health_module_1.HealthModule,
            kyc_module_1.KycModule,
            escrow_module_1.EscrowModule,
            bill_splitting_module_1.BillSplittingModule,
            crowdfunding_module_1.CrowdfundingModule,
            shared_wallets_module_1.SharedWalletsModule,
            ai_insights_module_1.AiInsightsModule,
            rewards_module_1.RewardsModule,
            ledger_module_1.LedgerModule,
            transfers_module_1.TransfersModule,
        ],
    })
], AppModule);


/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("@nestjs/typeorm");

/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("@nestjs/bullmq");

/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("@nestjs/throttler");

/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("@nestjs/schedule");

/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("@nestjs/event-emitter");

/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("nest-winston");

/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("winston");

/***/ }),
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseConfig = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(4);
const entities_1 = __webpack_require__(16);
const migrations_1 = __webpack_require__(47);
let DatabaseConfig = class DatabaseConfig {
    constructor(configService) {
        this.configService = configService;
    }
    createTypeOrmOptions() {
        const isDev = this.configService.get('NODE_ENV') === 'development';
        return {
            type: 'postgres',
            host: this.configService.get('DB_HOST'),
            port: this.configService.get('DB_PORT'),
            username: this.configService.get('DB_USERNAME'),
            password: this.configService.get('DB_PASSWORD'),
            database: this.configService.get('DB_NAME'),
            entities: entities_1.ENTITIES,
            migrations: migrations_1.MIGRATIONS,
            synchronize: isDev,
            migrationsRun: !isDev,
            ssl: isDev ? false : { rejectUnauthorized: false },
            logging: isDev,
        };
    }
};
exports.DatabaseConfig = DatabaseConfig;
exports.DatabaseConfig = DatabaseConfig = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], DatabaseConfig);


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ENTITIES = void 0;
const bank_downtime_entity_1 = __webpack_require__(17);
const bill_entity_1 = __webpack_require__(19);
const bill_payment_entity_1 = __webpack_require__(20);
const bill_split_entity_1 = __webpack_require__(27);
const bill_split_participant_entity_1 = __webpack_require__(28);
const budget_recommendation_entity_1 = __webpack_require__(29);
const crowdfunding_campaign_entity_1 = __webpack_require__(30);
const crowdfunding_contribution_entity_1 = __webpack_require__(31);
const escrow_entity_1 = __webpack_require__(32);
const escrow_participant_entity_1 = __webpack_require__(33);
const ledger_entry_entity_1 = __webpack_require__(34);
const notification_entity_1 = __webpack_require__(26);
const reconciliation_record_entity_1 = __webpack_require__(35);
const recurring_payment_entity_1 = __webpack_require__(36);
const reward_entity_1 = __webpack_require__(37);
const reward_rule_entity_1 = __webpack_require__(39);
const scheduled_transfer_entity_1 = __webpack_require__(40);
const shared_wallet_entity_1 = __webpack_require__(41);
const shared_wallet_member_entity_1 = __webpack_require__(42);
const shared_wallet_transaction_entity_1 = __webpack_require__(43);
const spending_insight_entity_1 = __webpack_require__(45);
const transaction_entity_1 = __webpack_require__(25);
const transaction_signature_entity_1 = __webpack_require__(44);
const transfer_entity_1 = __webpack_require__(46);
const user_entity_1 = __webpack_require__(21);
const user_reward_entity_1 = __webpack_require__(38);
const wallet_entity_1 = __webpack_require__(24);
exports.ENTITIES = [
    bank_downtime_entity_1.BankDowntime,
    bill_entity_1.Bill,
    bill_payment_entity_1.BillPayment,
    bill_split_entity_1.BillSplit,
    bill_split_participant_entity_1.BillSplitParticipant,
    budget_recommendation_entity_1.BudgetRecommendation,
    crowdfunding_campaign_entity_1.CrowdfundingCampaign,
    crowdfunding_contribution_entity_1.CrowdfundingContribution,
    escrow_entity_1.Escrow,
    escrow_participant_entity_1.EscrowParticipant,
    ledger_entry_entity_1.LedgerEntry,
    notification_entity_1.Notification,
    reconciliation_record_entity_1.ReconciliationRecord,
    recurring_payment_entity_1.RecurringPayment,
    reward_entity_1.Reward,
    reward_rule_entity_1.RewardRule,
    scheduled_transfer_entity_1.ScheduledTransfer,
    shared_wallet_entity_1.SharedWallet,
    shared_wallet_member_entity_1.SharedWalletMember,
    shared_wallet_transaction_entity_1.SharedWalletTransaction,
    spending_insight_entity_1.SpendingInsight,
    transaction_entity_1.Transaction,
    transaction_signature_entity_1.TransactionSignature,
    transfer_entity_1.Transfer,
    user_entity_1.User,
    user_reward_entity_1.UserReward,
    wallet_entity_1.Wallet,
];


/***/ }),
/* 17 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BankDowntime = exports.DowntimeType = exports.DowntimeStatus = void 0;
const typeorm_1 = __webpack_require__(18);
var DowntimeStatus;
(function (DowntimeStatus) {
    DowntimeStatus["ACTIVE"] = "active";
    DowntimeStatus["RESOLVED"] = "resolved";
    DowntimeStatus["SCHEDULED"] = "scheduled";
})(DowntimeStatus || (exports.DowntimeStatus = DowntimeStatus = {}));
var DowntimeType;
(function (DowntimeType) {
    DowntimeType["MAINTENANCE"] = "maintenance";
    DowntimeType["OUTAGE"] = "outage";
    DowntimeType["PARTIAL"] = "partial";
})(DowntimeType || (exports.DowntimeType = DowntimeType = {}));
let BankDowntime = class BankDowntime {
};
exports.BankDowntime = BankDowntime;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BankDowntime.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BankDowntime.prototype, "bankCode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BankDowntime.prototype, "bankName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: DowntimeType }),
    __metadata("design:type", String)
], BankDowntime.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: DowntimeStatus }),
    __metadata("design:type", String)
], BankDowntime.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BankDowntime.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], BankDowntime.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], BankDowntime.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], BankDowntime.prototype, "estimatedEndTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], BankDowntime.prototype, "actualEndTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], BankDowntime.prototype, "affectedServices", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], BankDowntime.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], BankDowntime.prototype, "updatedAt", void 0);
exports.BankDowntime = BankDowntime = __decorate([
    (0, typeorm_1.Entity)('bank_downtimes')
], BankDowntime);


/***/ }),
/* 18 */
/***/ ((module) => {

module.exports = require("typeorm");

/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Bill = exports.BillProvider = exports.BillCategory = void 0;
const typeorm_1 = __webpack_require__(18);
const bill_payment_entity_1 = __webpack_require__(20);
var BillCategory;
(function (BillCategory) {
    BillCategory["AIRTIME"] = "airtime";
    BillCategory["DATA"] = "data";
    BillCategory["ELECTRICITY"] = "electricity";
    BillCategory["TV"] = "tv";
    BillCategory["INTERNET"] = "internet";
    BillCategory["BETTING"] = "betting";
})(BillCategory || (exports.BillCategory = BillCategory = {}));
var BillProvider;
(function (BillProvider) {
    BillProvider["FLUTTERWAVE"] = "flutterwave";
    BillProvider["INTERSWITCH"] = "interswitch";
})(BillProvider || (exports.BillProvider = BillProvider = {}));
let Bill = class Bill {
};
exports.Bill = Bill;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Bill.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Bill.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Bill.prototype, "billerCode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Bill.prototype, "itemCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: BillCategory }),
    __metadata("design:type", String)
], Bill.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: BillProvider }),
    __metadata("design:type", String)
], Bill.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Bill.prototype, "fee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Bill.prototype, "minimumAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Bill.prototype, "maximumAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Bill.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Bill.prototype, "hasDowntime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Bill.prototype, "downtimeStart", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Bill.prototype, "downtimeEnd", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Bill.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Bill.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Bill.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bill_payment_entity_1.BillPayment, (payment) => payment.bill),
    __metadata("design:type", Array)
], Bill.prototype, "payments", void 0);
exports.Bill = Bill = __decorate([
    (0, typeorm_1.Entity)('bills')
], Bill);


/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillPayment = exports.BillPaymentStatus = void 0;
const typeorm_1 = __webpack_require__(18);
const user_entity_1 = __webpack_require__(21);
const bill_entity_1 = __webpack_require__(19);
const wallet_entity_1 = __webpack_require__(24);
var BillPaymentStatus;
(function (BillPaymentStatus) {
    BillPaymentStatus["PENDING"] = "pending";
    BillPaymentStatus["PROCESSING"] = "processing";
    BillPaymentStatus["COMPLETED"] = "completed";
    BillPaymentStatus["FAILED"] = "failed";
})(BillPaymentStatus || (exports.BillPaymentStatus = BillPaymentStatus = {}));
let BillPayment = class BillPayment {
};
exports.BillPayment = BillPayment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BillPayment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], BillPayment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BillPayment.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: BillPaymentStatus, default: BillPaymentStatus.PENDING }),
    __metadata("design:type", String)
], BillPayment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BillPayment.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BillPayment.prototype, "providerReference", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BillPayment.prototype, "failureReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], BillPayment.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], BillPayment.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], BillPayment.prototype, "billId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], BillPayment.prototype, "walletId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], BillPayment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], BillPayment.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", typeof (_c = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _c : Object)
], BillPayment.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bill_entity_1.Bill, (bill) => bill.payments),
    (0, typeorm_1.JoinColumn)({ name: 'billId' }),
    __metadata("design:type", typeof (_d = typeof bill_entity_1.Bill !== "undefined" && bill_entity_1.Bill) === "function" ? _d : Object)
], BillPayment.prototype, "bill", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => wallet_entity_1.Wallet),
    (0, typeorm_1.JoinColumn)({ name: 'walletId' }),
    __metadata("design:type", typeof (_e = typeof wallet_entity_1.Wallet !== "undefined" && wallet_entity_1.Wallet) === "function" ? _e : Object)
], BillPayment.prototype, "wallet", void 0);
exports.BillPayment = BillPayment = __decorate([
    (0, typeorm_1.Entity)('bill_payments')
], BillPayment);


/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.User = exports.KYCStatus = exports.UserRole = exports.Role = void 0;
const typeorm_1 = __webpack_require__(18);
const class_transformer_1 = __webpack_require__(22);
const roles_decorator_1 = __webpack_require__(23);
Object.defineProperty(exports, "Role", ({ enumerable: true, get: function () { return roles_decorator_1.Role; } }));
Object.defineProperty(exports, "UserRole", ({ enumerable: true, get: function () { return roles_decorator_1.Role; } }));
const wallet_entity_1 = __webpack_require__(24);
const notification_entity_1 = __webpack_require__(26);
var KYCStatus;
(function (KYCStatus) {
    KYCStatus["PENDING"] = "pending";
    KYCStatus["REJECTED"] = "rejected";
    KYCStatus["APPROVED"] = "approved";
    KYCStatus["NOT_STARTED"] = "not_started";
})(KYCStatus || (exports.KYCStatus = KYCStatus = {}));
let User = class User {
    updateTimestamp() {
        this.updatedAt = new Date();
    }
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "bvn", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "nin", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "accountNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "bank", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "accountName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], User.prototype, "biometricPublicKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: roles_decorator_1.Role, default: roles_decorator_1.Role.USER }),
    __metadata("design:type", typeof (_a = typeof roles_decorator_1.Role !== "undefined" && roles_decorator_1.Role) === "function" ? _a : Object)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { default: [] }),
    __metadata("design:type", Array)
], User.prototype, "codes", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isEmailVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isPhoneVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: KYCStatus, default: KYCStatus.NOT_STARTED }),
    __metadata("design:type", String)
], User.prototype, "kycStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], User.prototype, "lastLoginAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "loginDevice", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "pin", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => wallet_entity_1.Wallet, (wallet) => wallet.user),
    __metadata("design:type", Array)
], User.prototype, "wallets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_entity_1.Notification, (notification) => notification.user),
    __metadata("design:type", Array)
], User.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "updateTimestamp", null);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);


/***/ }),
/* 22 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = exports.ROLES_KEY = exports.Role = void 0;
const common_1 = __webpack_require__(2);
var Role;
(function (Role) {
    Role["USER"] = "user";
    Role["ADMIN"] = "admin";
    Role["SUPER_ADMIN"] = "super_admin";
})(Role || (exports.Role = Role = {}));
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Wallet = exports.WalletType = void 0;
const typeorm_1 = __webpack_require__(18);
const user_entity_1 = __webpack_require__(21);
const transaction_entity_1 = __webpack_require__(25);
var WalletType;
(function (WalletType) {
    WalletType["MAIN"] = "main";
    WalletType["ESCROW"] = "escrow";
    WalletType["SPLIT_BILL"] = "split_bill";
    WalletType["BILL_PAYMENT"] = "bill_payment";
    WalletType["OTHERS"] = "others";
})(WalletType || (exports.WalletType = WalletType = {}));
let Wallet = class Wallet {
};
exports.Wallet = Wallet;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Wallet.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Wallet.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Wallet.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: WalletType, default: WalletType.MAIN }),
    __metadata("design:type", String)
], Wallet.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Wallet.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'NGN' }),
    __metadata("design:type", String)
], Wallet.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Wallet.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Wallet.prototype, "accountNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Wallet.prototype, "accountName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Wallet.prototype, "bankName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Wallet.prototype, "bankCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Wallet.prototype, "providerWalletId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Wallet.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Wallet.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Wallet.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.wallets),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", typeof (_c = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _c : Object)
], Wallet.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => transaction_entity_1.Transaction, (transaction) => transaction.wallet),
    __metadata("design:type", Array)
], Wallet.prototype, "transactions", void 0);
exports.Wallet = Wallet = __decorate([
    (0, typeorm_1.Entity)('wallets')
], Wallet);


/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Transaction = exports.TransactionStatus = exports.TransactionType = void 0;
const typeorm_1 = __webpack_require__(18);
const wallet_entity_1 = __webpack_require__(24);
var TransactionType;
(function (TransactionType) {
    TransactionType["DEPOSIT"] = "deposit";
    TransactionType["WITHDRAWAL"] = "withdrawal";
    TransactionType["BILL_PAYMENT"] = "bill_payment";
    TransactionType["TRANSFER"] = "transfer";
    TransactionType["REFUND"] = "refund";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["PROCESSING"] = "processing";
    TransactionStatus["COMPLETED"] = "completed";
    TransactionStatus["FAILED"] = "failed";
    TransactionStatus["CANCELLED"] = "cancelled";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
let Transaction = class Transaction {
};
exports.Transaction = Transaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Transaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], Transaction.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TransactionType }),
    __metadata("design:type", String)
], Transaction.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING }),
    __metadata("design:type", String)
], Transaction.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Transaction.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Transaction.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "providerReference", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "failureReason", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Transaction.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Transaction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Transaction.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Transaction.prototype, "walletId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => wallet_entity_1.Wallet, (wallet) => wallet.transactions),
    (0, typeorm_1.JoinColumn)({ name: 'walletId' }),
    __metadata("design:type", typeof (_c = typeof wallet_entity_1.Wallet !== "undefined" && wallet_entity_1.Wallet) === "function" ? _c : Object)
], Transaction.prototype, "wallet", void 0);
exports.Transaction = Transaction = __decorate([
    (0, typeorm_1.Entity)('transactions')
], Transaction);


/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Notification = exports.NotificationChannel = exports.NotificationType = void 0;
const typeorm_1 = __webpack_require__(18);
const user_entity_1 = __webpack_require__(21);
var NotificationType;
(function (NotificationType) {
    NotificationType["TRANSACTION"] = "transaction";
    NotificationType["BILL_PAYMENT"] = "bill_payment";
    NotificationType["WALLET_FUNDING"] = "wallet_funding";
    NotificationType["WITHDRAWAL"] = "withdrawal";
    NotificationType["SECURITY"] = "security";
    NotificationType["GENERAL"] = "general";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["IN_APP"] = "in_app";
    NotificationChannel["EMAIL"] = "email";
    NotificationChannel["SMS"] = "sms";
    NotificationChannel["PUSH"] = "push";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
let Notification = class Notification {
};
exports.Notification = Notification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Notification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Notification.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: NotificationType }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: NotificationChannel }),
    __metadata("design:type", String)
], Notification.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Notification.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Notification.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Notification.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Notification.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.notifications),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", typeof (_c = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _c : Object)
], Notification.prototype, "user", void 0);
exports.Notification = Notification = __decorate([
    (0, typeorm_1.Entity)('notifications')
], Notification);


/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillSplit = exports.SplitStatus = exports.SplitFrequency = exports.SplitType = void 0;
const typeorm_1 = __webpack_require__(18);
const user_entity_1 = __webpack_require__(21);
const wallet_entity_1 = __webpack_require__(24);
const bill_split_participant_entity_1 = __webpack_require__(28);
var SplitType;
(function (SplitType) {
    SplitType["ONE_TO_MANY"] = "one_to_many";
    SplitType["MANY_TO_ONE"] = "many_to_one";
})(SplitType || (exports.SplitType = SplitType = {}));
var SplitFrequency;
(function (SplitFrequency) {
    SplitFrequency["ONE_TIME"] = "one_time";
    SplitFrequency["RECURRING"] = "recurring";
})(SplitFrequency || (exports.SplitFrequency = SplitFrequency = {}));
var SplitStatus;
(function (SplitStatus) {
    SplitStatus["PENDING"] = "pending";
    SplitStatus["ACTIVE"] = "active";
    SplitStatus["COMPLETED"] = "completed";
    SplitStatus["CANCELLED"] = "cancelled";
})(SplitStatus || (exports.SplitStatus = SplitStatus = {}));
let BillSplit = class BillSplit {
};
exports.BillSplit = BillSplit;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BillSplit.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BillSplit.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], BillSplit.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], BillSplit.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SplitType }),
    __metadata("design:type", String)
], BillSplit.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SplitFrequency }),
    __metadata("design:type", String)
], BillSplit.prototype, "frequency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SplitStatus, default: SplitStatus.PENDING }),
    __metadata("design:type", String)
], BillSplit.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BillSplit.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], BillSplit.prototype, "nextExecutionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], BillSplit.prototype, "schedule", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], BillSplit.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], BillSplit.prototype, "creatorId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], BillSplit.prototype, "walletId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], BillSplit.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], BillSplit.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'creatorId' }),
    __metadata("design:type", typeof (_d = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _d : Object)
], BillSplit.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => wallet_entity_1.Wallet),
    (0, typeorm_1.JoinColumn)({ name: 'walletId' }),
    __metadata("design:type", typeof (_e = typeof wallet_entity_1.Wallet !== "undefined" && wallet_entity_1.Wallet) === "function" ? _e : Object)
], BillSplit.prototype, "wallet", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bill_split_participant_entity_1.BillSplitParticipant, (participant) => participant.billSplit),
    __metadata("design:type", Array)
], BillSplit.prototype, "participants", void 0);
exports.BillSplit = BillSplit = __decorate([
    (0, typeorm_1.Entity)('bill_splits')
], BillSplit);


/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillSplitParticipant = exports.ParticipantStatus = exports.ParticipantRole = void 0;
const typeorm_1 = __webpack_require__(18);
const user_entity_1 = __webpack_require__(21);
const wallet_entity_1 = __webpack_require__(24);
const bill_split_entity_1 = __webpack_require__(27);
var ParticipantRole;
(function (ParticipantRole) {
    ParticipantRole["SENDER"] = "sender";
    ParticipantRole["RECEIVER"] = "receiver";
})(ParticipantRole || (exports.ParticipantRole = ParticipantRole = {}));
var ParticipantStatus;
(function (ParticipantStatus) {
    ParticipantStatus["INVITED"] = "invited";
    ParticipantStatus["ACCEPTED"] = "accepted";
    ParticipantStatus["DECLINED"] = "declined";
    ParticipantStatus["COMPLETED"] = "completed";
})(ParticipantStatus || (exports.ParticipantStatus = ParticipantStatus = {}));
let BillSplitParticipant = class BillSplitParticipant {
};
exports.BillSplitParticipant = BillSplitParticipant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BillSplitParticipant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ParticipantRole }),
    __metadata("design:type", String)
], BillSplitParticipant.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ParticipantStatus, default: ParticipantStatus.INVITED }),
    __metadata("design:type", String)
], BillSplitParticipant.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], BillSplitParticipant.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], BillSplitParticipant.prototype, "lastPaymentDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], BillSplitParticipant.prototype, "nextReminderDate", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], BillSplitParticipant.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], BillSplitParticipant.prototype, "walletId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], BillSplitParticipant.prototype, "billSplitId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], BillSplitParticipant.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], BillSplitParticipant.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", typeof (_e = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _e : Object)
], BillSplitParticipant.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => wallet_entity_1.Wallet),
    (0, typeorm_1.JoinColumn)({ name: 'walletId' }),
    __metadata("design:type", typeof (_f = typeof wallet_entity_1.Wallet !== "undefined" && wallet_entity_1.Wallet) === "function" ? _f : Object)
], BillSplitParticipant.prototype, "wallet", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bill_split_entity_1.BillSplit, (billSplit) => billSplit.participants),
    (0, typeorm_1.JoinColumn)({ name: 'billSplitId' }),
    __metadata("design:type", typeof (_g = typeof bill_split_entity_1.BillSplit !== "undefined" && bill_split_entity_1.BillSplit) === "function" ? _g : Object)
], BillSplitParticipant.prototype, "billSplit", void 0);
exports.BillSplitParticipant = BillSplitParticipant = __decorate([
    (0, typeorm_1.Entity)('bill_split_participants')
], BillSplitParticipant);


/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BudgetRecommendation = exports.RecommendationType = void 0;
const typeorm_1 = __webpack_require__(18);
const user_entity_1 = __webpack_require__(21);
var RecommendationType;
(function (RecommendationType) {
    RecommendationType["REDUCE_SPENDING"] = "reduce_spending";
    RecommendationType["INCREASE_SAVINGS"] = "increase_savings";
    RecommendationType["OPTIMIZE_BILLS"] = "optimize_bills";
    RecommendationType["INVESTMENT_OPPORTUNITY"] = "investment_opportunity";
})(RecommendationType || (exports.RecommendationType = RecommendationType = {}));
let BudgetRecommendation = class BudgetRecommendation {
};
exports.BudgetRecommendation = BudgetRecommendation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BudgetRecommendation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: RecommendationType }),
    __metadata("design:type", String)
], BudgetRecommendation.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BudgetRecommendation.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], BudgetRecommendation.prototype, "currentSpending", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], BudgetRecommendation.prototype, "recommendedSpending", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], BudgetRecommendation.prototype, "potentialSavings", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], BudgetRecommendation.prototype, "explanation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Array)
], BudgetRecommendation.prototype, "actionItems", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], BudgetRecommendation.prototype, "isImplemented", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], BudgetRecommendation.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], BudgetRecommendation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], BudgetRecommendation.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", typeof (_c = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _c : Object)
], BudgetRecommendation.prototype, "user", void 0);
exports.BudgetRecommendation = BudgetRecommendation = __decorate([
    (0, typeorm_1.Entity)('budget_recommendations')
], BudgetRecommendation);


/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CrowdfundingCampaign = exports.CampaignStatus = void 0;
const typeorm_1 = __webpack_require__(18);
const user_entity_1 = __webpack_require__(21);
const wallet_entity_1 = __webpack_require__(24);
const crowdfunding_contribution_entity_1 = __webpack_require__(31);
var CampaignStatus;
(function (CampaignStatus) {
    CampaignStatus["ACTIVE"] = "active";
    CampaignStatus["COMPLETED"] = "completed";
    CampaignStatus["CANCELLED"] = "cancelled";
    CampaignStatus["EXPIRED"] = "expired";
})(CampaignStatus || (exports.CampaignStatus = CampaignStatus = {}));
let CrowdfundingCampaign = class CrowdfundingCampaign {
    get progressPercentage() {
        return Math.min((Number(this.raisedAmount) / Number(this.targetAmount)) * 100, 100);
    }
};
exports.CrowdfundingCampaign = CrowdfundingCampaign;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CrowdfundingCampaign.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CrowdfundingCampaign.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], CrowdfundingCampaign.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], CrowdfundingCampaign.prototype, "targetAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CrowdfundingCampaign.prototype, "raisedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: CampaignStatus, default: CampaignStatus.ACTIVE }),
    __metadata("design:type", String)
], CrowdfundingCampaign.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CrowdfundingCampaign.prototype, "shareableLink", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], CrowdfundingCampaign.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], CrowdfundingCampaign.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], CrowdfundingCampaign.prototype, "creatorId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], CrowdfundingCampaign.prototype, "walletId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], CrowdfundingCampaign.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], CrowdfundingCampaign.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'creatorId' }),
    __metadata("design:type", typeof (_d = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _d : Object)
], CrowdfundingCampaign.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => wallet_entity_1.Wallet),
    (0, typeorm_1.JoinColumn)({ name: 'walletId' }),
    __metadata("design:type", typeof (_e = typeof wallet_entity_1.Wallet !== "undefined" && wallet_entity_1.Wallet) === "function" ? _e : Object)
], CrowdfundingCampaign.prototype, "wallet", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => crowdfunding_contribution_entity_1.CrowdfundingContribution, (contribution) => contribution.campaign),
    __metadata("design:type", Array)
], CrowdfundingCampaign.prototype, "contributions", void 0);
exports.CrowdfundingCampaign = CrowdfundingCampaign = __decorate([
    (0, typeorm_1.Entity)('crowdfunding_campaigns')
], CrowdfundingCampaign);


/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CrowdfundingContribution = void 0;
const typeorm_1 = __webpack_require__(18);
const user_entity_1 = __webpack_require__(21);
const crowdfunding_campaign_entity_1 = __webpack_require__(30);
let CrowdfundingContribution = class CrowdfundingContribution {
};
exports.CrowdfundingContribution = CrowdfundingContribution;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CrowdfundingContribution.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], CrowdfundingContribution.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CrowdfundingContribution.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], CrowdfundingContribution.prototype, "isAnonymous", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CrowdfundingContribution.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], CrowdfundingContribution.prototype, "contributorId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], CrowdfundingContribution.prototype, "campaignId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], CrowdfundingContribution.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], CrowdfundingContribution.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'contributorId' }),
    __metadata("design:type", typeof (_c = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _c : Object)
], CrowdfundingContribution.prototype, "contributor", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => crowdfunding_campaign_entity_1.CrowdfundingCampaign, (campaign) => campaign.contributions),
    (0, typeorm_1.JoinColumn)({ name: 'campaignId' }),
    __metadata("design:type", typeof (_d = typeof crowdfunding_campaign_entity_1.CrowdfundingCampaign !== "undefined" && crowdfunding_campaign_entity_1.CrowdfundingCampaign) === "function" ? _d : Object)
], CrowdfundingContribution.prototype, "campaign", void 0);
exports.CrowdfundingContribution = CrowdfundingContribution = __decorate([
    (0, typeorm_1.Entity)('crowdfunding_contributions')
], CrowdfundingContribution);


/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Escrow = exports.EscrowStatus = exports.EscrowMode = exports.EscrowType = void 0;
const typeorm_1 = __webpack_require__(18);
const user_entity_1 = __webpack_require__(21);
const wallet_entity_1 = __webpack_require__(24);
const escrow_participant_entity_1 = __webpack_require__(33);
var EscrowType;
(function (EscrowType) {
    EscrowType["ONE_TIME"] = "one_time";
    EscrowType["RECURRING"] = "recurring";
})(EscrowType || (exports.EscrowType = EscrowType = {}));
var EscrowMode;
(function (EscrowMode) {
    EscrowMode["SINGLE"] = "single";
    EscrowMode["GROUP"] = "group";
})(EscrowMode || (exports.EscrowMode = EscrowMode = {}));
var EscrowStatus;
(function (EscrowStatus) {
    EscrowStatus["PENDING"] = "pending";
    EscrowStatus["FUNDED"] = "funded";
    EscrowStatus["RELEASED"] = "released";
    EscrowStatus["DISPUTED"] = "disputed";
    EscrowStatus["CANCELLED"] = "cancelled";
    EscrowStatus["EXPIRED"] = "expired";
})(EscrowStatus || (exports.EscrowStatus = EscrowStatus = {}));
let Escrow = class Escrow {
};
exports.Escrow = Escrow;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Escrow.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Escrow.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Escrow.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], Escrow.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EscrowType }),
    __metadata("design:type", String)
], Escrow.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EscrowMode }),
    __metadata("design:type", String)
], Escrow.prototype, "mode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EscrowStatus, default: EscrowStatus.PENDING }),
    __metadata("design:type", String)
], Escrow.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Escrow.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Escrow.prototype, "releaseDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Escrow.prototype, "conditions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Escrow.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Escrow.prototype, "creatorId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Escrow.prototype, "walletId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Escrow.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Escrow.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'creatorId' }),
    __metadata("design:type", typeof (_d = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _d : Object)
], Escrow.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => wallet_entity_1.Wallet),
    (0, typeorm_1.JoinColumn)({ name: 'walletId' }),
    __metadata("design:type", typeof (_e = typeof wallet_entity_1.Wallet !== "undefined" && wallet_entity_1.Wallet) === "function" ? _e : Object)
], Escrow.prototype, "wallet", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => escrow_participant_entity_1.EscrowParticipant, (participant) => participant.escrow),
    __metadata("design:type", Array)
], Escrow.prototype, "participants", void 0);
exports.Escrow = Escrow = __decorate([
    (0, typeorm_1.Entity)('escrows')
], Escrow);


/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EscrowParticipant = exports.ParticipantStatus = exports.ParticipantRole = void 0;
const typeorm_1 = __webpack_require__(18);
const user_entity_1 = __webpack_require__(21);
const escrow_entity_1 = __webpack_require__(32);
var ParticipantRole;
(function (ParticipantRole) {
    ParticipantRole["PAYER"] = "payer";
    ParticipantRole["PAYEE"] = "payee";
    ParticipantRole["ARBITRATOR"] = "arbitrator";
})(ParticipantRole || (exports.ParticipantRole = ParticipantRole = {}));
var ParticipantStatus;
(function (ParticipantStatus) {
    ParticipantStatus["INVITED"] = "invited";
    ParticipantStatus["ACCEPTED"] = "accepted";
    ParticipantStatus["DECLINED"] = "declined";
})(ParticipantStatus || (exports.ParticipantStatus = ParticipantStatus = {}));
let EscrowParticipant = class EscrowParticipant {
};
exports.EscrowParticipant = EscrowParticipant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EscrowParticipant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ParticipantRole }),
    __metadata("design:type", String)
], EscrowParticipant.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ParticipantStatus, default: ParticipantStatus.INVITED }),
    __metadata("design:type", String)
], EscrowParticipant.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], EscrowParticipant.prototype, "contributionAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], EscrowParticipant.prototype, "acceptedAt", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], EscrowParticipant.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], EscrowParticipant.prototype, "escrowId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], EscrowParticipant.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], EscrowParticipant.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", typeof (_d = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _d : Object)
], EscrowParticipant.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => escrow_entity_1.Escrow, (escrow) => escrow.participants),
    (0, typeorm_1.JoinColumn)({ name: 'escrowId' }),
    __metadata("design:type", typeof (_e = typeof escrow_entity_1.Escrow !== "undefined" && escrow_entity_1.Escrow) === "function" ? _e : Object)
], EscrowParticipant.prototype, "escrow", void 0);
exports.EscrowParticipant = EscrowParticipant = __decorate([
    (0, typeorm_1.Entity)('escrow_participants')
], EscrowParticipant);


/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LedgerEntry = exports.LedgerStatus = exports.LedgerProvider = exports.LedgerEntryType = void 0;
const typeorm_1 = __webpack_require__(18);
var LedgerEntryType;
(function (LedgerEntryType) {
    LedgerEntryType["DEBIT"] = "debit";
    LedgerEntryType["CREDIT"] = "credit";
})(LedgerEntryType || (exports.LedgerEntryType = LedgerEntryType = {}));
var LedgerProvider;
(function (LedgerProvider) {
    LedgerProvider["PROVIDUS"] = "providus";
    LedgerProvider["FLUTTERWAVE"] = "flutterwave";
    LedgerProvider["INTERSWITCH"] = "interswitch";
    LedgerProvider["INTERNAL"] = "internal";
})(LedgerProvider || (exports.LedgerProvider = LedgerProvider = {}));
var LedgerStatus;
(function (LedgerStatus) {
    LedgerStatus["PENDING"] = "pending";
    LedgerStatus["COMPLETED"] = "completed";
    LedgerStatus["FAILED"] = "failed";
    LedgerStatus["RECONCILED"] = "reconciled";
})(LedgerStatus || (exports.LedgerStatus = LedgerStatus = {}));
let LedgerEntry = class LedgerEntry {
};
exports.LedgerEntry = LedgerEntry;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LedgerEntry.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LedgerEntry.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: LedgerEntryType }),
    __metadata("design:type", String)
], LedgerEntry.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], LedgerEntry.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], LedgerEntry.prototype, "fee", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LedgerEntry.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: LedgerProvider }),
    __metadata("design:type", String)
], LedgerEntry.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], LedgerEntry.prototype, "providerReference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: LedgerStatus }),
    __metadata("design:type", String)
], LedgerEntry.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], LedgerEntry.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], LedgerEntry.prototype, "walletId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], LedgerEntry.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], LedgerEntry.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], LedgerEntry.prototype, "reconciledAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], LedgerEntry.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], LedgerEntry.prototype, "updatedAt", void 0);
exports.LedgerEntry = LedgerEntry = __decorate([
    (0, typeorm_1.Entity)('ledger_entries'),
    (0, typeorm_1.Index)(['userId', 'createdAt']),
    (0, typeorm_1.Index)(['provider', 'providerReference']),
    (0, typeorm_1.Index)(['reference'])
], LedgerEntry);


/***/ }),
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReconciliationRecord = exports.ReconciliationStatus = exports.ReconciliationType = void 0;
const typeorm_1 = __webpack_require__(18);
var ReconciliationType;
(function (ReconciliationType) {
    ReconciliationType["AUTOMATIC"] = "automatic";
    ReconciliationType["MANUAL"] = "manual";
})(ReconciliationType || (exports.ReconciliationType = ReconciliationType = {}));
var ReconciliationStatus;
(function (ReconciliationStatus) {
    ReconciliationStatus["PENDING"] = "pending";
    ReconciliationStatus["COMPLETED"] = "completed";
    ReconciliationStatus["FAILED"] = "failed";
})(ReconciliationStatus || (exports.ReconciliationStatus = ReconciliationStatus = {}));
let ReconciliationRecord = class ReconciliationRecord {
};
exports.ReconciliationRecord = ReconciliationRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ReconciliationRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ReconciliationType }),
    __metadata("design:type", String)
], ReconciliationRecord.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ReconciliationStatus }),
    __metadata("design:type", String)
], ReconciliationRecord.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], ReconciliationRecord.prototype, "reconciliationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ReconciliationRecord.prototype, "totalEntries", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ReconciliationRecord.prototype, "reconciledEntries", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ReconciliationRecord.prototype, "discrepancies", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ReconciliationRecord.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], ReconciliationRecord.prototype, "discrepancyDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReconciliationRecord.prototype, "performedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], ReconciliationRecord.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], ReconciliationRecord.prototype, "updatedAt", void 0);
exports.ReconciliationRecord = ReconciliationRecord = __decorate([
    (0, typeorm_1.Entity)('reconciliation_records')
], ReconciliationRecord);


/***/ }),
/* 36 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RecurringPayment = exports.RecurringStatus = exports.RecurrenceFrequency = void 0;
const typeorm_1 = __webpack_require__(18);
const user_entity_1 = __webpack_require__(21);
const transaction_entity_1 = __webpack_require__(25);
var RecurrenceFrequency;
(function (RecurrenceFrequency) {
    RecurrenceFrequency["DAILY"] = "daily";
    RecurrenceFrequency["WEEKLY"] = "weekly";
    RecurrenceFrequency["MONTHLY"] = "monthly";
    RecurrenceFrequency["CUSTOM"] = "custom";
})(RecurrenceFrequency || (exports.RecurrenceFrequency = RecurrenceFrequency = {}));
var RecurringStatus;
(function (RecurringStatus) {
    RecurringStatus["ACTIVE"] = "active";
    RecurringStatus["PAUSED"] = "paused";
    RecurringStatus["CANCELLED"] = "cancelled";
})(RecurringStatus || (exports.RecurringStatus = RecurringStatus = {}));
let RecurringPayment = class RecurringPayment {
};
exports.RecurringPayment = RecurringPayment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RecurringPayment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], RecurringPayment.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], RecurringPayment.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object)
], RecurringPayment.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => transaction_entity_1.Transaction),
    (0, typeorm_1.JoinColumn)({ name: 'transactionId' }),
    __metadata("design:type", typeof (_b = typeof transaction_entity_1.Transaction !== "undefined" && transaction_entity_1.Transaction) === "function" ? _b : Object)
], RecurringPayment.prototype, "transaction", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], RecurringPayment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RecurringPayment.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: RecurrenceFrequency }),
    __metadata("design:type", String)
], RecurringPayment.prototype, "frequency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: RecurringStatus, default: RecurringStatus.ACTIVE }),
    __metadata("design:type", String)
], RecurringPayment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], RecurringPayment.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], RecurringPayment.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], RecurringPayment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], RecurringPayment.prototype, "updatedAt", void 0);
exports.RecurringPayment = RecurringPayment = __decorate([
    (0, typeorm_1.Entity)('recurring_payments')
], RecurringPayment);


/***/ }),
/* 37 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Reward = exports.RewardCategory = exports.RewardType = void 0;
const typeorm_1 = __webpack_require__(18);
const user_reward_entity_1 = __webpack_require__(38);
var RewardType;
(function (RewardType) {
    RewardType["CASHBACK"] = "cashback";
    RewardType["DISCOUNT"] = "discount";
    RewardType["STREAK_BONUS"] = "streak_bonus";
    RewardType["MILESTONE"] = "milestone";
})(RewardType || (exports.RewardType = RewardType = {}));
var RewardCategory;
(function (RewardCategory) {
    RewardCategory["BILL_PAYMENT"] = "bill_payment";
    RewardCategory["TRANSFER"] = "transfer";
    RewardCategory["GENERAL"] = "general";
})(RewardCategory || (exports.RewardCategory = RewardCategory = {}));
let Reward = class Reward {
};
exports.Reward = Reward;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Reward.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Reward.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Reward.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: RewardType }),
    __metadata("design:type", String)
], Reward.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: RewardCategory }),
    __metadata("design:type", String)
], Reward.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], Reward.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Object)
], Reward.prototype, "conditions", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Reward.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Reward.prototype, "validFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Reward.prototype, "validUntil", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Reward.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Reward.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_reward_entity_1.UserReward, (userReward) => userReward.reward),
    __metadata("design:type", Array)
], Reward.prototype, "userRewards", void 0);
exports.Reward = Reward = __decorate([
    (0, typeorm_1.Entity)('rewards')
], Reward);


/***/ }),
/* 38 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserReward = exports.UserRewardStatus = void 0;
const typeorm_1 = __webpack_require__(18);
const user_entity_1 = __webpack_require__(21);
const reward_entity_1 = __webpack_require__(37);
const transaction_entity_1 = __webpack_require__(25);
var UserRewardStatus;
(function (UserRewardStatus) {
    UserRewardStatus["EARNED"] = "earned";
    UserRewardStatus["REDEEMED"] = "redeemed";
    UserRewardStatus["EXPIRED"] = "expired";
})(UserRewardStatus || (exports.UserRewardStatus = UserRewardStatus = {}));
let UserReward = class UserReward {
};
exports.UserReward = UserReward;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserReward.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], UserReward.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: UserRewardStatus, default: UserRewardStatus.EARNED }),
    __metadata("design:type", String)
], UserReward.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserReward.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], UserReward.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], UserReward.prototype, "redeemedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], UserReward.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], UserReward.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], UserReward.prototype, "rewardId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], UserReward.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], UserReward.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], UserReward.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", typeof (_e = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _e : Object)
], UserReward.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => reward_entity_1.Reward),
    (0, typeorm_1.JoinColumn)({ name: 'rewardId' }),
    __metadata("design:type", typeof (_f = typeof reward_entity_1.Reward !== "undefined" && reward_entity_1.Reward) === "function" ? _f : Object)
], UserReward.prototype, "reward", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => transaction_entity_1.Transaction, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'transactionId' }),
    __metadata("design:type", typeof (_g = typeof transaction_entity_1.Transaction !== "undefined" && transaction_entity_1.Transaction) === "function" ? _g : Object)
], UserReward.prototype, "transaction", void 0);
exports.UserReward = UserReward = __decorate([
    (0, typeorm_1.Entity)('user_rewards')
], UserReward);


/***/ }),
/* 39 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RewardRule = exports.RuleType = void 0;
const typeorm_1 = __webpack_require__(18);
var RuleType;
(function (RuleType) {
    RuleType["STREAK"] = "streak";
    RuleType["AMOUNT_THRESHOLD"] = "amount_threshold";
    RuleType["FREQUENCY"] = "frequency";
    RuleType["CATEGORY_SPENDING"] = "category_spending";
})(RuleType || (exports.RuleType = RuleType = {}));
let RewardRule = class RewardRule {
};
exports.RewardRule = RewardRule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RewardRule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RewardRule.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: RuleType }),
    __metadata("design:type", String)
], RewardRule.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Object)
], RewardRule.prototype, "conditions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Object)
], RewardRule.prototype, "rewards", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], RewardRule.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], RewardRule.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], RewardRule.prototype, "updatedAt", void 0);
exports.RewardRule = RewardRule = __decorate([
    (0, typeorm_1.Entity)('reward_rules')
], RewardRule);


/***/ }),
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScheduledTransfer = exports.ScheduleStatus = exports.ScheduleFrequency = void 0;
const typeorm_1 = __webpack_require__(18);
const user_entity_1 = __webpack_require__(21);
var ScheduleFrequency;
(function (ScheduleFrequency) {
    ScheduleFrequency["ONE_TIME"] = "one_time";
    ScheduleFrequency["DAILY"] = "daily";
    ScheduleFrequency["WEEKLY"] = "weekly";
    ScheduleFrequency["MONTHLY"] = "monthly";
    ScheduleFrequency["CUSTOM"] = "custom";
})(ScheduleFrequency || (exports.ScheduleFrequency = ScheduleFrequency = {}));
var ScheduleStatus;
(function (ScheduleStatus) {
    ScheduleStatus["ACTIVE"] = "active";
    ScheduleStatus["PAUSED"] = "paused";
    ScheduleStatus["COMPLETED"] = "completed";
    ScheduleStatus["CANCELLED"] = "cancelled";
})(ScheduleStatus || (exports.ScheduleStatus = ScheduleStatus = {}));
let ScheduledTransfer = class ScheduledTransfer {
};
exports.ScheduledTransfer = ScheduledTransfer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ScheduledTransfer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ScheduledTransfer.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], ScheduledTransfer.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ScheduleFrequency }),
    __metadata("design:type", String)
], ScheduledTransfer.prototype, "frequency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ScheduleStatus, default: ScheduleStatus.ACTIVE }),
    __metadata("design:type", String)
], ScheduledTransfer.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], ScheduledTransfer.prototype, "nextExecutionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], ScheduledTransfer.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ScheduledTransfer.prototype, "executionCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ScheduledTransfer.prototype, "maxExecutions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Object)
], ScheduledTransfer.prototype, "transferTemplate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], ScheduledTransfer.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], ScheduledTransfer.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], ScheduledTransfer.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], ScheduledTransfer.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", typeof (_e = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _e : Object)
], ScheduledTransfer.prototype, "user", void 0);
exports.ScheduledTransfer = ScheduledTransfer = __decorate([
    (0, typeorm_1.Entity)('scheduled_transfers')
], ScheduledTransfer);


/***/ }),
/* 41 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SharedWallet = exports.SharedWalletStatus = exports.SharedWalletMode = void 0;
const typeorm_1 = __webpack_require__(18);
const user_entity_1 = __webpack_require__(21);
const wallet_entity_1 = __webpack_require__(24);
const shared_wallet_member_entity_1 = __webpack_require__(42);
const shared_wallet_transaction_entity_1 = __webpack_require__(43);
var SharedWalletMode;
(function (SharedWalletMode) {
    SharedWalletMode["FREE_ACTION"] = "free_action";
    SharedWalletMode["SIGNATORY_REQUIRED"] = "signatory_required";
})(SharedWalletMode || (exports.SharedWalletMode = SharedWalletMode = {}));
var SharedWalletStatus;
(function (SharedWalletStatus) {
    SharedWalletStatus["ACTIVE"] = "active";
    SharedWalletStatus["SUSPENDED"] = "suspended";
    SharedWalletStatus["CLOSED"] = "closed";
})(SharedWalletStatus || (exports.SharedWalletStatus = SharedWalletStatus = {}));
let SharedWallet = class SharedWallet {
};
exports.SharedWallet = SharedWallet;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SharedWallet.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SharedWallet.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], SharedWallet.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SharedWalletMode }),
    __metadata("design:type", String)
], SharedWallet.prototype, "mode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SharedWalletStatus, default: SharedWalletStatus.ACTIVE }),
    __metadata("design:type", String)
], SharedWallet.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], SharedWallet.prototype, "requiredSignatures", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], SharedWallet.prototype, "rules", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], SharedWallet.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], SharedWallet.prototype, "creatorId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], SharedWallet.prototype, "walletId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], SharedWallet.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], SharedWallet.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'creatorId' }),
    __metadata("design:type", typeof (_c = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _c : Object)
], SharedWallet.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => wallet_entity_1.Wallet),
    (0, typeorm_1.JoinColumn)({ name: 'walletId' }),
    __metadata("design:type", typeof (_d = typeof wallet_entity_1.Wallet !== "undefined" && wallet_entity_1.Wallet) === "function" ? _d : Object)
], SharedWallet.prototype, "wallet", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => shared_wallet_member_entity_1.SharedWalletMember, (member) => member.sharedWallet),
    __metadata("design:type", Array)
], SharedWallet.prototype, "members", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => shared_wallet_transaction_entity_1.SharedWalletTransaction, (transaction) => transaction.sharedWallet),
    __metadata("design:type", Array)
], SharedWallet.prototype, "transactions", void 0);
exports.SharedWallet = SharedWallet = __decorate([
    (0, typeorm_1.Entity)('shared_wallets')
], SharedWallet);


/***/ }),
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SharedWalletMember = exports.MemberStatus = exports.MemberRole = void 0;
const typeorm_1 = __webpack_require__(18);
const user_entity_1 = __webpack_require__(21);
const shared_wallet_entity_1 = __webpack_require__(41);
var MemberRole;
(function (MemberRole) {
    MemberRole["ADMIN"] = "admin";
    MemberRole["MEMBER"] = "member";
    MemberRole["VIEWER"] = "viewer";
})(MemberRole || (exports.MemberRole = MemberRole = {}));
var MemberStatus;
(function (MemberStatus) {
    MemberStatus["INVITED"] = "invited";
    MemberStatus["ACTIVE"] = "active";
    MemberStatus["SUSPENDED"] = "suspended";
})(MemberStatus || (exports.MemberStatus = MemberStatus = {}));
let SharedWalletMember = class SharedWalletMember {
};
exports.SharedWalletMember = SharedWalletMember;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SharedWalletMember.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: MemberRole }),
    __metadata("design:type", String)
], SharedWalletMember.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: MemberStatus, default: MemberStatus.INVITED }),
    __metadata("design:type", String)
], SharedWalletMember.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], SharedWalletMember.prototype, "spendingLimit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], SharedWalletMember.prototype, "permissions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], SharedWalletMember.prototype, "joinedAt", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], SharedWalletMember.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], SharedWalletMember.prototype, "sharedWalletId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], SharedWalletMember.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], SharedWalletMember.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", typeof (_d = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _d : Object)
], SharedWalletMember.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => shared_wallet_entity_1.SharedWallet, (sharedWallet) => sharedWallet.members),
    (0, typeorm_1.JoinColumn)({ name: 'sharedWalletId' }),
    __metadata("design:type", typeof (_e = typeof shared_wallet_entity_1.SharedWallet !== "undefined" && shared_wallet_entity_1.SharedWallet) === "function" ? _e : Object)
], SharedWalletMember.prototype, "sharedWallet", void 0);
exports.SharedWalletMember = SharedWalletMember = __decorate([
    (0, typeorm_1.Entity)('shared_wallet_members')
], SharedWalletMember);


/***/ }),
/* 43 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SharedWalletTransaction = exports.SharedTransactionStatus = exports.SharedTransactionType = void 0;
const typeorm_1 = __webpack_require__(18);
const user_entity_1 = __webpack_require__(21);
const shared_wallet_entity_1 = __webpack_require__(41);
const transaction_signature_entity_1 = __webpack_require__(44);
var SharedTransactionType;
(function (SharedTransactionType) {
    SharedTransactionType["CREDIT"] = "credit";
    SharedTransactionType["DEBIT"] = "debit";
    SharedTransactionType["TRANSFER"] = "transfer";
})(SharedTransactionType || (exports.SharedTransactionType = SharedTransactionType = {}));
var SharedTransactionStatus;
(function (SharedTransactionStatus) {
    SharedTransactionStatus["PENDING"] = "pending";
    SharedTransactionStatus["APPROVED"] = "approved";
    SharedTransactionStatus["REJECTED"] = "rejected";
    SharedTransactionStatus["EXECUTED"] = "executed";
})(SharedTransactionStatus || (exports.SharedTransactionStatus = SharedTransactionStatus = {}));
let SharedWalletTransaction = class SharedWalletTransaction {
};
exports.SharedWalletTransaction = SharedWalletTransaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SharedWalletTransaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], SharedWalletTransaction.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SharedTransactionType }),
    __metadata("design:type", String)
], SharedWalletTransaction.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SharedTransactionStatus, default: SharedTransactionStatus.PENDING }),
    __metadata("design:type", String)
], SharedWalletTransaction.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SharedWalletTransaction.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SharedWalletTransaction.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], SharedWalletTransaction.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], SharedWalletTransaction.prototype, "initiatorId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], SharedWalletTransaction.prototype, "sharedWalletId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], SharedWalletTransaction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], SharedWalletTransaction.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'initiatorId' }),
    __metadata("design:type", typeof (_c = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _c : Object)
], SharedWalletTransaction.prototype, "initiator", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => shared_wallet_entity_1.SharedWallet, (sharedWallet) => sharedWallet.transactions),
    (0, typeorm_1.JoinColumn)({ name: 'sharedWalletId' }),
    __metadata("design:type", typeof (_d = typeof shared_wallet_entity_1.SharedWallet !== "undefined" && shared_wallet_entity_1.SharedWallet) === "function" ? _d : Object)
], SharedWalletTransaction.prototype, "sharedWallet", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => transaction_signature_entity_1.TransactionSignature, (signature) => signature.transaction),
    __metadata("design:type", Array)
], SharedWalletTransaction.prototype, "signatures", void 0);
exports.SharedWalletTransaction = SharedWalletTransaction = __decorate([
    (0, typeorm_1.Entity)('shared_wallet_transactions')
], SharedWalletTransaction);


/***/ }),
/* 44 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionSignature = exports.SignatureStatus = void 0;
const typeorm_1 = __webpack_require__(18);
const user_entity_1 = __webpack_require__(21);
const shared_wallet_transaction_entity_1 = __webpack_require__(43);
var SignatureStatus;
(function (SignatureStatus) {
    SignatureStatus["PENDING"] = "pending";
    SignatureStatus["APPROVED"] = "approved";
    SignatureStatus["REJECTED"] = "rejected";
})(SignatureStatus || (exports.SignatureStatus = SignatureStatus = {}));
let TransactionSignature = class TransactionSignature {
};
exports.TransactionSignature = TransactionSignature;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TransactionSignature.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SignatureStatus, default: SignatureStatus.PENDING }),
    __metadata("design:type", String)
], TransactionSignature.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TransactionSignature.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], TransactionSignature.prototype, "signerId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], TransactionSignature.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], TransactionSignature.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'signerId' }),
    __metadata("design:type", typeof (_b = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _b : Object)
], TransactionSignature.prototype, "signer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => shared_wallet_transaction_entity_1.SharedWalletTransaction, (transaction) => transaction.signatures),
    (0, typeorm_1.JoinColumn)({ name: 'transactionId' }),
    __metadata("design:type", typeof (_c = typeof shared_wallet_transaction_entity_1.SharedWalletTransaction !== "undefined" && shared_wallet_transaction_entity_1.SharedWalletTransaction) === "function" ? _c : Object)
], TransactionSignature.prototype, "transaction", void 0);
exports.TransactionSignature = TransactionSignature = __decorate([
    (0, typeorm_1.Entity)('transaction_signatures')
], TransactionSignature);


/***/ }),
/* 45 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SpendingInsight = exports.InsightPriority = exports.InsightType = void 0;
const typeorm_1 = __webpack_require__(18);
const user_entity_1 = __webpack_require__(21);
var InsightType;
(function (InsightType) {
    InsightType["SPENDING_PATTERN"] = "spending_pattern";
    InsightType["BUDGET_ALERT"] = "budget_alert";
    InsightType["SAVING_OPPORTUNITY"] = "saving_opportunity";
    InsightType["CATEGORY_ANALYSIS"] = "category_analysis";
})(InsightType || (exports.InsightType = InsightType = {}));
var InsightPriority;
(function (InsightPriority) {
    InsightPriority["LOW"] = "low";
    InsightPriority["MEDIUM"] = "medium";
    InsightPriority["HIGH"] = "high";
    InsightPriority["CRITICAL"] = "critical";
})(InsightPriority || (exports.InsightPriority = InsightPriority = {}));
let SpendingInsight = class SpendingInsight {
};
exports.SpendingInsight = SpendingInsight;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SpendingInsight.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: InsightType }),
    __metadata("design:type", String)
], SpendingInsight.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: InsightPriority }),
    __metadata("design:type", String)
], SpendingInsight.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SpendingInsight.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], SpendingInsight.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], SpendingInsight.prototype, "recommendation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Object)
], SpendingInsight.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], SpendingInsight.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], SpendingInsight.prototype, "isActioned", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], SpendingInsight.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], SpendingInsight.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], SpendingInsight.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", typeof (_c = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _c : Object)
], SpendingInsight.prototype, "user", void 0);
exports.SpendingInsight = SpendingInsight = __decorate([
    (0, typeorm_1.Entity)('spending_insights')
], SpendingInsight);


/***/ }),
/* 46 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Transfer = exports.TransferStatus = exports.TransferType = void 0;
const typeorm_1 = __webpack_require__(18);
const user_entity_1 = __webpack_require__(21);
const wallet_entity_1 = __webpack_require__(24);
var TransferType;
(function (TransferType) {
    TransferType["WALLET_TO_WALLET"] = "wallet_to_wallet";
    TransferType["WALLET_TO_BANK"] = "wallet_to_bank";
    TransferType["BANK_TO_WALLET"] = "bank_to_wallet";
})(TransferType || (exports.TransferType = TransferType = {}));
var TransferStatus;
(function (TransferStatus) {
    TransferStatus["PENDING"] = "pending";
    TransferStatus["PROCESSING"] = "processing";
    TransferStatus["COMPLETED"] = "completed";
    TransferStatus["FAILED"] = "failed";
    TransferStatus["CANCELLED"] = "cancelled";
})(TransferStatus || (exports.TransferStatus = TransferStatus = {}));
let Transfer = class Transfer {
};
exports.Transfer = Transfer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Transfer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], Transfer.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Transfer.prototype, "fee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TransferType }),
    __metadata("design:type", String)
], Transfer.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TransferStatus, default: TransferStatus.PENDING }),
    __metadata("design:type", String)
], Transfer.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Transfer.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Transfer.prototype, "providerReference", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Transfer.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Object)
], Transfer.prototype, "sourceDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Object)
], Transfer.prototype, "destinationDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Transfer.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Transfer.prototype, "failureReason", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Transfer.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], Transfer.prototype, "sourceWalletId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], Transfer.prototype, "destinationWalletId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Transfer.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Transfer.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", typeof (_c = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _c : Object)
], Transfer.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => wallet_entity_1.Wallet, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'sourceWalletId' }),
    __metadata("design:type", typeof (_d = typeof wallet_entity_1.Wallet !== "undefined" && wallet_entity_1.Wallet) === "function" ? _d : Object)
], Transfer.prototype, "sourceWallet", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => wallet_entity_1.Wallet, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'destinationWalletId' }),
    __metadata("design:type", typeof (_e = typeof wallet_entity_1.Wallet !== "undefined" && wallet_entity_1.Wallet) === "function" ? _e : Object)
], Transfer.prototype, "destinationWallet", void 0);
exports.Transfer = Transfer = __decorate([
    (0, typeorm_1.Entity)('transfers')
], Transfer);


/***/ }),
/* 47 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MIGRATIONS = void 0;
const _001_initial_schema_1 = __webpack_require__(48);
const _002_escrow_tables_1 = __webpack_require__(49);
const _003_bill_splitting_tables_1 = __webpack_require__(50);
const _004_crowdfunding_tables_1 = __webpack_require__(51);
const _005_shared_wallets_tables_1 = __webpack_require__(52);
const _006_ai_insights_tables_1 = __webpack_require__(53);
const _007_rewards_tables_1 = __webpack_require__(54);
const _008_ledger_tables_1 = __webpack_require__(55);
const _009_transfers_tables_1 = __webpack_require__(56);
const _010_recurring_payments_table_1 = __webpack_require__(57);
const _011_fix_users_columns_1 = __webpack_require__(58);
const _012_wallet_bank_account_1 = __webpack_require__(59);
exports.MIGRATIONS = [
    _001_initial_schema_1.InitialSchema1703001000000,
    _002_escrow_tables_1.EscrowTables1703002000000,
    _003_bill_splitting_tables_1.BillSplittingTables1703003000000,
    _004_crowdfunding_tables_1.CrowdfundingTables1703004000000,
    _005_shared_wallets_tables_1.SharedWalletsTables1703005000000,
    _006_ai_insights_tables_1.AiInsightsTables1703006000000,
    _007_rewards_tables_1.RewardsTables1703007000000,
    _008_ledger_tables_1.LedgerTables1703008000000,
    _009_transfers_tables_1.TransfersTables1703009000000,
    _010_recurring_payments_table_1.RecurringPaymentsTable1703010000000,
    _011_fix_users_columns_1.FixUsersColumns1703011000000,
    _012_wallet_bank_account_1.WalletBankAccount1703012000000,
];


/***/ }),
/* 48 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InitialSchema1703001000000 = void 0;
class InitialSchema1703001000000 {
    constructor() {
        this.name = 'InitialSchema1703001000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" varchar UNIQUE NOT NULL,
        "username" varchar UNIQUE,
        "password" varchar,
        "firstName" varchar,
        "lastName" varchar,
        "bvn" bigint,
        "nin" bigint,
        "accountNumber" bigint,
        "bank" varchar,
        "accountName" varchar,
        "address" varchar,
        "dateOfBirth" varchar,
        "biometricPublicKey" text,
        "phone" varchar UNIQUE,
        "role" varchar DEFAULT 'user',
        "codes" jsonb DEFAULT '[]',
        "isActive" boolean DEFAULT true,
        "isEmailVerified" boolean DEFAULT false,
        "isPhoneVerified" boolean DEFAULT false,
        "kycStatus" varchar DEFAULT 'not_started',
        "lastLoginAt" timestamp,
        "loginDevice" varchar,
        "pin" varchar,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "bills" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar NOT NULL,
        "billerCode" varchar NOT NULL,
        "itemCode" varchar NOT NULL,
        "category" varchar NOT NULL,
        "provider" varchar NOT NULL,
        "fee" decimal(10,2) NOT NULL,
        "minimumAmount" decimal(10,2),
        "maximumAmount" decimal(10,2),
        "isActive" boolean DEFAULT true,
        "hasDowntime" boolean DEFAULT false,
        "downtimeStart" timestamp,
        "downtimeEnd" timestamp,
        "metadata" jsonb,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "wallets" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "customerId" varchar NOT NULL,
        "balance" decimal(15,2) DEFAULT 0,
        "type" varchar DEFAULT 'main',
        "name" varchar NOT NULL,
        "currency" varchar DEFAULT 'NGN',
        "isActive" boolean DEFAULT true,
        "userId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "bill_payments" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "amount" decimal(15,2) NOT NULL,
        "customer" varchar NOT NULL,
        "status" varchar DEFAULT 'pending',
        "reference" varchar NOT NULL,
        "providerReference" varchar,
        "failureReason" varchar,
        "metadata" jsonb,
        "userId" uuid NOT NULL,
        "billId" uuid NOT NULL,
        "walletId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("billId") REFERENCES "bills"("id") ON DELETE CASCADE,
        FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "transactions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "amount" decimal(15,2) NOT NULL,
        "type" varchar NOT NULL,
        "status" varchar DEFAULT 'pending',
        "reference" varchar NOT NULL,
        "description" varchar,
        "metadata" jsonb,
        "providerReference" varchar,
        "failureReason" varchar,
        "userId" uuid NOT NULL,
        "walletId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "notifications" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" varchar NOT NULL,
        "message" text NOT NULL,
        "type" varchar NOT NULL,
        "channel" varchar NOT NULL,
        "isRead" boolean DEFAULT false,
        "metadata" jsonb,
        "userId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "notifications"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "transactions"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "wallets"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    }
}
exports.InitialSchema1703001000000 = InitialSchema1703001000000;


/***/ }),
/* 49 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EscrowTables1703002000000 = void 0;
class EscrowTables1703002000000 {
    constructor() {
        this.name = 'EscrowTables1703002000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "escrows" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" varchar NOT NULL,
        "description" text NOT NULL,
        "amount" decimal(15,2) NOT NULL,
        "type" varchar NOT NULL,
        "mode" varchar NOT NULL,
        "status" varchar DEFAULT 'pending',
        "reference" varchar NOT NULL,
        "releaseDate" timestamp NOT NULL,
        "conditions" jsonb,
        "metadata" jsonb,
        "creatorId" uuid NOT NULL,
        "walletId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "escrow_participants" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "role" varchar NOT NULL,
        "status" varchar DEFAULT 'invited',
        "contributionAmount" decimal(15,2),
        "acceptedAt" timestamp,
        "userId" uuid NOT NULL,
        "escrowId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("escrowId") REFERENCES "escrows"("id") ON DELETE CASCADE
      )
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "escrow_participants"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "escrows"`);
    }
}
exports.EscrowTables1703002000000 = EscrowTables1703002000000;


/***/ }),
/* 50 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillSplittingTables1703003000000 = void 0;
class BillSplittingTables1703003000000 {
    constructor() {
        this.name = 'BillSplittingTables1703003000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "bill_splits" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" varchar NOT NULL,
        "description" text NOT NULL,
        "totalAmount" decimal(15,2) NOT NULL,
        "type" varchar NOT NULL,
        "frequency" varchar NOT NULL,
        "status" varchar DEFAULT 'pending',
        "reference" varchar NOT NULL,
        "nextExecutionDate" timestamp,
        "schedule" jsonb,
        "metadata" jsonb,
        "creatorId" uuid NOT NULL,
        "walletId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "bill_split_participants" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "role" varchar NOT NULL,
        "status" varchar DEFAULT 'invited',
        "amount" decimal(15,2) NOT NULL,
        "lastPaymentDate" timestamp,
        "nextReminderDate" timestamp,
        "userId" uuid NOT NULL,
        "walletId" uuid NOT NULL,
        "billSplitId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE,
        FOREIGN KEY ("billSplitId") REFERENCES "bill_splits"("id") ON DELETE CASCADE
      )
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "bill_split_participants"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "bill_splits"`);
    }
}
exports.BillSplittingTables1703003000000 = BillSplittingTables1703003000000;


/***/ }),
/* 51 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CrowdfundingTables1703004000000 = void 0;
class CrowdfundingTables1703004000000 {
    constructor() {
        this.name = 'CrowdfundingTables1703004000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "crowdfunding_campaigns" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" varchar NOT NULL,
        "description" text NOT NULL,
        "targetAmount" decimal(15,2) NOT NULL,
        "raisedAmount" decimal(15,2) DEFAULT 0,
        "status" varchar DEFAULT 'active',
        "shareableLink" varchar NOT NULL,
        "endDate" timestamp NOT NULL,
        "metadata" jsonb,
        "creatorId" uuid NOT NULL,
        "walletId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "crowdfunding_contributions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "amount" decimal(15,2) NOT NULL,
        "message" varchar,
        "isAnonymous" boolean DEFAULT false,
        "reference" varchar NOT NULL,
        "contributorId" uuid NOT NULL,
        "campaignId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("contributorId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("campaignId") REFERENCES "crowdfunding_campaigns"("id") ON DELETE CASCADE
      )
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "crowdfunding_contributions"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "crowdfunding_campaigns"`);
    }
}
exports.CrowdfundingTables1703004000000 = CrowdfundingTables1703004000000;


/***/ }),
/* 52 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SharedWalletsTables1703005000000 = void 0;
class SharedWalletsTables1703005000000 {
    constructor() {
        this.name = 'SharedWalletsTables1703005000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "shared_wallets" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar NOT NULL,
        "description" text,
        "mode" varchar NOT NULL,
        "status" varchar DEFAULT 'active',
        "requiredSignatures" int DEFAULT 1,
        "rules" jsonb,
        "metadata" jsonb,
        "creatorId" uuid NOT NULL,
        "walletId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "shared_wallet_members" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "role" varchar NOT NULL,
        "status" varchar DEFAULT 'invited',
        "spendingLimit" decimal(15,2),
        "permissions" jsonb,
        "joinedAt" timestamp,
        "userId" uuid NOT NULL,
        "sharedWalletId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("sharedWalletId") REFERENCES "shared_wallets"("id") ON DELETE CASCADE
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "shared_wallet_transactions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "amount" decimal(15,2) NOT NULL,
        "type" varchar NOT NULL,
        "status" varchar DEFAULT 'pending',
        "reference" varchar NOT NULL,
        "description" varchar,
        "metadata" jsonb,
        "initiatorId" uuid NOT NULL,
        "sharedWalletId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("initiatorId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("sharedWalletId") REFERENCES "shared_wallets"("id") ON DELETE CASCADE
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "transaction_signatures" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "status" varchar DEFAULT 'pending',
        "comment" varchar,
        "signerId" uuid NOT NULL,
        "transactionId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        FOREIGN KEY ("signerId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("transactionId") REFERENCES "shared_wallet_transactions"("id") ON DELETE CASCADE
      )
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "transaction_signatures"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "shared_wallet_transactions"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "shared_wallet_members"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "shared_wallets"`);
    }
}
exports.SharedWalletsTables1703005000000 = SharedWalletsTables1703005000000;


/***/ }),
/* 53 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiInsightsTables1703006000000 = void 0;
class AiInsightsTables1703006000000 {
    constructor() {
        this.name = 'AiInsightsTables1703006000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "spending_insights" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "type" varchar NOT NULL,
        "priority" varchar NOT NULL,
        "title" varchar NOT NULL,
        "description" text NOT NULL,
        "recommendation" text NOT NULL,
        "data" jsonb NOT NULL,
        "isRead" boolean DEFAULT false,
        "isActioned" boolean DEFAULT false,
        "userId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "budget_recommendations" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "type" varchar NOT NULL,
        "category" varchar NOT NULL,
        "currentSpending" decimal(15,2) NOT NULL,
        "recommendedSpending" decimal(15,2) NOT NULL,
        "potentialSavings" decimal(15,2) NOT NULL,
        "explanation" text NOT NULL,
        "actionItems" jsonb NOT NULL,
        "isImplemented" boolean DEFAULT false,
        "userId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "budget_recommendations"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "spending_insights"`);
    }
}
exports.AiInsightsTables1703006000000 = AiInsightsTables1703006000000;


/***/ }),
/* 54 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RewardsTables1703007000000 = void 0;
class RewardsTables1703007000000 {
    constructor() {
        this.name = 'RewardsTables1703007000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "rewards" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar NOT NULL,
        "description" text NOT NULL,
        "type" varchar NOT NULL,
        "category" varchar NOT NULL,
        "value" decimal(5,2) NOT NULL,
        "conditions" jsonb NOT NULL,
        "isActive" boolean DEFAULT true,
        "validFrom" timestamp,
        "validUntil" timestamp,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_rewards" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "amount" decimal(15,2) NOT NULL,
        "status" varchar DEFAULT 'earned',
        "reference" varchar NOT NULL,
        "metadata" jsonb,
        "redeemedAt" timestamp,
        "expiresAt" timestamp,
        "userId" uuid NOT NULL,
        "rewardId" uuid,
        "transactionId" uuid,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("rewardId") REFERENCES "rewards"("id") ON DELETE SET NULL,
        FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE SET NULL
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "reward_rules" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar NOT NULL,
        "type" varchar NOT NULL,
        "conditions" jsonb NOT NULL,
        "rewards" jsonb NOT NULL,
        "isActive" boolean DEFAULT true,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      )
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "reward_rules"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "user_rewards"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "rewards"`);
    }
}
exports.RewardsTables1703007000000 = RewardsTables1703007000000;


/***/ }),
/* 55 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LedgerTables1703008000000 = void 0;
class LedgerTables1703008000000 {
    constructor() {
        this.name = 'LedgerTables1703008000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "ledger_entries" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "reference" varchar NOT NULL,
        "type" varchar NOT NULL,
        "amount" decimal(15,2) NOT NULL,
        "fee" decimal(15,2) DEFAULT 0,
        "description" varchar NOT NULL,
        "provider" varchar NOT NULL,
        "providerReference" varchar,
        "status" varchar NOT NULL,
        "userId" uuid NOT NULL,
        "walletId" uuid,
        "transactionId" uuid,
        "metadata" jsonb,
        "reconciledAt" timestamp,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      )
    `);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_ledger_user_created" ON "ledger_entries" ("userId", "createdAt")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_ledger_provider_ref" ON "ledger_entries" ("provider", "providerReference")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_ledger_reference" ON "ledger_entries" ("reference")`);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "reconciliation_records" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "type" varchar NOT NULL,
        "status" varchar NOT NULL,
        "reconciliationDate" date NOT NULL,
        "totalEntries" int DEFAULT 0,
        "reconciledEntries" int DEFAULT 0,
        "discrepancies" int DEFAULT 0,
        "totalAmount" decimal(15,2) DEFAULT 0,
        "discrepancyDetails" jsonb,
        "performedBy" varchar,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      )
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ledger_reference"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ledger_provider_ref"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ledger_user_created"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "reconciliation_records"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "ledger_entries"`);
    }
}
exports.LedgerTables1703008000000 = LedgerTables1703008000000;


/***/ }),
/* 56 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransfersTables1703009000000 = void 0;
class TransfersTables1703009000000 {
    constructor() {
        this.name = 'TransfersTables1703009000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "transfers" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "amount" decimal(15,2) NOT NULL,
        "fee" decimal(15,2) DEFAULT 0,
        "type" varchar NOT NULL,
        "status" varchar DEFAULT 'pending',
        "reference" varchar NOT NULL,
        "providerReference" varchar,
        "description" varchar NOT NULL,
        "sourceDetails" jsonb NOT NULL,
        "destinationDetails" jsonb NOT NULL,
        "metadata" jsonb,
        "failureReason" varchar,
        "userId" uuid NOT NULL,
        "sourceWalletId" uuid,
        "destinationWalletId" uuid,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("sourceWalletId") REFERENCES "wallets"("id") ON DELETE SET NULL,
        FOREIGN KEY ("destinationWalletId") REFERENCES "wallets"("id") ON DELETE SET NULL
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "scheduled_transfers" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar NOT NULL,
        "amount" decimal(15,2) NOT NULL,
        "frequency" varchar NOT NULL,
        "status" varchar DEFAULT 'active',
        "nextExecutionDate" timestamp NOT NULL,
        "endDate" timestamp,
        "executionCount" int DEFAULT 0,
        "maxExecutions" int,
        "transferTemplate" jsonb NOT NULL,
        "metadata" jsonb,
        "userId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "bank_downtimes" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "bankCode" varchar NOT NULL,
        "bankName" varchar NOT NULL,
        "type" varchar NOT NULL,
        "status" varchar NOT NULL,
        "title" varchar NOT NULL,
        "description" text NOT NULL,
        "startTime" timestamp NOT NULL,
        "estimatedEndTime" timestamp,
        "actualEndTime" timestamp,
        "affectedServices" jsonb,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      )
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "bank_downtimes"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "scheduled_transfers"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "transfers"`);
    }
}
exports.TransfersTables1703009000000 = TransfersTables1703009000000;


/***/ }),
/* 57 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RecurringPaymentsTable1703010000000 = void 0;
class RecurringPaymentsTable1703010000000 {
    constructor() {
        this.name = 'RecurringPaymentsTable1703010000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "recurring_payments" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" uuid NOT NULL,
        "transactionId" uuid NOT NULL,
        "amount" decimal(15,2) NOT NULL,
        "duration" int NOT NULL,
        "frequency" varchar NOT NULL,
        "status" varchar DEFAULT 'active',
        "startDate" date NOT NULL,
        "metadata" jsonb,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE CASCADE
      )
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "recurring_payments"`);
    }
}
exports.RecurringPaymentsTable1703010000000 = RecurringPaymentsTable1703010000000;


/***/ }),
/* 58 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FixUsersColumns1703011000000 = void 0;
class FixUsersColumns1703011000000 {
    constructor() {
        this.name = 'FixUsersColumns1703011000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "bvn" TYPE character varying USING "bvn"::character varying`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "nin" TYPE character varying USING "nin"::character varying`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "accountNumber" TYPE character varying USING "accountNumber"::character varying`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "accountNumber" TYPE bigint USING NULLIF("accountNumber", '')::bigint`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "nin" TYPE bigint USING NULLIF("nin", '')::bigint`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "bvn" TYPE bigint USING NULLIF("bvn", '')::bigint`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`);
    }
}
exports.FixUsersColumns1703011000000 = FixUsersColumns1703011000000;


/***/ }),
/* 59 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WalletBankAccount1703012000000 = void 0;
class WalletBankAccount1703012000000 {
    constructor() {
        this.name = 'WalletBankAccount1703012000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "wallets" ADD COLUMN IF NOT EXISTS "accountNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "wallets" ADD COLUMN IF NOT EXISTS "accountName" character varying`);
        await queryRunner.query(`ALTER TABLE "wallets" ADD COLUMN IF NOT EXISTS "bankName" character varying`);
        await queryRunner.query(`ALTER TABLE "wallets" ADD COLUMN IF NOT EXISTS "bankCode" character varying`);
        await queryRunner.query(`ALTER TABLE "wallets" ADD COLUMN IF NOT EXISTS "providerWalletId" character varying`);
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_wallets_providerWalletId" ON "wallets" ("providerWalletId") WHERE "providerWalletId" IS NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_wallets_providerWalletId"`);
        for (const col of ['providerWalletId', 'bankCode', 'bankName', 'accountName', 'accountNumber']) {
            await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN IF EXISTS "${col}"`);
        }
    }
}
exports.WalletBankAccount1703012000000 = WalletBankAccount1703012000000;


/***/ }),
/* 60 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RedisConfig = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(4);
let RedisConfig = class RedisConfig {
    constructor(configService) {
        this.configService = configService;
    }
    createSharedConfiguration() {
        return {
            connection: {
                host: this.configService.get('REDIS_HOST', 'localhost'),
                port: this.configService.get('REDIS_PORT', 6379),
                password: this.configService.get('REDIS_PASSWORD'),
            },
        };
    }
};
exports.RedisConfig = RedisConfig;
exports.RedisConfig = RedisConfig = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], RedisConfig);


/***/ }),
/* 61 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.validateEnv = validateEnv;
const common_1 = __webpack_require__(2);
const REQUIRED = [
    'DB_HOST',
    'DB_PORT',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_NAME',
    'JWT_SECRET',
    'ENCRYPTION_KEY',
];
const OPTIONAL_GROUPS = {
    'Flutterwave payments': [
        'FLUTTERWAVE_PUBLIC_KEY',
        'FLUTTERWAVE_SECRET_KEY',
        'FLUTTERWAVE_ACCOUNT_NUMBER',
        'FLUTTERWAVE_ACCOUNT_NAME',
        'FLUTTERWAVE_BANK_NAME',
        'FLUTTERWAVE_BANK_CODE',
    ],
    'Xpress Wallet (bank accounts, transfers)': ['XPRESS_BASEURL', 'XPRESS_SECRET_KEY'],
    'ZeptoMail (transactional email)': ['ZEPTO_URL', 'ZEPTO_API_KEY', 'ZEPTO_FROM'],
    'Termii (SMS / OTP)': ['TERMII_BASE_URL', 'TERMII_API_KEY'],
    'Sumsub (KYC)': ['SUMSUB_APP_TOKEN', 'SUMSUB_SECRET_KEY'],
};
function validateEnv(config) {
    const logger = new common_1.Logger('Config');
    const missing = REQUIRED.filter((key) => {
        const v = config[key];
        return v === undefined || v === null || String(v).trim() === '';
    });
    if (missing.length) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}. ` +
            `Copy .env.example to .env and fill them in.`);
    }
    if (String(config.JWT_SECRET).length < 32) {
        throw new Error('JWT_SECRET must be at least 32 characters.');
    }
    for (const [feature, keys] of Object.entries(OPTIONAL_GROUPS)) {
        const absent = keys.filter((k) => {
            const v = config[k];
            return v === undefined || v === null || String(v).trim() === '';
        });
        if (absent.length) {
            logger.warn(`${feature} is not configured — ${absent.join(', ')} unset. ` +
                `Endpoints that depend on it will fail until these are set in .env.`);
        }
    }
    return config;
}


/***/ }),
/* 62 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(63);
const typeorm_1 = __webpack_require__(8);
const passport_1 = __webpack_require__(64);
const config_1 = __webpack_require__(4);
const auth_service_1 = __webpack_require__(65);
const auth_controller_1 = __webpack_require__(104);
const users_module_1 = __webpack_require__(113);
const jwt_strategy_1 = __webpack_require__(120);
const local_strategy_1 = __webpack_require__(122);
const notifications_module_1 = __webpack_require__(124);
const wallet_module_1 = __webpack_require__(127);
const user_entity_1 = __webpack_require__(21);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            users_module_1.UsersModule,
            notifications_module_1.NotificationsModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            wallet_module_1.WalletModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRES_IN') || '7d',
                    },
                }),
            }),
        ],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, local_strategy_1.LocalStrategy],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService, jwt_1.JwtModule],
    })
], AuthModule);


/***/ }),
/* 63 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 64 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 65 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = exports.CodeCategory = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(18);
const jwt_1 = __webpack_require__(63);
const bcrypt = __importStar(__webpack_require__(66));
const crypto_1 = __webpack_require__(67);
const user_entity_1 = __webpack_require__(21);
const users_service_1 = __webpack_require__(68);
const notifications_service_1 = __webpack_require__(69);
const wallet_service_1 = __webpack_require__(74);
const wallet_entity_1 = __webpack_require__(24);
exports.CodeCategory = {
    SIGNUP: 'signup',
    RESET_PASSWORD: 'reset-password',
    RESET_PIN: 'reset-pin',
};
let AuthService = AuthService_1 = class AuthService {
    constructor(userRepository, jwtService, usersService, notificationsService, walletService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.usersService = usersService;
        this.notificationsService = notificationsService;
        this.walletService = walletService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    channelOf(identifier) {
        return identifier.includes('@') ? 'email' : 'phone';
    }
    async findByIdentifier(identifier) {
        return this.channelOf(identifier) === 'email'
            ? this.userRepository.findOneBy({ email: identifier })
            : this.userRepository.findOneBy({ phone: identifier });
    }
    generateCode() {
        return (0, crypto_1.randomInt)(0, 1_000_000).toString().padStart(6, '0');
    }
    sign(user) {
        return this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
    }
    sanitise(user) {
        const { password, pin, codes, biometricPublicKey, ...safe } = user;
        return safe;
    }
    async consumeCode(identifier, category, code) {
        const user = await this.findByIdentifier(identifier);
        if (!user)
            throw new common_1.NotFoundException('No account found for that contact');
        const match = (user.codes ?? []).find((c) => c.code === code && c.category === category);
        if (!match)
            throw new common_1.BadRequestException('Invalid verification code');
        if (new Date(match.expires) < new Date()) {
            throw new common_1.BadRequestException('Verification code has expired');
        }
        await this.userRepository.update(user.id, {
            codes: (user.codes ?? []).filter((c) => c.id !== match.id),
        });
        return user;
    }
    async issueCode(identifier, category, name = '') {
        const channel = this.channelOf(identifier);
        const code = this.generateCode();
        await this.usersService.storeVerificationCode(identifier, channel, category, code);
        try {
            await this.notificationsService.sendVerificationCode(identifier, name, code, channel);
        }
        catch (error) {
            this.logger.error(`Could not deliver the ${category} code to ${identifier} over ${channel}: ` +
                `${error.message}`);
        }
    }
    async register(createUserDto) {
        const identifier = createUserDto.email ?? createUserDto.phone;
        if (!identifier) {
            throw new common_1.BadRequestException('An email address or phone number is required');
        }
        const existing = await this.findByIdentifier(identifier);
        if (existing?.password) {
            throw new common_1.ConflictException('An account with those details already exists');
        }
        await this.issueCode(identifier, exports.CodeCategory.SIGNUP);
        return {
            message: `Verification code sent to ${identifier}`,
            contact: identifier,
        };
    }
    async resendCode(createUserDto) {
        const identifier = createUserDto.email ?? createUserDto.phone;
        if (!identifier) {
            throw new common_1.BadRequestException('An email address or phone number is required');
        }
        await this.issueCode(identifier, exports.CodeCategory.SIGNUP);
        return { message: `Verification code resent to ${identifier}`, contact: identifier };
    }
    async verifyCode(contact, code) {
        const user = await this.consumeCode(contact, exports.CodeCategory.SIGNUP, code);
        await this.userRepository.update(user.id, {
            ...(this.channelOf(contact) === 'email'
                ? { isEmailVerified: true }
                : { isPhoneVerified: true }),
        });
        return { verified: true, userId: user.id, contact };
    }
    async completeProfile(contact, data) {
        const user = await this.findByIdentifier(contact);
        if (!user)
            throw new common_1.NotFoundException('No account found for that contact');
        if (!user.isEmailVerified && !user.isPhoneVerified) {
            throw new common_1.BadRequestException('Verify your contact details before continuing');
        }
        const { id, role, codes, isEmailVerified, isPhoneVerified, ...safeData } = data;
        const patch = { ...safeData };
        if (data.password)
            patch.password = await bcrypt.hash(data.password, 12);
        if (data.pin)
            patch.pin = await bcrypt.hash(data.pin, 12);
        await this.userRepository.update(user.id, patch);
        const updated = await this.usersService.findById(user.id);
        try {
            const existing = await this.walletService.findUserWalletByType(updated.id, wallet_entity_1.WalletType.MAIN);
            if (!existing) {
                await this.walletService.createWallet(updated.id, {
                    type: wallet_entity_1.WalletType.MAIN,
                    name: 'Main Wallet',
                    customerId: updated.id,
                    currency: 'NGN',
                });
            }
        }
        catch (error) {
            this.logger.error(`Wallet creation failed for user ${updated.id}`, error);
        }
        return { access_token: this.sign(updated), user: this.sanitise(updated) };
    }
    async validateUser(identifier, password) {
        try {
            const user = await this.findByIdentifier(identifier);
            if (!user?.password)
                return null;
            return (await bcrypt.compare(password, user.password)) ? user : null;
        }
        catch (error) {
            this.logger.error('Error validating user', error);
            return null;
        }
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.identifier, loginDto.password);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (!user.isActive)
            throw new common_1.UnauthorizedException('This account is disabled');
        await this.usersService.updateLastLogin(user.id);
        return { access_token: this.sign(user), user: this.sanitise(user) };
    }
    async adminLogin(email, password) {
        const user = await this.validateUser(email, password);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (user.role !== user_entity_1.Role.ADMIN && user.role !== user_entity_1.Role.SUPER_ADMIN) {
            throw new common_1.UnauthorizedException('This account is not an administrator');
        }
        await this.usersService.updateLastLogin(user.id);
        return { access_token: this.sign(user), user: this.sanitise(user) };
    }
    async verifyToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.usersService.findById(payload.sub);
            return { valid: true, user: this.sanitise(user) };
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
    async initiateResetPassword(identifier) {
        const user = await this.findByIdentifier(identifier);
        if (user) {
            await this.issueCode(identifier, exports.CodeCategory.RESET_PASSWORD, user.firstName ?? '');
        }
        return { message: `If that account exists, a reset code has been sent` };
    }
    async resetPassword(identifier, code, newPassword) {
        const user = await this.consumeCode(identifier, exports.CodeCategory.RESET_PASSWORD, code);
        await this.userRepository.update(user.id, {
            password: await bcrypt.hash(newPassword, 12),
        });
        return { message: 'Password updated' };
    }
    async updatePassword(userId, newPassword) {
        const user = await this.usersService.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.password) {
            throw new common_1.BadRequestException('A password is already set — use the reset-password flow instead');
        }
        await this.userRepository.update(userId, {
            password: await bcrypt.hash(newPassword, 12),
        });
        return { message: 'Password set' };
    }
    async setPin(userId, pin) {
        if (!/^\d{4,6}$/.test(pin)) {
            throw new common_1.BadRequestException('PIN must be 4 to 6 digits');
        }
        const user = await this.usersService.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.userRepository.update(userId, { pin: await bcrypt.hash(pin, 12) });
        return { message: 'PIN set' };
    }
    async verifyPin(userId, pin) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            select: ['id', 'pin'],
        });
        if (!user?.pin)
            throw new common_1.BadRequestException('No PIN has been set');
        const valid = await bcrypt.compare(pin, user.pin);
        if (!valid)
            throw new common_1.UnauthorizedException('Incorrect PIN');
        return { valid: true };
    }
    async initiateResetPin(identifier) {
        const user = await this.findByIdentifier(identifier);
        if (user) {
            await this.issueCode(identifier, exports.CodeCategory.RESET_PIN, user.firstName ?? '');
        }
        return { message: 'If that account exists, a reset code has been sent' };
    }
    async resetPin(identifier, code, pin) {
        if (!/^\d{4,6}$/.test(pin)) {
            throw new common_1.BadRequestException('PIN must be 4 to 6 digits');
        }
        const user = await this.consumeCode(identifier, exports.CodeCategory.RESET_PIN, code);
        await this.userRepository.update(user.id, { pin: await bcrypt.hash(pin, 12) });
        return { message: 'PIN updated' };
    }
    async registerBiometricDevice(dto) {
        const user = await this.usersService.findById(dto.userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.userRepository.update(dto.userId, { biometricPublicKey: dto.publicKey });
        return { message: 'Biometric device registered' };
    }
    async biometricLogin(dto) {
        const user = await this.findByIdentifier(dto.identifier);
        if (!user?.biometricPublicKey) {
            throw new common_1.UnauthorizedException('No biometric device registered');
        }
        let verified = false;
        try {
            const verifier = (0, crypto_1.createVerify)('SHA256');
            verifier.update(dto.challenge);
            verifier.end();
            verified = verifier.verify(user.biometricPublicKey, dto.signature, 'base64');
        }
        catch (error) {
            this.logger.warn(`Biometric verification error for ${dto.identifier}`);
            verified = false;
        }
        if (!verified)
            throw new common_1.UnauthorizedException('Biometric verification failed');
        await this.usersService.updateLastLogin(user.id);
        return { access_token: this.sign(user), user: this.sanitise(user) };
    }
    async getOnboardingStatus(userId) {
        const user = await this.usersService.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const steps = {
            contactVerified: user.isEmailVerified || user.isPhoneVerified,
            profileComplete: Boolean(user.firstName && user.lastName),
            passwordSet: Boolean(user.password),
            pinSet: Boolean(user.pin),
            kycApproved: user.kycStatus === user_entity_1.KYCStatus.APPROVED,
        };
        return {
            steps,
            complete: Object.values(steps).every(Boolean),
            kycStatus: user.kycStatus,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object, typeof (_c = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _c : Object, typeof (_d = typeof notifications_service_1.NotificationsService !== "undefined" && notifications_service_1.NotificationsService) === "function" ? _d : Object, typeof (_e = typeof wallet_service_1.WalletService !== "undefined" && wallet_service_1.WalletService) === "function" ? _e : Object])
], AuthService);


/***/ }),
/* 66 */
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),
/* 67 */
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),
/* 68 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(18);
const user_entity_1 = __webpack_require__(21);
let UsersService = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(createUserDto) {
        const user = this.userRepository.create(createUserDto);
        return this.userRepository.save(user);
    }
    async findAll() {
        return this.userRepository.find({
            select: [
                'id',
                'email',
                'firstName',
                'lastName',
                'bvn',
                'nin',
                'accountNumber',
                'phone',
                'role',
                'isActive',
                'createdAt',
            ],
        });
    }
    async findById(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        return user;
    }
    async findByEmail(email) {
        return this.userRepository.findOneBy({ email });
    }
    async findByPhone(phone) {
        return this.userRepository.findOneBy({ phone });
    }
    async findByUsername(username) {
        return this.userRepository.findOneBy({ username });
    }
    async findByEmailOrPhone(email, phone) {
        if (!email && !phone)
            return null;
        const whereConditions = [];
        if (email)
            whereConditions.push({ email });
        if (phone)
            whereConditions.push({ phone });
        return this.userRepository.findOne({
            where: whereConditions,
        });
    }
    async updateUser(id, data) {
        await this.userRepository.update(id, data);
        return this.findById(id);
    }
    async remove(id) {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
    }
    async updateLastLogin(id) {
        await this.userRepository.update(id, { lastLoginAt: new Date() });
    }
    async storeVerificationCode(identifier, type, category, code) {
        const user = await this.userRepository.findOneBy(type === 'email' ? { email: identifier } : { phone: identifier });
        const newCode = {
            id: this.generateRandomString(),
            category,
            code,
            expires: this.getExpiryDate(),
        };
        if (!user) {
            const newUser = this.userRepository.create(type === 'email'
                ? { email: identifier, codes: [newCode] }
                : { phone: identifier, codes: [newCode] });
            await this.userRepository.save(newUser);
        }
        else {
            await this.userRepository.update(user.id, {
                codes: [...(user.codes || []), newCode],
            });
        }
    }
    async verifyCode(identifier, type, code) {
        const user = await this.userRepository.findOneBy(type === 'email' ? { email: identifier } : { phone: identifier });
        if (!user || !user.codes?.length)
            return false;
        const now = new Date();
        const match = user.codes.find((c) => c.code === code);
        if (!match)
            return false;
        if (match.expires < now)
            return null;
        return true;
    }
    generateRandomString(length = 10) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_@%&$#!';
        let result = '';
        for (let i = 0; i < length; i++) {
            const index = Math.floor(Math.random() * chars.length);
            result += chars[index];
        }
        return result;
    }
    getExpiryDate(minutes = 30) {
        const date = new Date();
        date.setMinutes(date.getMinutes() + minutes);
        return date;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], UsersService);


/***/ }),
/* 69 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var NotificationsService_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(18);
const notification_entity_1 = __webpack_require__(26);
const axios_1 = __webpack_require__(70);
const config_1 = __webpack_require__(4);
const zeptomail_1 = __webpack_require__(71);
const verifymail_template_1 = __webpack_require__(72);
const axios_2 = __importDefault(__webpack_require__(73));
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(notificationRepo, httpService, configService) {
        this.notificationRepo = notificationRepo;
        this.httpService = httpService;
        this.configService = configService;
        this.logger = new common_1.Logger(NotificationsService_1.name);
    }
    async sendVerificationCode(recipient, name = "", code, type) {
        if (type == "email") {
            return this.sendEmail(recipient, "Verification Code", (0, verifymail_template_1.verifyMail)(name, code));
        }
        else if (type == "phone") {
            await this.sendSms(recipient, (0, verifymail_template_1.verifyMessage)(code));
            await this.sendWhatsApp(recipient, (0, verifymail_template_1.verifyMessage)(code));
            return;
        }
        throw new Error('Invalid recipient type');
    }
    async sendEmail(email, title, content) {
        const url = this.configService.get('ZEPTO_URL');
        const token = this.configService.get('ZEPTO_API_KEY');
        const from = this.configService.get('ZEPTO_FROM');
        if (!token) {
            throw new Error('ZEPTO_API_KEY is not configured — cannot send email');
        }
        try {
            const client = new zeptomail_1.SendMailClient({ url, token });
            await client.sendMail({
                from: { address: from, name: 'Vaultiva Team' },
                to: [{ email_address: { address: email } }],
                subject: title,
                htmlbody: content,
            });
            this.logger.log(`Verification code sent to email: ${email}`);
        }
        catch (error) {
            this.logger.error('Failed to send email:', error?.response?.data || error.message);
            throw error;
        }
    }
    async sendSms(phone, sms) {
        try {
            const data = {
                "to": phone,
                "from": "Vaultiva Tech",
                "sms": sms,
                "type": "plain",
                "api_key": this.configService.get('TERMII_API_KEY'),
                "channel": "generic",
            };
            await axios_2.default.post(`https://${this.configService.get('TERMII_BASE_URL')}/api/sms/send`, data);
            this.logger.log(`SMS sent to ${phone}`);
        }
        catch (error) {
            this.logger.error('Failed to send SMS:', error.message);
            throw error;
        }
    }
    async sendWhatsApp(phone, message) {
        const formatted = phone.startsWith('+') ? phone : `+${phone}`;
        try {
            const data = {
                "to": phone,
                "from": "Vaultiva Tech",
                "sms": message,
                "type": "plain",
                "api_key": this.configService.get('TERMII_API_KEY'),
                "channel": "whatsapp",
            };
            await axios_2.default.post(`https://${this.configService.get('TERMII_BASE_URL')}/api/sms/send`, data);
            this.logger.log(`WhatsApp message sent to ${formatted}`);
        }
        catch (error) {
            this.logger.error('Failed to send WhatsApp:', error.message);
            throw error;
        }
    }
    async create(createDto) {
        const notification = this.notificationRepo.create(createDto);
        return await this.notificationRepo.save(notification);
    }
    async findUserNotifications(userId, page = 1, limit = 20) {
        if (page < 1 || limit < 1) {
            throw new common_1.BadRequestException('Page and limit must be positive integers');
        }
        const [notifications, total] = await this.notificationRepo.findAndCount({
            where: { userId },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            notifications,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async markAsRead(id, userId) {
        const notification = await this.notificationRepo.findOne({
            where: { id, userId },
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        notification.isRead = true;
        return await this.notificationRepo.save(notification);
    }
    async markAllAsRead(userId) {
        await this.notificationRepo.update({ userId, isRead: false }, { isRead: true });
    }
    async getUnreadCount(userId) {
        return await this.notificationRepo.count({
            where: { userId, isRead: false },
        });
    }
    async deleteNotification(id, userId) {
        const result = await this.notificationRepo.delete({ id, userId });
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Notification not found');
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _b : Object, typeof (_c = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _c : Object])
], NotificationsService);


/***/ }),
/* 70 */
/***/ ((module) => {

module.exports = require("@nestjs/axios");

/***/ }),
/* 71 */
/***/ ((module) => {

module.exports = require("zeptomail");

/***/ }),
/* 72 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.verifyMessage = exports.verifyMail = void 0;
const verifyMail = (name, code) => (`
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Verification Code</title>
        </head>
        <body style="margin:0; padding:0; background:#f4f6fb; font-family:Arial, Helvetica, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f6fb" style="padding:30px 0;">
                <tr>
                    <td align="center">
                        <!-- Container -->
                        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background:#ffffff; border-radius:10px; overflow:hidden;">
                        <!-- Header -->
                        <tr>
                            <td style="padding:20px; font-size:18px; font-weight:bold; color:#111827;">
                                Hello ${name},
                            </td>
                        </tr>
                        <!-- Body -->
                        <tr>
                            <td colspan="2" style="padding:30px 20px 20px;">
                            <h1 style="margin:0 0 10px; font-size:20px; color:#111827;">Your verification code</h1>
                            <p style="margin:0; font-size:14px; color:#6b7280;">Use this code, verification code expires in 10 minutes.</p>
                            </td>
                        </tr>
                        <!-- Code -->
                        <tr>
                            <td colspan="2" align="center" style="padding:20px;">
                            <div style="font-size:32px; font-weight:bold; letter-spacing:8px; background:#f9fafb; padding:15px 20px; border:1px solid #e5e7eb; border-radius:8px; display:inline-block; color:#111827;">
                                ${code}
                            </div>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td colspan="2" style="padding:20px; font-size:12px; color:#6b7280;">
                                If you didn’t request this, you can ignore this email.  
                            <br><br>
                                Best Regards,
                                Vaultiva Team.
                            </td>
                        </tr>
                        </table>
                        <!-- /container -->
                    </td>
                </tr>
            </table>
        </body>
    </html>
`);
exports.verifyMail = verifyMail;
const verifyMessage = (code) => (`
    *Verification Code is*

        Code: *${code}*

    Expires in 10 mins
    Do not share with anyone.
`);
exports.verifyMessage = verifyMessage;


/***/ }),
/* 73 */
/***/ ((module) => {

module.exports = require("axios");

/***/ }),
/* 74 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var WalletService_1;
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WalletService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(18);
const bullmq_1 = __webpack_require__(9);
const bullmq_2 = __webpack_require__(75);
const wallet_entity_1 = __webpack_require__(24);
const transaction_entity_1 = __webpack_require__(25);
const payments_service_1 = __webpack_require__(76);
const uuid_1 = __webpack_require__(103);
let WalletService = WalletService_1 = class WalletService {
    constructor(walletRepository, transactionRepository, transactionQueue, dataSource, paymentsService) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.transactionQueue = transactionQueue;
        this.dataSource = dataSource;
        this.paymentsService = paymentsService;
        this.logger = new common_1.Logger(WalletService_1.name);
    }
    async createWallet(userId, createWalletDto) {
        const wallet = this.walletRepository.create({
            ...createWalletDto,
            userId,
        });
        return this.walletRepository.save(wallet);
    }
    async provisionBankAccount(walletId) {
        const wallet = await this.walletRepository.findOne({
            where: { id: walletId },
            relations: ['user'],
        });
        if (!wallet)
            throw new common_1.NotFoundException('Wallet not found');
        if (wallet.providerWalletId)
            return wallet;
        const user = wallet.user;
        const missing = [
            !user?.bvn && 'bvn',
            !user?.dateOfBirth && 'dateOfBirth',
            !user?.firstName && 'firstName',
            !user?.lastName && 'lastName',
            !user?.phone && 'phone',
        ].filter(Boolean);
        if (missing.length) {
            throw new common_1.BadRequestException(`Cannot open a bank account until KYC is complete — missing: ${missing.join(', ')}`);
        }
        const { wallet: provider } = await this.paymentsService.createCustomerWallet({
            bvn: user.bvn,
            firstName: user.firstName,
            lastName: user.lastName,
            dateOfBirth: user.dateOfBirth,
            phoneNumber: user.phone,
            email: user.email,
            address: user.address,
            metadata: { vaultivaUserId: user.id, vaultivaWalletId: wallet.id },
        });
        wallet.providerWalletId = provider.id;
        wallet.accountNumber = provider.accountNumber;
        wallet.accountName = provider.accountName;
        wallet.bankName = provider.bankName;
        wallet.bankCode = provider.bankCode;
        this.logger.log(`Opened account ${provider.accountNumber} for wallet ${wallet.id}`);
        return this.walletRepository.save(wallet);
    }
    async lockWalletFunds(walletId, amount, duration) {
        const wallet = await this.findWalletById(walletId);
        if (wallet.balance < amount) {
            throw new common_1.BadRequestException('Insufficient balance to lock');
        }
        this.logger.log(`Locking ${amount} in wallet ${walletId} for ${duration} days`);
    }
    async findUserWallets(userId) {
        return this.walletRepository.find({
            where: { userId },
            relations: ['transactions'],
            order: { createdAt: 'DESC' },
        });
    }
    async findUserWalletsByType(userId, types) {
        const whereConditions = types.map(type => ({ userId, type }));
        return this.walletRepository.find({
            where: whereConditions,
            relations: ['user'],
        });
    }
    async findUserWalletByType(userId, type) {
        return this.walletRepository.findOne({
            where: { userId, type },
            relations: ['user'],
        });
    }
    async findWalletById(id) {
        const wallet = await this.walletRepository.findOne({
            where: { id },
            relations: ['user', 'transactions'],
        });
        if (!wallet) {
            throw new common_1.NotFoundException(`Wallet with ID ${id} not found`);
        }
        return wallet;
    }
    async transferBetweenWallets(fromUserId, toWalletId, amount, description) {
        const fromWallet = await this.getUserMainWallet(fromUserId);
        const toWallet = await this.findWalletById(toWalletId);
        if (fromWallet.balance < amount) {
            throw new common_1.BadRequestException('Insufficient balance');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.update(wallet_entity_1.Wallet, fromWallet.id, {
                balance: () => `balance - ${amount}`,
            });
            await queryRunner.manager.update(wallet_entity_1.Wallet, toWalletId, {
                balance: () => `balance + ${amount}`,
            });
            const transaction = await queryRunner.manager.save(transaction_entity_1.Transaction, {
                walletId: fromWallet.id,
                amount,
                type: transaction_entity_1.TransactionType.TRANSFER,
                status: transaction_entity_1.TransactionStatus.COMPLETED,
                reference: this.generateReference(),
                description,
                metadata: { toWalletId, toUserId: toWallet.userId },
            });
            await queryRunner.commitTransaction();
            return transaction;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async creditMainWallet(userId, amount, description) {
        const wallet = await this.getUserMainWallet(userId);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.update(wallet_entity_1.Wallet, wallet.id, {
                balance: () => `balance + ${amount}`,
            });
            const transaction = await queryRunner.manager.save(transaction_entity_1.Transaction, {
                walletId: wallet.id,
                amount,
                type: transaction_entity_1.TransactionType.DEPOSIT,
                status: transaction_entity_1.TransactionStatus.COMPLETED,
                reference: this.generateReference(),
                description,
            });
            await queryRunner.commitTransaction();
            return transaction;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getTransactionById(transactionId) {
        const transaction = await this.transactionRepository.findOne({
            where: { id: transactionId },
            relations: ['wallet'],
        });
        if (!transaction) {
            throw new common_1.NotFoundException('Transaction not found');
        }
        return transaction;
    }
    async fundAccount(userId, withdrawDto) {
        const wallet = await this.getUserMainWallet(userId);
        const reference = this.generateReference();
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const transaction = await queryRunner.manager.save(transaction_entity_1.Transaction, {
                walletId: wallet.id,
                amount: withdrawDto.amount,
                type: transaction_entity_1.TransactionType.DEPOSIT,
                status: transaction_entity_1.TransactionStatus.PROCESSING,
                reference,
                description: 'Wallet Deposit',
                metadata: {
                    bankCode: withdrawDto.bankCode,
                    accountNumber: withdrawDto.accountNumber,
                    accountName: withdrawDto.accountName,
                },
            });
            await queryRunner.commitTransaction();
            await this.transactionQueue.add('process-deposit', {
                transactionId: transaction.id,
                userId,
            });
            return transaction;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async withdraw(userId, type, withdrawDto, metadata) {
        const wallet = await this.getUserMainWallet(userId);
        if (wallet.balance < withdrawDto.amount) {
            throw new common_1.BadRequestException('Insufficient balance');
        }
        const reference = this.generateReference();
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.update(wallet_entity_1.Wallet, wallet.id, {
                balance: () => `balance - ${withdrawDto.amount}`,
            });
            const transaction = await queryRunner.manager.save(transaction_entity_1.Transaction, {
                walletId: wallet.id,
                amount: withdrawDto.amount,
                type,
                status: transaction_entity_1.TransactionStatus.PROCESSING,
                reference,
                description: `Wallet ${type}`,
                metadata: {
                    bankCode: withdrawDto.bankCode,
                    accountNumber: withdrawDto.accountNumber,
                    accountName: withdrawDto.accountName,
                    ...metadata
                },
            });
            await queryRunner.commitTransaction();
            await this.transactionQueue.add('process-withdrawal', {
                transactionId: transaction.id,
                userId,
            });
            return transaction;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async withdrawComplete(transactionId, ref, userId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const savedTransaction = await queryRunner.manager.findOne(transaction_entity_1.Transaction, {
                where: { id: transactionId },
            });
            if (!savedTransaction) {
                throw new common_1.NotFoundException('Transaction not found');
            }
            savedTransaction.status = transaction_entity_1.TransactionStatus.COMPLETED;
            savedTransaction.providerReference = ref;
            await queryRunner.manager.save(savedTransaction);
            await queryRunner.commitTransaction();
            await this.transactionQueue.add('finalize-withdrawal', {
                transactionId: savedTransaction.id,
                userId,
            });
            return savedTransaction;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async withdrawFailed(transactionId, reason, userId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const savedTransaction = await queryRunner.manager.findOne(transaction_entity_1.Transaction, {
                where: { id: transactionId },
            });
            if (!savedTransaction) {
                throw new common_1.NotFoundException('Transaction not found');
            }
            savedTransaction.status = transaction_entity_1.TransactionStatus.FAILED;
            savedTransaction.failureReason = reason;
            await queryRunner.manager.save(savedTransaction);
            await queryRunner.commitTransaction();
            await this.transactionQueue.add('finalize-withdrawal', {
                transactionId: savedTransaction.id,
                userId,
            });
            return savedTransaction;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async processWebhook(payload) {
        const { tx_ref, status, transaction_id } = payload;
        const transaction = await this.transactionRepository.findOne({
            where: { id: transaction_id },
            relations: ['wallet'],
        });
        if (!transaction) {
            throw new common_1.NotFoundException('Transaction not found');
        }
        if (status === 'successful' && (transaction.status === transaction_entity_1.TransactionStatus.PENDING ||
            transaction.status === transaction_entity_1.TransactionStatus.PROCESSING)) {
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                await queryRunner.manager.update(wallet_entity_1.Wallet, transaction.walletId, {
                    balance: () => `balance + ${transaction.amount}`,
                });
                await queryRunner.manager.update(transaction_entity_1.Transaction, transaction.id, {
                    status: transaction_entity_1.TransactionStatus.COMPLETED,
                    reference: tx_ref,
                    metadata: { ...transaction.metadata, webhookData: payload },
                });
                await queryRunner.commitTransaction();
                await this.transactionQueue.add('send-notification', {
                    userId: transaction.wallet.userId,
                    type: 'wallet_funded',
                    amount: transaction.amount,
                });
                return { success: true };
            }
            catch (error) {
                await queryRunner.rollbackTransaction();
                throw error;
            }
            finally {
                await queryRunner.release();
            }
        }
        return { success: false };
    }
    async getTransactionHistory(userId, page = 1, limit = 20) {
        const wallets = await this.findUserWallets(userId);
        const walletIds = wallets.map(w => w.id);
        if (walletIds.length === 0) {
            return {
                transactions: [],
                pagination: { page, limit, total: 0, pages: 0 },
            };
        }
        const whereConditions = walletIds.map(id => ({ walletId: id }));
        const [transactions, total] = await this.transactionRepository.findAndCount({
            where: whereConditions,
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            transactions,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getUserMainWallet(userId) {
        const wallet = await this.walletRepository.findOne({
            where: { userId, type: wallet_entity_1.WalletType.MAIN },
        });
        if (!wallet) {
            throw new common_1.NotFoundException("User Wallet Not found");
        }
        return wallet;
    }
    async createTransaction(data) {
        const transaction = this.transactionRepository.create(data);
        return this.transactionRepository.save(transaction);
    }
    generateReference() {
        return `TXN_${Date.now()}_${(0, uuid_1.v4)().substring(0, 8).toUpperCase()}`;
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = WalletService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wallet_entity_1.Wallet)),
    __param(1, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(2, (0, bullmq_1.InjectQueue)('transactions')),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => payments_service_1.PaymentsService))),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof bullmq_2.Queue !== "undefined" && bullmq_2.Queue) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.DataSource !== "undefined" && typeorm_2.DataSource) === "function" ? _d : Object, typeof (_e = typeof payments_service_1.PaymentsService !== "undefined" && payments_service_1.PaymentsService) === "function" ? _e : Object])
], WalletService);


/***/ }),
/* 75 */
/***/ ((module) => {

module.exports = require("bullmq");

/***/ }),
/* 76 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PaymentsService_1;
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentsService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(18);
const event_emitter_1 = __webpack_require__(12);
const wallet_service_1 = __webpack_require__(74);
const transaction_entity_1 = __webpack_require__(25);
const crypto = __importStar(__webpack_require__(67));
const xpress_wallet_1 = __webpack_require__(77);
const config_1 = __webpack_require__(4);
const flutterwave_v3_1 = __importDefault(__webpack_require__(99));
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(transactionRepository, walletService, eventEmitter, config) {
        this.transactionRepository = transactionRepository;
        this.walletService = walletService;
        this.eventEmitter = eventEmitter;
        this.config = config;
        this.logger = new common_1.Logger(PaymentsService_1.name);
        const apiKey = this.config.get('XPRESS_SECRET_KEY');
        if (!apiKey && !this.config.get('XPRESS_EMAIL')) {
            this.logger.warn('XpressWallet credentials not configured');
        }
        this.xpressService = new xpress_wallet_1.XpressWalletSDK({
            apiKey,
            xpressEmail: this.config.get('XPRESS_EMAIL'),
            xpressPassword: this.config.get('XPRESS_PASSWORD'),
            baseUrl: this.config.get('XPRESS_BASEURL'),
        });
    }
    async createCustomerWallet(request) {
        await this.xpressService.init();
        return this.xpressService.wallet.createCustomerWallet(request);
    }
    async getAccountInfo() {
        const account_number = this.config.get('FLUTTERWAVE_ACCOUNT_NUMBER');
        const account_name = this.config.get('FLUTTERWAVE_ACCOUNT_NAME');
        const bank_name = this.config.get('FLUTTERWAVE_BANK_NAME');
        const bank_code = this.config.get('FLUTTERWAVE_BANK_CODE');
        return ({
            account_number: String(account_number),
            bank_code: String(bank_code),
            account_name: String(account_name),
            bank_name: String(bank_name)
        });
    }
    async payBill(userId, walletId, billData) {
        const wallet = await this.walletService.findWalletById(walletId);
        if (!wallet || wallet.userId !== userId) {
            throw new common_1.NotFoundException('Wallet not found for user');
        }
        if (wallet.balance < billData.amount) {
            throw new common_1.BadRequestException('Insufficient wallet balance');
        }
        const transaction = await this.walletService.withdraw(userId, transaction_entity_1.TransactionType.BILL_PAYMENT, { amount: billData.amount }, billData);
        try {
            const { deducted, reason, reference, status } = await this.deductFromWallet({
                walletId: wallet.id,
                amount: billData.amount,
                type: "bill_payment",
                customer: billData.customer,
                biller_code: billData.biller_code,
                item_code: billData.item_code,
                narration: billData.type
            });
            if (deducted && status && !status.toLowerCase().includes("pending")) {
                await this.walletService.withdrawComplete(transaction.id, reference, userId);
            }
            if (!deducted) {
                await this.walletService.withdrawFailed(transaction.id, reason, userId);
                throw new common_1.BadRequestException(reason || 'Bill payment failed');
            }
            this.eventEmitter.emit('bill.paid', { transaction: transaction });
            return transaction;
        }
        catch (error) {
            await this.walletService.withdrawFailed(transaction.id, error.message, userId);
            throw error;
        }
    }
    async validateCustomer(code, customer) {
        try {
            return await flutterwave_v3_1.default.getV3BillItemsCb141Validate({
                customer,
                code,
                Authorization: `Bearer ${this.config.get('FLUTTERWAVE_SECRET_KEY')}`
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || 'Customer validation failed');
        }
    }
    async getTransactionStatus(reference) {
        const transaction = await this.transactionRepository.findOne({
            where: { reference },
            relations: ['wallet', 'wallet.user'],
        });
        if (!transaction) {
            throw new common_1.NotFoundException('Transaction not found');
        }
        return transaction;
    }
    async deductFromWallet({ walletId, amount, type, customer, biller_code, item_code, narration }) {
        const wallet = await this.walletService.findWalletById(walletId);
        if (!wallet) {
            throw new common_1.NotFoundException('Wallet not found for user');
        }
        const reference = this.generateReference('BILL');
        if (type == "bill_payment") {
            if (!customer) {
                return { deducted: false, reason: "Customer number required" };
            }
            if (!biller_code) {
                return { deducted: false, reason: "Biller Code required" };
            }
            if (!item_code) {
                return { deducted: false, reason: "Item Code required" };
            }
            try {
                const account_info = await this.getAccountInfo();
                const xdata = await this.xpressService.transfer.customerBankTransfer({
                    customerId: wallet.customerId,
                    accountName: account_info.account_name,
                    accountNumber: account_info.account_number,
                    sortCode: account_info.bank_code,
                    amount: amount,
                    narration: `Bill Payment ${narration}`,
                });
                if (!xdata.status || !xdata.transfer) {
                    return { deducted: false, reason: xdata.message || 'Transfer failed' };
                }
                const fwResponse = await flutterwave_v3_1.default.postV3BillersBiller_codeItemsItem_codePayment({
                    country: 'NG',
                    customer: customer,
                    amount: amount,
                    reference,
                    biller_code,
                    item_code,
                    Authorization: `Bearer ${this.config.get('FLUTTERWAVE_SECRET_KEY')}`
                });
                if (fwResponse.status !== 200 || !fwResponse.data?.data) {
                    return { deducted: false, reason: fwResponse.data?.message || 'Payment failed', status: fwResponse.data?.status };
                }
                this.eventEmitter.emit('wallet.debit', { walletId, amount });
                return { deducted: true, reference: fwResponse.data.data.tx_ref, status: fwResponse.data.status };
            }
            catch (error) {
                this.logger.error('Bill payment error:', error);
                return { deducted: false, reason: error.message || 'Payment processing failed' };
            }
        }
        return { deducted: false, reason: 'Unsupported transaction type' };
    }
    generateReference(prefix) {
        return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => wallet_service_1.WalletService))),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof wallet_service_1.WalletService !== "undefined" && wallet_service_1.WalletService) === "function" ? _b : Object, typeof (_c = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _c : Object, typeof (_d = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _d : Object])
], PaymentsService);


/***/ }),
/* 77 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.XpressWalletError = exports.XpressWalletSDK = void 0;
var xpress_wallet_sdk_1 = __webpack_require__(78);
Object.defineProperty(exports, "XpressWalletSDK", ({ enumerable: true, get: function () { return xpress_wallet_sdk_1.XpressWalletSDK; } }));
__exportStar(__webpack_require__(89), exports);
__exportStar(__webpack_require__(90), exports);
__exportStar(__webpack_require__(91), exports);
__exportStar(__webpack_require__(92), exports);
__exportStar(__webpack_require__(93), exports);
__exportStar(__webpack_require__(94), exports);
__exportStar(__webpack_require__(95), exports);
__exportStar(__webpack_require__(96), exports);
__exportStar(__webpack_require__(97), exports);
__exportStar(__webpack_require__(98), exports);
var http_client_1 = __webpack_require__(79);
Object.defineProperty(exports, "XpressWalletError", ({ enumerable: true, get: function () { return http_client_1.XpressWalletError; } }));


/***/ }),
/* 78 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.XpressWalletError = exports.XpressWalletSDK = void 0;
const http_client_1 = __webpack_require__(79);
const auth_service_1 = __webpack_require__(80);
const user_service_1 = __webpack_require__(81);
const customer_service_1 = __webpack_require__(82);
const wallet_service_1 = __webpack_require__(83);
const transaction_service_1 = __webpack_require__(84);
const transfer_service_1 = __webpack_require__(85);
const team_service_1 = __webpack_require__(86);
const merchant_service_1 = __webpack_require__(87);
const card_service_1 = __webpack_require__(88);
class XpressWalletSDK {
    constructor(config) {
        this.httpClient = new http_client_1.HttpClient(config);
        this.auth = new auth_service_1.AuthService(this.httpClient);
        this.user = new user_service_1.UserService(this.httpClient);
        this.customer = new customer_service_1.CustomerService(this.httpClient);
        this.wallet = new wallet_service_1.WalletService(this.httpClient);
        this.transaction = new transaction_service_1.TransactionService(this.httpClient);
        this.transfer = new transfer_service_1.TransferService(this.httpClient);
        this.team = new team_service_1.TeamService(this.httpClient);
        this.merchant = new merchant_service_1.MerchantService(this.httpClient);
        this.card = new card_service_1.CardService(this.httpClient);
    }
    async init() {
        await this.httpClient.init();
    }
    setTokens(tokens) {
        this.httpClient.setTokens(tokens);
    }
    getTokens() {
        return this.httpClient.getTokens();
    }
    clearTokens() {
        this.httpClient.clearTokens();
    }
    setBearerToken(token) {
        this.httpClient.setBearerToken(token);
    }
    clearBearerToken() {
        this.httpClient.clearBearerToken();
    }
    isAuthenticated() {
        const tokens = this.getTokens();
        return !!(tokens?.accessToken && tokens?.refreshToken);
    }
}
exports.XpressWalletSDK = XpressWalletSDK;
__exportStar(__webpack_require__(89), exports);
__exportStar(__webpack_require__(90), exports);
__exportStar(__webpack_require__(91), exports);
__exportStar(__webpack_require__(92), exports);
__exportStar(__webpack_require__(93), exports);
__exportStar(__webpack_require__(94), exports);
__exportStar(__webpack_require__(95), exports);
__exportStar(__webpack_require__(96), exports);
__exportStar(__webpack_require__(97), exports);
__exportStar(__webpack_require__(98), exports);
var http_client_2 = __webpack_require__(79);
Object.defineProperty(exports, "XpressWalletError", ({ enumerable: true, get: function () { return http_client_2.XpressWalletError; } }));


/***/ }),
/* 79 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.XpressWalletError = void 0;
const axios_1 = __importDefault(__webpack_require__(73));
class XpressWalletError extends Error {
    constructor(message, statusCode, response) {
        super(message);
        this.statusCode = statusCode;
        this.response = response;
        this.name = 'XpressWalletError';
    }
}
exports.XpressWalletError = XpressWalletError;
class HttpClient {
    constructor(config) {
        this.config = config;
        this.tokens = null;
        this.refreshPromise = null;
        this.client = axios_1.default.create({
            baseURL: config.baseUrl,
            timeout: config.timeout || 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.setupInterceptors();
    }
    async init() {
        if (this.config.apiKey) {
            this.client.defaults.headers.common['Authorization'] = `Bearer ${this.config.apiKey}`;
            return;
        }
        if (!this.config.xpressEmail || !this.config.xpressPassword) {
            throw new XpressWalletError('Xpress Wallet is not configured: set XPRESS_SECRET_KEY, or both ' +
                'XPRESS_EMAIL and XPRESS_PASSWORD.');
        }
        const { tokens } = await this.login({
            email: this.config.xpressEmail,
            password: this.config.xpressPassword,
        });
        this.setTokens(tokens);
        this.setupInterceptors();
    }
    async login(credentials) {
        try {
            const response = await this.client.post('/auth/login', credentials);
            const tokens = {
                accessToken: response.headers['x-access-token'] || '',
                refreshToken: response.headers['x-refresh-token'] || ''
            };
            if (!tokens.accessToken || !tokens.refreshToken) {
                throw new Error('Authentication tokens not received');
            }
            this.setTokens(tokens);
            return {
                response: response.data,
                tokens
            };
        }
        catch (error) {
            throw new XpressWalletError(error.response?.data?.message || 'Login failed', error.response?.status);
        }
    }
    setTokens(tokens) {
        this.tokens = tokens;
        this.setBearerToken(tokens.accessToken);
    }
    getTokens() {
        return this.tokens;
    }
    clearTokens() {
        this.tokens = null;
        this.clearBearerToken();
    }
    setBearerToken(token) {
        this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    clearBearerToken() {
        delete this.client.defaults.headers.common['Authorization'];
    }
    setupInterceptors() {
        this.client.interceptors.request.use((config) => {
            if (this.config.apiKey) {
                config.headers['Authorization'] = `Bearer ${this.config.apiKey}`;
                return config;
            }
            if (this.tokens) {
                config.headers['X-Access-Token'] = this.tokens.accessToken;
                config.headers['X-Refresh-Token'] = this.tokens.refreshToken;
            }
            return config;
        });
        this.client.interceptors.response.use((response) => {
            const newAccessToken = response.headers['x-access-token'];
            const newRefreshToken = response.headers['x-refresh-token'];
            if (newAccessToken && newRefreshToken && this.tokens) {
                this.tokens.accessToken = newAccessToken;
                this.tokens.refreshToken = newRefreshToken;
                this.setBearerToken(newAccessToken);
            }
            return response;
        }, async (error) => {
            const originalRequest = error.config;
            if (error.response?.status === 401 &&
                this.tokens?.refreshToken &&
                !originalRequest._retry) {
                if (this.refreshPromise) {
                    await this.refreshPromise;
                    return this.client(originalRequest);
                }
                originalRequest._retry = true;
                this.refreshPromise = this.refreshTokens();
                try {
                    await this.refreshPromise;
                    return this.client(originalRequest);
                }
                catch (refreshError) {
                    this.clearTokens();
                    throw new XpressWalletError('Authentication failed. Please login again.', 401);
                }
                finally {
                    this.refreshPromise = null;
                }
            }
            if (error.response) {
                const errorData = error.response.data;
                throw new XpressWalletError(errorData.message || 'API request failed', error.response.status, errorData);
            }
            throw new XpressWalletError(error.message || 'Network error occurred');
        });
    }
    async refreshTokens() {
        if (!this.tokens?.refreshToken) {
            throw new Error('No refresh token available');
        }
        try {
            const response = await axios_1.default.post(`${this.config.baseUrl}/auth/refresh/token`, {}, {
                headers: {
                    'X-Refresh-Token': this.tokens.refreshToken,
                    'Content-Type': 'application/json',
                },
            });
            const newAccessToken = response.headers['x-access-token'];
            const newRefreshToken = response.headers['x-refresh-token'];
            if (newAccessToken && newRefreshToken) {
                this.tokens.accessToken = newAccessToken;
                this.tokens.refreshToken = newRefreshToken;
                this.setBearerToken(newAccessToken);
            }
            else {
                throw new Error('Failed to refresh tokens');
            }
        }
        catch (error) {
            this.clearTokens();
            throw error;
        }
    }
    async request(config) {
        return this.client.request(config);
    }
    async get(url, config) {
        return this.client.get(url, config);
    }
    async post(url, data, config) {
        return this.client.post(url, data, config);
    }
    async put(url, data, config) {
        return this.client.put(url, data, config);
    }
    async patch(url, data, config) {
        return this.client.patch(url, data, config);
    }
    async delete(url, config) {
        return this.client.delete(url, config);
    }
}
exports.HttpClient = HttpClient;


/***/ }),
/* 80 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
class AuthService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    async logout() {
        const response = await this.httpClient.post('/auth/logout');
        this.httpClient.clearTokens();
        return response.data;
    }
    async forgetPassword(request) {
        const response = await this.httpClient.post('/auth/password/forget', request);
        return response.data;
    }
    async resetPassword(request) {
        const response = await this.httpClient.post('/auth/password/reset', request);
        return response.data;
    }
    async refreshToken() {
        const response = await this.httpClient.post('/auth/refresh/token');
        const tokens = {
            accessToken: response.headers['x-access-token'],
            refreshToken: response.headers['x-refresh-token']
        };
        this.httpClient.setTokens(tokens);
        return {
            response: response.data,
            tokens
        };
    }
}
exports.AuthService = AuthService;


/***/ }),
/* 81 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserService = void 0;
class UserService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    async getProfile() {
        const response = await this.httpClient.get('/user/profile');
        return response.data;
    }
    async changePassword(request) {
        const response = await this.httpClient.put('/user/password', request);
        return response.data;
    }
}
exports.UserService = UserService;


/***/ }),
/* 82 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CustomerService = void 0;
class CustomerService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    async getAllCustomers(page = 1) {
        const response = await this.httpClient.get('/customer', {
            params: { page }
        });
        return {
            status: response.data.status,
            data: response.data.customers,
            metadata: response.data.metadata
        };
    }
    async getCustomerById(customerId) {
        const response = await this.httpClient.get(`/customer/${customerId}`);
        return {
            status: response.data.status,
            data: response.data.customer
        };
    }
    async findByPhoneNumber(phoneNumber) {
        const response = await this.httpClient.get('/customer/phone', {
            params: { phoneNumber }
        });
        return {
            status: response.data.status,
            data: response.data.customer
        };
    }
    async updateCustomer(customerId, updates) {
        const response = await this.httpClient.put(`/customer/${customerId}`, updates);
        return {
            status: response.data.status,
            data: response.data.customer
        };
    }
}
exports.CustomerService = CustomerService;


/***/ }),
/* 83 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WalletService = void 0;
class WalletService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    async createCustomerWallet(request) {
        const response = await this.httpClient.post('/wallet', request);
        return response.data;
    }
    async getAllWallets() {
        const response = await this.httpClient.get('/wallet');
        return {
            status: response.data.status,
            data: response.data.wallets
        };
    }
    async getCustomerWallet(customerId) {
        const response = await this.httpClient.get('/wallet/customer', {
            params: { customerId }
        });
        return {
            status: response.data.status,
            data: response.data.wallet
        };
    }
    async creditWallet(request) {
        const response = await this.httpClient.post('/wallet/credit', request);
        return response.data;
    }
    async debitWallet(request) {
        const response = await this.httpClient.post('/wallet/debit', request);
        return response.data;
    }
    async freezeWallet(request) {
        const response = await this.httpClient.post('/wallet/close', request);
        return response.data;
    }
    async unfreezeWallet(request) {
        const response = await this.httpClient.post('/wallet/enable', request);
        return response.data;
    }
    async batchCreditWallets(request) {
        const response = await this.httpClient.post('/wallet/batch-credit-customer-wallet', request);
        return response.data;
    }
    async batchDebitWallets(request) {
        const response = await this.httpClient.post('/wallet/batch-debit-customer-wallet', request);
        return response.data;
    }
    async customerBatchCreditWallets(request) {
        const response = await this.httpClient.post('/wallet/customer-batch-credit-customer-wallet', request);
        return response.data;
    }
    async fundMerchantSandboxWallet(request) {
        const response = await this.httpClient.post('/merchant/fund-wallet', request);
        return response.data;
    }
}
exports.WalletService = WalletService;


/***/ }),
/* 84 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionService = void 0;
class TransactionService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    async getMerchantTransactions(query = {}) {
        const response = await this.httpClient.get('/merchant/transactions', {
            params: {
                page: query.page || 1,
                type: query.type || 'ALL',
                status: query.status,
                category: query.category,
                search: query.search
            }
        });
        return {
            status: response.data.status,
            data: response.data.transactions,
            metadata: response.data.metadata
        };
    }
    async getTransactionDetails(transactionReference) {
        const response = await this.httpClient.get(`/merchant/transaction/${transactionReference}`);
        return {
            status: response.data.status,
            data: response.data.transaction
        };
    }
    async getCustomerTransactions(query) {
        const response = await this.httpClient.get('/transaction/customer', {
            params: {
                customerId: query.customerId,
                page: query.page || 1,
                type: query.type,
                perPage: query.perPage || 20,
                category: query.category
            }
        });
        return {
            status: response.data.status,
            data: response.data.transactions,
            metadata: response.data.metadata
        };
    }
    async getBatchTransactions(query = {}) {
        const response = await this.httpClient.get('/transaction/batch', {
            params: {
                search: query.search,
                category: query.category,
                type: query.type,
                page: query.page || 1,
                perPage: query.perPage || 20
            }
        });
        return {
            status: response.data.status,
            data: response.data.data,
            metadata: response.data.metadata
        };
    }
    async getBatchTransactionDetails(reference) {
        const response = await this.httpClient.get(`/transaction/batch/${reference}`);
        return {
            status: response.data.status,
            data: response.data.data
        };
    }
    async getPendingTransactions(query = {}) {
        const response = await this.httpClient.get('/transaction/pending', {
            params: {
                page: query.page || 1,
                type: query.type || 'ALL',
                category: query.category
            }
        });
        return {
            status: response.data.status,
            data: response.data.data,
            metadata: response.data.metadata
        };
    }
    async approveTransaction(request) {
        const response = await this.httpClient.post('/transaction/approve', request);
        return response.data;
    }
    async declinePendingTransaction(transactionId) {
        const response = await this.httpClient.delete(`/transaction/${transactionId}`);
        return response.data;
    }
    async reverseBatchTransaction(request) {
        const response = await this.httpClient.post('/wallet/reverse-batch-transaction', request);
        return response.data;
    }
    async downloadMerchantTransactions() {
        const response = await this.httpClient.get('/transaction/download/merchant');
        return {
            status: response.data.status,
            data: response.data.data
        };
    }
    async downloadCustomerTransactions(customerId) {
        const response = await this.httpClient.get('/transaction/download/customer', {
            params: { customerId }
        });
        return {
            status: response.data.status,
            data: response.data.data
        };
    }
}
exports.TransactionService = TransactionService;


/***/ }),
/* 85 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransferService = void 0;
class TransferService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    async getBankList() {
        const response = await this.httpClient.get('/transfer/banks');
        return {
            status: response.data.status,
            data: response.data.banks
        };
    }
    async getBankAccountDetails(query) {
        const response = await this.httpClient.get('/transfer/account/details', {
            params: {
                sortCode: query.sortCode,
                accountNumber: query.accountNumber
            }
        });
        return {
            status: response.data.status,
            data: response.data.account
        };
    }
    async merchantBankTransfer(request) {
        const response = await this.httpClient.post('/transfer/bank', request);
        return response.data;
    }
    async customerBankTransfer(request) {
        const response = await this.httpClient.post('/transfer/bank/customer', request);
        return response.data;
    }
    async merchantBatchBankTransfer(requests) {
        const response = await this.httpClient.post('/transfer/bank/batch', requests);
        return response.data;
    }
    async walletToWalletTransfer(request) {
        const response = await this.httpClient.post('/transfer/wallet', request);
        return response.data;
    }
}
exports.TransferService = TransferService;


/***/ }),
/* 86 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TeamService = void 0;
class TeamService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    async inviteTeamMember(request) {
        const response = await this.httpClient.post('/team/invitations', request);
        return response.data;
    }
    async getTeamMembers() {
        const response = await this.httpClient.get('/team/members');
        return {
            status: response.data.status,
            data: response.data.data
        };
    }
    async getAllInvitations(page = 1, perPage = 20) {
        const response = await this.httpClient.get('/team/invitations', {
            params: { page, perPage }
        });
        return {
            status: response.data.status,
            data: response.data.data
        };
    }
    async resendInvitation(request) {
        const response = await this.httpClient.post('/team/invitations/resend', request);
        return response.data;
    }
    async acceptInvitation(request) {
        const response = await this.httpClient.post('/team/invitations/accept', request);
        return response.data;
    }
    async getMerchantList() {
        const response = await this.httpClient.get('/team/merchants');
        return {
            status: response.data.status,
            data: response.data.data
        };
    }
    async switchMerchant(request) {
        const response = await this.httpClient.post('/team/merchants/switch', request);
        return response.data;
    }
    async updateMember(memberId, request) {
        const response = await this.httpClient.put(`/team/member/${memberId}`, request);
        return response.data;
    }
    async getAllPermissions() {
        const response = await this.httpClient.get('/team/permissions');
        return {
            status: response.data.status,
            data: response.data.data
        };
    }
    async getAllRoles() {
        const response = await this.httpClient.get('/team/roles');
        return {
            status: response.data.status,
            data: response.data.data
        };
    }
    async createRole(request) {
        const response = await this.httpClient.post('/team/roles', request);
        return {
            status: response.data.status,
            message: response.data.message,
            data: response.data.data
        };
    }
    async updateRole(roleId, request) {
        const response = await this.httpClient.patch(`/team/roles/${roleId}`, request);
        return {
            status: response.data.status,
            message: response.data.message,
            data: response.data.data
        };
    }
}
exports.TeamService = TeamService;


/***/ }),
/* 87 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MerchantService = void 0;
class MerchantService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    async registerMerchant(request) {
        const response = await this.httpClient.post('/merchant', request);
        return response.data;
    }
    async verifyAccount(request) {
        const response = await this.httpClient.put('/merchant/verify', request);
        return response.data;
    }
    async resendVerificationCode(request) {
        const response = await this.httpClient.post('/merchant/verify/resend', request);
        return response.data;
    }
    async getProfile() {
        const response = await this.httpClient.get('/merchant/profile');
        return {
            status: response.data.status,
            data: response.data.data
        };
    }
    async updateProfile(request) {
        const response = await this.httpClient.patch('/merchant/profile', request);
        return response.data;
    }
    async getWallet() {
        const response = await this.httpClient.get('/merchant/wallet');
        return {
            status: response.data.status,
            data: response.data.data
        };
    }
    async getAccessKeys() {
        const response = await this.httpClient.get('/merchant/my-access-keys');
        return {
            status: response.data.status,
            data: response.data.data
        };
    }
    async generateAccessKeys() {
        const response = await this.httpClient.post('/merchant/generate-access-keys');
        return {
            status: response.data.status,
            data: response.data.data
        };
    }
    async switchAccountMode(request) {
        const response = await this.httpClient.post('/merchant/account-mode', request);
        return response.data;
    }
}
exports.MerchantService = MerchantService;


/***/ }),
/* 88 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CardService = void 0;
class CardService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    async setupCard(request) {
        const response = await this.httpClient.put('/card/setup', request);
        return response.data;
    }
    async createCard(request) {
        const response = await this.httpClient.post('/card', request);
        return response.data;
    }
    async activateCard(request) {
        const response = await this.httpClient.post('/card/activate', request);
        return response.data;
    }
    async getCardBalance(query) {
        const response = await this.httpClient.get('/card/balance', {
            params: query
        });
        return {
            status: response.data.status,
            data: response.data.data
        };
    }
    async fundCard(request) {
        const response = await this.httpClient.post('/card/fund', request);
        return response.data;
    }
}
exports.CardService = CardService;


/***/ }),
/* 89 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 90 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 91 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 92 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 93 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 94 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 95 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 96 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 97 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 98 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 99 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const oas_1 = __importDefault(__webpack_require__(100));
const core_1 = __importDefault(__webpack_require__(101));
const openapi_json_1 = __importDefault(__webpack_require__(102));
class SDK {
    constructor() {
        this.spec = oas_1.default.init(openapi_json_1.default);
        this.core = new core_1.default(this.spec, 'flutterwave-v3/1.0.0 (api/6.1.3)');
    }
    config(config) {
        this.core.setConfig(config);
    }
    auth(...values) {
        this.core.setAuth(...values);
        return this;
    }
    server(url, variables = {}) {
        this.core.setServer(url, variables);
    }
    postV3Charges(body, metadata) {
        return this.core.fetch('/v3/charges', 'post', body, metadata);
    }
    postV3ValidateCharge(metadata) {
        return this.core.fetch('/v3/validate-charge', 'post', metadata);
    }
    postV3TokenizedCharges(metadata) {
        return this.core.fetch('/v3/tokenized-charges', 'post', metadata);
    }
    postV3BulkTokenizedCharges(body) {
        return this.core.fetch('/v3/bulk-tokenized-charges/', 'post', body);
    }
    getV3BulkTokenizedChargesBulk_idTransactions(metadata) {
        return this.core.fetch('/v3/bulk-tokenized-charges/{bulk_id}/transactions', 'get', metadata);
    }
    getV3BulkTokenizedChargesBulk_id(metadata) {
        return this.core.fetch('/v3/bulk-tokenized-charges/{bulk_id}', 'get', metadata);
    }
    putV3TokensToken(metadata) {
        return this.core.fetch('/v3/tokens/{token}', 'put', metadata);
    }
    postV3ChargesFlw_refCapture(body, metadata) {
        return this.core.fetch('/v3/charges/{flw_ref}/capture', 'post', body, metadata);
    }
    postV3ChargesFlw_refRefund(body, metadata) {
        return this.core.fetch('/v3/charges/{flw_ref}/refund', 'post', body, metadata);
    }
    postV3ChargesFlw_refVoid(metadata) {
        return this.core.fetch('/v3/charges/{flw_ref}/void', 'post', metadata);
    }
    getV3TransactionsIdVerify(metadata) {
        return this.core.fetch('/v3/transactions/{id}/verify', 'get', metadata);
    }
    getV3TransactionsVerify_by_reference(metadata) {
        return this.core.fetch('/v3/transactions/verify_by_reference', 'get', metadata);
    }
    postV3TransactionsIdRefund(metadata) {
        return this.core.fetch('/v3/transactions/{id}/refund', 'post', metadata);
    }
    getV3Transactions(metadata) {
        return this.core.fetch('/v3/transactions', 'get', metadata);
    }
    getV3Refunds() {
        return this.core.fetch('/v3/refunds', 'get');
    }
    getV3TransactionsFee(metadata) {
        return this.core.fetch('/v3/transactions/fee', 'get', metadata);
    }
    postV3TransactionsIdResendHook(metadata) {
        return this.core.fetch('/v3/transactions/{id}/resend-hook', 'post', metadata);
    }
    getV3TransactionsIdEvents(metadata) {
        return this.core.fetch('/v3/transactions/{id}/events', 'get', metadata);
    }
    postV3Transfers(metadata) {
        return this.core.fetch('/v3/transfers', 'post', metadata);
    }
    getV3Transfers(metadata) {
        return this.core.fetch('/v3/transfers', 'get', metadata);
    }
    postV3TransfersIdRetries(metadata) {
        return this.core.fetch('/v3/transfers/{id}/retries', 'post', metadata);
    }
    getV3TransfersIdRetries(metadata) {
        return this.core.fetch('/v3/transfers/{id}/retries', 'get', metadata);
    }
    postV3BulkTransfers(metadata) {
        return this.core.fetch('/v3/bulk-transfers/', 'post', metadata);
    }
    getV3TransfersFee(metadata) {
        return this.core.fetch('/v3/transfers/fee', 'get', metadata);
    }
    getV3TransfersId(body, metadata) {
        return this.core.fetch('/v3/transfers/{id}', 'get', body, metadata);
    }
    getV3TransfersRates(body, metadata) {
        return this.core.fetch('/v3/transfers/rates', 'get', body, metadata);
    }
    postV3Beneficiaries(metadata) {
        return this.core.fetch('/v3/beneficiaries', 'post', metadata);
    }
    getV3Beneficiaries() {
        return this.core.fetch('/v3/beneficiaries', 'get');
    }
    getV3BeneficiariesId(metadata) {
        return this.core.fetch('/v3/beneficiaries/{id}', 'get', metadata);
    }
    deleteV3BeneficiariesId(metadata) {
        return this.core.fetch('/v3/beneficiaries/{id}', 'delete', metadata);
    }
    postV3VirtualCards(metadata) {
        return this.core.fetch('/v3/virtual-cards', 'post', metadata);
    }
    getV3VirtualCards(metadata) {
        return this.core.fetch('/v3/virtual-cards', 'get', metadata);
    }
    getV3VirtualCardsId(metadata) {
        return this.core.fetch('/v3/virtual-cards/{id}', 'get', metadata);
    }
    postV3VirtualCardsIdFund(metadata) {
        return this.core.fetch('/v3/virtual-cards/{id}/fund', 'post', metadata);
    }
    postV3VirtualCardsIdWithdraw(metadata) {
        return this.core.fetch('/v3/virtual-cards/{id}/withdraw', 'post', metadata);
    }
    putV3VirtualCardsIdStatusStatus_action(metadata) {
        return this.core.fetch('/v3/virtual-cards/{id}/status/{status_action}', 'put', metadata);
    }
    putV3VirtualCardsIdTerminate(metadata) {
        return this.core.fetch('/v3/virtual-cards/{id}/terminate', 'put', metadata);
    }
    getV3VirtualCardsIdTransactions(metadata) {
        return this.core.fetch('/v3/virtual-cards/{id}/transactions', 'get', metadata);
    }
    postV3VirtualAccountNumbers(metadata) {
        return this.core.fetch('/v3/virtual-account-numbers', 'post', metadata);
    }
    postV3BulkVirtualAccountNumbers(metadata) {
        return this.core.fetch('/v3/bulk-virtual-account-numbers', 'post', metadata);
    }
    getV3VirtualAccountNumbersOrder_ref(metadata) {
        return this.core.fetch('/v3/virtual-account-numbers/{order_ref}', 'get', metadata);
    }
    putV3VirtualAccountNumbersOrder_ref(metadata) {
        return this.core.fetch('/v3/virtual-account-numbers/{order_ref}', 'put', metadata);
    }
    postV3VirtualAccountNumbersOrder_ref(body, metadata) {
        return this.core.fetch('/v3/virtual-account-numbers/{order_ref}', 'post', body, metadata);
    }
    getV3BulkVirtualAccountNumbersBatch_id(metadata) {
        return this.core.fetch('/v3/bulk-virtual-account-numbers/{batch_id}', 'get', metadata);
    }
    postV3Subaccounts(metadata) {
        return this.core.fetch('/v3/subaccounts', 'post', metadata);
    }
    getV3Subaccounts(metadata) {
        return this.core.fetch('/v3/subaccounts', 'get', metadata);
    }
    getV3SubaccountsId(metadata) {
        return this.core.fetch('/v3/subaccounts/{id}', 'get', metadata);
    }
    putV3SubaccountsId(metadata) {
        return this.core.fetch('/v3/subaccounts/{id}', 'put', metadata);
    }
    deleteV3SubaccountsId(metadata) {
        return this.core.fetch('/v3/subaccounts/{id}', 'delete', metadata);
    }
    postV3PayoutSubaccounts(metadata) {
        return this.core.fetch('/v3/payout-subaccounts', 'post', metadata);
    }
    getV3PayoutSubaccounts(metadata) {
        return this.core.fetch('/v3/payout-subaccounts', 'get', metadata);
    }
    getV3PayoutSubaccountsAccount_reference(metadata) {
        return this.core.fetch('/v3/payout-subaccounts/{account_reference}', 'get', metadata);
    }
    putV3PayoutSubaccountsAccount_reference(metadata) {
        return this.core.fetch('/v3/payout-subaccounts/{account_reference}', 'put', metadata);
    }
    getV3PayoutSubaccountsAccount_referenceTransactions(metadata) {
        return this.core.fetch('/v3/payout-subaccounts/{account_reference}/transactions', 'get', metadata);
    }
    getV3PayoutSubaccountsAccount_referenceBalances(metadata) {
        return this.core.fetch('/v3/payout-subaccounts/{account_reference}/balances', 'get', metadata);
    }
    getV3PayoutSubaccountsAccount_referenceStaticAccount(metadata) {
        return this.core.fetch('/v3/payout-subaccounts/{account_reference}/static-account', 'get', metadata);
    }
    getV3Subscriptions(metadata) {
        return this.core.fetch('/v3/subscriptions', 'get', metadata);
    }
    putV3SubscriptionsIdActivate(metadata) {
        return this.core.fetch('/v3/subscriptions/{id}/activate', 'put', metadata);
    }
    putV3SubscriptionsIdCancel(metadata) {
        return this.core.fetch('/v3/subscriptions/{id}/cancel', 'put', metadata);
    }
    postV3PaymentPlans(metadata) {
        return this.core.fetch('/v3/payment-plans', 'post', metadata);
    }
    getV3PaymentPlans(metadata) {
        return this.core.fetch('/v3/payment-plans', 'get', metadata);
    }
    getV3PaymentPlansId(metadata) {
        return this.core.fetch('/v3/payment-plans/{id}', 'get', metadata);
    }
    putV3PaymentPlansId(metadata) {
        return this.core.fetch('/v3/payment-plans/{id}', 'put', metadata);
    }
    putV3PaymentPlansIdCancel(metadata) {
        return this.core.fetch('/v3/payment-plans/{id}/cancel', 'put', metadata);
    }
    getV3TopBillCategories(metadata) {
        return this.core.fetch('/v3/top-bill-categories', 'get', metadata);
    }
    getV3BillsCategoryBillers(metadata) {
        return this.core.fetch('/v3/bills/{category}/billers', 'get', metadata);
    }
    getV3BillersBiller_codeItems(metadata) {
        return this.core.fetch('/v3/billers/{biller_code}/items', 'get', metadata);
    }
    getV3BillItemsCb141Validate(metadata) {
        return this.core.fetch('/v3/bill-items/CB141/validate', 'get', metadata);
    }
    postV3BillersBiller_codeItemsItem_codePayment(metadata) {
        return this.core.fetch('/v3/billers/{biller_code}/items/{item_code}/payment', 'post', metadata);
    }
    getV3BillsSummary(metadata) {
        return this.core.fetch('/v3/bills/summary', 'get', metadata);
    }
    getV3BillsReference(metadata) {
        return this.core.fetch('/v3/bills/{reference}', 'get', metadata);
    }
    postV3BulkBills(metadata) {
        return this.core.fetch('/v3/bulk-bills', 'post', metadata);
    }
    getV3BillsHistory(metadata) {
        return this.core.fetch('/v3/bills/history', 'get', metadata);
    }
    getV3BanksCountry(metadata) {
        return this.core.fetch('/v3/banks/{country}', 'get', metadata);
    }
    getV3BanksIdBranches(metadata) {
        return this.core.fetch('/v3/banks/{id}/branches', 'get', metadata);
    }
    getV3Balances(metadata) {
        return this.core.fetch('/v3/balances', 'get', metadata);
    }
    getV3BalancesCurrency(metadata) {
        return this.core.fetch('/v3/balances/{currency}', 'get', metadata);
    }
    postV3AccountsResolve(metadata) {
        return this.core.fetch('/v3/accounts/resolve', 'post', metadata);
    }
    getV3CardBinsBin(metadata) {
        return this.core.fetch('/v3/card-bins/{bin}', 'get', metadata);
    }
    getV3WalletStatement(metadata) {
        return this.core.fetch('/v3/wallet/statement', 'get', metadata);
    }
    postV3BvnVerifications(body) {
        return this.core.fetch('/v3/bvn/verifications', 'post', body);
    }
    getV3BvnVerificationsReference(metadata) {
        return this.core.fetch('/v3/bvn/verifications/{reference}', 'get', metadata);
    }
    getV3Settlements(metadata) {
        return this.core.fetch('/v3/settlements', 'get', metadata);
    }
    getV3SettlementsId(metadata) {
        return this.core.fetch('/v3/settlements/{id}', 'get', metadata);
    }
    postV3Otps(metadata) {
        return this.core.fetch('/v3/otps', 'post', metadata);
    }
    postV3OtpsReferenceValidate(body, metadata) {
        return this.core.fetch('/v3/otps/{reference}/validate', 'post', body, metadata);
    }
    getV3Chargebacks(metadata) {
        return this.core.fetch('/v3/chargebacks', 'get', metadata);
    }
    putV3ChargebacksId(body, metadata) {
        return this.core.fetch('/v3/chargebacks/{id}', 'put', body, metadata);
    }
}
const createSDK = (() => { return new SDK(); })();
exports["default"] = createSDK;


/***/ }),
/* 100 */
/***/ ((module) => {

module.exports = require("oas");

/***/ }),
/* 101 */
/***/ ((module) => {

module.exports = require("api/dist/core");

/***/ }),
/* 102 */
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"openapi":"3.0.0","info":{"title":"Flutterwave v3","version":"1.0.0","description":"The Flutterwave for Business(F4B) APIs collection for all v3 endpoints with pre-formatted requests and response examples."},"servers":[{"url":"https://api.flutterwave.com"}],"paths":{"/v3/charges":{"parameters":[],"post":{"summary":"card","parameters":[{"name":"type","in":"query","required":false,"example":"card","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Mon, 18 Mar 2024 08:16:47 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"1068"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"42c-bldAoO0AGvS7w9B9qyWc/w\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"card - success","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"tx_ref":{"type":"string"},"flw_ref":{"type":"string"},"device_fingerprint":{"type":"string"},"amount":{"type":"integer"},"charged_amount":{"type":"integer"},"app_fee":{"type":"number"},"merchant_fee":{"type":"integer"},"processor_response":{"type":"string"},"auth_model":{"type":"string"},"currency":{"type":"string"},"ip":{"type":"string","format":"ip-address"},"narration":{"type":"string"},"status":{"type":"string"},"auth_url":{"type":"string","format":"uri"},"payment_type":{"type":"string"},"plan":{"nullable":true},"fraud_status":{"type":"string"},"charge_type":{"type":"string"},"created_at":{"type":"string","format":"date-time"},"account_id":{"type":"integer"},"customer":{"type":"object","properties":{"id":{"type":"integer"},"phone_number":{"nullable":true},"name":{"type":"string"},"email":{"type":"string","format":"email"},"created_at":{"type":"string","format":"date-time"}}},"card":{"type":"object","properties":{"first_6digits":{"type":"string","format":"color"},"last_4digits":{"type":"string","format":"utc-millisec"},"issuer":{"type":"string"},"country":{"type":"string"},"type":{"type":"string"},"expiry":{"type":"string"}}}}}}},"example":{"status":"success","message":"Successful","data":{"id":4973065,"tx_ref":"YOUR_UNIQUE_REFERENCE","flw_ref":"FLW-MOCK-2477a2b9d7845b31976cd50c0af890f1","device_fingerprint":"N/A","amount":100,"charged_amount":100,"app_fee":1.4,"merchant_fee":0,"processor_response":"Please enter the OTP sent to your mobile number 080****** and email te**@rave**.com","auth_model":"NOAUTH","currency":"NGN","ip":"52.209.154.143","narration":"CARD Transaction ","status":"successful","auth_url":"https://ravesandboxapi.flutterwave.com/mockvbvpage?ref=FLW-MOCK-2477a2b9d7845b31976cd50c0af890f1&code=00&message=Approved.%20Successful&receiptno=RN1710749806478","payment_type":"card","plan":null,"fraud_status":"ok","charge_type":"normal","created_at":"2024-03-18T08:16:46.000Z","account_id":20937,"customer":{"id":2373734,"phone_number":null,"name":"Anonymous customer","email":"developers@flutterwavego.com","created_at":"2024-03-18T08:16:46.000Z"},"card":{"first_6digits":"553188","last_4digits":"2950","issuer":"MASTERCARD  CREDIT","country":"NG","type":"MASTERCARD","expiry":"09/32"}}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Wed, 27 Mar 2024 10:20:21 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"56"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"38-OBAazE4T6h1/TUwzUcBWiw\\""}},"description":"card - error","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"BIN not Found","data":null}}}}},"requestBody":{"content":{"application/json":{"schema":{"type":"object","properties":{"tx_ref":{"type":"string"},"amount":{"type":"integer"},"currency":{"type":"string"},"card_number":{"type":"string","format":"utc-millisec"},"expiry_month":{"type":"string","format":"utc-millisec"},"expiry_year":{"type":"string","format":"utc-millisec"},"cvv":{"type":"string","format":"color"},"redirect_url":{"type":"string","format":"uri"},"email":{"type":"string","format":"email"},"meta":{"type":"object","properties":{"extraData":{"type":"string"}}}}},"example":{"tx_ref":"YOUR_UNIQUE_REFERENCE","amount":100,"currency":"NGN","card_number":"5531886652142950","expiry_month":"09","expiry_year":"32","cvv":"564","redirect_url":"https://www.google.com","email":"developers@flutterwavego.com","meta":{"extraData":"Some data I want to access later"}}}}}}},"/v3/validate-charge":{"parameters":[],"post":{"summary":"Validate Charge","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 21 Mar 2024 22:16:54 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"859"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"35b-EU5fnOECfJz9MXbcKeFQTA\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Validate Charge - success","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"tx_ref":{"type":"string"},"flw_ref":{"type":"string"},"device_fingerprint":{"type":"string"},"amount":{"type":"integer"},"charged_amount":{"type":"integer"},"app_fee":{"type":"number"},"merchant_fee":{"type":"integer"},"processor_response":{"type":"string"},"auth_model":{"type":"string"},"currency":{"type":"string"},"ip":{"type":"string","format":"ip-address"},"narration":{"type":"string"},"status":{"type":"string"},"auth_url":{"type":"string"},"payment_type":{"type":"string"},"plan":{"nullable":true},"fraud_status":{"type":"string"},"charge_type":{"type":"string"},"created_at":{"type":"string","format":"date-time"},"account_id":{"type":"integer"},"customer":{"type":"object","properties":{"id":{"type":"integer"},"phone_number":{"nullable":true},"name":{"type":"string"},"email":{"type":"string","format":"email"},"created_at":{"type":"string","format":"date-time"}}},"card":{"type":"object","properties":{"first_6digits":{"type":"string","format":"color"},"last_4digits":{"type":"string","format":"utc-millisec"},"issuer":{"type":"string"},"country":{"type":"string"},"type":{"type":"string"},"expiry":{"type":"string"}}}}}}},"example":{"status":"success","message":"Charge validated","data":{"id":4981392,"tx_ref":"MC-3243ff00440011pu00","flw_ref":"FLW-MOCK-f7a221903f699288569465135f357022","device_fingerprint":"N/A","amount":100,"charged_amount":100,"app_fee":1.4,"merchant_fee":0,"processor_response":"successful","auth_model":"PIN","currency":"NGN","ip":"52.209.154.143","narration":"CARD Transaction ","status":"successful","auth_url":"N/A","payment_type":"card","plan":null,"fraud_status":"ok","charge_type":"normal","created_at":"2024-03-21T22:16:28.000Z","account_id":20937,"customer":{"id":2376560,"phone_number":null,"name":"John Doe","email":"Johndoe@gmail.com","created_at":"2024-03-21T22:16:28.000Z"},"card":{"first_6digits":"539983","last_4digits":"8381","issuer":"MASTERCARD GUARANTY TRUST BANK Mastercard Naira Debit Card","country":"NG","type":"MASTERCARD","expiry":"10/31"}}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 08:22:40 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"84"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"54-mjKKu+Z38SQqnigU/WWbwQ\\""}},"description":"Validate Charge - error","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Invalid transaction attempt. No REF Cache","data":null}}}}}}},"/v3/tokenized-charges":{"parameters":[],"post":{"summary":"Create a Tokenized Charge","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"840"},"ETag":{"schema":{"type":"string"},"example":"W/\\"348-5Ua3C8srJWGnzo4VDdfWlw\\""},"Date":{"schema":{"type":"string"},"example":"Wed, 11 Mar 2020 19:33:22 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"tx_ref":{"type":"string"},"flw_ref":{"type":"string"},"redirect_url":{"type":"string","format":"uri"},"device_fingerprint":{"type":"string"},"amount":{"type":"integer"},"charged_amount":{"type":"integer"},"app_fee":{"type":"number"},"merchant_fee":{"type":"integer"},"processor_response":{"type":"string"},"auth_model":{"type":"string"},"currency":{"type":"string"},"ip":{"type":"string"},"narration":{"type":"string"},"status":{"type":"string"},"payment_type":{"type":"string"},"created_at":{"type":"string","format":"date-time"},"account_id":{"type":"integer"},"customer":{"type":"object","properties":{"id":{"type":"integer"},"phone_number":{"type":"string"},"name":{"type":"string"},"email":{"type":"string","format":"email"},"created_at":{"type":"string","format":"date-time"}}},"card":{"type":"object","properties":{"first_6digits":{"type":"string","format":"color"},"last_4digits":{"type":"string","format":"utc-millisec"},"issuer":{"type":"string"},"country":{"type":"string"},"type":{"type":"string"},"expiry":{"type":"string"},"token":{"type":"string"}}}}}}},"example":{"status":"success","message":"Charge successful","data":{"id":1163077,"tx_ref":"akhlm-pstmn-23452","flw_ref":"FLW-M03K-781621ccfe976c03515bcd07a39f3db8","redirect_url":"http://127.0.0","device_fingerprint":"N/A","amount":30300,"charged_amount":30300,"app_fee":11741.9,"merchant_fee":0,"processor_response":"Approved","auth_model":"noauth","currency":"NGN","ip":"pstmn","narration":"pstmn charge","status":"successful","payment_type":"card","created_at":"2020-03-11T19:33:20.000Z","account_id":73362,"customer":{"id":252759,"phone_number":"0813XXXXXXX","name":"Kendrick Graham","email":"user@example.com","created_at":"2020-01-15T13:26:24.000Z"},"card":{"first_6digits":"553188","last_4digits":"2950","issuer":"MASTERCARD  CREDIT","country":"NG","type":"MASTERCARD","expiry":"09/22","token":"flw-t0-d0185c6edad078c9e8304c4f78b8cd5b-m03k"}}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Mon, 18 Mar 2024 09:45:27 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"70"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"46-0GFY0QTQRBzquTV1urerCw\\""}},"description":"Sample Bad Request Error","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Wrong token or email passed","data":null}}}}}}},"/v3/bulk-tokenized-charges/":{"parameters":[],"post":{"summary":"Create Bulk Tokenized Charge","parameters":[],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"232"},"ETag":{"schema":{"type":"string"},"example":"W/\\"e8-2ZfIYuOX6YwI4VOfAdHg3A\\""},"Date":{"schema":{"type":"string"},"example":"Thu, 12 Mar 2020 16:04:40 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"created_at":{"type":"string","format":"date-time"},"approver":{"type":"string"},"title":{"type":"string"},"total_charges":{"type":"integer"},"pending_charges":{"type":"integer"},"processed_charges":{"type":"integer"}}}}},"example":{"status":"success","message":"Bulk charge initiated","data":{"id":156,"created_at":"2020-03-12T16:04:40.000Z","approver":"N/A","title":"akhlm blk tknzd chrg pstmn tst 1","total_charges":2,"pending_charges":2,"processed_charges":0}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 08:25:37 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"142"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"8e-ucKQ53jtFBpsyUnNJe0hxA\\""}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"retry_interval is required , retry_amount_variable is required , retry_attempt_variable is required","data":null}}}}},"requestBody":{"content":{"application/json":{"schema":{"type":"object","properties":{"title":{"type":"string"},"retry_strategy":{"type":"object","properties":{"retry_interval":{"type":"integer"},"retry_amount_variable":{"type":"integer"},"retry_attempt_variable":{"type":"integer"}}},"bulk_data":{"type":"array","items":{"type":"object","properties":{"currency":{"type":"string"},"token":{"type":"string"},"country":{"type":"string"},"amount":{"type":"integer"},"email":{"type":"string","format":"email"},"first_name":{"type":"string"},"last_name":{"type":"string"},"ip":{"type":"string"},"tx_ref":{"type":"string"}}}}}},"example":{"title":"akhlm blk tknzd chrg pstmn tst 1","retry_strategy":{"retry_interval":120,"retry_amount_variable":60,"retry_attempt_variable":2},"bulk_data":[{"currency":"NGN","token":"flw-t1nf-f9b3bf384cd30d6fca42b6df9d27bd2f-m03k","country":"NG","amount":3500,"email":"user@example.com","first_name":"Example","last_name":"User","ip":"pstmn","tx_ref":"akhlm-pstmn-blkchrg-xy10"},{"currency":"NGN","token":"flw-t1nf-f9b3bf384cd30d6fca42b6df9d27bd2f-m03k","country":"NG","amount":3000,"email":"user@example.com","first_name":"Jane","last_name":"Doe","ip":"pstmn","tx_ref":"akhlm-pstmn-blkchrge-xx10"}]}}}}}},"/v3/bulk-tokenized-charges/{bulk_id}/transactions":{"parameters":[{"name":"bulk_id","in":"path","required":true,"schema":{"type":"string"}}],"get":{"summary":"Get Bulk Tokenized Transactions","parameters":[],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"4485"},"ETag":{"schema":{"type":"string"},"example":"W/\\"1185-xEAl/PyUpqyc4y3MsWkoGw\\""},"Date":{"schema":{"type":"string"},"example":"Wed, 11 Mar 2020 19:33:59 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"array","items":{"type":"object","properties":{"tx_ref":{"type":"string"},"id":{"type":"string","format":"utc-millisec"},"flw_ref":{"type":"string"},"device_fingerprint":{"type":"string"},"amount":{"type":"integer"},"currency":{"type":"string"},"charged_amount":{"type":"integer"},"app_fee":{"type":"integer"},"merchant_fee":{"type":"integer"},"processor_response":{"type":"string"},"auth_model":{"type":"string"},"ip":{"type":"string"},"narration":{"type":"string"},"status":{"type":"string"},"payment_type":{"type":"string"},"created_at":{"type":"string","format":"date-time"},"account_id":{"type":"string","format":"utc-millisec"},"amount_settled":{"type":"integer"},"card":{"type":"object","properties":{"expiry":{"type":"string"},"type":{"type":"string"},"country":{"type":"string"},"issuer":{"type":"string"},"first_6digits":{"type":"string","format":"color"},"last_4digits":{"type":"string","format":"utc-millisec"}}},"customer":{"type":"object","properties":{"id":{"type":"string","format":"color"},"email":{"type":"string","format":"email"},"phone_number":{"type":"string"},"name":{"type":"string"},"created_at":{"type":"string","format":"date-time"}}}}}}}},"example":{"status":"success","message":"Bulk charge transactions fetched","data":[{"tx_ref":"akhlm-pstmn-blkchrg-xx6","id":"1017000","flw_ref":"FLW-M03K-7544dc8d157ca763bbcf864a24906f93","device_fingerprint":"N/A","amount":3500,"currency":"NGN","charged_amount":3549,"app_fee":49,"merchant_fee":0,"processor_response":"Approved","auth_model":"noauth","ip":"pstmn","narration":"Kizito Akhilome","status":"successful","payment_type":"card","created_at":"2020-01-19T21:46:29.000Z","account_id":"73362","amount_settled":3450,"card":{"expiry":"09/22","type":"MASTERCARD","country":"NIGERIA NG","issuer":"MASTERCARD  CREDIT","first_6digits":"553188","last_4digits":"2950"},"customer":{"id":"252759","email":"user@example.com","phone_number":"0813XXXXXXX","name":"Kizito Akhilome","created_at":"2020-01-15T13:26:24.000Z"}},{"tx_ref":"akhlm-pstmn-blkchrg-xx6","id":"1017004","flw_ref":"FLW-M03K-4aa1f32bbc80a7cf9e42426e9b2d73eb","device_fingerprint":"N/A","amount":3500,"currency":"NGN","charged_amount":3549,"app_fee":49,"merchant_fee":0,"processor_response":"Approved","auth_model":"noauth","ip":"pstmn","narration":"Kizito Akhilome","status":"successful","payment_type":"card","created_at":"2020-01-19T21:49:29.000Z","account_id":"73362","amount_settled":3450,"card":{"expiry":"09/22","type":"MASTERCARD","country":"NIGERIA NG","issuer":"MASTERCARD  CREDIT","first_6digits":"553188","last_4digits":"2950"},"customer":{"id":"252759","email":"user@example.com","phone_number":"0813XXXXXXX","name":"Kizito Akhilome","created_at":"2020-01-15T13:26:24.000Z"}},{"tx_ref":"akhlm-pstmn-blkchrg-xx6","id":"1163067","flw_ref":"FLW-M03K-9d02da3020c67ac05ade7b596881d59f","device_fingerprint":"N/A","amount":3500,"currency":"NGN","charged_amount":3500,"app_fee":1050,"merchant_fee":0,"processor_response":"Approved","auth_model":"noauth","ip":"pstmn","narration":"Kizito Akhilome","status":"successful","payment_type":"card","created_at":"2020-03-11T19:22:06.000Z","account_id":"73362","amount_settled":2450,"card":{"expiry":"09/22","type":"MASTERCARD","country":"NIGERIA NG","issuer":"MASTERCARD  CREDIT","first_6digits":"553188","last_4digits":"2950"},"customer":{"id":"252759","email":"user@example.com","phone_number":"0813XXXXXXX","name":"Kendrick Graham","created_at":"2020-01-15T13:26:24.000Z"}},{"tx_ref":"akhlm-pstmn-blkchrge-xx6","id":"1017001","flw_ref":"FLW-M03K-bbd148a9569b709882da8437e123ba61","device_fingerprint":"N/A","amount":3000,"currency":"NGN","charged_amount":3042,"app_fee":42,"merchant_fee":0,"processor_response":"Approved","auth_model":"noauth","ip":"pstmn","narration":"Kizito Akhilome","status":"successful","payment_type":"card","created_at":"2020-01-19T21:46:30.000Z","account_id":"73362","amount_settled":2950,"card":{"expiry":"09/22","type":"MASTERCARD","country":"NIGERIA NG","issuer":"MASTERCARD  CREDIT","first_6digits":"553188","last_4digits":"2950"},"customer":{"id":"252759","email":"user@example.com","phone_number":"0813XXXXXXX","name":"Kizito Akhilome","created_at":"2020-01-15T13:26:24.000Z"}},{"tx_ref":"akhlm-pstmn-blkchrge-xx6","id":"1017005","flw_ref":"FLW-M03K-3a046716482046ea974c73d73eaa4463","device_fingerprint":"N/A","amount":3000,"currency":"NGN","charged_amount":3042,"app_fee":42,"merchant_fee":0,"processor_response":"Approved","auth_model":"noauth","ip":"pstmn","narration":"Kizito Akhilome","status":"successful","payment_type":"card","created_at":"2020-01-19T21:49:30.000Z","account_id":"73362","amount_settled":2950,"card":{"expiry":"09/22","type":"MASTERCARD","country":"NIGERIA NG","issuer":"MASTERCARD  CREDIT","first_6digits":"553188","last_4digits":"2950"},"customer":{"id":"252759","email":"user@example.com","phone_number":"0813XXXXXXX","name":"Kizito Akhilome","created_at":"2020-01-15T13:26:24.000Z"}},{"tx_ref":"akhlm-pstmn-blkchrge-xx6","id":"1163068","flw_ref":"FLW-M03K-02c21a8095c7e064b8b9714db834080b","device_fingerprint":"N/A","amount":3000,"currency":"NGN","charged_amount":3000,"app_fee":1000,"merchant_fee":0,"processor_response":"Approved","auth_model":"noauth","ip":"pstmn","narration":"Kizito Akhilome","status":"successful","payment_type":"card","created_at":"2020-03-11T19:22:07.000Z","account_id":"73362","amount_settled":2000,"card":{"expiry":"09/22","type":"MASTERCARD","country":"NIGERIA NG","issuer":"MASTERCARD  CREDIT","first_6digits":"553188","last_4digits":"2950"},"customer":{"id":"252759","email":"user@example.com","phone_number":"0813XXXXXXX","name":"Kendrick Graham","created_at":"2020-01-15T13:26:24.000Z"}}]}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 08:27:22 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"76"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"4c-vkZdvxWSI4PqT18kwWAoeg\\""}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"No transactions for this batch_id","data":null}}}}}}},"/v3/bulk-tokenized-charges/{bulk_id}":{"parameters":[{"name":"bulk_id","in":"path","required":true,"schema":{"type":"string"}}],"get":{"summary":"Get status of Bulk Tokenized Charge","parameters":[],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"190"},"ETag":{"schema":{"type":"string"},"example":"W/\\"be-ez0zOMCX75lcD7RVZfIaeA\\""},"Date":{"schema":{"type":"string"},"example":"Thu, 12 Mar 2020 16:08:13 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Response Message","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"title":{"type":"string"},"approver":{"type":"string"},"processed_charges":{"type":"integer"},"pending_charges":{"type":"integer"},"total_charges":{"type":"integer"}}}}},"example":{"status":"success","message":"Bulk charge fetched","data":{"id":156,"title":"akhlm blk tknzd chrg pstmn tst 1","approver":"N/A","processed_charges":2,"pending_charges":0,"total_charges":2}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 08:28:05 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"59"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"3b-zt/QlEs/tOw3N43V+JHq5g\\""}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Invalid Batch ID","data":null}}}}}}},"/v3/tokens/{token}":{"parameters":[{"name":"token","in":"path","required":true,"schema":{"type":"string"}}],"put":{"summary":"Update a Card Token","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"216"},"ETag":{"schema":{"type":"string"},"example":"W/\\"d8-rwZqanskgxtoQJWuWIntvw\\""},"Date":{"schema":{"type":"string"},"example":"Tue, 21 Jan 2020 19:45:27 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Successful Example","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"customer_email":{"type":"string","format":"email"},"customer_full_name":{"type":"string"},"customer_phone_number":{"type":"string"},"created_at":{"type":"string","format":"date-time"}}}}},"example":{"status":"success","message":"Token details updated","data":{"customer_email":"user@example.com","customer_full_name":"Kendrick Graham","customer_phone_number":"0813XXXXXXX","created_at":"2020-01-15T13:26:24.000Z"}}}}},"400":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"58"},"ETag":{"schema":{"type":"string"},"example":"W/\\"3a-AP8hyyebt8xFQdG9ZfAGfg\\""},"Date":{"schema":{"type":"string"},"example":"Tue, 21 Jan 2020 19:46:31 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Error Example","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Token not found","data":null}}}}}}},"/v3/charges/{flw_ref}/capture":{"parameters":[{"name":"flw_ref","in":"path","required":true,"example":"FLW-MOCK-PREAUTH-bde14443c3f233d11c5f574acc120399","schema":{"type":"string"}}],"post":{"summary":"Capture a Charge","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Mon, 18 Mar 2024 10:10:02 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"880"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"370-07G7vjSNm0N8pmqOeg2PdQ\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Capture a Charge - success","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"tx_ref":{"type":"string"},"flw_ref":{"type":"string"},"device_fingerprint":{"type":"string"},"amount":{"type":"integer"},"charged_amount":{"type":"integer"},"app_fee":{"type":"number"},"merchant_fee":{"type":"integer"},"processor_response":{"type":"string"},"auth_model":{"type":"string"},"currency":{"type":"string"},"ip":{"type":"string","format":"ip-address"},"narration":{"type":"string"},"status":{"type":"string"},"auth_url":{"type":"string"},"payment_type":{"type":"string"},"plan":{"nullable":true},"fraud_status":{"type":"string"},"charge_type":{"type":"string"},"created_at":{"type":"string","format":"date-time"},"account_id":{"type":"integer"},"customer":{"type":"object","properties":{"id":{"type":"integer"},"phone_number":{"nullable":true},"name":{"type":"string"},"email":{"type":"string","format":"email"},"created_at":{"type":"string","format":"date-time"}}},"card":{"type":"object","properties":{"first_6digits":{"type":"string","format":"color"},"last_4digits":{"type":"string","format":"utc-millisec"},"issuer":{"type":"string"},"country":{"type":"string"},"type":{"type":"string"},"expiry":{"type":"string"}}}}}}},"example":{"status":"success","message":"Charge captured","data":{"id":4973327,"tx_ref":"YOUR_UNIQUE_REFERENCE","flw_ref":"FLW-MOCK-PREAUTH-1c4b0406fccc0fad316b46f947e870e9","device_fingerprint":"N/A","amount":100,"charged_amount":100,"app_fee":5.8,"merchant_fee":0,"processor_response":"Approved","auth_model":"NOAUTH","currency":"NGN","ip":"52.209.154.143","narration":"FLW-PBF CARD Transaction ","status":"successful","auth_url":"N/A","payment_type":"card","plan":null,"fraud_status":"ok","charge_type":"preauth","created_at":"2024-03-18T10:04:04.000Z","account_id":20937,"customer":{"id":2373843,"phone_number":null,"name":"Anonymous customer","email":"developers@flutterwavego.com","created_at":"2024-03-18T10:04:03.000Z"},"card":{"first_6digits":"537728","last_4digits":"7450","issuer":"MASTERCARD JSB PROBUSINESSBANK CREDITGOLD","country":"RU","type":"MASTERCARD","expiry":"09/31"}}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 08:28:42 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"173"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"ad-/v5GRyvzpAJZATc16eBPJQ\\""}},"description":"Capture a Charge - error","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Transaction with ref FLW-MOCK-PREAUTH-bde14443c3f233d11c5f574acc120390 either does not exist or is not a valid preauth transaction","data":null}}}}},"requestBody":{"content":{"application/json":{"schema":{"type":"object","properties":{"amount":{"type":"integer"}}},"example":{"amount":100}}}}}},"/v3/charges/{flw_ref}/refund":{"parameters":[{"name":"flw_ref","in":"path","required":true,"example":"FLW-MOCK-PREAUTH-bde14443c3f233d11c5f574acc120399","schema":{"type":"string"}}],"post":{"summary":"Create a Refund","parameters":[],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Mon, 18 Mar 2024 10:19:41 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"969"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"3c9-koj1tkiehJSNVvMtXHVqTA\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Create a Refund - success","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"tx_ref":{"type":"string"},"flw_ref":{"type":"string"},"device_fingerprint":{"type":"string"},"amount":{"type":"integer"},"charged_amount":{"type":"integer"},"app_fee":{"type":"number"},"merchant_fee":{"type":"integer"},"processor_response":{"type":"string"},"auth_model":{"type":"string"},"currency":{"type":"string"},"ip":{"type":"string","format":"ip-address"},"narration":{"type":"string"},"status":{"type":"string"},"auth_url":{"type":"string"},"payment_type":{"type":"string"},"plan":{"nullable":true},"fraud_status":{"type":"string"},"charge_type":{"type":"string"},"created_at":{"type":"string","format":"date-time"},"account_id":{"type":"integer"},"customer":{"type":"object","properties":{"id":{"type":"integer"},"phone":{"nullable":true},"fullName":{"type":"string"},"customertoken":{"nullable":true},"email":{"type":"string","format":"email"},"createdAt":{"type":"string","format":"date-time"},"updatedAt":{"type":"string","format":"date-time"},"deletedAt":{"nullable":true},"AccountId":{"type":"integer"}}},"card":{"type":"object","properties":{"first_6digits":{"type":"string","format":"color"},"last_4digits":{"type":"string","format":"utc-millisec"},"issuer":{"type":"string"},"country":{"type":"string"},"type":{"type":"string"},"expiry":{"type":"string"}}}}}}},"example":{"status":"success","message":"Charge refunded","data":{"id":4973363,"tx_ref":"YOUR_UNIQUE_REFERENCE","flw_ref":"FLW-MOCK-PREAUTH-bde14443c3f233d11c5f574acc120399","device_fingerprint":"N/A","amount":100,"charged_amount":100,"app_fee":5.8,"merchant_fee":0,"processor_response":"Approved","auth_model":"NOAUTH","currency":"NGN","ip":"54.75.161.64","narration":"FLW-PBF CARD Transaction ","status":"successful","auth_url":"N/A","payment_type":"card","plan":null,"fraud_status":"ok","charge_type":"preauth","created_at":"2024-03-18T10:18:56.000Z","account_id":20937,"customer":{"id":2373852,"phone":null,"fullName":"Anonymous customer","customertoken":null,"email":"developers@flutterwavego.com","createdAt":"2024-03-18T10:18:56.000Z","updatedAt":"2024-03-18T10:18:56.000Z","deletedAt":null,"AccountId":20937},"card":{"first_6digits":"537728","last_4digits":"7450","issuer":"MASTERCARD JSB PROBUSINESSBANK CREDITGOLD","country":"RU","type":"MASTERCARD","expiry":"09/31"}}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 08:29:20 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"101"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"65-1M0bRoYXaYrXia6GSiFaqQ\\""}},"description":"Create a Refund - error","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string","format":"style"},"data":{"nullable":true}}},"example":{"status":"error","message":"Error: Cannot refund non-existent/unauthorized transaction","data":null}}}}},"requestBody":{"content":{"application/json":{"schema":{"type":"object","properties":{"amount":{"type":"string","format":"color"}}},"example":{"amount":"100"}}}}}},"/v3/charges/{flw_ref}/void":{"parameters":[{"name":"flw_ref","in":"path","required":true,"example":"FLW-MOCK-PREAUTH-1c4b0406fccc0fad316b46f947e870e9","schema":{"type":"string"}}],"post":{"summary":"Void a Charge","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Mon, 18 Mar 2024 10:16:40 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"874"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"36a-5Xzpj4oW4SqQcDAIJCBEDg\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Void a Charge - success","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"tx_ref":{"type":"string"},"flw_ref":{"type":"string"},"device_fingerprint":{"type":"string"},"amount":{"type":"integer"},"charged_amount":{"type":"integer"},"app_fee":{"type":"number"},"merchant_fee":{"type":"integer"},"processor_response":{"type":"string"},"auth_model":{"type":"string"},"currency":{"type":"string"},"ip":{"type":"string","format":"ip-address"},"narration":{"type":"string"},"status":{"type":"string"},"auth_url":{"type":"string"},"payment_type":{"type":"string"},"plan":{"nullable":true},"fraud_status":{"type":"string"},"charge_type":{"type":"string"},"created_at":{"type":"string","format":"date-time"},"account_id":{"type":"integer"},"customer":{"type":"object","properties":{"id":{"type":"integer"},"phone_number":{"nullable":true},"name":{"type":"string"},"email":{"type":"string","format":"email"},"created_at":{"type":"string","format":"date-time"}}},"card":{"type":"object","properties":{"first_6digits":{"type":"string","format":"color"},"last_4digits":{"type":"string","format":"utc-millisec"},"issuer":{"type":"string"},"country":{"type":"string"},"type":{"type":"string"},"expiry":{"type":"string"}}}}}}},"example":{"status":"success","message":"Charge voided","data":{"id":4973327,"tx_ref":"YOUR_UNIQUE_REFERENCE","flw_ref":"FLW-MOCK-PREAUTH-1c4b0406fccc0fad316b46f947e870e9","device_fingerprint":"N/A","amount":100,"charged_amount":100,"app_fee":5.8,"merchant_fee":0,"processor_response":"Approved","auth_model":"NOAUTH","currency":"NGN","ip":"52.209.154.143","narration":"FLW-PBF CARD Transaction ","status":"voided","auth_url":"N/A","payment_type":"card","plan":null,"fraud_status":"ok","charge_type":"preauth","created_at":"2024-03-18T10:04:04.000Z","account_id":20937,"customer":{"id":2373843,"phone_number":null,"name":"Anonymous customer","email":"developers@flutterwavego.com","created_at":"2024-03-18T10:04:03.000Z"},"card":{"first_6digits":"537728","last_4digits":"7450","issuer":"MASTERCARD JSB PROBUSINESSBANK CREDITGOLD","country":"RU","type":"MASTERCARD","expiry":"09/31"}}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 08:34:33 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"68"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"44-xLIuFC9i8+gafF4HEFQJ/A\\""}},"description":"Void a Charge - error","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"No PBTX transaction found","data":null}}}}}}},"/v3/transactions/{id}/verify":{"parameters":[{"name":"id","in":"path","required":true,"example":"4975363","schema":{"type":"integer"}}],"get":{"summary":"Verify a Transaction","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Tue, 19 Mar 2024 09:55:08 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"793"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"319-Hoc8XfTC2WI0+4NTzUpJJQ\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Verify a Transaction - success","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"tx_ref":{"type":"string"},"flw_ref":{"type":"string","format":"utc-millisec"},"device_fingerprint":{"type":"string"},"amount":{"type":"integer"},"currency":{"type":"string"},"charged_amount":{"type":"integer"},"app_fee":{"type":"integer"},"merchant_fee":{"type":"integer"},"processor_response":{"type":"string"},"auth_model":{"type":"string"},"ip":{"type":"string","format":"ipv6"},"narration":{"type":"string"},"status":{"type":"string"},"payment_type":{"type":"string"},"created_at":{"type":"string","format":"date-time"},"account_id":{"type":"integer"},"meta":{"type":"object","properties":{"originatoraccountnumber":{"type":"string"},"originatorname":{"type":"string"},"bankname":{"type":"string"},"originatoramount":{"type":"string"}}},"amount_settled":{"type":"integer"},"customer":{"type":"object","properties":{"id":{"type":"integer"},"name":{"type":"string"},"phone_number":{"type":"string","format":"utc-millisec"},"email":{"type":"string","format":"email"},"created_at":{"type":"string","format":"date-time"}}}}}}},"example":{"status":"success","message":"Transaction fetched successfully","data":{"id":4975363,"tx_ref":"1710840858755-RND_83","flw_ref":"0537565244201710840859363","device_fingerprint":"N/A","amount":1000,"currency":"NGN","charged_amount":1000,"app_fee":14,"merchant_fee":0,"processor_response":"success","auth_model":"AUTH","ip":"::ffff:172.16.47.200","narration":"FLUTTERWAVE V3 DOCS","status":"successful","payment_type":"bank_transfer","created_at":"2024-03-19T09:34:27.000Z","account_id":118468,"meta":{"originatoraccountnumber":"123*******90","originatorname":"JOHN DOE","bankname":"Access Bank","originatoramount":"N/A"},"amount_settled":986,"customer":{"id":2374551,"name":"Anonymous customer","phone_number":"08012345678","email":"Johndoe@gmail.com","created_at":"2024-03-19T09:34:18.000Z"}}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 08:36:01 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"79"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"4f-z88FEzfY9wDvaRq/G2KxiQ\\""}},"description":"Verify a Transaction - error","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"No transaction was found for this id","data":null}}}}}}},"/v3/transactions/verify_by_reference":{"parameters":[],"get":{"summary":"Verify a transaction by Transaction reference","parameters":[{"name":"tx_ref","in":"query","required":false,"example":"1710840858755-RND_83","schema":{"type":"integer"}},{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Tue, 19 Mar 2024 09:56:18 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"793"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"319-Hoc8XfTC2WI0+4NTzUpJJQ\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Verify a transaction by Transaction reference - success","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"tx_ref":{"type":"string"},"flw_ref":{"type":"string","format":"utc-millisec"},"device_fingerprint":{"type":"string"},"amount":{"type":"integer"},"currency":{"type":"string"},"charged_amount":{"type":"integer"},"app_fee":{"type":"integer"},"merchant_fee":{"type":"integer"},"processor_response":{"type":"string"},"auth_model":{"type":"string"},"ip":{"type":"string","format":"ipv6"},"narration":{"type":"string"},"status":{"type":"string"},"payment_type":{"type":"string"},"created_at":{"type":"string","format":"date-time"},"account_id":{"type":"integer"},"meta":{"type":"object","properties":{"originatoraccountnumber":{"type":"string"},"originatorname":{"type":"string"},"bankname":{"type":"string"},"originatoramount":{"type":"string"}}},"amount_settled":{"type":"integer"},"customer":{"type":"object","properties":{"id":{"type":"integer"},"name":{"type":"string"},"phone_number":{"type":"string","format":"utc-millisec"},"email":{"type":"string","format":"email"},"created_at":{"type":"string","format":"date-time"}}}}}}},"example":{"status":"success","message":"Transaction fetched successfully","data":{"id":4975363,"tx_ref":"1710840858755-RND_83","flw_ref":"0537565244201710840859363","device_fingerprint":"N/A","amount":1000,"currency":"NGN","charged_amount":1000,"app_fee":14,"merchant_fee":0,"processor_response":"success","auth_model":"AUTH","ip":"::ffff:172.16.47.200","narration":"FLUTTERWAVE V3 DOCS","status":"successful","payment_type":"bank_transfer","created_at":"2024-03-19T09:34:27.000Z","account_id":118468,"meta":{"originatoraccountnumber":"123*******90","originatorname":"JOHN DOE","bankname":"Access Bank","originatoramount":"N/A"},"amount_settled":986,"customer":{"id":2374551,"name":"Anonymous customer","phone_number":"08012345678","email":"Johndoe@gmail.com","created_at":"2024-03-19T09:34:18.000Z"}}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 08:37:52 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"79"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"4f-z88FEzfY9wDvaRq/G2KxiQ\\""}},"description":"Verify a transaction by Transaction reference - error","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"No transaction was found for this id","data":null}}}}}}},"/v3/transactions/{id}/refund":{"parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"string"}}],"post":{"summary":"Create a Refund","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"322"},"ETag":{"schema":{"type":"string"},"example":"W/\\"142-UWUPFn2ohciECrPOQSLpbw\\""},"Date":{"schema":{"type":"string"},"example":"Fri, 24 Jan 2020 09:18:37 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Successful Partial Refund","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"account_id":{"type":"integer"},"tx_id":{"type":"integer"},"flw_ref":{"type":"string"},"wallet_id":{"type":"integer"},"amount_refunded":{"type":"integer"},"status":{"type":"string"},"destination":{"type":"string"},"meta":{"type":"object","properties":{"source":{"type":"string"}}},"created_at":{"type":"string","format":"date-time"}}}}},"example":{"status":"success","message":"Transaction refund initiated","data":{"id":8612,"account_id":73362,"tx_id":908790,"flw_ref":"URF_1577867664541_3572735","wallet_id":74639,"amount_refunded":5000,"status":"completed","destination":"payment_source","meta":{"source":"availablebalance"},"created_at":"2020-01-24T09:18:37.366Z"}}}}}}}},"/v3/transactions":{"parameters":[],"get":{"summary":"Get Multiple Transactions","parameters":[{"name":"from","in":"query","required":false,"schema":{"type":"string"}},{"name":"to","in":"query","required":false,"schema":{"type":"string"}},{"name":"tx_ref","in":"query","required":false,"schema":{"type":"string"}},{"name":"currency","in":"query","required":false,"schema":{"type":"string"}},{"name":"status","in":"query","required":false,"schema":{"type":"string"}},{"name":"page","in":"query","required":false,"schema":{"type":"string"}},{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"7404"},"ETag":{"schema":{"type":"string"},"example":"W/\\"1cec-MA8Vd+x0PyNy5yAHHaOXMg\\""},"Date":{"schema":{"type":"string"},"example":"Wed, 11 Mar 2020 19:42:03 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Successful Sample Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"meta":{"type":"object","properties":{"page_info":{"type":"object","properties":{"total":{"type":"integer"},"current_page":{"type":"integer"},"total_pages":{"type":"integer"}}}}},"data":{"type":"array","items":{"type":"object","properties":{"id":{"type":"integer"},"tx_ref":{"type":"string"},"flw_ref":{"type":"string"},"device_fingerprint":{"type":"string"},"amount":{"type":"integer"},"currency":{"type":"string"},"charged_amount":{"type":"integer"},"app_fee":{"type":"number"},"merchant_fee":{"type":"integer"},"processor_response":{"type":"string"},"auth_model":{"type":"string"},"ip":{"type":"string"},"narration":{"type":"string"},"status":{"type":"string"},"payment_type":{"type":"string"},"created_at":{"type":"string","format":"date-time"},"amount_settled":{"type":"number"},"card":{"type":"object","properties":{"type":{"type":"string"},"country":{"type":"string"},"issuer":{"type":"string"},"first_6digits":{"type":"string","format":"utc-millisec"},"last_4digits":{"type":"string","format":"utc-millisec"},"expiry":{"type":"string"}}},"customer":{"type":"object","properties":{"id":{"type":"integer"},"email":{"type":"string","format":"email"},"phone_number":{"type":"string"},"name":{"type":"string"},"created_at":{"type":"string","format":"date-time"}}},"account_id":{"type":"integer"}}}}}},"example":{"status":"success","message":"Transactions fetched","meta":{"page_info":{"total":158,"current_page":1,"total_pages":16}},"data":[{"id":1163077,"tx_ref":"akhlm-pstmn-23452","flw_ref":"FLW-M03K-781621ccfe976c03515bcd07a39f3db8","device_fingerprint":"N/A","amount":30300,"currency":"NGN","charged_amount":30300,"app_fee":11741.9,"merchant_fee":0,"processor_response":"Approved","auth_model":"noauth","ip":"pstmn","narration":"pstmn charge","status":"successful","payment_type":"card","created_at":"2020-03-11T19:33:20.000Z","amount_settled":18558.1,"card":{"type":"MASTERCARD","country":"NIGERIA NG","issuer":"MASTERCARD  CREDIT","first_6digits":"55318","last_4digits":"2950","expiry":"09/22"},"customer":{"id":252759,"email":"user@example.com","phone_number":"0813XXXXXXX","name":"Kendrick Graham","created_at":"2020-01-15T13:26:24.000Z"},"account_id":73362},{"id":1163068,"tx_ref":"akhlm-pstmn-blkchrge-xx6","flw_ref":"FLW-M03K-02c21a8095c7e064b8b9714db834080b","device_fingerprint":"N/A","amount":3000,"currency":"NGN","charged_amount":3000,"app_fee":1000,"merchant_fee":0,"processor_response":"Approved","auth_model":"noauth","ip":"pstmn","narration":"Kizito Akhilome","status":"successful","payment_type":"card","created_at":"2020-03-11T19:22:07.000Z","amount_settled":2000,"card":{"type":"MASTERCARD","country":"NIGERIA NG","issuer":"MASTERCARD  CREDIT","first_6digits":"55318","last_4digits":"2950","expiry":"09/22"},"customer":{"id":252759,"email":"user@example.com","phone_number":"0813XXXXXXX","name":"Kendrick Graham","created_at":"2020-01-15T13:26:24.000Z"},"account_id":73362},{"id":1163067,"tx_ref":"akhlm-pstmn-blkchrg-xx6","flw_ref":"FLW-M03K-9d02da3020c67ac05ade7b596881d59f","device_fingerprint":"N/A","amount":3500,"currency":"NGN","charged_amount":3500,"app_fee":1050,"merchant_fee":0,"processor_response":"Approved","auth_model":"noauth","ip":"pstmn","narration":"Kizito Akhilome","status":"successful","payment_type":"card","created_at":"2020-03-11T19:22:06.000Z","amount_settled":2450,"card":{"type":"MASTERCARD","country":"NIGERIA NG","issuer":"MASTERCARD  CREDIT","first_6digits":"55318","last_4digits":"2950","expiry":"09/22"},"customer":{"id":252759,"email":"user@example.com","phone_number":"0813XXXXXXX","name":"Kendrick Graham","created_at":"2020-01-15T13:26:24.000Z"},"account_id":73362},{"id":1163058,"tx_ref":"akhlm-pstmn-23312","flw_ref":"FLW-M03K-c3f4f15cc0e643caaf6d44297c95d25c","device_fingerprint":"N/A","amount":30000,"currency":"NGN","charged_amount":30000,"app_fee":11652.5,"merchant_fee":0,"processor_response":"Approved","auth_model":"noauth","ip":"pstmn","narration":"pstmn charge","status":"successful","payment_type":"card","created_at":"2020-03-11T19:03:56.000Z","amount_settled":18347.5,"card":{"type":"MASTERCARD","country":"NIGERIA NG","issuer":"MASTERCARD  CREDIT","first_6digits":"55318","last_4digits":"2950","expiry":"09/22"},"customer":{"id":252759,"email":"user@example.com","phone_number":"0813XXXXXXX","name":"Kendrick Graham","created_at":"2020-01-15T13:26:24.000Z"},"account_id":73362},{"id":1163057,"tx_ref":"akhlm-pstmn-2ew12","flw_ref":"FLW-M03K-2c1146ad3900b9259b519b36d1a8490d","device_fingerprint":"N/A","amount":3000,"currency":"NGN","charged_amount":3000,"app_fee":2756.5,"merchant_fee":0,"processor_response":"Approved","auth_model":"noauth","ip":"pstmn","narration":"pstmn charge","status":"successful","payment_type":"card","created_at":"2020-03-11T19:02:12.000Z","amount_settled":243.5,"card":{"type":"MASTERCARD","country":"NIGERIA NG","issuer":"MASTERCARD  CREDIT","first_6digits":"55318","last_4digits":"2950","expiry":"09/22"},"customer":{"id":252759,"email":"user@example.com","phone_number":"0813XXXXXXX","name":"Kendrick Graham","created_at":"2020-01-15T13:26:24.000Z"},"account_id":73362},{"id":1163052,"tx_ref":"akhlm-pstmn-221eew12","flw_ref":"FLW-M03K-aed39a8d098aa78cbf295b4e098afb9e","device_fingerprint":"N/A","amount":3000,"currency":"NGN","charged_amount":3000,"app_fee":2756.5,"merchant_fee":0,"processor_response":"Approved","auth_model":"noauth","ip":"pstmn","narration":"pstmn charge","status":"successful","payment_type":"card","created_at":"2020-03-11T18:58:43.000Z","amount_settled":243.5,"card":{"type":"MASTERCARD","country":"NIGERIA NG","issuer":"MASTERCARD  CREDIT","first_6digits":"55318","last_4digits":"2950","expiry":"09/22"},"customer":{"id":252759,"email":"user@example.com","phone_number":"0813XXXXXXX","name":"Kendrick Graham","created_at":"2020-01-15T13:26:24.000Z"},"account_id":73362},{"id":1163048,"tx_ref":"akhlm-pstmn-222393212","flw_ref":"FLW-M03K-c2c22fb57c0290d0135ebef82a721941","device_fingerprint":"N/A","amount":3000,"currency":"NGN","charged_amount":3000,"app_fee":2756.5,"merchant_fee":0,"processor_response":"Approved","auth_model":"noauth","ip":"pstmn","narration":"pstmn charge","status":"successful","payment_type":"card","created_at":"2020-03-11T18:57:21.000Z","amount_settled":243.5,"card":{"type":"MASTERCARD","country":"NIGERIA NG","issuer":"MASTERCARD  CREDIT","first_6digits":"55318","last_4digits":"2950","expiry":"09/22"},"customer":{"id":252759,"email":"user@example.com","phone_number":"0813XXXXXXX","name":"Kendrick Graham","created_at":"2020-01-15T13:26:24.000Z"},"account_id":73362},{"id":1163046,"tx_ref":"akhlm-pstmn-2223938342","flw_ref":"FLW-M03K-d58cb852feb2256ff8de82a9ff852635","device_fingerprint":"N/A","amount":3000,"currency":"NGN","charged_amount":3000,"app_fee":2756.5,"merchant_fee":0,"processor_response":"Approved","auth_model":"noauth","ip":"pstmn","narration":"pstmn charge","status":"successful","payment_type":"card","created_at":"2020-03-11T18:56:14.000Z","amount_settled":243.5,"card":{"type":"MASTERCARD","country":"NIGERIA NG","issuer":"MASTERCARD  CREDIT","first_6digits":"55318","last_4digits":"2950","expiry":"09/22"},"customer":{"id":252759,"email":"user@example.com","phone_number":"0813XXXXXXX","name":"Kendrick Graham","created_at":"2020-01-15T13:26:24.000Z"},"account_id":73362},{"id":1163038,"tx_ref":"akhlm-pstmn-222342342","flw_ref":"FLW-M03K-2a6fb0558c3a6b7c136c87f27023db15","device_fingerprint":"N/A","amount":3000,"currency":"NGN","charged_amount":3000,"app_fee":2756.5,"merchant_fee":0,"processor_response":"Approved","auth_model":"noauth","ip":"pstmn","narration":"pstmn charge","status":"successful","payment_type":"card","created_at":"2020-03-11T18:53:22.000Z","amount_settled":243.5,"card":{"type":"MASTERCARD","country":"NIGERIA NG","issuer":"MASTERCARD  CREDIT","first_6digits":"55318","last_4digits":"2950","expiry":"09/22"},"customer":{"id":252759,"email":"user@example.com","phone_number":"0813XXXXXXX","name":"Kendrick Graham","created_at":"2020-01-15T13:26:24.000Z"},"account_id":73362},{"id":1163027,"tx_ref":"akhlm-pstmn-222342342","flw_ref":"FLW-M03K-3c3c840708db61ddadef1491b63b6677","device_fingerprint":"N/A","amount":3000,"currency":"NGN","charged_amount":3000,"app_fee":2756.5,"merchant_fee":0,"processor_response":"Approved","auth_model":"noauth","ip":"pstmn","narration":"pstmn charge","status":"successful","payment_type":"card","created_at":"2020-03-11T18:43:36.000Z","amount_settled":243.5,"card":{"type":"MASTERCARD","country":"NIGERIA NG","issuer":"MASTERCARD  CREDIT","first_6digits":"55318","last_4digits":"2950","expiry":"09/22"},"customer":{"id":252759,"email":"user@example.com","phone_number":"0813XXXXXXX","name":"Kendrick Graham","created_at":"2020-01-15T13:26:24.000Z"},"account_id":73362}]}}}}}}},"/v3/refunds":{"parameters":[],"get":{"summary":"Get all refunds","parameters":[],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Tue, 19 Mar 2024 09:58:14 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"5895"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"1707-SXAbDUD4Vdv1c5A4+MuaFA\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Get all refunds","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"meta":{"type":"object","properties":{"page_info":{"type":"object","properties":{"total":{"type":"integer"},"current_page":{"type":"integer"},"total_pages":{"type":"integer"},"page_size":{"type":"integer"}}}}},"data":{"type":"array","items":{"type":"object","properties":{"id":{"type":"integer"},"amount_refunded":{"type":"integer"},"status":{"type":"string"},"flw_ref":{"type":"string"},"comment":{"nullable":true},"settlement_id":{"type":"string","format":"color"},"meta":{"type":"string","format":"style"},"created_at":{"type":"string","format":"date-time"},"account_id":{"type":"integer"},"transaction_id":{"type":"integer"}}}}}},"example":{"status":"success","message":"Refunds fetched","meta":{"page_info":{"total":43,"current_page":1,"total_pages":3,"page_size":20}},"data":[{"id":74896,"amount_refunded":65,"status":"pending-momo","flw_ref":"flwm3s4m0c1704848686939","comment":null,"settlement_id":"166255","meta":"{\\"source\\":\\"ledgerbalance\\",\\"disburse_ref\\":\\"CC-REFD-06950087816-flwm3s4m0c1704848686939\\",\\"disburse_status\\":\\"pending\\"}","created_at":"2024-01-10T06:44:47.000Z","account_id":118468,"transaction_id":4091194},{"id":73519,"amount_refunded":1,"status":"completed","flw_ref":"flwm3s4m0c1695302554064","comment":null,"settlement_id":"168094","meta":"{\\"source\\":\\"ledgerbalance\\",\\"uniquereference\\":\\"71167325151\\"}","created_at":"2023-09-21T13:35:25.000Z","account_id":118468,"transaction_id":3864163},{"id":38780,"amount_refunded":50,"status":"pending-momo","flw_ref":"8839095070","comment":null,"settlement_id":"139635","meta":"{\\"source\\":\\"ledgerbalance\\",\\"disburse_ref\\":\\"CC-REFD-46453110252-8839095070\\",\\"disburse_status\\":\\"pending\\",\\"linking_ref\\":\\"04501342812\\",\\"disburse_message\\":\\"Transaction is currently being processed\\",\\"retries\\":1}","created_at":"2021-05-05T08:08:30.000Z","account_id":118468,"transaction_id":1859723},{"id":33525,"amount_refunded":1.5,"status":"completed","flw_ref":"FLW-MOCK-75206649deb1b7af698f9a29cec240c8","comment":null,"settlement_id":"85715","meta":"{\\"source\\":\\"ledgerbalance\\",\\"uniquereference\\":\\"26398102614\\"}","created_at":"2020-12-18T07:55:02.000Z","account_id":118468,"transaction_id":1534034},{"id":30560,"amount_refunded":100.1,"status":"completed","flw_ref":"URF_1606308679202_1431535","comment":null,"settlement_id":"99889","meta":"{\\"source\\":\\"ledgerbalance\\"}","created_at":"2020-11-25T12:57:34.000Z","account_id":118468,"transaction_id":1535022},{"id":30554,"amount_refunded":108.88,"status":"completed","flw_ref":"URF_1606298854488_2884535","comment":null,"settlement_id":"99889","meta":"{\\"source\\":\\"ledgerbalance\\"}","created_at":"2020-11-25T10:52:31.000Z","account_id":118468,"transaction_id":1534630},{"id":27192,"amount_refunded":300,"status":"completed","flw_ref":"FLW-MOCK-4ac895b4019c8a54afc1c36cc980d9ea","comment":null,"settlement_id":"96835","meta":"{\\"source\\":\\"ledgerbalance\\"}","created_at":"2020-11-06T13:05:09.000Z","account_id":118468,"transaction_id":1491829},{"id":27191,"amount_refunded":550,"status":"completed","flw_ref":"FLW-MOCK-4ac895b4019c8a54afc1c36cc980d9ea","comment":null,"settlement_id":"96835","meta":"{\\"source\\":\\"ledgerbalance\\"}","created_at":"2020-11-06T12:58:27.000Z","account_id":118468,"transaction_id":1491829},{"id":22477,"amount_refunded":50.5,"status":"completed","flw_ref":"FLW-MOCK-8a5d114729346f35936b31fc2138f67a","comment":null,"settlement_id":"NEW","meta":"{\\"source\\":\\"ledgerbalance\\"}","created_at":"2020-09-18T09:48:31.000Z","account_id":118468,"transaction_id":1383224},{"id":22476,"amount_refunded":50.5,"status":"completed","flw_ref":"FLW-MOCK-e921120fea7e41a9c3a5e7b13c24bce0","comment":null,"settlement_id":"NEW","meta":"{\\"source\\":\\"ledgerbalance\\"}","created_at":"2020-09-18T09:45:58.000Z","account_id":118468,"transaction_id":1383243},{"id":22475,"amount_refunded":50.5,"status":"completed","flw_ref":"FLW-MOCK-df92e94fbfbeac900f4b2d1578cbe2cf","comment":null,"settlement_id":"NEW","meta":"{\\"source\\":\\"ledgerbalance\\"}","created_at":"2020-09-18T09:36:00.000Z","account_id":118468,"transaction_id":1383232},{"id":22196,"amount_refunded":15,"status":"completed","flw_ref":"FLW-MOCK-f0f41624da81fa16ef071adb4c3f08a2","comment":null,"settlement_id":"80500","meta":"{\\"source\\":\\"ledgerbalance\\"}","created_at":"2020-09-15T10:11:51.000Z","account_id":118468,"transaction_id":1376285},{"id":22125,"amount_refunded":10.41,"status":"completed","flw_ref":"FLW-MOCK-abca43511bc4fc590d4a644d10e4fe59","comment":null,"settlement_id":"80500","meta":"{\\"source\\":\\"ledgerbalance\\"}","created_at":"2020-09-14T10:30:33.000Z","account_id":118468,"transaction_id":1370066},{"id":22124,"amount_refunded":10.41,"status":"completed","flw_ref":"FLW-MOCK-15e3663270fd2845799fe5f2a952aff8","comment":null,"settlement_id":"80500","meta":"{\\"source\\":\\"ledgerbalance\\"}","created_at":"2020-09-14T10:30:00.000Z","account_id":118468,"transaction_id":1373663},{"id":22120,"amount_refunded":15,"status":"completed","flw_ref":"FLW-MOCK-8c3983d8329652a04fb7ad631c21d46e","comment":null,"settlement_id":"80500","meta":"{\\"source\\":\\"ledgerbalance\\"}","created_at":"2020-09-12T06:58:31.000Z","account_id":118468,"transaction_id":1370207},{"id":22119,"amount_refunded":5.4,"status":"completed","flw_ref":"FLW-MOCK-502848fb78cd6a62982c21d180455fd3","comment":null,"settlement_id":"80500","meta":"{\\"source\\":\\"ledgerbalance\\"}","created_at":"2020-09-12T06:58:10.000Z","account_id":118468,"transaction_id":1370205},{"id":22118,"amount_refunded":10.51,"status":"completed","flw_ref":"FLW-MOCK-0f80dc40666acd5ecb3fd5f988b4d799","comment":null,"settlement_id":"80500","meta":"{\\"source\\":\\"ledgerbalance\\"}","created_at":"2020-09-12T06:57:16.000Z","account_id":118468,"transaction_id":1370173},{"id":22112,"amount_refunded":1000,"status":"completed","flw_ref":"FLW-MOCK-74a00017664618fac3e57a3facedff17","comment":null,"settlement_id":"81755","meta":"{\\"source\\":\\"ledgerbalance\\"}","created_at":"2020-09-11T11:02:04.000Z","account_id":118468,"transaction_id":1348523},{"id":22111,"amount_refunded":10,"status":"completed","flw_ref":"FLW-MOCK-28129ccecd00759404cf6e8c595865c6","comment":null,"settlement_id":"81755","meta":"{\\"source\\":\\"ledgerbalance\\"}","created_at":"2020-09-11T10:57:37.000Z","account_id":118468,"transaction_id":1348538},{"id":22110,"amount_refunded":10,"status":"completed","flw_ref":"FLW-MOCK-d8022fa28761ba2d6194ec2af9071483","comment":null,"settlement_id":"81755","meta":"{\\"source\\":\\"ledgerbalance\\"}","created_at":"2020-09-11T10:57:30.000Z","account_id":118468,"transaction_id":1359774}]}}}}}}},"/v3/transactions/fee":{"parameters":[],"get":{"summary":"Get Transactions Fees (Collections)","parameters":[{"name":"amount","in":"query","required":false,"example":"100","schema":{"type":"integer"}},{"name":"currency","in":"query","required":false,"example":"NGN","schema":{"type":"string"}},{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Tue, 19 Mar 2024 09:58:53 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"158"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"9e-94H+8Jg1qY9E0E1UNZBRFg\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Get Transactions Fees (Collections) - success","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"charge_amount":{"type":"integer"},"fee":{"type":"number"},"merchant_fee":{"type":"integer"},"flutterwave_fee":{"type":"number"},"stamp_duty_fee":{"type":"integer"},"currency":{"type":"string"}}}}},"example":{"status":"success","message":"Charged fee","data":{"charge_amount":100,"fee":1.4,"merchant_fee":0,"flutterwave_fee":1.4,"stamp_duty_fee":0,"currency":"NGN"}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 08:40:16 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"68"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"44-LL4yQihsKm2NQKn4LXx7uw\\""}},"description":"Get Transactions Fees (Collections) - error","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Invalid currency provided","data":null}}}}}}},"/v3/transactions/{id}/resend-hook":{"parameters":[{"name":"id","in":"path","required":true,"example":"4975363","schema":{"type":"integer"}}],"post":{"summary":"Resend Failed WebHooks","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"74"},"ETag":{"schema":{"type":"string"},"example":"W/\\"4a-dVYHjq6ngm+ZxFDLvoLJOg\\""},"Date":{"schema":{"type":"string"},"example":"Thu, 16 Jan 2020 10:06:11 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Successful Request","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"string"}}},"example":{"status":"success","message":"hook sent successfully","data":"hook sent"}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Tue, 19 Mar 2024 10:01:18 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"61"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"3d-Klpubq9srZt9N+IIpcEixA\\""}},"description":"Error response Resend Failed WebHooks","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"no hook data found","data":null}}}}}}},"/v3/transactions/{id}/events":{"parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"string"}}],"get":{"summary":"View Transaction Timeline","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"3552"},"ETag":{"schema":{"type":"string"},"example":"W/\\"de0-jarwRDOIE2HdSWJ8EbEJxg\\""},"Date":{"schema":{"type":"string"},"example":"Thu, 16 Jan 2020 16:17:26 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Successful Event Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"array","items":{"type":"object","properties":{"note":{"type":"string","format":"style"},"actor":{"type":"string","format":"email"},"object":{"type":"string"},"action":{"type":"string"},"context":{"type":"string"},"created_at":{"type":"string","format":"date-time"}}}}}},"example":{"status":"success","message":"Transaction events fetched","data":[{"note":"Loaded modal https://raveappv2.herokuapp.com/pay/akhlm","actor":"h0vkard@flw.ext","object":"modal","action":"loaded","context":"web","created_at":"2019-12-13T22:09:57.997Z"},{"note":"Switched to Pay with Bank Option","actor":"h0vkard@flw.ext","object":"modal","action":"switched","context":"web","created_at":"2019-12-13T22:09:58.001Z"},{"note":"Pay button clicked","actor":"h0vkard@flw.ext","object":"MODAL","action":"click","context":"web","created_at":"2019-12-13T22:09:56.903Z"},{"note":"IP Resolved 197.210.29.248","actor":"h0vkard@flw.ext","object":"IP","action":"request","context":"web","created_at":"2019-12-13T22:09:59.595Z"},{"note":"Switched to Pay with Card Option","actor":"h0vkard@flw.ext","object":"modal","action":"switched","context":"web","created_at":"2019-12-13T22:10:00.314Z"},{"note":"Entering Card Number","actor":"h0vkard@flw.ext","object":"Card Number","action":"typing","context":"web","created_at":"2019-12-13T22:10:03.505Z"},{"note":"Stopped entering Card Number","actor":"h0vkard@flw.ext","object":"Card Number","action":"typing","context":"web","created_at":"2019-12-13T22:10:04.522Z"},{"note":"Entering Expiry","actor":"h0vkard@flw.ext","object":"Expiry","action":"typing","context":"web","created_at":"2019-12-13T22:10:04.523Z"},{"note":"Entering CVV","actor":"h0vkard@flw.ext","object":"CVV","action":"typing","context":"web","created_at":"2019-12-13T22:10:06.595Z"},{"note":"Stopped entering Expiry","actor":"h0vkard@flw.ext","object":"Expiry","action":"typing","context":"web","created_at":"2019-12-13T22:10:06.593Z"},{"note":"Stopped entering CVV","actor":"h0vkard@flw.ext","object":"CVV","action":"typing","context":"web","created_at":"2019-12-13T22:10:12.412Z"},{"note":"Attempting card charge request","actor":"h0vkard@flw.ext","object":"CREDIT_CARD","action":"charge","context":"web","created_at":"2019-12-13T22:10:12.530Z"},{"note":"Submitted Payment Details","actor":"h0vkard@flw.ext","object":"payment details:credit_card","action":"submitted","context":"web","created_at":"2019-12-13T22:10:12.529Z"},{"note":"card charge request successful: request for PIN","actor":"h0vkard@flw.ext","object":"CREDIT_CARD","action":"charge","context":"web","created_at":"2019-12-13T22:10:14.097Z"},{"note":"Attempting card charge request","actor":"h0vkard@flw.ext","object":"CREDIT_CARD","action":"charge","context":"web","created_at":"2019-12-13T22:10:19.209Z"},{"note":"Card charge taking too long. Polling for response","actor":"h0vkard@flw.ext","object":"LONG_REQUEST","action":"charge","context":"web","created_at":"2019-12-13T22:10:23.880Z"},{"note":"card charge request successful: request for OTP","actor":"h0vkard@flw.ext","object":"CREDIT_CARD","action":"charge","context":"web","created_at":"2019-12-13T22:10:25.263Z"},{"note":"Attempting to validate card charge","actor":"h0vkard@flw.ext","object":"CARD_CHARGE","action":"validate","context":"web","created_at":"2019-12-13T22:10:31.630Z"},{"note":"Validate card charge request complete","actor":"h0vkard@flw.ext","object":"CARD_CHARGE","action":"validate","context":"web","created_at":"2019-12-13T22:10:33.146Z"},{"note":"Transaction Completed!","actor":"h0vkard@flw.ext","object":"TRANSACTION","action":"completion","context":"web","created_at":"2019-12-13T22:10:33.151Z"},{"note":"Validate card charge successful","actor":"h0vkard@flw.ext","object":"CARD_CHARGE","action":"validate","context":"web","created_at":"2019-12-13T22:10:33.147Z"}]}}}}}}},"/v3/transfers":{"parameters":[],"post":{"summary":"Initiate a Transfer","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Mon, 18 Mar 2024 08:58:40 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"470"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"1d6-YACt9CWy88jQ//m9DSBQZQ\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Successful NGN Transfer Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"account_number":{"type":"string","format":"utc-millisec"},"bank_code":{"type":"string","format":"color"},"full_name":{"type":"string"},"created_at":{"type":"string","format":"date-time"},"currency":{"type":"string"},"debit_currency":{"type":"string"},"amount":{"type":"integer"},"fee":{"type":"number"},"status":{"type":"string"},"reference":{"type":"string"},"meta":{"nullable":true},"narration":{"type":"string"},"complete_message":{"type":"string"},"requires_approval":{"type":"integer"},"is_approved":{"type":"integer"},"bank_name":{"type":"string"}}}}},"example":{"status":"success","message":"Transfer Queued Successfully","data":{"id":621922,"account_number":"0690000040","bank_code":"044","full_name":"Alexis Sanchez","created_at":"2024-03-18T08:58:30.000Z","currency":"NGN","debit_currency":"NGN","amount":500,"fee":10.75,"status":"NEW","reference":"akhlm-pstmnpyt-rfxx078_PMCKDU_1","meta":null,"narration":"Akhlm Pstmn Trnsfr xx007","complete_message":"","requires_approval":0,"is_approved":1,"bank_name":"ACCESS BANK NIGERIA"}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Mon, 18 Mar 2024 09:02:27 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"462"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"1ce-cXql9dJQjHa3cKypWFlmMA\\""}},"description":"Account Resolve Error","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"account_number":{"type":"string","format":"utc-millisec"},"bank_code":{"type":"string","format":"color"},"full_name":{"type":"string"},"created_at":{"type":"string","format":"date-time"},"currency":{"type":"string"},"debit_currency":{"type":"string"},"amount":{"type":"integer"},"fee":{"type":"number"},"status":{"type":"string"},"reference":{"type":"string"},"meta":{"nullable":true},"narration":{"type":"string"},"complete_message":{"type":"string"},"requires_approval":{"type":"integer"},"is_approved":{"type":"integer"},"bank_name":{"type":"string"}}}}},"example":{"status":"error","message":"Transfer creation failed","data":{"id":621925,"account_number":"0690000099","bank_code":"044","full_name":"N/A","created_at":"2024-03-18T09:02:14.000Z","currency":"NGN","debit_currency":"NGN","amount":500,"fee":10.75,"status":"FAILED","reference":"akhlm-pstmnpyt-rfxx678_PMCKDU_1","meta":null,"narration":"Akhlm Pstmn Trnsfr xx007","complete_message":"Account resolve failed","requires_approval":0,"is_approved":1,"bank_name":"N/A"}}}}}}},"get":{"summary":"Fetch a Bulk Transfer","parameters":[{"name":"batch_id","in":"query","required":false,"schema":{"type":"string"}}],"responses":{"200":{"description":"Successful response"}}}},"/v3/transfers/{id}/retries":{"parameters":[{"name":"id","in":"path","required":true,"example":"621926","schema":{"type":"integer"}}],"post":{"summary":"Retry a transfer","parameters":[],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Mon, 18 Mar 2024 09:38:20 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"485"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"1e5-6EjQ7e2axmoNYYYWK34wDA\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"account_number":{"type":"string","format":"utc-millisec"},"bank_code":{"type":"string","format":"color"},"full_name":{"type":"string"},"created_at":{"type":"string","format":"date-time"},"currency":{"type":"string"},"debit_currency":{"type":"string"},"amount":{"type":"integer"},"fee":{"type":"number"},"status":{"type":"string"},"reference":{"type":"string"},"meta":{"nullable":true},"narration":{"type":"string"},"complete_message":{"type":"string"},"requires_approval":{"type":"integer"},"is_approved":{"type":"integer"},"bank_name":{"type":"string"}}}}},"example":{"status":"success","message":"Transfer retry attempt queued.","data":{"id":621930,"account_number":"0690000040","bank_code":"044","full_name":"Alexis Sanchez","created_at":"2024-03-18T09:38:09.000Z","currency":"NGN","debit_currency":"NGN","amount":500,"fee":10.75,"status":"NEW","reference":"akhlm-pstmnpyt-rfxx078_PMCK_ST_FDU_1_RETRY_1","meta":null,"narration":"Akhlm Pstmn Trnsfr xx007","complete_message":"","requires_approval":0,"is_approved":1,"bank_name":"ACCESS BANK NIGERIA"}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 08:45:56 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"99"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"63-vE7zgLkhMIMRKY/MxEjd/w\\""}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"A failed transfer with the provided reference not found.","data":null}}}}}},"get":{"summary":"Fetch a Transfer Retry","parameters":[],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Mon, 18 Mar 2024 09:12:14 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"476"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"1dc-SXzPUxfFvgFbYL9keI303g\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Fetch a Transfer Retry","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"array","items":{"type":"object","properties":{"id":{"type":"integer"},"account_number":{"type":"string","format":"utc-millisec"},"bank_code":{"type":"string","format":"color"},"bank_name":{"type":"string"},"full_name":{"type":"string"},"currency":{"type":"string"},"debit_currency":{"type":"string"},"amount":{"type":"integer"},"fee":{"type":"number"},"status":{"type":"string"},"reference":{"type":"string"},"narration":{"type":"string"},"complete_message":{"type":"string"},"meta":{"nullable":true},"requires_approval":{"type":"integer"},"is_approved":{"type":"integer"},"created_at":{"type":"string","format":"date-time"}}}}}},"example":{"status":"success","message":"Transfer retry attempts retrieved.","data":[{"id":621925,"account_number":"0690000099","bank_code":"044","bank_name":"N/A","full_name":"N/A","currency":"NGN","debit_currency":"NGN","amount":500,"fee":10.75,"status":"FAILED","reference":"akhlm-pstmnpyt-rfxx678_PMCKDU_1","narration":"Akhlm Pstmn Trnsfr xx007","complete_message":"Account resolve failed","meta":null,"requires_approval":0,"is_approved":1,"created_at":"2024-03-18T09:02:14.000Z"}]}}}}}}},"/v3/bulk-transfers/":{"parameters":[],"post":{"summary":"Create a Bulk Transfer","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"129"},"ETag":{"schema":{"type":"string"},"example":"W/\\"81-kxmwd/DJbMKwIItuy46SBQ\\""},"Date":{"schema":{"type":"string"},"example":"Mon, 20 Jan 2020 16:36:29 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"created_at":{"type":"string","format":"date-time"},"approver":{"type":"string"}}}}},"example":{"status":"success","message":"Bulk transfer queued","data":{"id":2013,"created_at":"2020-01-20T16:36:29.000Z","approver":"N/A"}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 08:47:31 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"77"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"4d-tThKznfUf9c2Ubuhs6mepA\\""}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"bulk_data[1].bank_code is required","data":null}}}}}}},"/v3/transfers/fee":{"parameters":[],"get":{"summary":"Get Transfer Fee","parameters":[{"name":"currency","in":"query","required":false,"example":"NGN","schema":{"type":"string"}},{"name":"amount","in":"query","required":false,"example":"10000","schema":{"type":"integer"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"113"},"ETag":{"schema":{"type":"string"},"example":"W/\\"71-tyLYPwDoPsMiesM8i4zGDA\\""},"Date":{"schema":{"type":"string"},"example":"Wed, 11 Mar 2020 20:13:17 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"array","items":{"type":"object","properties":{"fee_type":{"type":"string"},"currency":{"type":"string"},"fee":{"type":"number"}}}}}},"example":{"status":"success","message":"Transfer fee fetched","data":[{"fee_type":"value","currency":"NGN","fee":26.875}]}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 08:48:24 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"63"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"3f-+988wM+kE4kJMyyI+pJuuA\\""}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"currency is required","data":null}}}}}}},"/v3/transfers/{id}":{"parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"string"}}],"get":{"summary":"Fetch a Transfer","parameters":[],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Mon, 18 Mar 2024 09:08:10 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"491"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"1eb-Tzj4oewV/0T6/a3DnL4FsQ\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"account_number":{"type":"string","format":"utc-millisec"},"bank_code":{"type":"string","format":"color"},"full_name":{"type":"string"},"created_at":{"type":"string","format":"date-time"},"currency":{"type":"string"},"debit_currency":{"type":"string"},"amount":{"type":"integer"},"fee":{"type":"number"},"status":{"type":"string"},"reference":{"type":"string"},"meta":{"nullable":true},"narration":{"type":"string"},"approver":{"nullable":true},"complete_message":{"type":"string"},"requires_approval":{"type":"integer"},"is_approved":{"type":"integer"},"bank_name":{"type":"string"}}}}},"example":{"status":"success","message":"Transfer fetched","data":{"id":621922,"account_number":"0690000040","bank_code":"044","full_name":"Alexis Sanchez","created_at":"2024-03-18T08:58:30.000Z","currency":"NGN","debit_currency":"NGN","amount":500,"fee":10.75,"status":"SUCCESSFUL","reference":"akhlm-pstmnpyt-rfxx078_PMCKDU_1","meta":null,"narration":"Akhlm Pstmn Trnsfr xx007","approver":null,"complete_message":"Successful","requires_approval":0,"is_approved":1,"bank_name":"ACCESS BANK NIGERIA"}}}}},"404":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 08:49:21 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"61"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"3d-x1nz9IqmnLU1noW8IhTMqw\\""}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Transfer not found","data":null}}}}},"requestBody":{"content":{"application/json":{"schema":{"type":"object"},"example":{}}}}}},"/v3/transfers/rates":{"parameters":[],"get":{"summary":"Get Transfer Rates","parameters":[{"name":"amount","in":"query","required":false,"example":"5000","schema":{"type":"integer"}},{"name":"destination_currency","in":"query","required":false,"example":"USD","schema":{"type":"string"}},{"name":"source_currency","in":"query","required":false,"example":"NGN","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Mon, 18 Mar 2024 09:14:39 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"172"},"Connection":{"schema":{"type":"string"},"example":"close"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"ac-E2q5tZZSRXpXIVY6v6rVbw\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Get Transfer Rates","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"rate":{"type":"number"},"source":{"type":"object","properties":{"currency":{"type":"string"},"amount":{"type":"integer"}}},"destination":{"type":"object","properties":{"currency":{"type":"string"},"amount":{"type":"integer"}}}}}}},"example":{"status":"success","message":"Transfer amount fetched","data":{"rate":1219.32,"source":{"currency":"NGN","amount":6096600},"destination":{"currency":"USD","amount":5000}}}}}}},"requestBody":{"content":{"application/json":{"schema":{"type":"object","properties":{"amount":{"type":"string","format":"utc-millisec"},"destination_currency":{"type":"string"},"source_currency":{"type":"string"}}},"example":{"amount":"10000","destination_currency":"USD","source_currency":"NGN"}}}}}},"/v3/beneficiaries":{"parameters":[],"post":{"summary":"Create a Transfer Beneficiary","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"216"},"ETag":{"schema":{"type":"string"},"example":"W/\\"d8-90e6oqWy4ho3Z36jKfVC2w\\""},"Date":{"schema":{"type":"string"},"example":"Thu, 16 Jan 2020 18:01:28 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"account_number":{"type":"string","format":"utc-millisec"},"bank_code":{"type":"string","format":"color"},"full_name":{"type":"string"},"created_at":{"type":"string","format":"date-time"},"bank_name":{"type":"string"}}}}},"example":{"status":"success","message":"Beneficiary created","data":{"id":3644,"account_number":"0690000034","bank_code":"044","full_name":"Ade Bond","created_at":"2020-01-16T18:01:28.000Z","bank_name":"ACCESS BANK NIGERIA"}}}}},"400":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"65"},"ETag":{"schema":{"type":"string"},"example":"W/\\"41-V2g624K95d3+94ivgoafBw\\""},"Date":{"schema":{"type":"string"},"example":"Thu, 16 Jan 2020 18:03:25 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Account resolve failed","data":null}}}}}},"get":{"summary":"List all Transfer Beneficiaries","parameters":[],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"1683"},"ETag":{"schema":{"type":"string"},"example":"W/\\"693-NQglBWQ1Wp6/LyQJ8wF2VQ\\""},"Date":{"schema":{"type":"string"},"example":"Thu, 23 Jan 2020 17:18:28 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"meta":{"type":"object","properties":{"page_info":{"type":"object","properties":{"total":{"type":"integer"},"current_page":{"type":"integer"},"total_pages":{"type":"integer"}}}}},"data":{"type":"array","items":{"type":"object","properties":{"id":{"type":"integer"},"account_number":{"type":"string","format":"utc-millisec"},"bank_code":{"type":"string","format":"color"},"full_name":{"type":"string"},"meta":{"nullable":true},"created_at":{"type":"string","format":"date-time"},"bank_name":{"type":"string"}}}}}},"example":{"status":"success","message":"Payout beneficiaries fetched","meta":{"page_info":{"total":9,"current_page":1,"total_pages":1}},"data":[{"id":3768,"account_number":"0690000040","bank_code":"044","full_name":"Alexis Sanchez","meta":null,"created_at":"2020-01-20T16:09:24.000Z","bank_name":"ACCESS BANK NIGERIA"},{"id":3690,"account_number":"0690000039","bank_code":"044","full_name":"Dotun Ajib","meta":null,"created_at":"2020-01-19T22:36:06.000Z","bank_name":"ACCESS BANK NIGERIA"},{"id":3644,"account_number":"0690000034","bank_code":"044","full_name":"Ade Bond","meta":null,"created_at":"2020-01-16T18:01:28.000Z","bank_name":"ACCESS BANK NIGERIA"},{"id":3608,"account_number":"0690000044","bank_code":"044","full_name":"Mercedes Daniel","meta":null,"created_at":"2020-01-15T11:58:02.000Z","bank_name":"ACCESS BANK NIGERIA"},{"id":3565,"account_number":"0690000038","bank_code":"044","full_name":"John Sunday","meta":null,"created_at":"2020-01-14T05:53:34.000Z","bank_name":"ACCESS BANK NIGERIA"},{"id":3104,"account_number":"2540782773934","bank_code":"000","full_name":"Kwame Adew","meta":null,"created_at":"2019-12-05T23:49:31.000Z","bank_name":"FA-BANK"},{"id":3093,"account_number":"0690000041","bank_code":"044","full_name":"Alexis Rogers","meta":null,"created_at":"2019-12-05T21:29:57.000Z","bank_name":"ACCESS BANK NIGERIA"},{"id":2923,"account_number":"0690000032","bank_code":"044","full_name":"Pastor Bright","meta":null,"created_at":"2019-11-28T08:15:29.000Z","bank_name":"ACCESS BANK NIGERIA"},{"id":2857,"account_number":"0690000031","bank_code":"044","full_name":"Forrest Green","meta":null,"created_at":"2019-11-20T10:33:20.000Z","bank_name":"ACCESS BANK NIGERIA"}]}}}}}}},"/v3/beneficiaries/{id}":{"parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"string"}}],"get":{"summary":"Fetch a Transfer Beneficiary","parameters":[],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"240"},"ETag":{"schema":{"type":"string"},"example":"W/\\"f0-R/UX/XUQWRiK8uhlXlyu3g\\""},"Date":{"schema":{"type":"string"},"example":"Thu, 16 Jan 2020 17:52:18 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"account_number":{"type":"string","format":"utc-millisec"},"bank_code":{"type":"string","format":"color"},"full_name":{"type":"string"},"meta":{"nullable":true},"created_at":{"type":"string","format":"date-time"},"bank_name":{"type":"string"}}}}},"example":{"status":"success","message":"Payout beneficiary fetched","data":{"id":2923,"account_number":"0690000032","bank_code":"044","full_name":"Pastor Bright","meta":null,"created_at":"2019-11-28T08:15:29.000Z","bank_name":"ACCESS BANK NIGERIA"}}}}}}},"delete":{"summary":"Delete a Transfer Beneficiary","parameters":[],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"69"},"ETag":{"schema":{"type":"string"},"example":"W/\\"45-C1CTt2MqdyzHcjvPcWMsXA\\""},"Date":{"schema":{"type":"string"},"example":"Thu, 16 Jan 2020 17:57:12 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"string"}}},"example":{"status":"success","message":"Beneficiary deleted","data":"Deleted"}}}},"400":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"64"},"ETag":{"schema":{"type":"string"},"example":"W/\\"40-AxukB+EjzA4UlDfnjE47Hw\\""},"Date":{"schema":{"type":"string"},"example":"Thu, 30 Jan 2020 08:57:33 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Beneficiary not found","data":null}}}}}}},"/v3/virtual-cards":{"parameters":[],"post":{"summary":"Create a Virtual Card","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"599"},"ETag":{"schema":{"type":"string"},"example":"W/\\"257-0kIut2kuFchnwsb7t3pzYg\\""},"Date":{"schema":{"type":"string"},"example":"Fri, 17 Jan 2020 18:33:27 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"string"},"account_id":{"type":"integer"},"amount":{"type":"string"},"currency":{"type":"string"},"card_hash":{"type":"string"},"card_pan":{"type":"string","format":"utc-millisec"},"masked_pan":{"type":"string"},"city":{"type":"string"},"state":{"type":"string"},"address_1":{"type":"string"},"address_2":{"nullable":true},"zip_code":{"type":"string","format":"utc-millisec"},"cvv":{"type":"string","format":"color"},"expiration":{"type":"string"},"send_to":{"nullable":true},"bin_check_name":{"nullable":true},"card_type":{"type":"string"},"name_on_card":{"type":"string"},"created_at":{"type":"string","format":"date-time"},"is_active":{"type":"boolean"},"callback_url":{"nullable":true}}}}},"example":{"status":"success","message":"Card created successfully","data":{"id":"43ec6e92-9eb7-48ad-91c8-7bee425a33cf","account_id":65637,"amount":"20,000.00","currency":"NGN","card_hash":"43ec6e92-9eb7-48ad-91c8-7bee425a33cf","card_pan":"5366130699778900","masked_pan":"536613*******8900","city":"Lekki","state":"Lagos","address_1":"19, Olubunmi Rotimi","address_2":null,"zip_code":"23401","cvv":"134","expiration":"2023-01","send_to":null,"bin_check_name":null,"card_type":"mastercard","name_on_card":"Jermaine Graham","created_at":"2020-01-17T18:33:29.0130255+00:00","is_active":true,"callback_url":null}}}}}}},"get":{"summary":"Get all Virtual Cards","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"3781"},"ETag":{"schema":{"type":"string"},"example":"W/\\"ec5-EyJ3Y2KoNj5gdNjN5hX4ww\\""},"Date":{"schema":{"type":"string"},"example":"Fri, 17 Jan 2020 18:46:11 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Successful Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"account_id":{"type":"integer"},"amount":{"type":"string"},"currency":{"type":"string"},"card_hash":{"type":"string"},"card_pan":{"type":"string","format":"utc-millisec"},"masked_pan":{"type":"string"},"city":{"type":"string"},"state":{"type":"string"},"address_1":{"type":"string"},"address_2":{"nullable":true},"zip_code":{"type":"string","format":"utc-millisec"},"cvv":{"type":"string","format":"color"},"expiration":{"type":"string"},"send_to":{"nullable":true},"bin_check_name":{"nullable":true},"card_type":{"type":"string"},"name_on_card":{"type":"string"},"created_at":{"type":"string","format":"date-time"},"is_active":{"type":"boolean"},"callback_url":{"type":"string","format":"uri"}}}}}},"example":{"status":"success","message":"Cards fetched successfully","data":[{"id":"43ec6e92-9eb7-48ad-91c8-7bee425a33cf","account_id":65637,"amount":"20,000.00","currency":"NGN","card_hash":"43ec6e92-9eb7-48ad-91c8-7bee425a33cf","card_pan":"5366130699778900","masked_pan":"536613*******8900","city":"Lekki","state":"Lagos","address_1":"19, Olubunmi Rotimi","address_2":null,"zip_code":"23401","cvv":"134","expiration":"2023-01","send_to":null,"bin_check_name":null,"card_type":"mastercard","name_on_card":"Jermaine Graham","created_at":"2020-01-17T18:33:29.013Z","is_active":true,"callback_url":"https://your-callback-url.com/"},{"id":"7dc7b98c-7f6d-48f3-9b31-859a145c8085","account_id":65637,"amount":"20,000.00","currency":"NGN","card_hash":"7dc7b98c-7f6d-48f3-9b31-859a145c8085","card_pan":"5366130719043293","masked_pan":"536613*******3293","city":"Lekki","state":"Lagos","address_1":"19, Olubunmi Rotimi","address_2":null,"zip_code":"23401","cvv":"267","expiration":"2023-01","send_to":null,"bin_check_name":null,"card_type":"mastercard","name_on_card":"Jermaine Graham","created_at":"2020-01-17T18:31:48.97Z","is_active":true,"callback_url":"https://your-callback-url.com/"},{"id":"acdbb983-09e2-463f-970a-409833dd40c3","account_id":65637,"amount":"45,000.00","currency":"NGN","card_hash":"acdbb983-09e2-463f-970a-409833dd40c3","card_pan":"5366138839204877","masked_pan":"536613*******4877","city":"Lekki","state":"Lagos","address_1":"19, Olubunmi Rotimi","address_2":null,"zip_code":"23401","cvv":"266","expiration":"2023-01","send_to":null,"bin_check_name":null,"card_type":"mastercard","name_on_card":"Aubrey Lamar","created_at":"2020-01-17T18:29:22.583Z","is_active":true,"callback_url":null},{"id":"9891e1ad-a24c-4e9b-a844-9ee990823312","account_id":65637,"amount":"50,000.00","currency":"NGN","card_hash":"9891e1ad-a24c-4e9b-a844-9ee990823312","card_pan":"5366130206773766","masked_pan":"536613*******3766","city":"Lekki","state":"Lagos","address_1":"19, Olubunmi Rotimi","address_2":null,"zip_code":"23401","cvv":"391","expiration":"2023-01","send_to":null,"bin_check_name":null,"card_type":"mastercard","name_on_card":"Aubrey Marshall","created_at":"2020-01-17T18:21:56.483Z","is_active":true,"callback_url":null},{"id":"cfe5e068-3fbc-4a5b-a843-9393fe8592de","account_id":65637,"amount":"50,000.00","currency":"NGN","card_hash":"cfe5e068-3fbc-4a5b-a843-9393fe8592de","card_pan":"5366133796787097","masked_pan":"536613*******7097","city":"Lekki","state":"Lagos","address_1":"19, Olubunmi Rotimi","address_2":null,"zip_code":"23401","cvv":"464","expiration":"2023-01","send_to":null,"bin_check_name":null,"card_type":"mastercard","name_on_card":"selma","created_at":"2020-01-14T05:24:48.747Z","is_active":true,"callback_url":null},{"id":"4edc6b82-5d3f-433f-848a-e980a72e63b0","account_id":65637,"amount":"45,000.00","currency":"NGN","card_hash":"4edc6b82-5d3f-433f-848a-e980a72e63b0","card_pan":"5366132470988252","masked_pan":"536613*******8252","city":"Lekki","state":"Lagos","address_1":"19, Olubunmi Rotimi","address_2":null,"zip_code":"23401","cvv":"967","expiration":"2023-01","send_to":null,"bin_check_name":null,"card_type":"mastercard","name_on_card":"Jessica selma","created_at":"2020-01-14T05:24:18.373Z","is_active":true,"callback_url":null},{"id":"38c9201a-fcb2-48fd-875e-6494ed79a6bb","account_id":65637,"amount":"895,000.00","currency":"NGN","card_hash":"38c9201a-fcb2-48fd-875e-6494ed79a6bb","card_pan":"5366132231776517","masked_pan":"536613*******6517","city":"Lekki","state":"Lagos","address_1":"19, Olubunmi Rotimi","address_2":null,"zip_code":"23401","cvv":"949","expiration":"2023-01","send_to":null,"bin_check_name":null,"card_type":"mastercard","name_on_card":"selma FLW","created_at":"2020-01-12T17:46:21.967Z","is_active":true,"callback_url":null}]}}}}}}},"/v3/virtual-cards/{id}":{"parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"string"}}],"get":{"summary":"Get a Virtual Card","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"617"},"ETag":{"schema":{"type":"string"},"example":"W/\\"269-eJkQFY9TgXgInc1FUPmDmA\\""},"Date":{"schema":{"type":"string"},"example":"Fri, 17 Jan 2020 18:52:17 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Successful Sample Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"string"},"account_id":{"type":"integer"},"amount":{"type":"string"},"currency":{"type":"string"},"card_hash":{"type":"string"},"card_pan":{"type":"string","format":"utc-millisec"},"masked_pan":{"type":"string"},"city":{"type":"string"},"state":{"type":"string"},"address_1":{"type":"string"},"address_2":{"nullable":true},"zip_code":{"type":"string","format":"utc-millisec"},"cvv":{"type":"string","format":"color"},"expiration":{"type":"string"},"send_to":{"nullable":true},"bin_check_name":{"nullable":true},"card_type":{"type":"string"},"name_on_card":{"type":"string"},"created_at":{"type":"string","format":"date-time"},"is_active":{"type":"boolean"},"callback_url":{"type":"string","format":"uri"}}}}},"example":{"status":"success","message":"Card fetched successfully","data":{"id":"7dc7b98c-7f6d-48f3-9b31-859a145c8085","account_id":65637,"amount":"20,000.00","currency":"NGN","card_hash":"7dc7b98c-7f6d-48f3-9b31-859a145c8085","card_pan":"5366130719043293","masked_pan":"536613*******3293","city":"Lekki","state":"Lagos","address_1":"19, Olubunmi Rotimi","address_2":null,"zip_code":"23401","cvv":"267","expiration":"2023-01","send_to":null,"bin_check_name":null,"card_type":"mastercard","name_on_card":"Jermaine Graham","created_at":"2020-01-17T18:31:48.97Z","is_active":true,"callback_url":"https://your-callback-url.com/"}}}}}}}},"/v3/virtual-cards/{id}/fund":{"parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"string"}}],"post":{"summary":"Fund a Virtual Card","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"69"},"ETag":{"schema":{"type":"string"},"example":"W/\\"45-RTdJyVMMUH0EBwhu+vO0qw\\""},"Date":{"schema":{"type":"string"},"example":"Sun, 19 Jan 2020 20:56:43 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"success","message":"Card funded successfully","data":null}}}}}}},"/v3/virtual-cards/{id}/withdraw":{"parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"string"}}],"post":{"summary":"Withdraw from a virtual Card","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"85"},"ETag":{"schema":{"type":"string"},"example":"W/\\"55-r8E1cHc+munShqkMTzcFLA\\""},"Date":{"schema":{"type":"string"},"example":"Thu, 30 Jan 2020 09:10:54 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Card not Found Error","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Card not found. Please check and try again","data":null}}}}}}},"/v3/virtual-cards/{id}/status/{status_action}":{"parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"string"}},{"name":"status_action","in":"path","required":true,"example":"block","schema":{"type":"string"}}],"put":{"summary":"Block/Unblock a Virtual Card","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"75"},"ETag":{"schema":{"type":"string"},"example":"W/\\"4b-0O0x1Rhp5achsE7BzbFMmQ\\""},"Date":{"schema":{"type":"string"},"example":"Thu, 30 Jan 2020 09:14:26 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Idempotent Card Block Error","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Card has been blocked previously","data":null}}}}}}},"/v3/virtual-cards/{id}/terminate":{"parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"string"}}],"put":{"summary":"Terminate a Virtual Card","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"81"},"ETag":{"schema":{"type":"string"},"example":"W/\\"51-MiI03tuoq56Qwx0N4TvCwA\\""},"Date":{"schema":{"type":"string"},"example":"Mon, 20 Jan 2020 15:12:40 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Card Not Found Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Unable to retrieve the requested card.","data":null}}}}}}},"/v3/virtual-cards/{id}/transactions":{"parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"string"}}],"get":{"summary":"Fetch a Virtual Card\'s Transactions","parameters":[{"name":"from","in":"query","required":false,"schema":{"type":"string"}},{"name":"to","in":"query","required":false,"schema":{"type":"string"}},{"name":"index","in":"query","required":false,"schema":{"type":"string"}},{"name":"size","in":"query","required":false,"schema":{"type":"string"}},{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"3812"},"ETag":{"schema":{"type":"string"},"example":"W/\\"ee4-yzpTr4lLFLpmh8jWFYjhPw\\""},"Date":{"schema":{"type":"string"},"example":"Sun, 19 Jan 2020 21:06:47 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Successful Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"array","items":{"type":"object","properties":{"id":{"type":"integer"},"amount":{"type":"integer"},"fee":{"type":"integer"},"product":{"type":"string"},"gateway_reference_details":{"type":"string"},"reference":{"type":"string"},"response_code":{"type":"integer"},"gateway_reference":{"type":"string"},"amount_confirmed":{"type":"integer"},"narration":{"type":"string"},"indicator":{"type":"string"},"created_at":{"type":"string","format":"date-time"},"status":{"type":"string"},"response_message":{"type":"string"},"currency":{"type":"string"}}}}}},"example":{"status":"success","message":"Card transactions fetched successfully","data":[{"id":39250,"amount":25000,"fee":0,"product":"Card Transactions","gateway_reference_details":"Card Withdrawal ","reference":"CF-BARTER-20200113051758201204","response_code":5,"gateway_reference":"536613*******6517","amount_confirmed":0,"narration":"Card Withdrawal","indicator":"D","created_at":"2020-01-13T05:17:58.777Z","status":"Successful","response_message":"Transaction was Successful","currency":"NGN"},{"id":39248,"amount":25000,"fee":0,"product":"Card Transactions","gateway_reference_details":"Card Withdrawal ","reference":"CF-BARTER-20200113051659648286","response_code":5,"gateway_reference":"536613*******6517","amount_confirmed":0,"narration":"Card Withdrawal","indicator":"D","created_at":"2020-01-13T05:16:59.197Z","status":"Successful","response_message":"Transaction was Successful","currency":"NGN"},{"id":39246,"amount":50000,"fee":0,"product":"Card Funding","gateway_reference_details":"38c9201a-fcb2-48fd-875e-6494ed79a6bb","reference":"CF-BARTER-20200113042055432113","response_code":5,"gateway_reference":"536613*******6517","amount_confirmed":0,"narration":"Card Funding","indicator":"C","created_at":"2020-01-13T04:20:55.597Z","status":"Successful","response_message":"Transaction was Successful","currency":"NGN"},{"id":39244,"amount":200000,"fee":0,"product":"Card Funding","gateway_reference_details":"38c9201a-fcb2-48fd-875e-6494ed79a6bb","reference":"CF-BARTER-20200113041736563749","response_code":5,"gateway_reference":"536613*******6517","amount_confirmed":0,"narration":"Card Funding","indicator":"C","created_at":"2020-01-13T04:17:36.257Z","status":"Successful","response_message":"Transaction was Successful","currency":"NGN"},{"id":39242,"amount":100000,"fee":0,"product":"Card Funding","gateway_reference_details":"38c9201a-fcb2-48fd-875e-6494ed79a6bb","reference":"CF-BARTER-20200113041558850052","response_code":5,"gateway_reference":"536613*******6517","amount_confirmed":0,"narration":"Card Funding","indicator":"C","created_at":"2020-01-13T04:15:58.107Z","status":"Successful","response_message":"Transaction was Successful","currency":"NGN"},{"id":39240,"amount":100000,"fee":0,"product":"Card Funding","gateway_reference_details":"38c9201a-fcb2-48fd-875e-6494ed79a6bb","reference":"CF-BARTER-20200113041420718064","response_code":5,"gateway_reference":"536613*******6517","amount_confirmed":0,"narration":"Card Funding","indicator":"C","created_at":"2020-01-13T04:14:20.273Z","status":"Successful","response_message":"Transaction was Successful","currency":"NGN"},{"id":39227,"amount":50000,"fee":0,"product":"Card Funding","gateway_reference_details":"38c9201a-fcb2-48fd-875e-6494ed79a6bb","reference":"CF-BARTER-20200112054622949312","response_code":5,"gateway_reference":"536613*******6517","amount_confirmed":0,"narration":"Card Funding","indicator":"C","created_at":"2020-01-12T17:46:22.543Z","status":"Successful","response_message":"Transaction was Successful","currency":"NGN"},{"id":39226,"amount":250,"fee":0,"product":"Card Issuance Fee","gateway_reference_details":"Card Issuance fee","reference":"CF-BARTER-20200112054621157627","response_code":5,"gateway_reference":"selma FLW","amount_confirmed":0,"narration":"Card Issuance Fee","indicator":"D","created_at":"2020-01-12T17:46:21.84Z","status":"Successful","response_message":"Transaction was Successful","currency":"NGN"},{"id":39225,"amount":50000,"fee":0,"product":"Card Funding Debit","gateway_reference_details":"Card Funding Transfers","reference":"CF-BARTER-20200112054618252652","response_code":5,"gateway_reference":"selma FLW","amount_confirmed":0,"narration":null,"indicator":"D","created_at":"2020-01-12T17:46:18.95Z","status":"Successful","response_message":"Transaction was Successful","currency":"NGN"}]}}}}}}},"/v3/virtual-account-numbers":{"parameters":[],"post":{"summary":"Create a Virtual Account Number","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 10:05:08 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"394"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"18a-Wq9MkBIAyI4Sn7FCp3myOg\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"response_code":{"type":"string","format":"utc-millisec"},"response_message":{"type":"string"},"flw_ref":{"type":"string"},"order_ref":{"type":"string"},"account_number":{"type":"string","format":"utc-millisec"},"account_status":{"type":"string"},"frequency":{"type":"integer"},"bank_name":{"type":"string"},"created_at":{"type":"integer"},"expiry_date":{"type":"integer"},"note":{"type":"string"},"amount":{"type":"string","format":"utc-millisec"}}}}},"example":{"status":"success","message":"Virtual account created","data":{"response_code":"02","response_message":"Transaction in progress","flw_ref":"MockFLWRef-1711620308271","order_ref":"URF_1711620308080_5006035","account_number":"0067100155","account_status":"active","frequency":1,"bank_name":"Mock Bank","created_at":1711620308271,"expiry_date":1711620308271,"note":"Mock note","amount":"100.00"}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 10:11:17 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"91"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"5b-nFSO7+mNo+3M0uyrfr17Lg\\""}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"BVN or NIN is required for static account number","data":null}}}}}}},"/v3/bulk-virtual-account-numbers":{"parameters":[],"post":{"summary":"Create Bulk Virtual Account Numbers","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"179"},"ETag":{"schema":{"type":"string"},"example":"W/\\"b3-CT0MM6BIZ6jXE3nNJ3dTXQ\\""},"Date":{"schema":{"type":"string"},"example":"Mon, 20 Jan 2020 10:27:35 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"batch_id":{"type":"string"},"response_code":{"type":"string","format":"utc-millisec"},"response_message":{"type":"string"}}}}},"example":{"status":"success","message":"Bulk virtual accounts creation queued","data":{"batch_id":"-RND_2641579516055928","response_code":"02","response_message":"Request added to Queue"}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 09:20:22 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"109"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"6d-hJI6zUHGl0HBt5aSbXXcZQ\\""}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string","format":"style"},"data":{"nullable":true}}},"example":{"status":"error","message":"Validation error: BVN or NIN is required for static account number","data":null}}}}}}},"/v3/virtual-account-numbers/{order_ref}":{"parameters":[{"name":"order_ref","in":"path","required":true,"example":"URF_1711621277645_7422535","schema":{"type":"string"}}],"get":{"summary":"Fetch a Virtual Account Number","parameters":[],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"430"},"ETag":{"schema":{"type":"string"},"example":"W/\\"1ae-gOS3714O98UwOUPXmORTwA\\""},"Date":{"schema":{"type":"string"},"example":"Mon, 20 Jan 2020 12:03:30 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"response_code":{"type":"string","format":"utc-millisec"},"response_message":{"type":"string"},"flw_ref":{"type":"string"},"order_ref":{"type":"string"},"account_number":{"type":"string","format":"utc-millisec"},"frequency":{"type":"string","format":"utc-millisec"},"bank_name":{"type":"string"},"created_at":{"type":"string","format":"style"},"expiry_date":{"type":"string"},"note":{"type":"string"},"amount":{"type":"integer"}}}}},"example":{"status":"success","message":"Virtual nuban fetched","data":{"response_code":"02","response_message":"Transaction in progress","flw_ref":"FLW-9b04c88aaf2244379f256691836fd9c9","order_ref":"URF_1579513580629_5981535","account_number":"7826463244","frequency":"5","bank_name":"WEMA BANK","created_at":"2020-01-20 09:46:23","expiry_date":"2020-01-25 23:59:59","note":"Please make a bank transfer to Earth Gang","amount":50700}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 09:20:52 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"57"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"39-bYUPLRXsM+Q+E7qKvaj4BA\\""}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"No order found","data":null}}}}}},"put":{"summary":"Update BVN","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"description":"Successful response"}}},"post":{"summary":"Delete a Virtual Account Number","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"description":"Successful response"}},"requestBody":{"content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"}}},"example":{"status":"inactive"}}}}}},"/v3/bulk-virtual-account-numbers/{batch_id}":{"parameters":[{"name":"batch_id","in":"path","required":true,"schema":{"type":"string"}}],"get":{"summary":"Fetch Bulk Virtual Account Details","parameters":[],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"1839"},"ETag":{"schema":{"type":"string"},"example":"W/\\"72f-w6PfPi02TxQQta2ArOvCEA\\""},"Date":{"schema":{"type":"string"},"example":"Mon, 20 Jan 2020 12:03:33 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"array","items":{"type":"object","properties":{"response_code":{"type":"string","format":"utc-millisec"},"response_message":{"type":"string"},"flw_ref":{"type":"string"},"order_ref":{"type":"string"},"account_number":{"type":"string","format":"utc-millisec"},"frequency":{"type":"string"},"bank_name":{"type":"string"},"created_at":{"type":"string","format":"style"},"expiry_date":{"type":"string"},"note":{"type":"string"},"amount":{"nullable":true}}}}}},"example":{"status":"success","message":"Bulk virtual accounts fetched","data":[{"response_code":"02","response_message":"Transaction in progress","flw_ref":"FLW-f2be3dfeb4fb4f1eb95c236b3129ef0c","order_ref":"URF_1579516057896_3120635","account_number":"7827737349","frequency":"N/A","bank_name":"WEMA BANK","created_at":"2020-01-20 10:27:38","expiry_date":"N/A","note":"Please make a bank transfer to Earth Gang","amount":null},{"response_code":"02","response_message":"Transaction in progress","flw_ref":"FLW-6117c6e877e34f7e80b76268ce73bb69","order_ref":"URF_1579516058932_17235","account_number":"7827554918","frequency":"N/A","bank_name":"WEMA BANK","created_at":"2020-01-20 10:27:39","expiry_date":"N/A","note":"Please make a bank transfer to Earth Gang","amount":null},{"response_code":"02","response_message":"Transaction in progress","flw_ref":"FLW-590fb41034b24dcd9f822f2c02c3cf98","order_ref":"URF_1579516059900_4435935","account_number":"7827619600","frequency":"N/A","bank_name":"WEMA BANK","created_at":"2020-01-20 10:27:40","expiry_date":"N/A","note":"Please make a bank transfer to Earth Gang","amount":null},{"response_code":"02","response_message":"Transaction in progress","flw_ref":"FLW-8e3fb79bb27040d69da1dbe467da8e7c","order_ref":"URF_1579516060920_1225335","account_number":"7827266267","frequency":"N/A","bank_name":"WEMA BANK","created_at":"2020-01-20 10:27:41","expiry_date":"N/A","note":"Please make a bank transfer to Earth Gang","amount":null},{"response_code":"02","response_message":"Transaction in progress","flw_ref":"FLW-1a5264671801416ba09211d0142f0bd1","order_ref":"URF_1579516061920_4339335","account_number":"7827342397","frequency":"N/A","bank_name":"WEMA BANK","created_at":"2020-01-20 10:27:42","expiry_date":"N/A","note":"Please make a bank transfer to Earth Gang","amount":null}]}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 09:21:41 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"78"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"4e-ZqY0F3zEGMoDhp7rhuyVWA\\""}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"NO ACCOUNT NUMBERS FOR THIS BATCHID","data":null}}}}}}},"/v3/subaccounts":{"parameters":[],"post":{"summary":"Create a collection subaccount","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"380"},"ETag":{"schema":{"type":"string"},"example":"W/\\"17c-gl+dV9PigMqm0JdWxJzsCg\\""},"Date":{"schema":{"type":"string"},"example":"Mon, 20 Jan 2020 06:47:56 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"account_number":{"type":"string","format":"utc-millisec"},"account_bank":{"type":"string","format":"color"},"full_name":{"type":"string"},"created_at":{"type":"string","format":"date-time"},"meta":{"type":"array","items":{"type":"object","properties":{"meta_name":{"type":"string"},"meta_value":{"type":"string","format":"utc-millisec"}}}},"split_type":{"type":"string"},"split_value":{"type":"number"},"subaccount_id":{"type":"string"},"bank_name":{"type":"string"}}}}},"example":{"status":"success","message":"Subaccount created","data":{"id":2181,"account_number":"0690000037","account_bank":"044","full_name":"Ibra Mili","created_at":"2020-01-20T06:47:56.000Z","meta":[{"meta_name":"mem_adr","meta_value":"0x16241F327213"}],"split_type":"percentage","split_value":0.5,"subaccount_id":"RS_9BD2ACE480785E759A16FDE1874A6657","bank_name":"ACCESS BANK NIGERIA"}}}}},"400":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"97"},"ETag":{"schema":{"type":"string"},"example":"W/\\"61-jlYiVPoI7KT6ruFwDsae/w\\""},"Date":{"schema":{"type":"string"},"example":"Thu, 23 Jan 2020 15:28:19 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Missing Information Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"business_name is required , business_email is required","data":null}}}}}},"get":{"summary":"Fetch all subaccounts","parameters":[{"name":"account_bank","in":"query","required":false,"schema":{"type":"string"}},{"name":"account_number","in":"query","required":false,"schema":{"type":"string"}},{"name":"bank_name","in":"query","required":false,"schema":{"type":"string"}},{"name":"page","in":"query","required":false,"schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"3103"},"ETag":{"schema":{"type":"string"},"example":"W/\\"c1f-GTlST7yRXkLnIbm8mbDc+A\\""},"Date":{"schema":{"type":"string"},"example":"Thu, 23 Jan 2020 17:24:03 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"meta":{"type":"object","properties":{"page_info":{"type":"object","properties":{"total":{"type":"integer"},"current_page":{"type":"integer"},"total_pages":{"type":"integer"}}}}},"data":{"type":"array","items":{"type":"object","properties":{"id":{"type":"integer"},"account_number":{"type":"string","format":"utc-millisec"},"account_bank":{"type":"string","format":"color"},"business_name":{"type":"string"},"full_name":{"type":"string"},"created_at":{"type":"string","format":"date-time"},"meta":{"type":"array","items":{"type":"object","properties":{"meta_name":{"type":"string"},"meta_value":{"type":"string","format":"utc-millisec"}}}},"account_id":{"type":"integer"},"split_ratio":{"type":"integer"},"split_type":{"type":"string"},"split_value":{"type":"number"},"subaccount_id":{"type":"string"},"bank_name":{"type":"string"},"country":{"type":"string"}}}}}},"example":{"status":"success","message":"Subaccounts fetched","meta":{"page_info":{"total":8,"current_page":1,"total_pages":1}},"data":[{"id":2181,"account_number":"0690000037","account_bank":"044","business_name":"Eternal Blue","full_name":"Ibra Mili","created_at":"2020-01-20T06:47:56.000Z","meta":[{"meta_name":"mem_adr","meta_value":"0x16241F327213"}],"account_id":88747,"split_ratio":1,"split_type":"percentage","split_value":0.5,"subaccount_id":"RS_9BD2ACE480785E759A16FDE1874A6657","bank_name":"ACCESS BANK NIGERIA","country":"NG"},{"id":2180,"account_number":"0690000035","account_bank":"044","business_name":"Eternal Blue","full_name":"Peter Crouch","created_at":"2020-01-20T06:44:58.000Z","meta":[{"meta_name":"mem_adr","meta_value":"0x16241F327213"}],"account_id":88746,"split_ratio":1,"split_type":"flat","split_value":0,"subaccount_id":"RS_5096825149E9FDDC65864F79B815AB45","bank_name":"ACCESS BANK NIGERIA","country":"NG"},{"id":2164,"account_number":"0690000043","account_bank":"044","business_name":"JK Services","full_name":"Roberta Weber","created_at":"2020-01-17T16:25:36.000Z","meta":[{}],"account_id":88496,"split_ratio":1,"split_type":"flat","split_value":0,"subaccount_id":"RS_A560B61FF493A3720913B0487030D2A5","bank_name":"ACCESS BANK NIGERIA","country":"NG"},{"id":2063,"account_number":"0690000039","account_bank":"044","business_name":"Sharp Guy","full_name":"Dotun Ajib","created_at":"2020-01-02T21:54:35.000Z","meta":[{"swift_code":""}],"account_id":86548,"split_ratio":1,"split_type":"percentage","split_value":0.6,"subaccount_id":"RS_2A9D2F79274AD40924983F5BA6975336","bank_name":"ACCESS BANK NIGERIA","country":"NG"},{"id":1962,"account_number":"0690000042","account_bank":"044","business_name":"Sam Son","full_name":"Forrest Terry","created_at":"2019-12-09T13:27:04.000Z","meta":[{"swift_code":""}],"account_id":84353,"split_ratio":1,"split_type":"percentage","split_value":0.02,"subaccount_id":"RS_008F29575D91B6E80BB31F5B374CBF4E","bank_name":"ACCESS BANK NIGERIA","country":"NG"},{"id":1961,"account_number":"0690000033","account_bank":"044","business_name":"Zen Daya","full_name":"Bale Gary","created_at":"2019-12-09T13:19:41.000Z","meta":[{"swift_code":""}],"account_id":84351,"split_ratio":1,"split_type":"percentage","split_value":0.05,"subaccount_id":"RS_DE6A6DDCB8C0708D7D39B7DFEC0AC8B7","bank_name":"ACCESS BANK NIGERIA","country":"NG"},{"id":1960,"account_number":"0690000031","account_bank":"044","business_name":"Zen Daya","full_name":"Forrest Green","created_at":"2019-12-09T13:18:14.000Z","meta":[{"swift_code":""}],"account_id":84349,"split_ratio":1,"split_type":"percentage","split_value":0.05,"subaccount_id":"RS_7F017022CF4E8A7F0BD5BBD86BD442B0","bank_name":"ACCESS BANK NIGERIA","country":"NG"},{"id":1663,"account_number":"0690000032","account_bank":"044","business_name":"Monkey Tail","full_name":"Pastor Bright","created_at":"2019-09-25T13:44:23.000Z","meta":[{"swift_code":""}],"account_id":75465,"split_ratio":1,"split_type":"flat","split_value":100,"subaccount_id":"RS_19D8078A8CB10757BA7ACA8FB695D17C","bank_name":"ACCESS BANK NIGERIA","country":"NG"}]}}}}}}},"/v3/subaccounts/{id}":{"parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"string"}}],"get":{"summary":"Fetch a Subaccount","parameters":[],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"423"},"ETag":{"schema":{"type":"string"},"example":"W/\\"1a7-ADkz899Y674y60sJ5U4vFA\\""},"Date":{"schema":{"type":"string"},"example":"Mon, 20 Jan 2020 06:39:59 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"account_number":{"type":"string","format":"utc-millisec"},"account_bank":{"type":"string","format":"color"},"business_name":{"type":"string"},"full_name":{"type":"string"},"created_at":{"type":"string","format":"date-time"},"meta":{"type":"array","items":{"type":"object","properties":{"swift_code":{"type":"string"}}}},"account_id":{"type":"integer"},"split_ratio":{"type":"integer"},"split_type":{"type":"string"},"split_value":{"type":"number"},"subaccount_id":{"type":"string"},"bank_name":{"type":"string"},"country":{"type":"string"}}}}},"example":{"status":"success","message":"Subaccount fetched","data":{"id":2063,"account_number":"0690000039","account_bank":"044","business_name":"Sharp Guy","full_name":"Dotun Ajib","created_at":"2020-01-02T21:54:35.000Z","meta":[{"swift_code":""}],"account_id":86548,"split_ratio":1,"split_type":"percentage","split_value":0.6,"subaccount_id":"RS_2A9D2F79274AD40924983F5BA6975336","bank_name":"ACCESS BANK NIGERIA","country":"NG"}}}}},"400":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"63"},"ETag":{"schema":{"type":"string"},"example":"W/\\"3f-2vcST+gZxhQQ8oPUbjGAuA\\""},"Date":{"schema":{"type":"string"},"example":"Thu, 30 Jan 2020 09:04:07 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Subaccount not found","data":null}}}}}},"put":{"summary":"Update a subaccount","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"456"},"ETag":{"schema":{"type":"string"},"example":"W/\\"1c8-IrV/6VCvyZaPKjtDxzh5KA\\""},"Date":{"schema":{"type":"string"},"example":"Mon, 20 Jan 2020 06:55:14 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"account_number":{"type":"string","format":"utc-millisec"},"account_bank":{"type":"string","format":"color"},"business_name":{"type":"string"},"full_name":{"type":"string"},"created_at":{"type":"string","format":"date-time"},"meta":{"type":"array","items":{"type":"object","properties":{"meta_name":{"type":"string"},"meta_value":{"type":"string"}}}},"account_id":{"type":"integer"},"split_ratio":{"type":"integer"},"split_type":{"type":"string"},"split_value":{"type":"string","format":"color"},"subaccount_id":{"type":"string"},"bank_name":{"type":"string"},"country":{"type":"string"}}}}},"example":{"status":"success","message":"Subaccount edited","data":{"id":2165,"account_number":"0690000040","account_bank":"044","business_name":"Mad O!","full_name":"Alexis Rogers","created_at":"2020-01-17T16:28:26.000Z","meta":[{"meta_name":"MarketplaceID","meta_value":"ggs-920900"}],"account_id":88497,"split_ratio":1,"split_type":"flat","split_value":"200","subaccount_id":"RS_884E7E4BD793ADA77F491CF4AD3DE19E","bank_name":"ACCESS BANK NIGERIA","country":"NG"}}}}},"400":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"61"},"ETag":{"schema":{"type":"string"},"example":"W/\\"3d-RH9GJR7trVyHmdpF2k/JTA\\""},"Date":{"schema":{"type":"string"},"example":"Thu, 30 Jan 2020 09:05:16 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Merchant not found","data":null}}}}}},"delete":{"summary":"Delete a subaccount","parameters":[],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"63"},"ETag":{"schema":{"type":"string"},"example":"W/\\"3f-887CkAWpWN3zvarmHXlYBQ\\""},"Date":{"schema":{"type":"string"},"example":"Mon, 20 Jan 2020 06:58:40 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Successful Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"success","message":"Subaccount deleted","data":null}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 10:29:26 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"64"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"40-AxukB+EjzA4UlDfnjE47Hw\\""}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Beneficiary not found","data":null}}}}}}},"/v3/payout-subaccounts":{"parameters":[],"post":{"summary":"Create a Payout Subaccount","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Sun, 24 Mar 2024 09:38:04 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"374"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"176-WOaW+7c1eB2ZSYKAR6jPlQ\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"account_reference":{"type":"string"},"account_name":{"type":"string"},"barter_id":{"type":"string","format":"utc-millisec"},"email":{"type":"string","format":"email"},"mobilenumber":{"type":"string","format":"utc-millisec"},"country":{"type":"string"},"nuban":{"type":"string","format":"utc-millisec"},"bank_name":{"type":"string"},"bank_code":{"type":"string","format":"color"},"status":{"type":"string"},"created_at":{"type":"string","format":"date-time"}}}}},"example":{"status":"success","message":"Payout subaccount created","data":{"id":4190,"account_reference":"PSA7472870CFA3073543","account_name":"Example User","barter_id":"234000002466747","email":"user@gmail.com","mobilenumber":"09010000000","country":"US","nuban":"6222125542","bank_name":"Sterling Bank","bank_code":"232","status":"ACTIVE","created_at":"2024-03-24T09:38:03.000Z"}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 10:31:07 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"63"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"3f-/TrnJcVmzKHuxDHN+VCpqw\\""}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Email already exists","data":null}}}}}},"get":{"summary":"List all Payout Subaccounts","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Sun, 24 Mar 2024 09:38:42 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"3634"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"e32-aIftCX6NrdC0WsBw0ARY9w\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"array","items":{"type":"object","properties":{"id":{"type":"integer"},"account_reference":{"type":"string"},"account_name":{"type":"string"},"barter_id":{"type":"string","format":"utc-millisec"},"email":{"type":"string","format":"email"},"mobilenumber":{"type":"string","format":"utc-millisec"},"country":{"type":"string"},"nuban":{"type":"string","format":"utc-millisec"},"bank_name":{"type":"string"},"bank_code":{"type":"string","format":"color"},"status":{"type":"string"},"created_at":{"type":"string","format":"date-time"}}}}}},"example":{"status":"success","message":"Payout subaccounts fetched","data":[{"id":2625,"account_reference":"678RRDDDFFF567700000","account_name":"Dekunle Odus","barter_id":"234000002004539","email":"dev@flutterwavego.com","mobilenumber":"08060399351","country":"NG","nuban":"6222060346","bank_name":"Sterling Bank","bank_code":"232","status":"ACTIVE","created_at":"2023-05-17T10:30:00.000Z"},{"id":736,"account_reference":"PSA0993DB6C214118068","account_name":"Ayomide DeveloperZ ","barter_id":"234000001714750","email":"ayomide+123@flutterwavego.com","mobilenumber":"09012903324","country":"US","nuban":"6222134233","bank_name":"Sterling Bank","bank_code":"232","status":"ACTIVE","created_at":"2022-03-15T11:35:18.000Z"},{"id":700,"account_reference":"PSA15FAF664D63870782","account_name":"Aramide Smith","barter_id":"234000001708295","email":"arasmith676@yahoo.com","mobilenumber":"+1409340265","country":"NG","nuban":"6222126187","bank_name":"Sterling Bank","bank_code":"232","status":"ACTIVE","created_at":"2022-03-04T19:57:50.000Z"},{"id":1338,"account_reference":"PSA473B98B92E2246208","account_name":"Cornelius Ashley-Osuzoka","barter_id":"234000001795142","email":"cornelius+123@flutterwavego.com","mobilenumber":"08109328188","country":"NG","nuban":"1352675881","bank_name":"HighStreet MFB bank","bank_code":"090175","status":"ACTIVE","created_at":"2022-07-21T14:04:06.000Z"},{"id":4190,"account_reference":"PSA7472870CFA3073543","account_name":"Example User","barter_id":"234000002466747","email":"user@gmail.com","mobilenumber":"09010000000","country":"US","nuban":"6222125542","bank_name":"Sterling Bank","bank_code":"232","status":"ACTIVE","created_at":"2024-03-24T09:38:03.000Z"},{"id":1753,"account_reference":"PSA88B1F0A78C0262783","account_name":"PHP Person","barter_id":"234000001862258","email":"cornelius@flutterwavego.com","mobilenumber":"+2348065007910","country":"NG","nuban":"1352702389","bank_name":"Test Bank","bank_code":"090175","status":"ACTIVE","created_at":"2022-11-07T14:11:02.000Z"},{"id":1750,"account_reference":"PSAA888D98D4E7757810","account_name":"Jake Teddy","barter_id":"234000001860681","email":"jteddy@gmail.com","mobilenumber":"+2348065007000","country":"NG","nuban":"1352701877","bank_name":"Test Bank","bank_code":"090175","status":"ACTIVE","created_at":"2022-11-04T16:02:37.000Z"},{"id":701,"account_reference":"PSAC33BFC23033921446","account_name":"Ayomide Jimi-Oni ","barter_id":"234000001708296","email":"ayomide@flutterwavego.com","mobilenumber":"09012903324","country":"NG","nuban":"6222126197","bank_name":"Sterling Bank","bank_code":"232","status":"ACTIVE","created_at":"2022-03-04T19:58:41.000Z"},{"id":3800,"account_reference":"PSAD0EFA5A9212120652","account_name":"USD_Wallet","barter_id":"234000002403717","email":"tgchatikobo@gmail.com","mobilenumber":"0614762097","country":"NG","nuban":"6222110118","bank_name":"Sterling Bank","bank_code":"232","status":"ACTIVE","created_at":"2023-12-06T11:28:51.000Z"},{"id":1372,"account_reference":"PSAE670D94E621190755","account_name":"Cornelius Ashley-Osuzoka","barter_id":"234000001798672","email":"cornelius+1234@flutterwavego.com","mobilenumber":"08109328188","country":"NG","nuban":"1352677207","bank_name":"HighStreet MFB bank","bank_code":"090175","status":"ACTIVE","created_at":"2022-07-26T13:13:10.000Z"},{"id":699,"account_reference":"PSAFF2118D1A33844332","account_name":"Flutterwave Developers","barter_id":"234000001708294","email":"developers@flutterwavego.com","mobilenumber":"010101010","country":"NG","nuban":"6222126177","bank_name":"Sterling Bank","bank_code":"232","status":"ACTIVE","created_at":"2022-03-04T19:57:24.000Z"}]}}}}}}},"/v3/payout-subaccounts/{account_reference}":{"parameters":[{"name":"account_reference","in":"path","required":true,"example":"PSAFF2118D1A33844332","schema":{"type":"string"}}],"get":{"summary":"Get a Payout Subaccount","parameters":[{"name":"include_limits","in":"query","required":false,"example":"1","schema":{"type":"integer"}},{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Sun, 24 Mar 2024 09:40:10 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"395"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"18b-yg+inrVpim1yuq+tFmXbQg\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"account_reference":{"type":"string"},"account_name":{"type":"string"},"barter_id":{"type":"string","format":"utc-millisec"},"email":{"type":"string","format":"email"},"mobilenumber":{"type":"string","format":"utc-millisec"},"country":{"type":"string"},"nuban":{"type":"string","format":"utc-millisec"},"bank_name":{"type":"string"},"bank_code":{"type":"string","format":"color"},"status":{"type":"string"},"created_at":{"type":"string","format":"date-time"}}}}},"example":{"status":"success","message":"Payout subaccount fetched","data":{"id":699,"account_reference":"PSAFF2118D1A33844332","account_name":"Flutterwave Developers","barter_id":"234000001708294","email":"developers@flutterwavego.com","mobilenumber":"010101010","country":"NG","nuban":"6222126177","bank_name":"Sterling Bank","bank_code":"232","status":"ACTIVE","created_at":"2022-03-04T19:57:24.000Z"}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 10:33:57 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"71"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"47-4hRGZOqlUywFx66UG/Ljlg\\""}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Account reference is Invalid","data":null}}}}}},"put":{"summary":"Update a Payout Subaccount","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Sun, 24 Mar 2024 09:42:34 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"394"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"18a-HZRr4f+0t0yGqNcFfWj3fg\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"account_reference":{"type":"string"},"account_name":{"type":"string"},"barter_id":{"type":"string","format":"utc-millisec"},"email":{"type":"string","format":"email"},"mobilenumber":{"type":"string","format":"utc-millisec"},"country":{"type":"string"},"nuban":{"type":"string","format":"utc-millisec"},"bank_name":{"type":"string"},"bank_code":{"type":"string","format":"color"},"status":{"type":"string"},"created_at":{"type":"string","format":"date-time"}}}}},"example":{"status":"success","message":"Payout subaccount updated","data":{"id":699,"account_reference":"PSAFF2118D1A33844332","account_name":"Another Example","barter_id":"234000001708294","email":"developers@flutterwavego.com","mobilenumber":"234000001708294","country":"US","nuban":"6222126177","bank_name":"Sterling Bank","bank_code":"232","status":"ACTIVE","created_at":"2022-03-04T19:57:24.000Z"}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 10:34:54 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"71"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"47-4hRGZOqlUywFx66UG/Ljlg\\""}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Account reference is Invalid","data":null}}}}}}},"/v3/payout-subaccounts/{account_reference}/transactions":{"parameters":[{"name":"account_reference","in":"path","required":true,"example":"PSAE905F542704932282","schema":{"type":"string"}}],"get":{"summary":"Fetch Transactions","parameters":[{"name":"from","in":"query","required":false,"example":"2020-03-21","schema":{"type":"integer"}},{"name":"to","in":"query","required":false,"example":"2024-03-25","schema":{"type":"integer"}},{"name":"currency","in":"query","required":false,"example":"NGN","schema":{"type":"string"}},{"name":"page","in":"query","required":false,"schema":{"type":"string"}},{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Tue, 26 Mar 2024 14:59:59 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"404"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"194-93qTbVDixaFqFB6hdDwv6Q\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"page_info":{"type":"object","properties":{"total":{"type":"integer"},"current_page":{"type":"integer"},"total_pages":{"type":"integer"}}},"transactions":{"type":"array","items":{"type":"object","properties":{"type":{"type":"string"},"amount":{"type":"integer"},"currency":{"type":"string"},"balance_before":{"type":"integer"},"balance_after":{"type":"integer"},"reference":{"type":"string"},"date":{"type":"string","format":"date-time"},"remarks":{"type":"string"},"sent_currency":{"type":"string"},"rate_used":{"type":"integer"},"sent_amount":{"type":"integer"},"statement_type":{"type":"string"}}}}}}}},"example":{"status":"success","message":"Wallet statement retrieved","data":{"page_info":{"total":1,"current_page":1,"total_pages":1},"transactions":[{"type":"C","amount":100,"currency":"NGN","balance_before":0,"balance_after":100,"reference":"FLWRVCNF623008","date":"2024-03-26T14:59:35+00:00","remarks":"Test balance funding","sent_currency":"NGN","rate_used":1,"sent_amount":100,"statement_type":"available"}]}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 10:35:36 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"68"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"44-Ermz/dFUAuz//fgkhq7Gfg\\""}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Invalid Account Reference","data":null}}}}}}},"/v3/payout-subaccounts/{account_reference}/balances":{"parameters":[{"name":"account_reference","in":"path","required":true,"example":"PSAE905F542704932282","schema":{"type":"string"}}],"get":{"summary":"Fetch Available  Balance","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Tue, 26 Mar 2024 15:00:48 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"128"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"80-H/nuAhGkOAiDXXlmi/HTOw\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"currency":{"type":"string"},"available_balance":{"type":"integer"},"ledger_balance":{"type":"integer"}}}}},"example":{"status":"success","message":"Subaccount balance fetched","data":{"currency":"NGN","available_balance":100,"ledger_balance":0}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 10:37:01 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"70"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"46-S4k1PZVSA9GPwThU6XB+YQ\\""}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Payout Subaccount not found","data":null}}}}}}},"/v3/payout-subaccounts/{account_reference}/static-account":{"parameters":[{"name":"account_reference","in":"path","required":true,"example":"PSAFF2118D1A33844332","schema":{"type":"string"}}],"get":{"summary":"Fetch Static Virtual Accounts","parameters":[{"name":"currency","in":"query","required":false,"example":"NGN","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Sun, 24 Mar 2024 09:54:39 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"151"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"97-AaQHL4M9eUAlNvCobaM+gg\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"static_account":{"type":"string","format":"utc-millisec"},"bank_name":{"type":"string"},"bank_code":{"type":"string","format":"color"},"currency":{"type":"string"}}}}},"example":{"status":"success","message":"SERVICE-RESPONSE","data":{"static_account":"6222126177","bank_name":"Sterling Bank","bank_code":"232","currency":"NGN"}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 10:38:55 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"68"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"44-Ermz/dFUAuz//fgkhq7Gfg\\""}},"description":"Sample Error Reference","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Invalid Account Reference","data":null}}}}}}},"/v3/subscriptions":{"parameters":[],"get":{"summary":"Get all Subscriptions","parameters":[{"name":"email","in":"query","required":false,"schema":{"type":"string"}},{"name":"transaction_id","in":"query","required":false,"schema":{"type":"string"}},{"name":"plan","in":"query","required":false,"schema":{"type":"string"}},{"name":"subscribed_from","in":"query","required":false,"schema":{"type":"string"}},{"name":"subscribed_to","in":"query","required":false,"schema":{"type":"string"}},{"name":"next_due_from","in":"query","required":false,"schema":{"type":"string"}},{"name":"next_due_to","in":"query","required":false,"schema":{"type":"string"}},{"name":"page","in":"query","required":false,"schema":{"type":"string"}},{"name":"status","in":"query","required":false,"schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"456"},"ETag":{"schema":{"type":"string"},"example":"W/\\"1c8-LWkfMzA2/iZs1/yofkRtqQ\\""},"Date":{"schema":{"type":"string"},"example":"Thu, 23 Jan 2020 17:29:44 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"meta":{"type":"object","properties":{"page_info":{"type":"object","properties":{"total":{"type":"integer"},"current_page":{"type":"integer"},"total_pages":{"type":"integer"}}}}},"data":{"type":"array","items":{"type":"object","properties":{"id":{"type":"integer"},"amount":{"type":"integer"},"customer":{"type":"object","properties":{"id":{"type":"integer"},"customer_email":{"type":"string","format":"email"}}},"plan":{"type":"integer"},"status":{"type":"string"},"created_at":{"type":"string","format":"date-time"}}}}}},"example":{"status":"success","message":"Plan subscriptions fetched","meta":{"page_info":{"total":2,"current_page":1,"total_pages":1}},"data":[{"id":4147,"amount":2000,"customer":{"id":247546,"customer_email":"h0vkard@flw.ext"},"plan":3657,"status":"cancelled","created_at":"2019-12-31T17:00:55.000Z"},{"id":4146,"amount":2000,"customer":{"id":247490,"customer_email":"h0vkard@flw.ext"},"plan":3656,"status":"cancelled","created_at":"2019-12-31T14:44:20.000Z"}]}}}}}}},"/v3/subscriptions/{id}/activate":{"parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"string"}}],"put":{"summary":"Activate a Subscription","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"220"},"ETag":{"schema":{"type":"string"},"example":"W/\\"dc-gOPhdDwm5ThR+Bprp+Ygew\\""},"Date":{"schema":{"type":"string"},"example":"Mon, 20 Jan 2020 17:02:55 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"amount":{"type":"integer"},"customer":{"type":"object","properties":{"id":{"type":"integer"},"customer_email":{"type":"string","format":"email"}}},"plan":{"type":"integer"},"status":{"type":"string"},"created_at":{"type":"string","format":"date-time"}}}}},"example":{"status":"success","message":"Subscription activated","data":{"id":4147,"amount":2000,"customer":{"id":247546,"customer_email":"h0vkard@flw.ext"},"plan":3657,"status":"active","created_at":"2019-12-31T17:00:55.000Z"}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 10:40:11 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"79"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"4f-ZwXfLxK03Y4h4WYVa8B4uA\\""}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Non existent or invalid subscription","data":null}}}}}}},"/v3/subscriptions/{id}/cancel":{"parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"string"}}],"put":{"summary":"Deactivate a Subscription","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"223"},"ETag":{"schema":{"type":"string"},"example":"W/\\"df-oA0LJcLVtpqjOwdFLMvWtQ\\""},"Date":{"schema":{"type":"string"},"example":"Mon, 20 Jan 2020 17:03:30 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"amount":{"type":"integer"},"customer":{"type":"object","properties":{"id":{"type":"integer"},"customer_email":{"type":"string","format":"email"}}},"plan":{"type":"integer"},"status":{"type":"string"},"created_at":{"type":"string","format":"date-time"}}}}},"example":{"status":"success","message":"Subscription cancelled","data":{"id":4147,"amount":2000,"customer":{"id":247546,"customer_email":"h0vkard@flw.ext"},"plan":3657,"status":"cancelled","created_at":"2019-12-31T17:00:55.000Z"}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 10:40:47 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"79"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"4f-ZwXfLxK03Y4h4WYVa8B4uA\\""}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Non existent or invalid subscription","data":null}}}}}}},"/v3/payment-plans":{"parameters":[],"post":{"summary":"Create a Payment Plan","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"270"},"ETag":{"schema":{"type":"string"},"example":"W/\\"10e-PNJQYallQPVg1KfJvyV2vw\\""},"Date":{"schema":{"type":"string"},"example":"Thu, 16 Jan 2020 18:08:19 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"name":{"type":"string"},"amount":{"type":"integer"},"interval":{"type":"string"},"duration":{"type":"integer"},"status":{"type":"string"},"currency":{"type":"string"},"plan_token":{"type":"string"},"created_at":{"type":"string","format":"date-time"}}}}},"example":{"status":"success","message":"Payment plan created","data":{"id":3807,"name":"the akhlm postman plan 2","amount":5000,"interval":"monthly","duration":48,"status":"active","currency":"NGN","plan_token":"rpp_12d2ef3d5ac1c13b9d30","created_at":"2020-01-16T18:08:19.000Z"}}}}}}},"get":{"summary":"Get all Payment Plans","parameters":[{"name":"from","in":"query","required":false,"schema":{"type":"string"}},{"name":"to","in":"query","required":false,"schema":{"type":"string"}},{"name":"page","in":"query","required":false,"schema":{"type":"string"}},{"name":"amount","in":"query","required":false,"schema":{"type":"string"}},{"name":"currency","in":"query","required":false,"schema":{"type":"string"}},{"name":"interval","in":"query","required":false,"schema":{"type":"string"}},{"name":"status","in":"query","required":false,"schema":{"type":"string"}},{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"2134"},"ETag":{"schema":{"type":"string"},"example":"W/\\"856-X3tSPY2usSv3MDhGZOprZw\\""},"Date":{"schema":{"type":"string"},"example":"Thu, 23 Jan 2020 17:21:23 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"meta":{"type":"object","properties":{"page_info":{"type":"object","properties":{"total":{"type":"integer"},"current_page":{"type":"integer"},"total_pages":{"type":"integer"}}}}},"data":{"type":"array","items":{"type":"object","properties":{"id":{"type":"integer"},"name":{"type":"string"},"amount":{"type":"integer"},"interval":{"type":"string"},"duration":{"type":"integer"},"status":{"type":"string"},"currency":{"type":"string"},"plan_token":{"type":"string"},"created_at":{"type":"string","format":"date-time"}}}}}},"example":{"status":"success","message":"Payment plans fetched","meta":{"page_info":{"total":11,"current_page":1,"total_pages":2}},"data":[{"id":3809,"name":"akhlm postman updated","amount":0,"interval":"daily","duration":0,"status":"active","currency":"NGN","plan_token":"rpp_59072efa415936a5cfbf","created_at":"2020-01-16T18:10:32.000Z"},{"id":3808,"name":"N/A","amount":5000,"interval":"daily","duration":0,"status":"active","currency":"NGN","plan_token":"rpp_e8b0c18d665d849f033b","created_at":"2020-01-16T18:10:22.000Z"},{"id":3807,"name":"akhlm postman update","amount":5000,"interval":"monthly","duration":48,"status":"active","currency":"NGN","plan_token":"rpp_12d2ef3d5ac1c13b9d30","created_at":"2020-01-16T18:08:19.000Z"},{"id":3806,"name":"the akhlm postman plan","amount":5000,"interval":"weekly","duration":52,"status":"active","currency":"NGN","plan_token":"rpp_25f3bbeae9333211dd35","created_at":"2020-01-16T18:05:01.000Z"},{"id":3772,"name":"The selma Postman Plan 2","amount":5000,"interval":"weekly","duration":52,"status":"cancelled","currency":"NGN","plan_token":"rpp_d2f295acd1970438f822","created_at":"2020-01-14T05:43:48.000Z"},{"id":3771,"name":"The selma Postman Plan","amount":5000,"interval":"monthly","duration":12,"status":"active","currency":"NGN","plan_token":"rpp_3e0968c64209b7a0f25c","created_at":"2020-01-14T05:42:57.000Z"},{"id":3700,"name":"The selma Plan","amount":2000,"interval":"monthly","duration":12,"status":"active","currency":"NGN","plan_token":"rpp_93fef9f31f7b6abb5882","created_at":"2020-01-10T13:29:46.000Z"},{"id":3699,"name":"N/A","amount":0,"interval":"daily","duration":0,"status":"cancelled","currency":"NGN","plan_token":"rpp_93d443ad355b5efb4fe3","created_at":"2020-01-10T13:28:47.000Z"},{"id":3698,"name":"The selma Editted","amount":0,"interval":"daily","duration":0,"status":"cancelled","currency":"NGN","plan_token":"rpp_f1ef76170b1a7bc1110b","created_at":"2020-01-10T13:28:13.000Z"},{"id":3657,"name":"akhlm-stag","amount":2000,"interval":"hourly","duration":4,"status":"active","currency":"NGN","plan_token":"rpp_fed796f8be1f5469a41f","created_at":"2019-12-31T16:51:28.000Z"}]}}}}}}},"/v3/payment-plans/{id}":{"parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"string"}}],"get":{"summary":"Get a Payment Plan","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Tue, 19 Mar 2024 09:14:12 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"258"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"102-jwaZy6xNy/jpSW4n+HUQTg\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Get a Payment Plan Success","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"name":{"type":"string"},"amount":{"type":"integer"},"interval":{"type":"string"},"duration":{"type":"integer"},"status":{"type":"string"},"currency":{"type":"string"},"plan_token":{"type":"string"},"created_at":{"type":"string","format":"date-time"}}}}},"example":{"status":"success","message":"Payment plan fetched","data":{"id":63468,"name":"Sample Plan","amount":1000,"interval":"monthly","duration":12,"status":"active","currency":"NGN","plan_token":"rpp_0ec8c0e2acb9e4304b94","created_at":"2024-03-08T06:59:41.000Z"}}}}}}},"put":{"summary":"Update a Payment Plan","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"266"},"ETag":{"schema":{"type":"string"},"example":"W/\\"10a-5DYdUKHR/b/cfY9KHqUE2A\\""},"Date":{"schema":{"type":"string"},"example":"Fri, 17 Jan 2020 07:49:54 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Successful Update Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"name":{"type":"string"},"plan_token":{"type":"string"},"status":{"type":"string"},"currency":{"type":"string"},"amount":{"type":"integer"},"duration":{"type":"integer"},"interval":{"type":"string"},"created_at":{"type":"string","format":"date-time"}}}}},"example":{"status":"success","message":"Payment plan updated","data":{"id":3807,"name":"akhlm postman update","plan_token":"rpp_12d2ef3d5ac1c13b9d30","status":"active","currency":"NGN","amount":5000,"duration":48,"interval":"monthly","created_at":"2020-01-16T18:08:19.000Z"}}}}},"400":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"81"},"ETag":{"schema":{"type":"string"},"example":"W/\\"51-6r1zpCkYNEgkXQzq5uMpVA\\""},"Date":{"schema":{"type":"string"},"example":"Thu, 23 Jan 2020 15:25:02 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Plan Not Found Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"No payment plan with provided id found","data":null}}}}}}},"/v3/payment-plans/{id}/cancel":{"parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"string"}}],"put":{"summary":"Cancel a Payment Plan","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"275"},"ETag":{"schema":{"type":"string"},"example":"W/\\"113-ZxLfw9DLUuP62Si/23pySg\\""},"Date":{"schema":{"type":"string"},"example":"Thu, 16 Jan 2020 18:40:21 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"name":{"type":"string"},"plan_token":{"type":"string"},"status":{"type":"string"},"currency":{"type":"string"},"amount":{"type":"integer"},"duration":{"type":"integer"},"interval":{"type":"string"},"created_at":{"type":"string","format":"date-time"}}}}},"example":{"status":"success","message":"Payment plan cancelled","data":{"id":3807,"name":"the akhlm postman plan 2","plan_token":"rpp_12d2ef3d5ac1c13b9d30","status":"cancelled","currency":"NGN","amount":5000,"duration":48,"interval":"monthly","created_at":"2020-01-16T18:08:19.000Z"}}}}},"400":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"64"},"ETag":{"schema":{"type":"string"},"example":"W/\\"40-BIwWJXZ2XNcs6OM5ApJJFQ\\""},"Date":{"schema":{"type":"string"},"example":"Thu, 23 Jan 2020 15:24:15 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample No Plan Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"No payment plan found","data":null}}}}}}},"/v3/top-bill-categories":{"parameters":[],"get":{"summary":"Get Supported Bill Categories","parameters":[{"name":"country","in":"query","required":false,"example":"NG","schema":{"type":"string"}},{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Sun, 24 Mar 2024 08:42:13 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"1939"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"793-R9xAWm3WCtc8ofHmg/IIHw\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Get Billers","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"array","items":{"type":"object","properties":{"id":{"type":"integer"},"name":{"type":"string"},"code":{"type":"string"},"description":{"type":"string"},"country_code":{"type":"string"}}}}}},"example":{"status":"success","message":"Categories fetched successfully","data":[{"id":1,"name":"Airtime","code":"AIRTIME","description":"Airtime","country_code":"NG"},{"id":2,"name":"Mobile Data Service","code":"MOBILEDATA","description":"Mobile Data Service","country_code":"NG"},{"id":3,"name":"Cable Bill Payment","code":"CABLEBILLS","description":"Cable Bill Payment","country_code":"NG"},{"id":4,"name":"Internet Service","code":"INTSERVICE","description":"Internet Service","country_code":"NG"},{"id":5,"name":"Utility Bills","code":"UTILITYBILLS","description":"Utility Bills","country_code":"NG"},{"id":6,"name":"Tax Payment","code":"TAX","description":"Tax Payment","country_code":"NG"},{"id":7,"name":"Donations","code":"DONATIONS","description":"Donations","country_code":"NG"},{"id":8,"name":"Transport and Logistics","code":"TRANSLOG","description":"Transport and Logistics","country_code":"NG"},{"id":9,"name":"Dealer Payments","code":"DEALPAY","description":"Dealer Payments","country_code":"NG"},{"id":10,"name":"Airtime","code":"AIRTIME","description":"Airtime","country_code":"GH"},{"id":11,"name":"Mobile Money","code":"MOBILEMONEY","description":"Mobile Money","country_code":"GH"},{"id":12,"name":"Airtime","code":"AIRTIME","description":"Airtime","country_code":"KE"},{"id":13,"name":"Cable Bill Payment","code":"CABLEBILLS","description":"Cable Bill Payment","country_code":"KE"},{"id":14,"name":"Utility Bills","code":"UTILITYBILLS","description":"Utility Bills","country_code":"KE"},{"id":15,"name":"Mobile Money","code":"MOBILEMONEY","description":"Mobile Money","country_code":"ZM"},{"id":16,"name":"Airtime","code":"Airtime","description":"Airtime","country_code":"ZM"},{"id":17,"name":"Religious Institutions","code":"RELINST","description":"Religious Institutions","country_code":"NG"},{"id":18,"name":"Schools & Professional Bodies","code":"SCHPB","description":"Schools & Professional Bodies","country_code":"NG"}]}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Sun, 24 Mar 2024 08:48:41 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"77"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"4d-2N6dqplzBo2kDr8W/OgLlg\\""}},"description":"Get Billers - Error response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Country not supported at this time","data":null}}}}}}},"/v3/bills/{category}/billers":{"parameters":[{"name":"category","in":"path","required":true,"example":"CABLEBILLS","schema":{"type":"string"}}],"get":{"summary":"Get Biller Details","parameters":[{"name":"country","in":"query","required":false,"example":"NG","schema":{"type":"string"}},{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Sun, 24 Mar 2024 08:46:30 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"1012"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"3f4-Gi+EDyCaeETR1eTuLYXHOQ\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Get Biller Details","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"array","items":{"type":"object","properties":{"id":{"type":"integer"},"name":{"type":"string"},"logo":{"nullable":true},"description":{"type":"string"},"short_name":{"type":"string"},"biller_code":{"type":"string"},"country_code":{"type":"string"}}}}}},"example":{"status":"success","message":"Billers fetched successfully","data":[{"id":66,"name":"DSTV","logo":null,"description":"DSTV","short_name":"DSTV","biller_code":"BIL119","country_code":"NG"},{"id":67,"name":"GOTV","logo":null,"description":"GOTV","short_name":"GOTV","biller_code":"BIL120","country_code":"NG"},{"id":68,"name":"DAARSAT Communications","logo":null,"description":"DAARSAT Communications","short_name":"DAARSAT Communications","biller_code":"BIL123","country_code":"NG"},{"id":69,"name":"DSTV BOX OFFICE","logo":null,"description":"DSTV BOX OFFICE","short_name":"DSTV BOX OFFICE","biller_code":"BIL125","country_code":"NG"},{"id":70,"name":"MyTV","logo":null,"description":"MyTV","short_name":"MyTV","biller_code":"BIL128","country_code":"NG"},{"id":71,"name":"HiTV","logo":null,"description":"HiTV","short_name":"HiTV","biller_code":"BIL129","country_code":"NG"},{"id":91,"name":"STARTIMES","logo":null,"description":"STARTIMES","short_name":"STARTIMES","biller_code":"BIL123","country_code":"NG"}]}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Sun, 24 Mar 2024 08:47:55 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"64"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"40-92wUCd2K7Rzqsy78GPAkrg\\""}},"description":"Get Biller Details - Error response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Invalid category code","data":null}}}}}}},"/v3/billers/{biller_code}/items":{"parameters":[{"name":"biller_code","in":"path","required":true,"example":"BIL119","schema":{"type":"string"}}],"get":{"summary":"Get a Bill Information","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Sun, 24 Mar 2024 08:51:21 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"1644"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"66c-AanLt7ucnI6WBydjQSyHeQ\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Get a Bill Information","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"array","items":{"type":"object","properties":{"id":{"type":"integer"},"biller_code":{"type":"string"},"name":{"type":"string"},"default_commission":{"type":"number"},"date_added":{"type":"string","format":"date-time"},"country":{"type":"string"},"is_airtime":{"type":"boolean"},"biller_name":{"type":"string"},"item_code":{"type":"string"},"short_name":{"type":"string"},"fee":{"type":"integer"},"commission_on_fee":{"type":"boolean"},"reg_expression":{"type":"string"},"label_name":{"type":"string"},"amount":{"type":"integer"},"is_resolvable":{"type":"boolean"},"group_name":{"type":"string"},"category_name":{"type":"string"},"is_data":{"nullable":true},"default_commission_on_amount":{"nullable":true},"commission_on_fee_or_amount":{"nullable":true},"validity_period":{"nullable":true}}}}}},"example":{"status":"success","message":"Bill items fetched successfully","data":[{"id":34,"biller_code":"BIL119","name":"DSTV Payment","default_commission":0.1,"date_added":"2020-09-17T15:56:58.057Z","country":"NG","is_airtime":false,"biller_name":"DSTV Payment","item_code":"CB140","short_name":"DSTV Premium","fee":100,"commission_on_fee":true,"reg_expression":"^[0-9]+$","label_name":"SmartCard Number","amount":14600,"is_resolvable":true,"group_name":"DSTV","category_name":"Cable Bill Payment","is_data":null,"default_commission_on_amount":null,"commission_on_fee_or_amount":null,"validity_period":null},{"id":35,"biller_code":"BIL119","name":"DSTV","default_commission":0.1,"date_added":"2020-09-17T15:56:58.057Z","country":"NG","is_airtime":false,"biller_name":"DSTV Access","item_code":"CB141","short_name":"DSTV Access","fee":100,"commission_on_fee":true,"reg_expression":"^[0-9]+$","label_name":"SmartCard Number","amount":1800,"is_resolvable":true,"group_name":"DSTV","category_name":"Cable Bill Payment","is_data":null,"default_commission_on_amount":null,"commission_on_fee_or_amount":null,"validity_period":null},{"id":91,"biller_code":"BIL119","name":"DSTV","default_commission":0.1,"date_added":"2020-09-17T15:56:58.057Z","country":"NG","is_airtime":false,"biller_name":"DSTV Premium","item_code":"CB140","short_name":"DSTV","fee":100,"commission_on_fee":true,"reg_expression":"^[0-9]+$","label_name":"SmartCard Number","amount":14600,"is_resolvable":true,"group_name":"Cable Bill Payment","category_name":"Cable Bill Payment","is_data":null,"default_commission_on_amount":null,"commission_on_fee_or_amount":null,"validity_period":null}]}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Sun, 24 Mar 2024 08:58:19 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"62"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"3e-Bnm4U9Za4fVwiRZc3wHskQ\\""}},"description":"Get a Bill Information - Error response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Invalid Biller code","data":null}}}}}}},"/v3/bill-items/CB141/validate":{"parameters":[],"get":{"summary":"Validate customer details","parameters":[{"name":"code","in":"query","required":false,"example":"BIL119","schema":{"type":"string"}},{"name":"customer","in":"query","required":false,"example":"0025401100","schema":{"type":"integer"}},{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Sun, 24 Mar 2024 09:08:18 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"279"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"117-3UBKI2U2ToNrQOgaw1lG7Q\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Validate customer details","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"response_code":{"type":"string","format":"utc-millisec"},"address":{"nullable":true},"response_message":{"type":"string"},"name":{"type":"string"},"biller_code":{"type":"string"},"customer":{"type":"string","format":"utc-millisec"},"product_code":{"type":"string"},"email":{"nullable":true},"fee":{"type":"integer"},"maximum":{"type":"integer"},"minimum":{"type":"integer"}}}}},"example":{"status":"success","message":"Item validated successfully","data":{"response_code":"00","address":null,"response_message":"Successful","name":"Test DSTV Account","biller_code":"BIL119","customer":"0025401100","product_code":"CB141","email":null,"fee":0,"maximum":0,"minimum":0}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Sun, 24 Mar 2024 09:09:05 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"62"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"3e-0LS5w9wlDuNUxpO8n+39eA\\""}},"description":"Validate customer details - Error response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Invalid customer id","data":null}}}}}}},"/v3/billers/{biller_code}/items/{item_code}/payment":{"parameters":[{"name":"biller_code","in":"path","required":true,"example":"BIL119","schema":{"type":"string"}},{"name":"item_code","in":"path","required":true,"example":"CB140","schema":{"type":"string"}}],"post":{"summary":"Create a Bill Payment","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Sun, 24 Mar 2024 09:14:17 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"269"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"10d-bvmRMMfyEayLqjKNvd8w2g\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Create a Bill Payment - success","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"phone_number":{"type":"string","format":"utc-millisec"},"amount":{"type":"integer"},"network":{"type":"string"},"code":{"type":"string","format":"color"},"tx_ref":{"type":"string"},"reference":{"type":"string","format":"utc-millisec"},"batch_reference":{"nullable":true},"recharge_token":{"nullable":true},"fee":{"type":"integer"}}}}},"example":{"status":"success","message":"Bill payment successful","data":{"phone_number":"0025401100","amount":1800,"network":"DSTV Payment","code":"200","tx_ref":"CF-FLYAPI-20240324091413750321","reference":"247837898415","batch_reference":null,"recharge_token":null,"fee":100}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 11:13:54 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"71"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"47-KRas8XPLmqFYzZ8fKWOhkA\\""}},"description":"Create a Bill Payment - error","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"No record found for customer","data":null}}}}}}},"/v3/bills/summary":{"parameters":[],"get":{"summary":"Get bill payments summary","parameters":[{"name":"from","in":"query","required":false,"example":"2024-03-15","schema":{"type":"integer"}},{"name":"to","in":"query","required":false,"example":"2024-03-25","schema":{"type":"integer"}},{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Sun, 24 Mar 2024 09:27:13 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"394"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"18a-EePKfdrOrTA0Qvn6ah7V5Q\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Get bill payments summary","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"array","items":{"type":"object","properties":{"currency":{"type":"string"},"sum_bills":{"type":"integer"},"sum_commission":{"type":"integer"},"sum_dstv":{"type":"integer"},"sum_airtime":{"type":"integer"},"sum_ikedc":{"type":"integer"},"sum_firs":{"type":"integer"},"sum_ekedc":{"type":"integer"},"sum_benindisco":{"type":"integer"},"sum_kadunadisco":{"type":"integer"},"sum_data":{"type":"integer"},"count_dstv":{"type":"integer"},"count_airtime":{"type":"integer"},"count_ikedc":{"type":"integer"},"count_ekedc":{"type":"integer"},"count_benindisco":{"type":"integer"},"count_kadunadisco":{"type":"integer"},"count_firs":{"type":"integer"},"count_data":{"type":"integer"}}}}}},"example":{"status":"success","message":"Bill summary fetched successfully","data":[{"currency":"NGN","sum_bills":1910,"sum_commission":30,"sum_dstv":1910,"sum_airtime":0,"sum_ikedc":0,"sum_firs":0,"sum_ekedc":0,"sum_benindisco":0,"sum_kadunadisco":0,"sum_data":0,"count_dstv":3,"count_airtime":0,"count_ikedc":0,"count_ekedc":0,"count_benindisco":0,"count_kadunadisco":0,"count_firs":0,"count_data":0}]}}}}}}},"/v3/bills/{reference}":{"parameters":[{"name":"reference","in":"path","required":true,"example":"CF-FLYAPI-20240324091413750321","schema":{"type":"string"}}],"get":{"summary":"Get a Bill Payment Status","parameters":[{"name":"verbose","in":"query","required":false,"example":"1","schema":{"type":"integer"}},{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Sun, 24 Mar 2024 09:22:41 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"498"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"1f2-Nb0Sbx8e6fEHSJHfyb1kPw\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Get a Bill Payment Status","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"currency":{"type":"string"},"customer_id":{"type":"string","format":"utc-millisec"},"frequency":{"type":"string"},"amount":{"type":"string","format":"utc-millisec"},"fee":{"type":"integer"},"product":{"type":"string"},"product_name":{"type":"string"},"commission":{"type":"integer"},"transaction_date":{"type":"string","format":"date-time"},"customer_reference":{"type":"string"},"country":{"type":"string"},"flw_ref":{"type":"string","format":"utc-millisec"},"tx_ref":{"type":"string"},"batch_id":{"type":"integer"},"extra":{"nullable":true},"product_details":{"type":"string"}}}}},"example":{"status":"success","message":"Bill status fetch successful","data":{"currency":"NGN","customer_id":"0025401100","frequency":"One Time","amount":"1800.00","fee":100,"product":"DSTV Payment","product_name":"DSTV Payment","commission":10,"transaction_date":"2024-03-24T09:14:13.373Z","customer_reference":"d7a004b1-a581-4cd9-89ae-a1f093400","country":"NG","flw_ref":"247837898415","tx_ref":"CF-FLYAPI-20240324091413750321","batch_id":3408739,"extra":null,"product_details":"FLY-API-NG-DSTV Payment"}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Sun, 24 Mar 2024 09:23:10 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"64"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"40-6WHHd91T02Px5ixyLI57gg\\""}},"description":"Get a Bill Payment Status - Error response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Transaction not found","data":null}}}}}}},"/v3/bulk-bills":{"parameters":[],"post":{"summary":"Create Bulk Bills Payment","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"143"},"ETag":{"schema":{"type":"string"},"example":"W/\\"8f-JVj+WK6ApE33or05MSdeBg\\""},"Date":{"schema":{"type":"string"},"example":"Tue, 10 Mar 2020 16:22:10 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Create Bulk Bills Payment - success","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"batch_reference":{"type":"string"}}}}},"example":{"status":"success","message":"Bulk bill Payment was queued for processing","data":{"batch_reference":"CF-BATCH-FLY-API-20200310042210201008"}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 11:17:24 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"106"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"6a-9t41bjaK6SsOzItXf5sO/A\\""}},"description":"Create Bulk Bills Payment - error","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string","format":"style"},"data":{"nullable":true}}},"example":{"status":"error","message":"Please specify the following parameters in body: bulk_reference","data":null}}}}}}},"/v3/bills/history":{"parameters":[],"get":{"summary":"Get bill payments history","parameters":[{"name":"status","in":"query","required":false,"schema":{"type":"string"}},{"name":"from","in":"query","required":false,"schema":{"type":"string"}},{"name":"to","in":"query","required":false,"schema":{"type":"string"}},{"name":"page","in":"query","required":false,"schema":{"type":"string"}},{"name":"limit","in":"query","required":false,"schema":{"type":"string"}},{"name":"reference","in":"query","required":false,"schema":{"type":"string"}},{"name":"batch_reference","in":"query","required":false,"schema":{"type":"string"}},{"name":"category","in":"query","required":false,"schema":{"type":"string"}},{"name":"country","in":"query","required":false,"schema":{"type":"string"}},{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Sun, 24 Mar 2024 09:30:28 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"10831"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"2a4f-e3cbqPaqNFBQUDbQBe4lfA\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Get bill payments history","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"meta":{"type":"object","properties":{"page_info":{"type":"object","properties":{"total":{"type":"integer"},"total_pages":{"type":"integer"},"current_page":{"type":"integer"}}}}},"data":{"type":"array","items":{"type":"object","properties":{"id":{"type":"integer"},"currency":{"type":"string"},"customer_id":{"type":"string","format":"utc-millisec"},"frequency":{"type":"string"},"amount":{"type":"string","format":"utc-millisec"},"category":{"type":"string"},"recurring_payment_id":{"nullable":true},"product":{"type":"string"},"product_name":{"type":"string"},"commission":{"type":"string","format":"utc-millisec"},"transaction_date":{"type":"string","format":"date-time"},"tx_id":{"type":"integer"},"customer_reference":{"type":"string"},"country":{"type":"string"},"flw_ref":{"type":"string","format":"utc-millisec"},"tx_ref":{"type":"string"},"batch_id":{"type":"integer"},"extra":{"nullable":true},"product_details":{"type":"string"},"status":{"type":"string"}}}}}},"example":{"status":"success","message":"Bill history fetched successfully","meta":{"page_info":{"total":173,"total_pages":9,"current_page":1}},"data":[{"id":5513725,"currency":"NGN","customer_id":"0025401100","frequency":"One Time","amount":"10.00","category":"Cable Bill Payment","recurring_payment_id":null,"product":"DSTV Payment","product_name":"DSTV Payment","commission":"10.00","transaction_date":"2024-03-24T09:15:57.487Z","tx_id":5513725,"customer_reference":"d7a004b1-a581-4cd9-89ae-a1f0934019","country":"NG","flw_ref":"247819983666","tx_ref":"CF-FLYAPI-20240324091557857302","batch_id":3408744,"extra":null,"product_details":"FLY-API-NG-DSTV Payment","status":"Successful"},{"id":5513723,"currency":"NGN","customer_id":"0025401100","frequency":"One Time","amount":"100.00","category":"Cable Bill Payment","recurring_payment_id":null,"product":"DSTV Payment","product_name":"DSTV Payment","commission":"10.00","transaction_date":"2024-03-24T09:15:21.373Z","tx_id":5513723,"customer_reference":"d7a004b1-a581-4cd9-89ae-a1f093401","country":"NG","flw_ref":"247853654882","tx_ref":"CF-FLYAPI-20240324091521583423","batch_id":3408741,"extra":null,"product_details":"FLY-API-NG-DSTV Payment","status":"Successful"},{"id":5513721,"currency":"NGN","customer_id":"0025401100","frequency":"One Time","amount":"1800.00","category":"Cable Bill Payment","recurring_payment_id":null,"product":"DSTV Payment","product_name":"DSTV Payment","commission":"10.00","transaction_date":"2024-03-24T09:14:13.373Z","tx_id":5513721,"customer_reference":"d7a004b1-a581-4cd9-89ae-a1f093400","country":"NG","flw_ref":"247837898415","tx_ref":"CF-FLYAPI-20240324091413750321","batch_id":3408739,"extra":null,"product_details":"FLY-API-NG-DSTV Payment","status":"Successful"},{"id":5496445,"currency":"NGN","customer_id":"07034262571","frequency":"One Time","amount":"100.00","category":"Mobile Data Service","recurring_payment_id":null,"product":"MTN 50 MB","product_name":"MTN 50 MB","commission":"0.00","transaction_date":"2024-03-12T14:29:03.963Z","tx_id":5496445,"customer_reference":"ubdbfdyujufbdbuj4599606","country":"NG","flw_ref":"BP17102537459058728","tx_ref":"CF-FLYAPI-20240312022903413856","batch_id":3390053,"extra":null,"product_details":"FLY-API-NG-MTN 50 MB","status":"Successful"},{"id":5496443,"currency":"NGN","customer_id":"07034262571","frequency":"One Time","amount":"100.00","category":"Mobile Data Service","recurring_payment_id":null,"product":"MTN 50 MB","product_name":"MTN 50 MB","commission":"0.00","transaction_date":"2024-03-12T14:28:25.933Z","tx_id":5496443,"customer_reference":"ubdbfdyujufbdbuj459606","country":"NG","flw_ref":"BP17102537078371066","tx_ref":"CF-FLYAPI-20240312022825933153","batch_id":3390050,"extra":null,"product_details":"FLY-API-NG-MTN 50 MB","status":"Successful"},{"id":5496442,"currency":"NGN","customer_id":"07034262571","frequency":"One Time","amount":"50.00","category":"Mobile Data Service","recurring_payment_id":null,"product":"MTN 50 MB","product_name":"MTN 50 MB","commission":"0.00","transaction_date":"2024-03-12T14:28:10.983Z","tx_id":5496442,"customer_reference":"ubdbfdyujufbdbuj45966","country":"NG","flw_ref":"CF-FLY-AIR-PREF-20240312022808502255","tx_ref":"RRCF-FLYAPI-20240312022808439291","batch_id":3390048,"extra":null,"product_details":"FLY-API-NG-MTN 50 MB","status":"Reversed"},{"id":5496441,"currency":"NGN","customer_id":"07034262571","frequency":"One Time","amount":"50.00","category":"Mobile Data Service","recurring_payment_id":null,"product":"MTN 50 MB","product_name":"MTN 50 MB","commission":"0.00","transaction_date":"2024-03-12T14:28:08.487Z","tx_id":5496441,"customer_reference":"ubdbfdyujufbdbuj45966","country":"NG","flw_ref":"CF-FLY-AIR-PREF-20240312022808502255","tx_ref":"CF-FLYAPI-20240312022808439291","batch_id":3390048,"extra":null,"product_details":"FLY-API-NG-MTN 50 MB","status":"Failed"},{"id":5455976,"currency":"NGN","customer_id":"07034262571","frequency":"One Time","amount":"50.00","category":"Mobile Data Service","recurring_payment_id":null,"product":"MTN 50 MB","product_name":"MTN 50 MB","commission":"0.00","transaction_date":"2024-02-26T16:01:03.65Z","tx_id":5455976,"customer_reference":"ubdbfdyujufbdbuj4596","country":"NG","flw_ref":"CF-FLY-AIR-PREF-20240226040101634429","tx_ref":"RRCF-FLYAPI-20240226040101271434","batch_id":3347756,"extra":null,"product_details":"FLY-API-NG-MTN 50 MB","status":"Reversed"},{"id":5455975,"currency":"NGN","customer_id":"07034262571","frequency":"One Time","amount":"50.00","category":"Mobile Data Service","recurring_payment_id":null,"product":"MTN 50 MB","product_name":"MTN 50 MB","commission":"0.00","transaction_date":"2024-02-26T16:01:01.547Z","tx_id":5455975,"customer_reference":"ubdbfdyujufbdbuj4596","country":"NG","flw_ref":"CF-FLY-AIR-PREF-20240226040101634429","tx_ref":"CF-FLYAPI-20240226040101271434","batch_id":3347756,"extra":null,"product_details":"FLY-API-NG-MTN 50 MB","status":"Failed"},{"id":5455198,"currency":"NGN","customer_id":"0025401100","frequency":"One Time","amount":"1800.00","category":"Cable Bill Payment","recurring_payment_id":null,"product":"DSTV Access","product_name":"DSTV Access","commission":"10.00","transaction_date":"2024-02-25T13:14:48.607Z","tx_id":5455198,"customer_reference":"930001343294dd029842029152269594939QLc","country":"NG","flw_ref":"247890707841","tx_ref":"CF-FLYAPI-20240225011448737576","batch_id":3346681,"extra":null,"product_details":"FLY-API-NG-DSTV Access","status":"Successful"},{"id":5455148,"currency":"NGN","customer_id":"0025401100","frequency":"One Time","amount":"1800.00","category":"Cable Bill Payment","recurring_payment_id":null,"product":"DSTV Access","product_name":"DSTV Access","commission":"10.00","transaction_date":"2024-02-25T12:42:20.957Z","tx_id":5455148,"customer_reference":"930001343294dd029842029152269594939QLX","country":"NG","flw_ref":"247832798014","tx_ref":"CF-FLYAPI-20240225124220515145","batch_id":3346628,"extra":null,"product_details":"FLY-API-NG-DSTV Access","status":"Successful"},{"id":5454891,"currency":"NGN","customer_id":"0025401100","frequency":"One Time","amount":"100.00","category":"Cable Bill Payment","recurring_payment_id":null,"product":"DSTV Payment","product_name":"DSTV Payment","commission":"10.00","transaction_date":"2024-02-24T22:56:02.1Z","tx_id":5454891,"customer_reference":"93000134832984009929e152269590974093669QLW78779","country":"NG","flw_ref":"247889403828","tx_ref":"CF-FLYAPI-20240224105602334736","batch_id":3346218,"extra":null,"product_details":"FLY-API-NG-DSTV Payment-","status":"Successful"},{"id":5454802,"currency":"NGN","customer_id":"07034262571","frequency":"One Time","amount":"100.00","category":"Mobile Data Service","recurring_payment_id":null,"product":"MTN 50 MB","product_name":"MTN 50 MB","commission":"0.00","transaction_date":"2024-02-24T21:36:59.257Z","tx_id":5454802,"customer_reference":"ubdbfdyujufbdbuj459","country":"NG","flw_ref":"BP17088106212473913","tx_ref":"CF-FLYAPI-20240224093659138480","batch_id":3346113,"extra":null,"product_details":"FLY-API-NG-MTN 50 MB","status":"Successful"},{"id":5454799,"currency":"NGN","customer_id":"0025401100","frequency":"One Time","amount":"100.00","category":"Cable Bill Payment","recurring_payment_id":null,"product":"DSTV Payment","product_name":"DSTV Payment","commission":"10.00","transaction_date":"2024-02-24T21:29:48.517Z","tx_id":5454799,"customer_reference":"9300013483294009929e152269590974093669QLW78779","country":"NG","flw_ref":"247874110665","tx_ref":"CF-FLYAPI-20240224092948984630","batch_id":3346109,"extra":null,"product_details":"FLY-API-NG-DSTV Payment-","status":"Successful"},{"id":5454718,"currency":"NGN","customer_id":"0025401100","frequency":"One Time","amount":"100.00","category":"Cable Bill Payment","recurring_payment_id":null,"product":"DSTV Payment","product_name":"DSTV Payment","commission":"0.00","transaction_date":"2024-02-24T20:45:34.467Z","tx_id":5454718,"customer_reference":"9300013483294009929e15226959974093669QLW78779","country":"NG","flw_ref":"247803305223","tx_ref":"CF-FLYAPI-20240224084534325983","batch_id":3346023,"extra":null,"product_details":"FLY-API-NG-DSTV Payment-","status":"Successful"},{"id":5454716,"currency":"NGN","customer_id":"07034262571","frequency":"One Time","amount":"100.00","category":"Mobile Data Service","recurring_payment_id":null,"product":"MTN 50 MB","product_name":"MTN 50 MB","commission":"0.00","transaction_date":"2024-02-24T20:40:35.517Z","tx_id":5454716,"customer_reference":"ubdbfdyujufbdbuj45","country":"NG","flw_ref":"BP17088072372245421","tx_ref":"CF-FLYAPI-20240224084035883973","batch_id":3346020,"extra":null,"product_details":"FLY-API-NG-MTN 50 MB","status":"Successful"},{"id":5454715,"currency":"NGN","customer_id":"07034262571","frequency":"One Time","amount":"50.00","category":"Mobile Data Service","recurring_payment_id":null,"product":"MTN 50 MB","product_name":"MTN 50 MB","commission":"0.00","transaction_date":"2024-02-24T20:37:55.987Z","tx_id":5454715,"customer_reference":"TREF-1708807072128","country":"NG","flw_ref":"CF-FLY-AIR-PREF-20240224083756520515","tx_ref":"CF-FLYAPI-20240224083755938106","batch_id":3346018,"extra":null,"product_details":"FLY-API-NG-MTN 50 MB","status":"Pending"},{"id":5454714,"currency":"NGN","customer_id":"07034262571","frequency":"One Time","amount":"50.00","category":"Mobile Data Service","recurring_payment_id":null,"product":"MTN 50 MB","product_name":"MTN 50 MB","commission":"0.00","transaction_date":"2024-02-24T20:36:07.58Z","tx_id":5454714,"customer_reference":"TREF-1708806963914","country":"NG","flw_ref":"CF-FLY-AIR-PREF-20240224083607814318","tx_ref":"CF-FLYAPI-20240224083607354390","batch_id":3346017,"extra":null,"product_details":"FLY-API-NG-MTN 50 MB","status":"Pending"},{"id":5453506,"currency":"NGN","customer_id":"07034262571","frequency":"One Time","amount":"50.00","category":"Internet Service","recurring_payment_id":null,"product":"MTN Hynet Payment","product_name":"MTN Hynet Payment","commission":"0.00","transaction_date":"2024-02-23T11:38:49.257Z","tx_id":5453506,"customer_reference":"TREF-1708688326233","country":"NG","flw_ref":"CF-FLY-AIR-PREF-20240223113849392237","tx_ref":"CF-FLYAPI-20240223113849309445","batch_id":3344450,"extra":null,"product_details":"FLY-API-NG-MTN Hynet Payment","status":"Pending"},{"id":5453105,"currency":"NGN","customer_id":"07034262571","frequency":"One Time","amount":"100.00","category":"Mobile Data Service","recurring_payment_id":null,"product":"MTN 50 MB","product_name":"MTN 50 MB","commission":"0.00","transaction_date":"2024-02-22T18:22:37.587Z","tx_id":5453105,"customer_reference":"TREF-1708626155290","country":"NG","flw_ref":"BP17086261601217338","tx_ref":"CF-FLYAPI-20240222062237455821","batch_id":3343882,"extra":null,"product_details":"FLY-API-NG-MTN 50 MB","status":"Successful"}]}}}}}}},"/v3/banks/{country}":{"parameters":[{"name":"country","in":"path","required":true,"example":"NG","schema":{"type":"string"}}],"get":{"summary":"Get all Banks","parameters":[],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Tue, 19 Mar 2024 09:02:32 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"35778"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"8bc2-Ttm3Cclv/kOeLsG5LS9MWw\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Get all NG Banks","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"array","items":{"type":"object","properties":{"id":{"type":"integer"},"code":{"type":"string","format":"color"},"name":{"type":"string"}}}}}},"example":{"status":"success","message":"Banks fetched successfully","data":[{"id":132,"code":"560","name":"Page MFBank"},{"id":133,"code":"304","name":"Stanbic Mobile Money"},{"id":134,"code":"308","name":"FortisMobile"},{"id":135,"code":"328","name":"TagPay"},{"id":136,"code":"309","name":"FBNMobile"},{"id":137,"code":"011","name":"First Bank of Nigeria"},{"id":138,"code":"326","name":"Sterling Mobile"},{"id":139,"code":"990","name":"Omoluabi Mortgage Bank"},{"id":140,"code":"311","name":"ReadyCash (Parkway)"},{"id":141,"code":"057","name":"Zenith Bank"},{"id":142,"code":"068","name":"Standard Chartered Bank"},{"id":143,"code":"306","name":"eTranzact"},{"id":144,"code":"070","name":"Fidelity Bank"},{"id":145,"code":"023","name":"CitiBank"},{"id":146,"code":"215","name":"Unity Bank"},{"id":147,"code":"323","name":"Access Money"},{"id":148,"code":"302","name":"Eartholeum"},{"id":149,"code":"324","name":"Hedonmark"},{"id":150,"code":"325","name":"MoneyBox"},{"id":151,"code":"301","name":"JAIZ Bank"},{"id":152,"code":"050","name":"Ecobank Plc"},{"id":153,"code":"307","name":"EcoMobile"},{"id":154,"code":"318","name":"Fidelity Mobile"},{"id":155,"code":"319","name":"TeasyMobile"},{"id":156,"code":"999","name":"NIP Virtual Bank"},{"id":157,"code":"320","name":"VTNetworks"},{"id":158,"code":"221","name":"Stanbic IBTC Bank"},{"id":159,"code":"501","name":"Fortis Microfinance Bank"},{"id":160,"code":"329","name":"PayAttitude Online"},{"id":161,"code":"322","name":"ZenithMobile"},{"id":162,"code":"303","name":"ChamsMobile"},{"id":163,"code":"403","name":"SafeTrust Mortgage Bank"},{"id":164,"code":"551","name":"Covenant Microfinance Bank"},{"id":165,"code":"415","name":"Imperial Homes Mortgage Bank"},{"id":166,"code":"552","name":"NPF MicroFinance Bank"},{"id":167,"code":"526","name":"Parralex"},{"id":168,"code":"035","name":"Wema Bank"},{"id":169,"code":"084","name":"Enterprise Bank"},{"id":170,"code":"063","name":"Diamond Bank"},{"id":171,"code":"305","name":"Paycom"},{"id":172,"code":"100","name":"SunTrust Bank"},{"id":173,"code":"317","name":"Cellulant"},{"id":174,"code":"401","name":"ASO Savings and & Loans"},{"id":175,"code":"030","name":"Heritage"},{"id":176,"code":"402","name":"Jubilee Life Mortgage Bank"},{"id":177,"code":"058","name":"GTBank Plc"},{"id":178,"code":"032","name":"Union Bank"},{"id":179,"code":"232","name":"Sterling Bank"},{"id":180,"code":"076","name":"Polaris Bank"},{"id":181,"code":"082","name":"Keystone Bank"},{"id":182,"code":"327","name":"Pagatech"},{"id":183,"code":"559","name":"Coronation Merchant Bank"},{"id":184,"code":"601","name":"FSDH"},{"id":185,"code":"313","name":"Mkudi"},{"id":186,"code":"214","name":"First City Monument Bank"},{"id":187,"code":"314","name":"FET"},{"id":188,"code":"523","name":"Trustbond"},{"id":189,"code":"315","name":"GTMobile"},{"id":190,"code":"033","name":"United Bank for Africa"},{"id":191,"code":"044","name":"Access Bank"},{"id":567,"code":"90115","name":"TCF MFB"},{"id":1413,"code":"090175","name":"Test bank"},{"id":1731,"code":"103","name":"Globus Bank"},{"id":1800,"code":"000019","name":"Enterprise Bank"},{"id":1801,"code":"000025","name":"Titan Trust Bank"},{"id":1802,"code":"000026","name":"Taj Bank Limited"},{"id":1803,"code":"000028","name":"Central Bank Of Nigeria"},{"id":1804,"code":"000029","name":"Lotus Bank"},{"id":1805,"code":"000030","name":"Parallex Bank"},{"id":1806,"code":"000031","name":"PremiumTrust Bank"},{"id":1807,"code":"000033","name":"ENaira"},{"id":1808,"code":"000034","name":"SIGNATURE BANK"},{"id":1809,"code":"000036","name":"Optimus Bank"},{"id":1810,"code":"050001","name":"County Finance Ltd"},{"id":1811,"code":"050002","name":"Fewchore Finance Company Limited"},{"id":1812,"code":"050003","name":"Sagegrey Finance Limited"},{"id":1813,"code":"050004","name":"Newedge Finance Ltd"},{"id":1814,"code":"050005","name":"Aaa Finance"},{"id":1815,"code":"050006","name":"Branch International Financial Services"},{"id":1816,"code":"050007","name":"Tekla Finance Ltd"},{"id":1817,"code":"050008","name":"SIMPLE FINANCE LIMITED"},{"id":1818,"code":"050009","name":"FAST CREDIT"},{"id":1819,"code":"050010","name":"FUNDQUEST FINANCIAL SERVICES LTD"},{"id":1820,"code":"050012","name":"Enco Finance"},{"id":1821,"code":"050013","name":"Dignity Finance"},{"id":1822,"code":"050014","name":"TRINITY FINANCIAL SERVICES LIMITED"},{"id":1823,"code":"060001","name":"Coronation Merchant Bank"},{"id":1824,"code":"060002","name":"FBNQUEST Merchant Bank"},{"id":1825,"code":"060003","name":"Nova Merchant Bank"},{"id":1826,"code":"060004","name":"Greenwich Merchant Bank"},{"id":1827,"code":"070001","name":"NPF MicroFinance Bank"},{"id":1828,"code":"070002","name":"Fortis Microfinance Bank"},{"id":1829,"code":"070006","name":"Covenant Microfinance Bank"},{"id":1830,"code":"070007","name":"Omoluabi savings and loans"},{"id":1831,"code":"070008","name":"Page Financials"},{"id":1832,"code":"070009","name":"Gateway Mortgage Bank"},{"id":1833,"code":"070010","name":"Abbey Mortgage Bank"},{"id":1834,"code":"070011","name":"Refuge Mortgage Bank"},{"id":1835,"code":"070012","name":"Lagos Building Investment Company"},{"id":1836,"code":"070013","name":"Platinum Mortgage Bank"},{"id":1837,"code":"070014","name":"First Generation Mortgage Bank"},{"id":1838,"code":"070015","name":"Brent Mortgage Bank"},{"id":1839,"code":"070016","name":"Infinity Trust Mortgage Bank"},{"id":1840,"code":"070017","name":"Haggai Mortgage Bank Limited"},{"id":1841,"code":"070019","name":"Mayfresh Mortgage Bank"},{"id":1842,"code":"070021","name":"Coop Mortgage Bank"},{"id":1843,"code":"070022","name":"Stb Mortgage Bank"},{"id":1844,"code":"070023","name":"Delta Trust Mortgage Bank"},{"id":1845,"code":"070024","name":"Homebase Mortgage"},{"id":1846,"code":"070025","name":"Akwa Savings & Loans Limited"},{"id":1847,"code":"070026","name":"Fha Mortgage Bank Ltd"},{"id":1848,"code":"080002","name":"Tajwallet"},{"id":1849,"code":"090001","name":"ASOSavings & Loans"},{"id":1850,"code":"090003","name":"Jubilee-Life Mortgage  Bank"},{"id":1851,"code":"090004","name":"Parralex Microfinance bank"},{"id":1852,"code":"090005","name":"Trustbond Mortgage Bank"},{"id":1853,"code":"090006","name":"SafeTrust "},{"id":1854,"code":"090097","name":"Ekondo MFB"},{"id":1855,"code":"090107","name":"FBN Mortgages Limited"},{"id":1856,"code":"090108","name":"New Prudential Bank"},{"id":1857,"code":"090110","name":"VFD Micro Finance Bank"},{"id":1858,"code":"090112","name":"Seed Capital Microfinance Bank"},{"id":1859,"code":"090113","name":"Microvis Microfinance Bank"},{"id":1860,"code":"090114","name":"Empire trust MFB"},{"id":1861,"code":"090115","name":"TCF MFB"},{"id":1862,"code":"090116","name":"AMML MFB"},{"id":1863,"code":"090117","name":"Boctrust Microfinance Bank"},{"id":1864,"code":"090118","name":"IBILE Microfinance Bank"},{"id":1865,"code":"090119","name":"Ohafia Microfinance Bank"},{"id":1866,"code":"090120","name":"Wetland Microfinance Bank"},{"id":1867,"code":"090121","name":"Hasal Microfinance Bank"},{"id":1868,"code":"090122","name":"Gowans Microfinance Bank"},{"id":1869,"code":"090123","name":"Verite Microfinance Bank"},{"id":1870,"code":"090124","name":"Xslnce Microfinance Bank"},{"id":1871,"code":"090125","name":"Regent Microfinance Bank"},{"id":1872,"code":"090126","name":"Fidfund Microfinance Bank"},{"id":1873,"code":"090127","name":"BC Kash Microfinance Bank"},{"id":1874,"code":"090128","name":"Ndiorah Microfinance Bank"},{"id":1875,"code":"090129","name":"Money Trust Microfinance Bank"},{"id":1876,"code":"090130","name":"Consumer Microfinance Bank"},{"id":1877,"code":"090131","name":"Allworkers Microfinance Bank"},{"id":1878,"code":"090132","name":"Richway Microfinance Bank"},{"id":1879,"code":"090133","name":" AL-Barakah Microfinance Bank"},{"id":1880,"code":"090134","name":"Accion Microfinance Bank"},{"id":1881,"code":"090135","name":"Personal Trust Microfinance Bank"},{"id":1882,"code":"090136","name":"Baobab Microfinance Bank"},{"id":1883,"code":"090137","name":"PecanTrust Microfinance Bank"},{"id":1884,"code":"090138","name":"Royal Exchange Microfinance Bank"},{"id":1885,"code":"090139","name":"Visa Microfinance Bank"},{"id":1886,"code":"090140","name":"Sagamu Microfinance Bank"},{"id":1887,"code":"090141","name":"Chikum Microfinance Bank"},{"id":1888,"code":"090142","name":"Yes Microfinance Bank"},{"id":1889,"code":"090143","name":"Apeks Microfinance Bank"},{"id":1890,"code":"090144","name":"CIT Microfinance Bank"},{"id":1891,"code":"090145","name":"Fullrange Microfinance Bank"},{"id":1892,"code":"090146","name":"Trident Microfinance Bank"},{"id":1893,"code":"090147","name":"Hackman Microfinance Bank"},{"id":1894,"code":"090148","name":"Bowen Microfinance Bank"},{"id":1895,"code":"090149","name":"IRL Microfinance Bank"},{"id":1896,"code":"090150","name":"Virtue Microfinance Bank"},{"id":1897,"code":"090151","name":"Mutual Trust Microfinance Bank"},{"id":1898,"code":"090152","name":"Nagarta Microfinance Bank"},{"id":1899,"code":"090153","name":"FFS Microfinance Bank"},{"id":1900,"code":"090154","name":"CEMCS Microfinance Bank"},{"id":1901,"code":"090155","name":"La  Fayette Microfinance Bank"},{"id":1902,"code":"090156","name":"e-Barcs Microfinance Bank"},{"id":1903,"code":"090157","name":"Infinity Microfinance Bank"},{"id":1904,"code":"090158","name":"Futo Microfinance Bank"},{"id":1905,"code":"090159","name":"Credit Afrique Microfinance Bank"},{"id":1906,"code":"090160","name":"Addosser Microfinance Bank"},{"id":1907,"code":"090161","name":"Okpoga Microfinance Bank"},{"id":1908,"code":"090162","name":"Stanford Microfinance Bak"},{"id":1909,"code":"090163","name":"First Multiple Microfinance Bank"},{"id":1910,"code":"090164","name":"First Royal Microfinance Bank"},{"id":1911,"code":"090165","name":"Petra Microfinance Bank"},{"id":1912,"code":"090166","name":"Eso-E Microfinance Bank"},{"id":1913,"code":"090167","name":"Daylight Microfinance Bank"},{"id":1914,"code":"090168","name":"Gashua Microfinance Bank"},{"id":1915,"code":"090169","name":"Alpha Kapital Microfinance Bank"},{"id":1916,"code":"090170","name":"Rahama Microfinance Bank"},{"id":1917,"code":"090171","name":"Mainstreet Microfinance Bank"},{"id":1918,"code":"090172","name":"Astrapolaris Microfinance Bank"},{"id":1919,"code":"090173","name":"Reliance Microfinance Bank"},{"id":1920,"code":"090174","name":"Malachy Microfinance Bank"},{"id":1921,"code":"090176","name":"Bosak Microfinance Bank"},{"id":1922,"code":"090177","name":"Lapo Microfinance Bank"},{"id":1923,"code":"090178","name":"GreenBank Microfinance Bank"},{"id":1924,"code":"090179","name":"FAST Microfinance Bank"},{"id":1925,"code":"090180","name":"AMJU Unique Microfinance Bank"},{"id":1926,"code":"090181","name":"Balogun Fulani  Microfinance Bank"},{"id":1927,"code":"090182","name":"Standard Microfinance Bank"},{"id":1928,"code":"090186","name":"Girei Microfinance Bank"},{"id":1929,"code":"090188","name":"Baines Credit Microfinance Bank"},{"id":1930,"code":"090189","name":"Esan Microfinance Bank"},{"id":1931,"code":"090190","name":"Mutual Benefits Microfinance Bank"},{"id":1932,"code":"090191","name":"KCMB Microfinance Bank"},{"id":1933,"code":"090192","name":"Midland Microfinance Bank"},{"id":1934,"code":"090193","name":"Unical Microfinance Bank"},{"id":1935,"code":"090194","name":"NIRSAL Microfinance Bank"},{"id":1936,"code":"090195","name":"Grooming Microfinance Bank"},{"id":1937,"code":"090196","name":"Pennywise Microfinance Bank"},{"id":1938,"code":"090197","name":"ABU Microfinance Bank"},{"id":1939,"code":"090198","name":"RenMoney Microfinance Bank"},{"id":1940,"code":"090201","name":"Xpress Payments"},{"id":1941,"code":"090202","name":"Accelerex Network"},{"id":1942,"code":"090205","name":"New Dawn Microfinance Bank"},{"id":1943,"code":"090211","name":"Itex Integrated Services Limited"},{"id":1944,"code":"090251","name":"UNN MFB"},{"id":1945,"code":"090252","name":"Yobe Microfinance Bank"},{"id":1946,"code":"090254","name":"Coalcamp Microfinance Bank"},{"id":1947,"code":"090258","name":"Imo State Microfinance Bank"},{"id":1948,"code":"090259","name":"Alekun Microfinance Bank"},{"id":1949,"code":"090260","name":"Above Only Microfinance Bank"},{"id":1950,"code":"090261","name":"Quickfund Microfinance Bank"},{"id":1951,"code":"090262","name":"Stellas Microfinance Bank"},{"id":1952,"code":"090263","name":"Navy Microfinance Bank"},{"id":1953,"code":"090264","name":"Auchi Microfinance Bank"},{"id":1954,"code":"090265","name":"Lovonus Microfinance Bank"},{"id":1955,"code":"090266","name":"Uniben Microfinance Bank"},{"id":1956,"code":"090267","name":"Kuda"},{"id":1957,"code":"090268","name":"Adeyemi College Staff Microfinance Bank"},{"id":1958,"code":"090269","name":"Greenville Microfinance Bank"},{"id":1959,"code":"090270","name":"AB Microfinance Bank"},{"id":1960,"code":"090271","name":"Lavender Microfinance Bank"},{"id":1961,"code":"090272","name":"Olabisi Onabanjo University Microfinance Bank"},{"id":1962,"code":"090273","name":"Emeralds Microfinance Bank"},{"id":1963,"code":"090274","name":"Prestige Microfinance Bank"},{"id":1964,"code":"090275","name":"Meridian Microfinance Bank"},{"id":1965,"code":"090276","name":"Trustfund Microfinance Bank"},{"id":1966,"code":"090277","name":"Al-Hayat Microfinance Bank"},{"id":1967,"code":"090278","name":"Glory Microfinance Bank "},{"id":1968,"code":"090279","name":"Ikire Microfinance Bank"},{"id":1969,"code":"090280","name":"Megapraise Microfinance Bank"},{"id":1970,"code":"090281","name":"Mint-Finex MICROFINANCE BANK"},{"id":1971,"code":"090282","name":"Arise Microfinance Bank"},{"id":1972,"code":"090283","name":"Thrive Microfinance Bank"},{"id":1973,"code":"090285","name":"First Option Microfinance Bank"},{"id":1974,"code":"090286","name":"Safe Haven MFB"},{"id":1975,"code":"090287","name":"Assets Matrix Microfinance Bank"},{"id":1976,"code":"090289","name":"Pillar Microfinance Bank"},{"id":1977,"code":"090290","name":"Fct Microfinance Bank"},{"id":1978,"code":"090291","name":"Halacredit Microfinance Bank"},{"id":1979,"code":"090292","name":"Afekhafe Microfinance Bank"},{"id":1980,"code":"090293","name":"Brethren Microfinance Bank"},{"id":1981,"code":"090294","name":"Eagle Flight Microfinance Bank"},{"id":1982,"code":"090295","name":"Omiye Microfinance Bank"},{"id":1983,"code":"090296","name":"Polyuwanna Microfinance Bank"},{"id":1984,"code":"090297","name":"Alert Microfinance Bank"},{"id":1985,"code":"090298","name":"Federalpoly Nasarawamfb"},{"id":1986,"code":"090299","name":"Kontagora Microfinance Bank"},{"id":1987,"code":"090302","name":"Sunbeam Microfinance Bank"},{"id":1988,"code":"090303","name":"Purplemoney Microfinance Bank"},{"id":1989,"code":"090304","name":"Evangel Microfinance Bank"},{"id":1990,"code":"090305","name":"Sulsap Microfinance Bank"},{"id":1991,"code":"090307","name":"Aramoko Microfinance Bank"},{"id":1992,"code":"090308","name":"Brightway Microfinance Bank"},{"id":1993,"code":"090310","name":"Edfin Microfinance Bank"},{"id":1994,"code":"090315","name":"U And C Microfinance Bank"},{"id":1995,"code":"090316","name":"Bayero Microfinance Bank"},{"id":1996,"code":"090317","name":"PatrickGold Microfinance Bank"},{"id":1997,"code":"090318","name":"Federal University Dutse  Microfinance Bank"},{"id":1998,"code":"090319","name":"Bonghe Microfinance Bank"},{"id":1999,"code":"090320","name":"Kadpoly Microfinance Bank"},{"id":2000,"code":"090321","name":"Mayfair  Microfinance Bank"},{"id":2001,"code":"090322","name":"Rephidim Microfinance Bank"},{"id":2002,"code":"090323","name":"Mainland Microfinance Bank"},{"id":2003,"code":"090324","name":"Ikenne Microfinance Bank"},{"id":2004,"code":"090325","name":"Sparkle"},{"id":2005,"code":"090326","name":"Balogun Gambari Microfinance Bank"},{"id":2006,"code":"090327","name":"Trust Microfinance Bank"},{"id":2007,"code":"090328","name":"Eyowo MFB"},{"id":2008,"code":"090329","name":"Neptune Microfinance Bank"},{"id":2009,"code":"090330","name":"Fame Microfinance Bank"},{"id":2010,"code":"090331","name":"Unaab Microfinance Bank"},{"id":2011,"code":"090332","name":"Evergreen Microfinance Bank"},{"id":2012,"code":"090333","name":"Oche Microfinance Bank"},{"id":2013,"code":"090335","name":"Grant MF Bank"},{"id":2014,"code":"090336","name":"Bipc Microfinance Bank"},{"id":2015,"code":"090337","name":"Iyeru Okin Microfinance Bank Ltd"},{"id":2016,"code":"090338","name":"Uniuyo Microfinance Bank"},{"id":2017,"code":"090340","name":"Stockcorp  Microfinance Bank"},{"id":2018,"code":"090341","name":"Unilorin Microfinance Bank"},{"id":2019,"code":"090343","name":"Citizen Trust Microfinance Bank Ltd"},{"id":2020,"code":"090345","name":"Oau Microfinance Bank Ltd"},{"id":2021,"code":"090349","name":"Nasarawa Microfinance Bank"},{"id":2022,"code":"090350","name":"Illorin Microfinance Bank"},{"id":2023,"code":"090352","name":"Jessefield Microfinance Bank"},{"id":2024,"code":"090353","name":"Isuofia Microfinance Bank"},{"id":2025,"code":"090360","name":"Cashconnect   Microfinance Bank"},{"id":2026,"code":"090362","name":"Molusi Microfinance Bank"},{"id":2027,"code":"090363","name":"Headway Microfinance Bank"},{"id":2028,"code":"090364","name":"Nuture Microfinance Bank"},{"id":2029,"code":"090365","name":"Corestep Microfinance Bank"},{"id":2030,"code":"090366","name":"Firmus MFB"},{"id":2031,"code":"090369","name":"Seedvest Microfinance Bank"},{"id":2032,"code":"090370","name":"Ilasan Microfinance Bank"},{"id":2033,"code":"090371","name":"Agosasa Microfinance Bank"},{"id":2034,"code":"090372","name":"Legend Microfinance Bank"},{"id":2035,"code":"090373","name":"Tf Microfinance Bank"},{"id":2036,"code":"090374","name":"Coastline Microfinance Bank"},{"id":2037,"code":"090376","name":"Apple  Microfinance Bank"},{"id":2038,"code":"090377","name":"Isaleoyo Microfinance Bank"},{"id":2039,"code":"090378","name":"New Golden Pastures Microfinance Bank"},{"id":2040,"code":"090379","name":"Peniel Micorfinance Bank Ltd"},{"id":2041,"code":"090380","name":"Kredi Money Microfinance Bank"},{"id":2042,"code":"090383","name":"Manny Microfinance bank"},{"id":2043,"code":"090385","name":"Gti  Microfinance Bank"},{"id":2044,"code":"090386","name":"Interland Microfinance Bank"},{"id":2045,"code":"090389","name":"Ek-Reliable Microfinance Bank"},{"id":2046,"code":"090390","name":"Parkway Mf Bank"},{"id":2047,"code":"090391","name":"Davodani  Microfinance Bank"},{"id":2048,"code":"090392","name":"Mozfin Microfinance Bank"},{"id":2049,"code":"090393","name":"BRIDGEWAY MICROFINANCE BANK"},{"id":2050,"code":"090394","name":"Amac Microfinance Bank"},{"id":2051,"code":"090395","name":"Borgu Microfinance Bank"},{"id":2052,"code":"090396","name":"Oscotech Microfinance Bank"},{"id":2053,"code":"090397","name":"Chanelle Bank"},{"id":2054,"code":"090398","name":"Federal Polytechnic Nekede Microfinance Bank"},{"id":2055,"code":"090399","name":"Nwannegadi Microfinance Bank"},{"id":2056,"code":"090400","name":"Finca Microfinance Bank"},{"id":2057,"code":"090401","name":"Shepherd Trust Microfinance Bank"},{"id":2058,"code":"090402","name":"Peace Microfinance Bank"},{"id":2059,"code":"090403","name":"Uda Microfinance Bank"},{"id":2060,"code":"090404","name":"Olowolagba Microfinance Bank"},{"id":2061,"code":"090405","name":"Moniepoint Microfinance Bank"},{"id":2062,"code":"090406","name":"Business Support Microfinance Bank"},{"id":2063,"code":"090408","name":"Gmb Microfinance Bank"},{"id":2064,"code":"090409","name":"Fcmb Microfinance Bank"},{"id":2065,"code":"090410","name":"Maritime Microfinance Bank"},{"id":2066,"code":"090411","name":"Giginya Microfinance Bank"},{"id":2067,"code":"090412","name":"Preeminent Microfinance Bank"},{"id":2068,"code":"090413","name":"Benysta Microfinance Bank"},{"id":2069,"code":"090414","name":"Crutech  Microfinance Bank"},{"id":2070,"code":"090415","name":"Calabar Microfinance Bank"},{"id":2071,"code":"090416","name":"Chibueze Microfinance Bank"},{"id":2072,"code":"090417","name":"Imowo Microfinance Bank"},{"id":2073,"code":"090418","name":"Highland Microfinance Bank"},{"id":2074,"code":"090419","name":"Winview Bank"},{"id":2075,"code":"090420","name":"Letshego MFB"},{"id":2076,"code":"090421","name":"Izon Microfinance Bank"},{"id":2077,"code":"090422","name":"Landgold  Microfinance Bank"},{"id":2078,"code":"090423","name":"MAUTECH Microfinance Bank"},{"id":2079,"code":"090424","name":"Abucoop  Microfinance Bank"},{"id":2080,"code":"090425","name":"Banex Microfinance Bank"},{"id":2081,"code":"090426","name":"Tangerine Bank"},{"id":2082,"code":"090427","name":"Ebsu Microfinance Bank"},{"id":2083,"code":"090428","name":"Ishie  Microfinance Bank"},{"id":2084,"code":"090429","name":"Crossriver  Microfinance Bank"},{"id":2085,"code":"090430","name":"Ilora Microfinance Bank"},{"id":2086,"code":"090431","name":"Bluewhales  Microfinance Bank"},{"id":2087,"code":"090432","name":"Memphis Microfinance Bank"},{"id":2088,"code":"090433","name":"Rigo Microfinance Bank"},{"id":2089,"code":"090434","name":"Insight Microfinance Bank"},{"id":2090,"code":"090435","name":"Links Microfinance Bank"},{"id":2091,"code":"090436","name":"Spectrum Microfinance Bank"},{"id":2092,"code":"090437","name":"Oakland Microfinance Bank"},{"id":2093,"code":"090438","name":"Futminna Microfinance Bank"},{"id":2094,"code":"090439","name":"Ibeto  Microfinance Bank"},{"id":2095,"code":"090440","name":"Cherish Microfinance Bank"},{"id":2096,"code":"090441","name":"Giwa Microfinance Bank"},{"id":2097,"code":"090443","name":"Rima Microfinance Bank"},{"id":2098,"code":"090444","name":"Boi Mf Bank"},{"id":2099,"code":"090445","name":"Capstone Mf Bank"},{"id":2100,"code":"090446","name":"Support Mf Bank"},{"id":2101,"code":"090448","name":"Moyofade Mf Bank"},{"id":2102,"code":"090449","name":"Sls  Mf Bank"},{"id":2103,"code":"090450","name":"Kwasu Mf Bank"},{"id":2104,"code":"090451","name":"Atbu  Microfinance Bank"},{"id":2105,"code":"090452","name":"Unilag  Microfinance Bank"},{"id":2106,"code":"090453","name":"Uzondu Mf Bank"},{"id":2107,"code":"090454","name":"Borstal Microfinance Bank"},{"id":2108,"code":"090455","name":"MKOBO MICROFINANCE BANK LTD"},{"id":2109,"code":"090456","name":"Ospoly Microfinance Bank"},{"id":2110,"code":"090459","name":"Nice Microfinance Bank"},{"id":2111,"code":"090460","name":"Oluyole Microfinance Bank"},{"id":2112,"code":"090461","name":"Uniibadan Microfinance Bank"},{"id":2113,"code":"090462","name":"Monarch Microfinance Bank"},{"id":2114,"code":"090463","name":"Rehoboth Microfinance Bank"},{"id":2115,"code":"090464","name":"Unimaid Microfinance Bank"},{"id":2116,"code":"090465","name":"Maintrust Microfinance Bank"},{"id":2117,"code":"090466","name":"Yct Microfinance Bank"},{"id":2118,"code":"090467","name":"Good Neighbours Microfinance Bank"},{"id":2119,"code":"090468","name":"Olofin Owena Microfinance Bank"},{"id":2120,"code":"090469","name":"Aniocha Microfinance Bank"},{"id":2121,"code":"090470","name":"DOT MICROFINANCE BANK"},{"id":2122,"code":"090471","name":"Oluchukwu Microfinance Bank"},{"id":2123,"code":"090472","name":"Caretaker Microfinance Bank"},{"id":2124,"code":"090473","name":"Assets Microfinance Bank"},{"id":2125,"code":"090474","name":"Verdant Microfinance Bank"},{"id":2126,"code":"090475","name":"Giant Stride Microfinance Bank"},{"id":2127,"code":"090476","name":"Anchorage Microfinance Bank"},{"id":2128,"code":"090477","name":"Light Microfinance Bank"},{"id":2129,"code":"090478","name":"Avuenegbe Microfinance Bank"},{"id":2130,"code":"090479","name":"First Heritage Microfinance Bank"},{"id":2131,"code":"090480","name":"Cintrust Microfinance Bank"},{"id":2132,"code":"090481","name":"Prisco  Microfinance Bank"},{"id":2133,"code":"090482","name":"FEDETH MICROFINANCE BANK"},{"id":2134,"code":"090483","name":"Ada Microfinance Bank"},{"id":2135,"code":"090484","name":"Garki Microfinance Bank"},{"id":2136,"code":"090485","name":"Safegate Microfinance Bank"},{"id":2137,"code":"090486","name":"Fortress Microfinance Bank"},{"id":2138,"code":"090487","name":"Kingdom College  Microfinance Bank"},{"id":2139,"code":"090488","name":"Ibu-Aje Microfinance"},{"id":2140,"code":"090489","name":"Alvana Microfinance Bank"},{"id":2141,"code":"090490","name":"Chukwunenye  Microfinance Bank"},{"id":2142,"code":"090491","name":"Nsuk  Microfinance Bank"},{"id":2143,"code":"090492","name":"Oraukwu  Microfinance Bank"},{"id":2144,"code":"090493","name":"Iperu Microfinance Bank"},{"id":2145,"code":"090494","name":"Boji Boji Microfinance Bank"},{"id":2146,"code":"090495","name":"GOODNEWS MFB"},{"id":2147,"code":"090496","name":"Radalpha Microfinance Bank"},{"id":2148,"code":"090497","name":"Palmcoast Microfinance Bank"},{"id":2149,"code":"090498","name":"Catland Microfinance Bank"},{"id":2150,"code":"090499","name":"Pristine Divitis Microfinance Bank"},{"id":2151,"code":"090500","name":"Gwong Microfinance Bank"},{"id":2152,"code":"090501","name":"Boromu Microfinance Bank"},{"id":2153,"code":"090502","name":"Shalom Microfinance Bank"},{"id":2154,"code":"090503","name":"Projects Microfinance Bank"},{"id":2155,"code":"090504","name":"Zikora Microfinance Bank"},{"id":2156,"code":"090505","name":"Nigeria Prisonsmicrofinance Bank"},{"id":2157,"code":"090506","name":"Solid Allianze Microfinance Bank"},{"id":2158,"code":"090507","name":"Fims Microfinance Bank"},{"id":2159,"code":"090508","name":"Borno Renaissance Microfinance Bank"},{"id":2160,"code":"090509","name":"Capitalmetriq Swift Microfinance Bank"},{"id":2161,"code":"090510","name":"Umunnachi Microfinance Bank"},{"id":2162,"code":"090511","name":"Cloverleaf  Microfinance Bank"},{"id":2163,"code":"090512","name":"Bubayero Microfinance Bank"},{"id":2164,"code":"090513","name":"Seap Microfinance Bank"},{"id":2165,"code":"090514","name":"Umuchinemere Procredit Microfinance Bank"},{"id":2166,"code":"090515","name":"Rima Growth Pathway Microfinance Bank "},{"id":2167,"code":"090516","name":"Numo Microfinance Bank"},{"id":2168,"code":"090517","name":"Uhuru Microfinance Bank"},{"id":2169,"code":"090518","name":"Afemai Microfinance Bank"},{"id":2170,"code":"090519","name":"Ibom Fadama Microfinance Bank"},{"id":2171,"code":"090520","name":"Ic Globalmicrofinance Bank"},{"id":2172,"code":"090521","name":"Foresight Microfinance Bank"},{"id":2173,"code":"090523","name":"Chase Microfinance Bank"},{"id":2174,"code":"090524","name":"Solidrock Microfinance Bank"},{"id":2175,"code":"090525","name":"Triple A Microfinance Bank"},{"id":2176,"code":"090526","name":"Crescent Microfinance Bank"},{"id":2177,"code":"090527","name":"Ojokoro Microfinance Bank"},{"id":2178,"code":"090528","name":"Mgbidi Microfinance Bank"},{"id":2179,"code":"090529","name":"Ampersand Microfinance Bank"},{"id":2180,"code":"090530","name":"Confidence Microfinance Bank Ltd"},{"id":2181,"code":"090531","name":"Aku Microfinance Bank"},{"id":2182,"code":"090532","name":"Ibolo Micorfinance Bank Ltd"},{"id":2183,"code":"090534","name":"Polyibadan Microfinance Bank"},{"id":2184,"code":"090535","name":"Nkpolu-Ust Microfinance"},{"id":2185,"code":"090536","name":"Ikoyi-Osun Microfinance Bank"},{"id":2186,"code":"090537","name":"Lobrem Microfinance Bank"},{"id":2187,"code":"090538","name":"Blue Investments Microfinance Bank"},{"id":2188,"code":"090539","name":"Enrich Microfinance Bank"},{"id":2189,"code":"090540","name":"Aztec Microfinance Bank"},{"id":2190,"code":"090541","name":"Excellent Microfinance Bank"},{"id":2191,"code":"090542","name":"Otuo Microfinance Bank Ltd"},{"id":2192,"code":"090543","name":"Iwoama Microfinance Bank"},{"id":2193,"code":"090544","name":"Aspire Microfinance Bank Ltd"},{"id":2194,"code":"090545","name":"Abulesoro Microfinance Bank Ltd"},{"id":2195,"code":"090546","name":"Ijebu-Ife Microfinance Bank Ltd"},{"id":2196,"code":"090547","name":"Rockshield Microfinance Bank"},{"id":2197,"code":"090548","name":"Ally Microfinance Bank"},{"id":2198,"code":"090549","name":"Kc Microfinance Bank"},{"id":2199,"code":"090550","name":"Green Energy Microfinance Bank Ltd"},{"id":2200,"code":"090551","name":"Fairmoney Microfinance Bank Ltd"},{"id":2201,"code":"090552","name":"Ekimogun Microfinance Bank"},{"id":2202,"code":"090553","name":"Consistent Trust Microfinance Bank Ltd"},{"id":2203,"code":"090554","name":"Kayvee Microfinance Bank"},{"id":2204,"code":"090555","name":"Bishopgate Microfinance Bank"},{"id":2205,"code":"090556","name":"Egwafin Microfinance Bank Ltd"},{"id":2206,"code":"090557","name":"Lifegate Microfinance Bank Ltd"},{"id":2207,"code":"090558","name":"Shongom Microfinance Bank Ltd"},{"id":2208,"code":"090559","name":"Shield Microfinance Bank Ltd"},{"id":2209,"code":"090560","name":"TANADI MFB (CRUST)"},{"id":2210,"code":"090561","name":"Akuchukwu Microfinance Bank Ltd"},{"id":2211,"code":"090562","name":"Cedar Microfinance Bank Ltd"},{"id":2212,"code":"090563","name":"Balera Microfinance Bank Ltd"},{"id":2213,"code":"090564","name":"Supreme Microfinance Bank Ltd"},{"id":2214,"code":"090565","name":"Oke-Aro Oredegbe Microfinance Bank Ltd"},{"id":2215,"code":"090566","name":"Okuku Microfinance Bank Ltd"},{"id":2216,"code":"090567","name":"Orokam Microfinance Bank Ltd"},{"id":2217,"code":"090568","name":"Broadview Microfinance Bank Ltd"},{"id":2218,"code":"090569","name":"Qube Microfinance Bank Ltd"},{"id":2219,"code":"090570","name":"Iyamoye Microfinance Bank Ltd"},{"id":2220,"code":"090571","name":"Ilaro Poly Microfinance Bank Ltd"},{"id":2221,"code":"090572","name":"Ewt Microfinance Bank"},{"id":2222,"code":"090573","name":"Snow Microfinance Bank"},{"id":2223,"code":"090574","name":"GOLDMAN MICROFINANCE BANK"},{"id":2224,"code":"090575","name":"Firstmidas Microfinance Bank Ltd"},{"id":2225,"code":"090576","name":"Octopus Microfinance Bank Ltd"},{"id":2226,"code":"090578","name":"Iwade Microfinance Bank Ltd"},{"id":2227,"code":"090579","name":"Gbede Microfinance Bank"},{"id":2228,"code":"090580","name":"Otech Microfinance Bank Ltd"},{"id":2229,"code":"090581","name":"BANC CORP MICROFINANCE BANK"},{"id":2230,"code":"090583","name":"STATESIDE MFB"},{"id":2231,"code":"090584","name":"ISLAND MICROFINANCE BANK "},{"id":2232,"code":"090586","name":"GOMBE MICROFINANCE BANK LTD"},{"id":2233,"code":"090587","name":"Microbiz Microfinance Bank"},{"id":2234,"code":"090588","name":"Orisun MFB"},{"id":2235,"code":"090589","name":"Mercury MFB"},{"id":2236,"code":"090590","name":"WAYA MICROFINANCE BANK LTD"},{"id":2237,"code":"090591","name":"Gabsyn Microfinance Bank"},{"id":2238,"code":"090592","name":"KANO POLY MFB"},{"id":2239,"code":"090593","name":"TASUED MICROFINANCE BANK LTD"},{"id":2240,"code":"090598","name":"IBA MFB "},{"id":2241,"code":"090599","name":"Greenacres MFB"},{"id":2242,"code":"090600","name":"AVE MARIA MICROFINANCE BANK LTD"},{"id":2243,"code":"090602","name":"KENECHUKWU MICROFINANCE BANK"},{"id":2244,"code":"090603 ","name":"Macrod MFB"},{"id":2245,"code":"090606","name":"KKU Microfinance Bank"},{"id":2246,"code":"090608","name":"Akpo Microfinance Bank"},{"id":2247,"code":"090609","name":"Ummah Microfinance Bank "},{"id":2248,"code":"090610","name":"AMOYE MICROFINANCE BANK"},{"id":2249,"code":"090611","name":"Creditville Microfinance Bank"},{"id":2250,"code":"090612","name":"Medef Microfinance Bank"},{"id":2251,"code":"090613","name":"Total Trust Microfinance Bank"},{"id":2252,"code":"090614","name":"FLOURISH MFB"},{"id":2253,"code":"090615","name":"Beststar Microfinance Bank"},{"id":2254,"code":"090616","name":"RAYYAN Microfinance Bank"},{"id":2255,"code":"090620","name":"Iyin Ekiti MFB"},{"id":2256,"code":"090621","name":"GIDAUNIYAR ALHERI MICROFINANCE BANK"},{"id":2257,"code":"090623","name":"Mab Allianz MFB"},{"id":2258,"code":"100001","name":"FET"},{"id":2259,"code":"100003","name":"Parkway-ReadyCash"},{"id":2260,"code":"100004","name":"Opay"},{"id":2261,"code":"100005","name":"Cellulant"},{"id":2262,"code":"100006","name":"eTranzact"},{"id":2263,"code":"100007","name":"Stanbic IBTC @ease wallet"},{"id":2264,"code":"100008","name":"Ecobank Xpress Account"},{"id":2265,"code":"100009","name":"GTMobile"},{"id":2266,"code":"100010","name":"TeasyMobile"},{"id":2267,"code":"100011","name":"Mkudi"},{"id":2268,"code":"100012","name":"VTNetworks"},{"id":2269,"code":"100013","name":"AccessMobile"},{"id":2270,"code":"100014","name":"FBNMobile"},{"id":2271,"code":"100015","name":"Kegow"},{"id":2272,"code":"100016","name":"FortisMobile"},{"id":2273,"code":"100017","name":"Hedonmark"},{"id":2274,"code":"100018","name":"ZenithMobile"},{"id":2275,"code":"100019","name":"Fidelity Mobile"},{"id":2276,"code":"100020","name":"MoneyBox"},{"id":2277,"code":"100021","name":"Eartholeum"},{"id":2278,"code":"100022","name":"GoMoney"},{"id":2279,"code":"100023","name":"TagPay"},{"id":2280,"code":"100024","name":"Imperial Homes Mortgage Bank"},{"id":2281,"code":"100025","name":"Zinternet Nigera Limited"},{"id":2282,"code":"100026","name":"One Finance"},{"id":2283,"code":"100027","name":"Intellifin"},{"id":2284,"code":"100028","name":"AG Mortgage Bank"},{"id":2285,"code":"100029","name":"Innovectives Kesh"},{"id":2286,"code":"100030","name":"EcoMobile"},{"id":2287,"code":"100031","name":"FCMB Easy Account"},{"id":2288,"code":"100032","name":"Contec Global Infotech Limited (NowNow)"},{"id":2289,"code":"100033","name":"PALMPAY"},{"id":2290,"code":"100034","name":"Zwallet"},{"id":2291,"code":"100035","name":"M36"},{"id":2292,"code":"100036","name":"Kegow(Chamsmobile)"},{"id":2293,"code":"100039","name":"Titan-Paystack"},{"id":2294,"code":"100052","name":"Beta-Access Yello"},{"id":2295,"code":"101","name":"ProvidusBank PLC"},{"id":2296,"code":"110001","name":"PayAttitude Online"},{"id":2297,"code":"110002","name":"Flutterwave Technology Solutions Limited"},{"id":2298,"code":"110003","name":"Interswitch Limited"},{"id":2299,"code":"110004","name":"First Apple Limited"},{"id":2300,"code":"110005","name":"3Line Card Management Limited"},{"id":2301,"code":"110006","name":"Paystack Payments Limited"},{"id":2302,"code":"110007","name":"TeamApt"},{"id":2303,"code":"110008","name":"Kadick Integration Limited"},{"id":2304,"code":"110009","name":"Venture Garden Nigeria Limited"},{"id":2305,"code":"110010","name":"Interswitch Financial Inclusion Services (Ifis)"},{"id":2306,"code":"110011","name":"Arca Payments"},{"id":2307,"code":"110012","name":"Cellulant Pssp"},{"id":2308,"code":"110013","name":"Qr Payments"},{"id":2309,"code":"110014","name":"Cyberspace Limited"},{"id":2310,"code":"110015","name":"Vas2Nets Limited"},{"id":2311,"code":"110017","name":"Crowdforce"},{"id":2312,"code":"110018","name":"Microsystems Investment And Development Limited"},{"id":2313,"code":"110019","name":"Nibssussd Payments"},{"id":2314,"code":"110021","name":"Bud Infrastructure Limited"},{"id":2315,"code":"110022","name":"Koraypay"},{"id":2316,"code":"110023","name":"Capricorn Digital"},{"id":2317,"code":"110024","name":"Resident Fintech Limited"},{"id":2318,"code":"110025","name":"Netapps Technology Limited"},{"id":2319,"code":"110026","name":"Spay Business"},{"id":2320,"code":"110027","name":"Yello Digital Financial Services"},{"id":2321,"code":"110028","name":"Nomba Financial Services Limited"},{"id":2322,"code":"110029","name":"Woven Finance"},{"id":2323,"code":"110044","name":"Leadremit Limited"},{"id":2324,"code":"120001","name":"9 Payment Service Bank"},{"id":2325,"code":"120002","name":"Hopepsb"},{"id":2326,"code":"120003","name":"Momo Psb"},{"id":2327,"code":"120004","name":"Smartcash Payment Service Bank"},{"id":2328,"code":"120005","name":"Money Master Psb"},{"id":2329,"code":"400001","name":"FSDH Merchant Bank"},{"id":2330,"code":"502","name":"Rand merchant Bank"},{"id":2331,"code":"608","name":"FINATRUST MICROFINANCE BANK"},{"id":2332,"code":"999001","name":"CBN_TSA"},{"id":2333,"code":"999999","name":"NIP Virtual Bank"}]}}}},"404":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 11:20:10 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"74"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"4a-D6SjPRR3mut3vKb0lkGp3A\\""}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"No banks found for country code","data":null}}}}}}},"/v3/banks/{id}/branches":{"parameters":[{"name":"id","in":"path","required":true,"example":"141","schema":{"type":"integer"}}],"get":{"summary":"Get Bank Branches","parameters":[],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Tue, 19 Mar 2024 09:08:04 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"4778"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"12aa-W2IgrM62HkP4MT/IhvI/lA\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Get Bank Branches","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"array","items":{"type":"object","properties":{"id":{"type":"integer"},"branch_code":{"type":"string"},"branch_name":{"type":"string"},"swift_code":{"type":"string"},"bic":{"type":"string"},"bank_id":{"type":"integer"}}}}}},"example":{"status":"success","message":"Bank branches fetched successfully","data":[{"id":992,"branch_code":"GH190101","branch_name":"STANBIC BANK GHANA LTD-ACCRA MAIN","swift_code":"SBICGHAC","bic":"SBICGHACXXX","bank_id":280},{"id":993,"branch_code":"GH190102","branch_name":"STANBIC BANK GHANA LTD-AIRPORT CITY","swift_code":"SBICGHAC","bic":"SBICGHACXXX","bank_id":280},{"id":994,"branch_code":"GH190103","branch_name":"STANBIC BANK GHANA LTD-SPINTEX ROAD","swift_code":"SBICGHAC","bic":"SBICGHACXXX","bank_id":280},{"id":995,"branch_code":"GH190104","branch_name":"STANBIC BANK GHANA LTD-ACCRA MALL","swift_code":"SBICGHAC","bic":"SBICGHACXXX","bank_id":280},{"id":996,"branch_code":"GH190105","branch_name":"STANBIC BANK GHANA -NORTH INDUSTIAL AREA","swift_code":"SBICGHAC","bic":"SBICGHACXXX","bank_id":280},{"id":997,"branch_code":"GH190106","branch_name":"STANBIC BANK GHANA-TEMA INDUSTRIAL AREA","swift_code":"SBICGHAC","bic":"SBICGHACXXX","bank_id":280},{"id":998,"branch_code":"GH190107","branch_name":"STANBIC BANK GHANA LTD-GRAPHIC ROAD","swift_code":"SBICGHAC","bic":"SBICGHACXXX","bank_id":280},{"id":999,"branch_code":"GH190108","branch_name":"STANBIC BANK GHANA LTD-MAKOLA","swift_code":"SBICGHAC","bic":"SBICGHACXXX","bank_id":280},{"id":1000,"branch_code":"GH190109","branch_name":"STANBIC BANK GHANA LTD-RIND ROAD","swift_code":"SBICGHAC","bic":"SBICGHACXXX","bank_id":280},{"id":1001,"branch_code":"GH190110","branch_name":"STANBIC BANK GHANA LTD-ACHIMOTA","swift_code":"SBICGHAC","bic":"SBICGHACXXX","bank_id":280},{"id":1002,"branch_code":"GH190112","branch_name":"STANBIC BANK GHANA LTD-KASOA","swift_code":"SBICGHAC","bic":"SBICGHACXXX","bank_id":280},{"id":1003,"branch_code":"GH190401","branch_name":"STANBIC BANK GHANA LTD-TAKORADI","swift_code":"SBICGHAC","bic":"SBICGHACXXX","bank_id":280},{"id":1004,"branch_code":"GH190402","branch_name":"STANBIC BANK GHANA LTD-TARKWA","swift_code":"SBICGHAC","bic":"SBICGHACXXX","bank_id":280},{"id":1005,"branch_code":"GH190501","branch_name":"STANBIC BANK GHANA LTD-HO","swift_code":"SBICGHAC","bic":"SBICGHACXXX","bank_id":280},{"id":1006,"branch_code":"GH190601","branch_name":"STANBIC BANK GHANA LTD-HARPER-KUMASI","swift_code":"SBICGHAC","bic":"SBICGHACXXX","bank_id":280},{"id":1007,"branch_code":"GH190701","branch_name":"STANBIC BANK GHANA LTD-SUNYANI","swift_code":"SBICGHAC","bic":"SBICGHACXXX","bank_id":280},{"id":1008,"branch_code":"GH190901","branch_name":"STANBIC BANK GHANA LTD-BOLGATANGA","swift_code":"SBICGHAC","bic":"SBICGHACXXX","bank_id":280},{"id":1009,"branch_code":"GH191001","branch_name":"STANBIC BANK GHANA LTD-WA","swift_code":"SBICGHAC","bic":"SBICGHACXXX","bank_id":280},{"id":1010,"branch_code":"GH190113","branch_name":"STANBIC BANK GH LTD - TEMA FISHING HABOUR","swift_code":"SBICGHAC","bic":"SBICGHACXXX","bank_id":280},{"id":1011,"branch_code":"GH190111","branch_name":"STANBIC BANK GHANA LTD-ROMAN RIDGE","swift_code":"SBICGHAC","bic":"SBICGHACXXX","bank_id":280},{"id":1012,"branch_code":"GH190801","branch_name":"STANBIC BANK GHANA LTD-TAMALE","swift_code":"SBICGHAC","bic":"SBICGHACXXX","bank_id":280},{"id":1013,"branch_code":"GH190121","branch_name":"STANBIC BANK -STANBIC HEIGHTS BRANCH","swift_code":"SBICGHAC","bic":"SBICGHACXXX","bank_id":280},{"id":1014,"branch_code":"GH190603","branch_name":"STABIC BANK GHANA LIMITED - ADUM","swift_code":"SBICGHAC","bic":"SBICGHAC","bank_id":280},{"id":1015,"branch_code":"GH190114","branch_name":"STANBIC BANK GHANA LTD-MOVENPICK","swift_code":"SBICGHAC","bic":"SBICGHACXXX","bank_id":280},{"id":1016,"branch_code":"GH190118","branch_name":"STANBIC BANK - MADINA BRANCH","swift_code":"SBICGHAC","bic":"SBICGHAC","bank_id":280},{"id":1017,"branch_code":"GH190602","branch_name":"STANBIC BANK GHANA LTD-SUAME","swift_code":"SBICGHAC","bic":"SBICGHAC","bank_id":280},{"id":1018,"branch_code":"GH190117","branch_name":"STANBIC BANK GHANA LTD- ASHIAMAN","swift_code":"SBICGHAC","bic":"SBICGHAC","bank_id":280},{"id":1019,"branch_code":"GH190125","branch_name":"STANBIC BANK-JUNCTION MALL BRANCH","swift_code":"SBICGHAC","bic":"SBICGHACXXX","bank_id":280},{"id":1020,"branch_code":"GH190120","branch_name":"STANBIC BANK GHANA LTD-LAPAZ","swift_code":"SBICGHAC","bic":"SBICGHACXXX","bank_id":280},{"id":1021,"branch_code":"GH190116","branch_name":"STANBIC BANK GHANA LTD-DANSOMAN","swift_code":"SBICGHAC","bic":"SBICGHACXXX","bank_id":280},{"id":1022,"branch_code":"GH190115","branch_name":"STANBIC MADINA","swift_code":"SBICGHAC","bic":"SBICGHAC","bank_id":280},{"id":1023,"branch_code":"GH190130","branch_name":"STANBIC BANK GHANA LTD - LEGON","swift_code":"SBICGHAC","bic":"SBICGHACXXX","bank_id":280},{"id":1024,"branch_code":"GH190119","branch_name":"STANBIC BANK - EAST LEGON","swift_code":"SBICGHAC","bic":"SBICGHAC","bank_id":280}]}}}},"404":{"headers":{"Date":{"schema":{"type":"string"},"example":"Tue, 19 Mar 2024 09:09:15 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"82"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"52-0Hbp90PKMbTHQFNC2pkopQ\\""}},"description":"No Branches Found Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"No branches found for specified bank id","data":null}}}}}}},"/v3/balances":{"parameters":[],"get":{"summary":"Get Multiple Wallet Balances","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Mon, 18 Mar 2024 10:33:33 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"1961"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"7a9-tgdGIAR9PpDIR1Xrrv2zrg\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Get Multiple Wallet Balances","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"array","items":{"type":"object","properties":{"currency":{"type":"string"},"available_balance":{"type":"number"},"ledger_balance":{"type":"number"}}}}}},"example":{"status":"success","message":"Wallet balances fetched","data":[{"currency":"NGN","available_balance":48717450884.01,"ledger_balance":2146247957.94},{"currency":"KES","available_balance":49984731390.62,"ledger_balance":45759570.43},{"currency":"GHS","available_balance":49999936370.47,"ledger_balance":2469481.98},{"currency":"USD","available_balance":49997158910.89,"ledger_balance":1586272.03},{"currency":"EUR","available_balance":49999786509.4,"ledger_balance":11027.91},{"currency":"ZAR","available_balance":49999996065.13,"ledger_balance":3775401.97},{"currency":"GBP","available_balance":49999995200.9,"ledger_balance":37132.46},{"currency":"TZS","available_balance":50000000424.2,"ledger_balance":28321.55},{"currency":"UGX","available_balance":49961567836.04,"ledger_balance":43543852.13},{"currency":"RWF","available_balance":50000000000,"ledger_balance":9002717.95},{"currency":"ZMW","available_balance":50000000000,"ledger_balance":1085164.56},{"currency":"INR","available_balance":50000000000,"ledger_balance":0},{"currency":"XOF","available_balance":49996967274.81,"ledger_balance":212904.99},{"currency":"MUR","available_balance":50000000000,"ledger_balance":0},{"currency":"ETB","available_balance":50000000000,"ledger_balance":3367},{"currency":"JPY","available_balance":50000000000,"ledger_balance":0},{"currency":"MAD","available_balance":50000000000,"ledger_balance":0},{"currency":"XAF","available_balance":50000005500,"ledger_balance":3189114.21},{"currency":"AUD","available_balance":0,"ledger_balance":186.33},{"currency":"CAD","available_balance":0,"ledger_balance":468.24},{"currency":"MYR","available_balance":0,"ledger_balance":0},{"currency":"CNY","available_balance":0,"ledger_balance":0},{"currency":"BRL","available_balance":0,"ledger_balance":0},{"currency":"eNGN","available_balance":0,"ledger_balance":0},{"currency":"MWK","available_balance":0,"ledger_balance":0},{"currency":"EGP","available_balance":0,"ledger_balance":0}]}}}}}}},"/v3/balances/{currency}":{"parameters":[{"name":"currency","in":"path","required":true,"example":"NGN","schema":{"type":"string"}}],"get":{"summary":"Get a Single Wallet Balance","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"81"},"ETag":{"schema":{"type":"string"},"example":"W/\\"51-fBrUyf9Du3BdAswU6jvK1w\\""},"Date":{"schema":{"type":"string"},"example":"Thu, 30 Jan 2020 08:54:13 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample No Wallet Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"No wallet found for specified currency","data":null}}}}}}},"/v3/accounts/resolve":{"parameters":[],"post":{"summary":"Resolve Account Details","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Mon, 18 Mar 2024 10:40:28 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"126"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"7e-HfKZLluS+tIjyZ+/t1IaGQ\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Resolve Account Details","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"account_name":{"type":"string"},"account_number":{"type":"string","format":"utc-millisec"}}}}},"example":{"status":"success","message":"Account details fetched","data":{"account_name":"Forrest Green","account_number":"0690000031"}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Mon, 18 Mar 2024 10:43:50 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"58"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"3a-u8vzT4Bm0IRNEQ/LOidFlQ\\""}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"invalid account","data":null}}}}}}},"/v3/card-bins/{bin}":{"parameters":[{"name":"bin","in":"path","required":true,"example":"539983","schema":{"type":"integer"}}],"get":{"summary":"Resolve Card Bin","parameters":[],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Mon, 18 Mar 2024 10:58:04 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"200"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"c8-q1DUmQF6fVnh1Lsr3P/CMg\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Resolve Card Bin","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"issuing_country":{"type":"string"},"bin":{"type":"string","format":"color"},"card_type":{"type":"string"},"issuer_info":{"type":"string"}}}}},"example":{"status":"success","message":"completed","data":{"issuing_country":" NIGERIA NG","bin":"539983","card_type":"MASTERCARD","issuer_info":"MASTERCARD GUARANTY TRUST BANK Mastercard Naira Debit Card  "}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 11:58:11 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"156"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"9c-FZyNvujojm3J6oKO4oqnbw\\""}},"description":"Bin Not Found","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"nigerian_card":{"type":"boolean"},"response_code":{"type":"string"},"response_message":{"type":"string"},"transaction_reference":{"nullable":true}}}}},"example":{"status":"error","message":"completed","data":{"nigerian_card":false,"response_code":"RR","response_message":"BIN not Found","transaction_reference":null}}}}}}}},"/v3/wallet/statement":{"parameters":[],"get":{"summary":"Get Balance History","parameters":[{"name":"from","in":"query","required":false,"schema":{"type":"string"}},{"name":"to","in":"query","required":false,"schema":{"type":"string"}},{"name":"currency","in":"query","required":false,"schema":{"type":"string"}},{"name":"type","in":"query","required":false,"schema":{"type":"string"}},{"name":"page","in":"query","required":false,"schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Mon, 18 Mar 2024 10:56:31 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"6043"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"179b-JNO8N2scjftOHasA5X+6hA\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Get Balance History","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"page_info":{"type":"object","properties":{"total":{"type":"integer"},"current_page":{"type":"integer"},"total_pages":{"type":"integer"}}},"transactions":{"type":"array","items":{"type":"object","properties":{"type":{"type":"string"},"amount":{"type":"integer"},"currency":{"type":"string"},"balance_before":{"type":"number"},"balance_after":{"type":"number"},"reference":{"type":"string"},"date":{"type":"string","format":"date-time"},"remarks":{"type":"string"},"sent_currency":{"type":"string"},"rate_used":{"type":"integer"},"sent_amount":{"type":"integer"},"statement_type":{"type":"string"}}}}}}}},"example":{"status":"success","message":"Wallet statement fetched","data":{"page_info":{"total":149,"current_page":1,"total_pages":8},"transactions":[{"type":"D","amount":1,"currency":"NGN","balance_before":48717450885.02,"balance_after":48717450884.02,"reference":"CF-BARTER-20240318102932638417","date":"2024-03-18T10:29:32+00:00","remarks":"OTP Saas Validate for Customer FLUTTERWAVE V3","sent_currency":"","rate_used":0,"sent_amount":0,"statement_type":"available"},{"type":"D","amount":2.5,"currency":"NGN","balance_before":48717450887.52,"balance_after":48717450885.02,"reference":"CF-BARTER-20240318102714796848","date":"2024-03-18T10:27:14+00:00","remarks":"OTP Saas for Customer FLUTTERWAVE V3","sent_currency":"","rate_used":0,"sent_amount":0,"statement_type":"available"},{"type":"D","amount":1,"currency":"NGN","balance_before":48717450888.52,"balance_after":48717450887.52,"reference":"CF-BARTER-20240318102713424760","date":"2024-03-18T10:27:14+00:00","remarks":"OTP Saas for Customer FLUTTERWAVE V3","sent_currency":"","rate_used":0,"sent_amount":0,"statement_type":"available"},{"type":"D","amount":10.75,"currency":"NGN","balance_before":48717450899.27,"balance_after":48717450888.52,"reference":"FLWRVCNF620715","date":"2024-03-13T13:09:37+00:00","remarks":"FEE|Ade Bond|0690000034","sent_currency":"NGN","rate_used":0,"sent_amount":300,"statement_type":"available"},{"type":"D","amount":300,"currency":"NGN","balance_before":48717451199.27,"balance_after":48717450899.27,"reference":"FLWRVCNF620715","date":"2024-03-13T13:09:37+00:00","remarks":"Ade Bond|0690000034","sent_currency":"NGN","rate_used":0,"sent_amount":300,"statement_type":"available"},{"type":"D","amount":10.75,"currency":"NGN","balance_before":48717451210.02,"balance_after":48717451199.27,"reference":"FLWRVCNF620543","date":"2024-03-12T16:25:36+00:00","remarks":"FEE|Ade Bond|0690000034","sent_currency":"NGN","rate_used":0,"sent_amount":300,"statement_type":"available"},{"type":"D","amount":300,"currency":"NGN","balance_before":48717451510.02,"balance_after":48717451210.02,"reference":"FLWRVCNF620543","date":"2024-03-12T16:25:36+00:00","remarks":"Ade Bond|0690000034","sent_currency":"NGN","rate_used":0,"sent_amount":300,"statement_type":"available"},{"type":"D","amount":10.75,"currency":"NGN","balance_before":48717451520.77,"balance_after":48717451510.02,"reference":"FLWRVCNF620542","date":"2024-03-12T16:25:03+00:00","remarks":"FEE|Ade Bond|0690000034","sent_currency":"NGN","rate_used":0,"sent_amount":300,"statement_type":"available"},{"type":"D","amount":300,"currency":"NGN","balance_before":48717451820.77,"balance_after":48717451520.77,"reference":"FLWRVCNF620542","date":"2024-03-12T16:25:03+00:00","remarks":"Ade Bond|0690000034","sent_currency":"NGN","rate_used":0,"sent_amount":300,"statement_type":"available"},{"type":"D","amount":10.75,"currency":"NGN","balance_before":48717451831.52,"balance_after":48717451820.77,"reference":"FLWRVCNF620541","date":"2024-03-12T16:23:39+00:00","remarks":"FEE|Ade Bond|0690000034","sent_currency":"NGN","rate_used":0,"sent_amount":300,"statement_type":"available"},{"type":"D","amount":300,"currency":"NGN","balance_before":48717452131.52,"balance_after":48717451831.52,"reference":"FLWRVCNF620541","date":"2024-03-12T16:23:39+00:00","remarks":"Ade Bond|0690000034","sent_currency":"NGN","rate_used":0,"sent_amount":300,"statement_type":"available"},{"type":"D","amount":10.75,"currency":"NGN","balance_before":48717452142.27,"balance_after":48717452131.52,"reference":"FLWRVCNF620540","date":"2024-03-12T16:21:09+00:00","remarks":"FEE|Ade Bond|0690000034","sent_currency":"NGN","rate_used":0,"sent_amount":300,"statement_type":"available"},{"type":"D","amount":300,"currency":"NGN","balance_before":48717452442.27,"balance_after":48717452142.27,"reference":"FLWRVCNF620540","date":"2024-03-12T16:21:09+00:00","remarks":"Ade Bond|0690000034","sent_currency":"NGN","rate_used":0,"sent_amount":300,"statement_type":"available"},{"type":"C","amount":0,"currency":"NGN","balance_before":48717452442.27,"balance_after":48717452442.27,"reference":"471269978971","date":"2024-03-12T11:39:57+00:00","remarks":"Commission -+2348098291822","sent_currency":"NGN","rate_used":1,"sent_amount":0,"statement_type":"available"},{"type":"D","amount":714.29,"currency":"NGN","balance_before":48717453156.56,"balance_after":48717452442.27,"reference":"471269978971","date":"2024-03-12T11:39:52+00:00","remarks":"FLY API - NG-AIRTIME-+2348098291822","sent_currency":"NGN","rate_used":1,"sent_amount":714.2857,"statement_type":"available"},{"type":"C","amount":10,"currency":"NGN","balance_before":48717453146.56,"balance_after":48717453156.56,"reference":"153258467557","date":"2024-03-12T11:39:19+00:00","remarks":"Commission -0025401100","sent_currency":"NGN","rate_used":1,"sent_amount":10,"statement_type":"available"},{"type":"D","amount":100,"currency":"NGN","balance_before":48717453246.56,"balance_after":48717453146.56,"reference":"153258467557","date":"2024-03-12T11:39:15+00:00","remarks":"FEE|FLY API - NG-DSTV Payment-0025401100","sent_currency":"NGN","rate_used":1,"sent_amount":14600,"statement_type":"available"},{"type":"D","amount":14600,"currency":"NGN","balance_before":48717467846.56,"balance_after":48717453246.56,"reference":"153258467557","date":"2024-03-12T11:39:15+00:00","remarks":"FLY API - NG-DSTV Payment-0025401100","sent_currency":"NGN","rate_used":1,"sent_amount":14600,"statement_type":"available"},{"type":"C","amount":10,"currency":"NGN","balance_before":48717467836.56,"balance_after":48717467846.56,"reference":"222337833252","date":"2024-03-12T11:19:51+00:00","remarks":"Commission -0025401100","sent_currency":"NGN","rate_used":1,"sent_amount":10,"statement_type":"available"},{"type":"D","amount":100,"currency":"NGN","balance_before":48717467936.56,"balance_after":48717467836.56,"reference":"222337833252","date":"2024-03-12T11:19:48+00:00","remarks":"FEE|FLY API - NG-DSTV Payment-0025401100","sent_currency":"NGN","rate_used":1,"sent_amount":14600,"statement_type":"available"}]}}}}}}}},"/v3/bvn/verifications":{"parameters":[],"post":{"summary":"Initiate BVN Consent","parameters":[],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Mon, 18 Mar 2024 10:52:13 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"245"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"f5-COoTshio/eBVB7KP2IVhBg\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Initiate BVN Consent - success","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"url":{"type":"string","format":"uri"},"reference":{"type":"string"}}}}},"example":{"status":"success","message":"Bvn verification initiated","data":{"url":"https://nibss-bvn-consent-management.dev-flutterwave.com/cms/BvnConsent?session=ZDdiYjVjODMtYWE0My00NjI0LTllMjAtYTQyODBmMzI1NmQ5","reference":"FLWA968D23A3D2BE31F5D63D0"}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 12:01:24 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"63"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"3f-QLWkh+32IdQegEEeaTHc4w\\""}},"description":"Initiate BVN Consent - error","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"lastname is required","data":null}}}}},"requestBody":{"content":{"application/json":{"schema":{"type":"object","properties":{"bvn":{"type":"string","format":"utc-millisec"},"firstname":{"type":"string"},"lastname":{"type":"string"},"redirect_url":{"type":"string","format":"uri"}}},"example":{"bvn":"22222222280","firstname":"Nibby","lastname":"Certifier","redirect_url":"https://example-url.company.com"}}}}}},"/v3/bvn/verifications/{reference}":{"parameters":[{"name":"reference","in":"path","required":true,"example":"FLWA968D23A3D2BE31F5D63D0","schema":{"type":"string"}}],"get":{"summary":"Verify BVN Consent","parameters":[],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Mon, 18 Mar 2024 10:55:50 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"243"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"f3-sdC2kZwJ5zV5SZL0F/gTDA\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Verify BVN Consent - success","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"first_name":{"type":"string"},"last_name":{"type":"string"},"status":{"type":"string"},"reference":{"type":"string"},"callback_url":{"nullable":true},"bvn_data":{"nullable":true},"created_at":{"type":"string","format":"date-time"}}}}},"example":{"status":"success","message":"Bvn details fetched","data":{"first_name":"Nibby","last_name":"Certifier","status":"INITIATED","reference":"FLWA968D23A3D2BE31F5D63D0","callback_url":null,"bvn_data":null,"created_at":"2024-03-18T10:52:13.000Z"}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 12:02:00 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"64"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"40-Rzgop+Deg1t4NGkocTJAlQ\\""}},"description":"Verify BVN Consent - error","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"Bvn details not found","data":null}}}}}}},"/v3/settlements":{"parameters":[],"get":{"summary":"Get all Settlements","parameters":[{"name":"subaccount_id","in":"query","required":false,"schema":{"type":"string"}},{"name":"from","in":"query","required":false,"schema":{"type":"string"}},{"name":"to","in":"query","required":false,"schema":{"type":"string"}},{"name":"page","in":"query","required":false,"schema":{"type":"string"}}],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"4784"},"ETag":{"schema":{"type":"string"},"example":"W/\\"12b0-izx1zlpZNvgWwUIOdKnYbQ\\""},"Date":{"schema":{"type":"string"},"example":"Thu, 23 Jan 2020 17:26:53 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"meta":{"type":"object","properties":{"page_info":{"type":"object","properties":{"total":{"type":"integer"},"current_page":{"type":"integer"},"total_pages":{"type":"integer"},"page_size":{"type":"integer"}}}}},"data":{"type":"array","items":{"type":"object","properties":{"id":{"type":"integer"},"account_id":{"type":"integer"},"merchant_name":{"type":"string"},"merchant_email":{"type":"string","format":"email"},"settlement_account":{"type":"string","format":"utc-millisec"},"bank_code":{"type":"string","format":"color"},"transaction_date":{"type":"string","format":"date-time"},"due_date":{"type":"string","format":"date-time"},"processed_date":{"nullable":true},"status":{"type":"string"},"is_local":{"type":"boolean"},"currency":{"type":"string"},"gross_amount":{"type":"integer"},"app_fee":{"type":"integer"},"merchant_fee":{"type":"integer"},"chargeback":{"type":"integer"},"refund":{"type":"integer"},"stampduty_charge":{"type":"integer"},"net_amount":{"type":"integer"},"transaction_count":{"type":"integer"},"processor_ref":{"nullable":true},"disburse_ref":{"type":"string"},"disburse_message":{"nullable":true},"channel":{"type":"string"},"destination":{"type":"string"},"fx_data":{"nullable":true},"flag_message":{"nullable":true},"meta":{"type":"array","items":{"type":"integer"}},"refund_meta":{"nullable":true},"chargeback_meta":{"nullable":true},"source_bankcode":{"nullable":true},"created_at":{"type":"string","format":"date-time"}}}}}},"example":{"status":"success","message":"Settlements fetched","meta":{"page_info":{"total":6,"current_page":1,"total_pages":1,"page_size":20}},"data":[{"id":41748,"account_id":73362,"merchant_name":"Earth Gang","merchant_email":"selma.m0ckaham@flutterwavego.com","settlement_account":"0031318432","bank_code":"063","transaction_date":"2020-01-01T04:00:00.000Z","due_date":"2020-01-01T04:00:00.000Z","processed_date":null,"status":"completed","is_local":true,"currency":"NGN","gross_amount":122000,"app_fee":2108,"merchant_fee":0,"chargeback":0,"refund":0,"stampduty_charge":0,"net_amount":119892,"transaction_count":8,"processor_ref":null,"disburse_ref":"INSTANT_SETTLEMENT","disburse_message":null,"channel":"web","destination":"autowallet","fx_data":null,"flag_message":null,"meta":[908260,908790,908232,908274,909038,908246,908290,908216],"refund_meta":null,"chargeback_meta":null,"source_bankcode":null,"created_at":"2020-01-02T01:30:00.000Z"},{"id":41642,"account_id":73362,"merchant_name":"Earth Gang","merchant_email":"selma.m0ckaham@flutterwavego.com","settlement_account":"0031318432","bank_code":"063","transaction_date":"2019-12-31T04:00:00.000Z","due_date":"2019-12-31T04:00:00.000Z","processed_date":null,"status":"completed","is_local":true,"currency":"NGN","gross_amount":24000,"app_fee":936,"merchant_fee":0,"chargeback":0,"refund":0,"stampduty_charge":0,"net_amount":23064,"transaction_count":12,"processor_ref":null,"disburse_ref":"INSTANT_SETTLEMENT","disburse_message":null,"channel":"web","destination":"autowallet","fx_data":null,"flag_message":null,"meta":[908041,908197,908082,908015,908111,908053,908087,908034,908174,908067,907967,908103],"refund_meta":null,"chargeback_meta":null,"source_bankcode":null,"created_at":"2020-01-01T01:30:00.000Z"},{"id":41497,"account_id":73362,"merchant_name":"Earth Gang","merchant_email":"selma.m0ckaham@flutterwavego.com","settlement_account":"0031318432","bank_code":"063","transaction_date":"2019-12-30T04:00:00.000Z","due_date":"2019-12-30T04:00:00.000Z","processed_date":null,"status":"completed","is_local":true,"currency":"NGN","gross_amount":50800,"app_fee":950,"merchant_fee":0,"chargeback":0,"refund":0,"stampduty_charge":0,"net_amount":49850,"transaction_count":5,"processor_ref":null,"disburse_ref":"RV3E18675549F6A0","disburse_message":null,"channel":"web","destination":"autowallet","fx_data":null,"flag_message":null,"meta":[906256,906358,906301,906362,906319],"refund_meta":null,"chargeback_meta":null,"source_bankcode":null,"created_at":"2019-12-31T01:30:00.000Z"},{"id":41440,"account_id":73362,"merchant_name":"Earth Gang","merchant_email":"selma.m0ckaham@flutterwavego.com","settlement_account":"0031318432","bank_code":"063","transaction_date":"2019-12-30T01:00:00.000Z","due_date":"2019-12-31T00:00:00.000Z","processed_date":null,"status":"pending","is_local":true,"currency":"NGN","gross_amount":30620,"app_fee":620,"merchant_fee":0,"chargeback":0,"refund":20114,"stampduty_charge":0,"net_amount":9886,"transaction_count":3,"processor_ref":null,"disburse_ref":null,"disburse_message":null,"channel":"web","destination":"account","fx_data":null,"flag_message":null,"meta":[906262,906336,906339],"refund_meta":[4169,4848,4852,4855,4868,4869,4870,4989],"chargeback_meta":[],"source_bankcode":null,"created_at":"2019-12-31T01:00:01.000Z"},{"id":40018,"account_id":73362,"merchant_name":"Earth Gang","merchant_email":"selma.m0ckaham@flutterwavego.com","settlement_account":"0031318432","bank_code":"063","transaction_date":"2019-11-28T00:00:00.000Z","due_date":"2019-11-29T00:00:00.000Z","processed_date":null,"status":"pending","is_local":true,"currency":"NGN","gross_amount":9000,"app_fee":176,"merchant_fee":0,"chargeback":0,"refund":0,"stampduty_charge":0,"net_amount":8824,"transaction_count":1,"processor_ref":null,"disburse_ref":null,"disburse_message":null,"channel":"web","destination":"account","fx_data":null,"flag_message":null,"meta":[854542],"refund_meta":[],"chargeback_meta":[],"source_bankcode":null,"created_at":"2019-11-29T11:50:38.000Z"},{"id":38813,"account_id":73362,"merchant_name":"Earth Gang","merchant_email":"selma.m0ckaham@flutterwavego.com","settlement_account":"0031318432","bank_code":"063","transaction_date":"2019-10-10T01:00:00.000Z","due_date":"2019-10-11T19:12:49.000Z","processed_date":null,"status":"pending","is_local":true,"currency":"NGN","gross_amount":2826.96,"app_fee":2508.96,"merchant_fee":0,"chargeback":0,"refund":0,"stampduty_charge":0,"net_amount":318,"transaction_count":2,"processor_ref":null,"disburse_ref":null,"disburse_message":null,"channel":null,"destination":"account","fx_data":null,"flag_message":null,"meta":null,"refund_meta":[],"chargeback_meta":null,"source_bankcode":null,"created_at":"2019-10-11T01:00:01.000Z"}]}}}}}}},"/v3/settlements/{id}":{"parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"string"}}],"get":{"summary":"Get a Settlement","parameters":[],"responses":{"200":{"headers":{"X-Powered-By":{"schema":{"type":"string"},"example":"Express"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"2858"},"ETag":{"schema":{"type":"string"},"example":"W/\\"b2a-NsQxffVxRx36jjT/8GPQ7w\\""},"Date":{"schema":{"type":"string"},"example":"Mon, 20 Jan 2020 17:33:53 GMT"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"account_id":{"type":"integer"},"merchant_name":{"type":"string"},"merchant_email":{"type":"string","format":"email"},"settlement_account":{"type":"string","format":"utc-millisec"},"bank_code":{"type":"string","format":"color"},"transaction_date":{"type":"string","format":"date-time"},"due_date":{"type":"string","format":"date-time"},"processed_date":{"nullable":true},"status":{"type":"string"},"is_local":{"type":"integer"},"currency":{"type":"string"},"gross_amount":{"type":"integer"},"app_fee":{"type":"integer"},"merchant_fee":{"type":"integer"},"chargeback":{"type":"integer"},"refund":{"type":"integer"},"stampduty_charge":{"type":"integer"},"net_amount":{"type":"integer"},"transaction_count":{"type":"integer"},"processor_ref":{"nullable":true},"disburse_ref":{"type":"string"},"disburse_message":{"nullable":true},"channel":{"type":"string"},"destination":{"type":"string"},"fx_data":{"nullable":true},"flag_message":{"nullable":true},"meta":{"type":"string"},"refund_meta":{"nullable":true},"chargeback_meta":{"nullable":true},"source_bankcode":{"nullable":true},"created_at":{"type":"string","format":"date-time"},"transactions":{"type":"array","items":{"type":"object","properties":{"customer_email":{"type":"string","format":"email"},"flw_ref":{"type":"string"},"tx_ref":{"type":"string"},"id":{"type":"integer"},"charged_amount":{"type":"integer"},"app_fee":{"type":"integer"},"merchant_fee":{"type":"integer"},"stampduty_charge":{"type":"integer"},"settlement_amount":{"type":"integer"},"status":{"type":"string"},"payment_entity":{"type":"string"},"transaction_date":{"type":"string","format":"date"},"currency":{"type":"string"},"card_locale":{"type":"string"},"rrn":{"type":"string"},"subaccount_settlement":{"type":"integer"}}}}}}}},"example":{"status":"success","message":"Settlement fetched","data":{"id":41497,"account_id":73362,"merchant_name":"Earth Gang","merchant_email":"selma.m0ckaham@flutterwavego.com","settlement_account":"0031318432","bank_code":"063","transaction_date":"2019-12-30T04:00:00.000Z","due_date":"2019-12-30T04:00:00.000Z","processed_date":null,"status":"completed","is_local":1,"currency":"NGN","gross_amount":50800,"app_fee":950,"merchant_fee":0,"chargeback":0,"refund":0,"stampduty_charge":0,"net_amount":49850,"transaction_count":5,"processor_ref":null,"disburse_ref":"RV3E18675549F6A0","disburse_message":null,"channel":"web","destination":"autowallet","fx_data":null,"flag_message":null,"meta":"[906256,906358,906301,906362,906319]","refund_meta":null,"chargeback_meta":null,"source_bankcode":null,"created_at":"2019-12-31T01:30:00.000Z","transactions":[{"customer_email":"h0vkard@flw.ext","flw_ref":"FLW-MOCK-RECURR-42b3daee9f470127dacd19560533f3a6","tx_ref":"Rave-Pages017117571060","id":984411,"charged_amount":10140,"app_fee":190,"merchant_fee":0,"stampduty_charge":0,"settlement_amount":9950,"status":"successful","payment_entity":"card","transaction_date":"2019-12-30","currency":"NGN","card_locale":"LOCAL","rrn":"N/A","subaccount_settlement":0},{"customer_email":"h0vkard@flw.ext","flw_ref":"FLW-MOCK-RECURR-c536481525f02f76409892f517a16300","tx_ref":"Rave-Pages017117571060","id":984456,"charged_amount":10140,"app_fee":190,"merchant_fee":0,"stampduty_charge":0,"settlement_amount":9950,"status":"successful","payment_entity":"card","transaction_date":"2019-12-30","currency":"NGN","card_locale":"LOCAL","rrn":"N/A","subaccount_settlement":0},{"customer_email":"h0vkard@flw.ext","flw_ref":"FLW-MOCK-RECURR-d22d0ec0955047e9648bec46da40c987","tx_ref":"Rave-Pages017117571060","id":984474,"charged_amount":10190,"app_fee":190,"merchant_fee":0,"stampduty_charge":0,"settlement_amount":10000,"status":"successful","payment_entity":"card","transaction_date":"2019-12-30","currency":"NGN","card_locale":"LOCAL","rrn":"N/A","subaccount_settlement":0},{"customer_email":"h0vkard@flw.ext","flw_ref":"FLW-MOCK-RECURR-e55f863f14a95816e0939e7c4625ee43","tx_ref":"Rave-Pages017117571060","id":984513,"charged_amount":10190,"app_fee":190,"merchant_fee":0,"stampduty_charge":0,"settlement_amount":10000,"status":"successful","payment_entity":"card","transaction_date":"2019-12-30","currency":"NGN","card_locale":"LOCAL","rrn":"N/A","subaccount_settlement":0},{"customer_email":"h0vkard@flw.ext","flw_ref":"FLW-MOCK-RECURR-6100e5300876cef2270b2e31bc9cc16e","tx_ref":"Rave-Pages017117571060","id":984517,"charged_amount":10140,"app_fee":190,"merchant_fee":0,"stampduty_charge":0,"settlement_amount":9950,"status":"successful","payment_entity":"card","transaction_date":"2019-12-30","currency":"NGN","card_locale":"LOCAL","rrn":"N/A","subaccount_settlement":0}]}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 12:03:37 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"69"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"45-YDYt4ONyYWV9iFUZqiWd+A\\""}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"No settlement record found","data":null}}}}}}},"/v3/otps":{"parameters":[],"post":{"summary":"Create an OTP","parameters":[{"name":"Content-Type","in":"header","required":false,"example":"application/json","schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Mon, 18 Mar 2024 10:27:15 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"321"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"141-thBeiajXyqzB7L+UU43Wtg\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"array","items":{"type":"object","properties":{"medium":{"type":"string"},"reference":{"type":"string"},"otp":{"type":"string","format":"utc-millisec"},"expiry":{"type":"string","format":"date-time"}}}}}},"example":{"status":"success","message":"OTP generated successfully","data":[{"medium":"email","reference":"CF-BARTER-20240318102713784653","otp":"5880211","expiry":"2024-03-18T10:32:14.1232277+00:00"},{"medium":"whatsapp","reference":"CF-BARTER-20240318102714764558","otp":"5880211","expiry":"2024-03-18T10:32:14.7812808+00:00"}]}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 12:04:28 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"98"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"62-DGBQQoQbzVmva7Usk61hPw\\""}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string","format":"style"},"data":{"nullable":true}}},"example":{"status":"error","message":"Please specify the following parameters in body: length","data":null}}}}}}},"/v3/otps/{reference}/validate":{"parameters":[{"name":"reference","in":"path","required":true,"example":"CF-BARTER-20240318102713784653","schema":{"type":"string"}}],"post":{"summary":"Validate an OTP","parameters":[],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Mon, 18 Mar 2024 10:29:33 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"75"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"4b-jbmEjZqdhTJXsX10F7bomA\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"success","message":"Otp Authenticated successfully","data":null}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 12:05:27 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"56"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"38-prulZD1FXxqRY8BXQZseKQ\\""}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"nullable":true}}},"example":{"status":"error","message":"OTP not found","data":null}}}}},"requestBody":{"content":{"application/json":{"schema":{"type":"object","properties":{"otp":{"type":"string","format":"utc-millisec"}}},"example":{"otp":"5880211"}}}}}},"/v3/chargebacks":{"parameters":[],"get":{"summary":"Get all Chargebacks","parameters":[{"name":"status","in":"query","required":false,"schema":{"type":"string"}},{"name":"from","in":"query","required":false,"schema":{"type":"string"}},{"name":"to","in":"query","required":false,"schema":{"type":"string"}},{"name":"currency","in":"query","required":false,"schema":{"type":"string"}},{"name":"flw_ref","in":"query","required":false,"schema":{"type":"string"}},{"name":"id","in":"query","required":false,"schema":{"type":"string"}},{"name":"page","in":"query","required":false,"schema":{"type":"string"}}],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Mon, 18 Mar 2024 10:20:41 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"794"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"31a-xFUwFN39e4A3jupNInFHbg\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Get all Chargebacks","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"meta":{"type":"object","properties":{"page_info":{"type":"object","properties":{"total":{"type":"integer"},"current_page":{"type":"integer"},"total_pages":{"type":"integer"},"page_size":{"type":"integer"}}}}},"data":{"type":"array","items":{"type":"object","properties":{"id":{"type":"integer"},"amount":{"type":"integer"},"flw_ref":{"type":"string"},"status":{"type":"string"},"stage":{"type":"string"},"comment":{"type":"string"},"meta":{"type":"object","properties":{"uploaded_proof":{"nullable":true},"history":{"type":"array","items":{"type":"object","properties":{"initiator":{"type":"string"},"date":{"type":"string","format":"date-time"},"description":{"type":"string"}}}}}},"due_date":{"type":"string","format":"date-time"},"settlement_id":{"type":"string"},"created_at":{"type":"string","format":"date-time"},"transaction_id":{"type":"integer"},"tx_ref":{"type":"string","format":"utc-millisec"}}}}}},"example":{"status":"success","message":"Chargebacks fetched","meta":{"page_info":{"total":1,"current_page":1,"total_pages":1,"page_size":20}},"data":[{"id":1390,"amount":100,"flw_ref":"URF_1600800139900_3999635","status":"lost","stage":"new","comment":"This is the payment","meta":{"uploaded_proof":null,"history":[{"initiator":"dispute","date":"2020-09-22T07:01:28.000Z","description":"Dispute transaction"},{"action":"initiated","stage":"new","date":"2020-09-22T07:05:02.000Z","description":"Debit and hold chargeback amount","source":"availablebalance"},{"action":"lost","stage":"new","date":"2020-09-23T04:03:05.000Z","description":"No merchant response"}]},"due_date":"2020-09-23T15:59:59.000Z","settlement_id":"N/A","created_at":"2020-09-22T19:01:28.000Z","transaction_id":1554166,"tx_ref":"10"}]}}}}}}},"/v3/chargebacks/{id}":{"parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"string"}}],"put":{"summary":"Accept/Decline Chargebacks","parameters":[],"responses":{"200":{"headers":{"Date":{"schema":{"type":"string"},"example":"Wed, 27 Mar 2024 10:07:48 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"670"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"29e-J5FFDzrRX8vP1x4mNnG77w\\""},"Strict-Transport-Security":{"schema":{"type":"string"},"example":"max-age=31536000; includeSubDomains; preload; always;"}},"description":"Sample Success Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string"},"data":{"type":"object","properties":{"id":{"type":"integer"},"amount":{"type":"integer"},"flw_ref":{"type":"string"},"status":{"type":"string"},"stage":{"type":"string"},"comment":{"type":"string"},"due_date":{"type":"string","format":"date-time"},"settlement_id":{"type":"string"},"created_at":{"type":"string","format":"date-time"},"meta":{"type":"object","properties":{"uploaded_proof":{"nullable":true},"history":{"type":"array","items":{"type":"object","properties":{"action":{"type":"string"},"stage":{"type":"string"},"date":{"type":"string","format":"date-time"},"description":{"type":"string"}}}}}}}}}},"example":{"status":"success","message":"Chargeback accepted","data":{"id":1591,"amount":100,"flw_ref":"FLW-MOCK-3cc9bbe84a82eb054191d1a1a609909b","status":"accepted","stage":"new","comment":"Testing Testing","due_date":"2024-03-27T15:59:59.000Z","settlement_id":"N/A","created_at":"2024-03-26T12:12:12.000Z","meta":{"uploaded_proof":null,"history":[{"action":"initiated","stage":"new","date":"2024-03-26T12:15:06.000Z","description":"Debit and hold chargeback amount"},{"action":"notification","date":"2024-03-26T12:15:19.000Z","description":"Email Notification Sent"},{"action":"accept","stage":"new","date":"2024-03-27T10:07:43.000Z","description":"Merchant accepts claim"}]}}}}}},"400":{"headers":{"Date":{"schema":{"type":"string"},"example":"Thu, 28 Mar 2024 12:07:25 GMT"},"Content-Type":{"schema":{"type":"string"},"example":"application/json; charset=utf-8"},"Content-Length":{"schema":{"type":"integer"},"example":"80"},"Connection":{"schema":{"type":"string"},"example":"keep-alive"},"Server":{"schema":{"type":"string"},"example":"nginx/1.24.0"},"Access-Control-Allow-Origin":{"schema":{"type":"string"},"example":"*"},"Access-Control-Allow-Headers":{"schema":{"type":"string"},"example":"Origin, X-Requested-With, Content-Type, Accept, Authorization, v3-xapp-id, flw-auth-token, mra-auth-token, alt_mode_auth, mid, altmodeauth, cc-admin-token, x-flw-lang"},"Access-Control-Allow-Methods":{"schema":{"type":"string"},"example":"PUT, POST, GET, DELETE, OPTIONS"},"ETag":{"schema":{"type":"string"},"example":"W/\\"50-5wNdUT6dhbLBxAvyfnrQtA\\""}},"description":"Sample Error Response","content":{"application/json":{"schema":{"type":"object","properties":{"status":{"type":"string"},"message":{"type":"string","format":"style"},"data":{"nullable":true}}},"example":{"status":"error","message":"Error: Chargeback due time has passed","data":null}}}}},"requestBody":{"content":{"application/json":{"schema":{"type":"object","properties":{"action":{"type":"string"},"comment":{"type":"string"},"prooflink":{"type":"string"}}},"example":{"action":"accept","comment":"testing...","prooflink":"https//www.example.com/prooflink"}}}}}}}}');

/***/ }),
/* 103 */
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),
/* 104 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const throttler_1 = __webpack_require__(10);
const auth_service_1 = __webpack_require__(65);
const create_user_dto_1 = __webpack_require__(105);
const login_dto_1 = __webpack_require__(108);
const local_auth_guard_1 = __webpack_require__(109);
const public_decorator_1 = __webpack_require__(110);
const biometric_login_dto_1 = __webpack_require__(111);
const register_biometric_dto_1 = __webpack_require__(112);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(createUserDto) {
        return this.authService.register(createUserDto);
    }
    async resendCode(createUserDto) {
        return this.authService.resendCode(createUserDto);
    }
    async verifyCode(body) {
        return this.authService.verifyCode(body.contact, body.code);
    }
    async completeProfile(body) {
        return this.authService.completeProfile(body.contact, body.data);
    }
    async login(loginDto, req) {
        return this.authService.login(loginDto);
    }
    async initiateResetPin(body) {
        return this.authService.initiateResetPin(body.identifier);
    }
    async resetPin(body) {
        return this.authService.resetPin(body.identifier, body.code, body.pin);
    }
    async initiateResetPassword(body) {
        return this.authService.initiateResetPassword(body.identifier);
    }
    async resetPassword(body) {
        return this.authService.resetPassword(body.identifier, body.code, body.newPassword);
    }
    async setPin(body) {
        return this.authService.setPin(body.userId, body.pin);
    }
    async verifyPin(body) {
        return this.authService.verifyPin(body.userId, body.pin);
    }
    async verifyToken(body) {
        return this.authService.verifyToken(body.token);
    }
    async registerBiometric(dto) {
        return this.authService.registerBiometricDevice(dto);
    }
    async biometricLogin(dto) {
        return this.authService.biometricLogin(dto);
    }
    async updatePassword(body) {
        return this.authService.updatePassword(body.userId, body.newPassword);
    }
    async getOnboardingStatus(body) {
        return this.authService.getOnboardingStatus(body.userId);
    }
    async adminLogin(body) {
        return this.authService.adminLogin(body.email, body.password);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Verification code sent' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'User already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_user_dto_1.CreateUserDto !== "undefined" && create_user_dto_1.CreateUserDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('resend-code'),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Resend verification code' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof create_user_dto_1.CreateUserDto !== "undefined" && create_user_dto_1.CreateUserDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendCode", null);
__decorate([
    (0, common_1.Post)('verify-code'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Verify code sent to email or phone' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyCode", null);
__decorate([
    (0, common_1.Post)('complete-profile'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Complete user profile and create wallets' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "completeProfile", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Login user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User successfully logged in' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof login_dto_1.LoginDto !== "undefined" && login_dto_1.LoginDto) === "function" ? _d : Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('initiate-reset-pin'),
    (0, swagger_1.ApiOperation)({ summary: 'Send verification code for resetting PIN' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "initiateResetPin", null);
__decorate([
    (0, common_1.Post)('reset-pin'),
    (0, swagger_1.ApiOperation)({ summary: 'Reset PIN with verification code' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPin", null);
__decorate([
    (0, common_1.Post)('initiate-reset-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Send verification code for resetting password' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "initiateResetPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Reset password with verification code' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('set-pin'),
    (0, swagger_1.ApiOperation)({ summary: 'Set transaction PIN' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "setPin", null);
__decorate([
    (0, common_1.Post)('verify-pin'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify transaction PIN' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyPin", null);
__decorate([
    (0, common_1.Post)('verify-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify JWT token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyToken", null);
__decorate([
    (0, common_1.Post)('register-biometric'),
    (0, swagger_1.ApiOperation)({ summary: 'Register Biometric' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof register_biometric_dto_1.RegisterBiometricDto !== "undefined" && register_biometric_dto_1.RegisterBiometricDto) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerBiometric", null);
__decorate([
    (0, common_1.Post)('biometric-login'),
    (0, swagger_1.ApiOperation)({ summary: 'Biometric Login' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof biometric_login_dto_1.BiometricLoginDto !== "undefined" && biometric_login_dto_1.BiometricLoginDto) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "biometricLogin", null);
__decorate([
    (0, common_1.Post)('update-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Update password (only if not already set)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Post)('onboarding-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user onboarding status' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getOnboardingStatus", null);
__decorate([
    (0, common_1.Post)('admin-login'),
    (0, swagger_1.ApiOperation)({ summary: 'Login as admin' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admin successfully logged in' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid admin credentials' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "adminLogin", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 105 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateUserDto = void 0;
const class_validator_1 = __webpack_require__(106);
const class_transformer_1 = __webpack_require__(22);
const swagger_1 = __webpack_require__(3);
const phone_transform_1 = __webpack_require__(107);
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'user@example.com' }),
    (0, class_validator_1.ValidateIf)((o) => !o.phone),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value)),
    (0, class_validator_1.IsEmail)({}, { message: 'Invalid email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required if phone number is not provided' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+2348123456789', description: 'Accepts 08123456789 too' }),
    (0, class_validator_1.ValidateIf)((o) => !o.email),
    (0, class_transformer_1.Transform)(({ value }) => (0, phone_transform_1.normaliseNigerianPhone)(value)),
    (0, class_validator_1.IsPhoneNumber)(undefined, { message: 'Invalid phone number' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Phone number is required if email is not provided' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phone", void 0);


/***/ }),
/* 106 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 107 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.normaliseNigerianPhone = normaliseNigerianPhone;
const NIGERIA = '+234';
function normaliseNigerianPhone(value) {
    if (typeof value !== 'string')
        return value;
    const cleaned = value.trim().replace(/[\s\-().]/g, '');
    if (!cleaned)
        return value;
    const digits = cleaned.replace(/^\+/, '');
    if (!/^\d+$/.test(digits))
        return value;
    if (cleaned.startsWith('+234'))
        return cleaned;
    if (digits.startsWith('234') && digits.length === 13)
        return `+${digits}`;
    if (digits.startsWith('0') && digits.length === 11)
        return `${NIGERIA}${digits.slice(1)}`;
    if (digits.length === 10)
        return `${NIGERIA}${digits}`;
    return cleaned.startsWith('+') ? cleaned : value;
}


/***/ }),
/* 108 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginDto = void 0;
const class_validator_1 = __webpack_require__(106);
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LoginDto.prototype, "identifier", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);


/***/ }),
/* 109 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalAuthGuard = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(64);
let LocalAuthGuard = class LocalAuthGuard extends (0, passport_1.AuthGuard)('local') {
};
exports.LocalAuthGuard = LocalAuthGuard;
exports.LocalAuthGuard = LocalAuthGuard = __decorate([
    (0, common_1.Injectable)()
], LocalAuthGuard);


/***/ }),
/* 110 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Public = exports.IS_PUBLIC_KEY = void 0;
const common_1 = __webpack_require__(2);
exports.IS_PUBLIC_KEY = 'isPublic';
const Public = () => (0, common_1.SetMetadata)(exports.IS_PUBLIC_KEY, true);
exports.Public = Public;


/***/ }),
/* 111 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BiometricLoginDto = void 0;
const class_validator_1 = __webpack_require__(106);
class BiometricLoginDto {
}
exports.BiometricLoginDto = BiometricLoginDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BiometricLoginDto.prototype, "identifier", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BiometricLoginDto.prototype, "challenge", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BiometricLoginDto.prototype, "signature", void 0);


/***/ }),
/* 112 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterBiometricDto = void 0;
const class_validator_1 = __webpack_require__(106);
class RegisterBiometricDto {
}
exports.RegisterBiometricDto = RegisterBiometricDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterBiometricDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterBiometricDto.prototype, "publicKey", void 0);


/***/ }),
/* 113 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const users_service_1 = __webpack_require__(68);
const users_controller_1 = __webpack_require__(114);
const user_entity_1 = __webpack_require__(21);
const encryption_util_1 = __webpack_require__(118);
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User])],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService, encryption_util_1.EncryptionUtil],
        exports: [users_service_1.UsersService],
    })
], UsersModule);


/***/ }),
/* 114 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const users_service_1 = __webpack_require__(68);
const update_user_dto_1 = __webpack_require__(115);
const jwt_auth_guard_1 = __webpack_require__(116);
const roles_guard_1 = __webpack_require__(117);
const roles_decorator_1 = __webpack_require__(23);
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    findAll() {
        return this.usersService.findAll();
    }
    getProfile(req) {
        return this.usersService.findById(req.user.id);
    }
    findOne(id) {
        return this.usersService.findById(id);
    }
    updateProfile(req, updateUserDto) {
        return this.usersService.updateUser(req.user.id, updateUserDto);
    }
    update(id, updateUserDto) {
        return this.usersService.updateUser(id, updateUserDto);
    }
    remove(id) {
        return this.usersService.remove(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Users retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Update current user profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile updated successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof update_user_dto_1.UpdateUserDto !== "undefined" && update_user_dto_1.UpdateUserDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update user by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_user_dto_1.UpdateUserDto !== "undefined" && update_user_dto_1.UpdateUserDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object])
], UsersController);


/***/ }),
/* 115 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateUserDto = void 0;
const class_validator_1 = __webpack_require__(106);
const class_validator_2 = __webpack_require__(106);
const swagger_1 = __webpack_require__(3);
class UpdateUserDto {
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'user@example.com' }),
    (0, class_validator_2.IsEmail)({}, { message: 'Invalid email address' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+2348123456789' }),
    (0, class_validator_2.IsPhoneNumber)(undefined, { message: 'Invalid phone number' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '[{ id: "random_string", category: "create-account", code: "123456", expires: "expiration_date" }]' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateUserDto.prototype, "codes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'password123' }),
    (0, class_validator_2.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_2.MinLength)(6, { message: 'Password must be at least 6 characters' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John' }),
    (0, class_validator_2.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Doe' }),
    (0, class_validator_2.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "isEmailVerified", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "isPhoneVerified", void 0);


/***/ }),
/* 116 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(64);
const core_1 = __webpack_require__(1);
const public_decorator_1 = __webpack_require__(110);
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(reflector) {
        super();
        this.reflector = reflector;
    }
    canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }
    handleRequest(err, user, info, context) {
        if (err || !user) {
            throw err || new common_1.UnauthorizedException('Invalid token');
        }
        return user;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], JwtAuthGuard);


/***/ }),
/* 117 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesGuard = void 0;
const common_1 = __webpack_require__(2);
const core_1 = __webpack_require__(1);
const roles_decorator_1 = __webpack_require__(23);
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            return false;
        }
        return requiredRoles.some((role) => user.role === role);
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], RolesGuard);


/***/ }),
/* 118 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EncryptionUtil = void 0;
const common_1 = __webpack_require__(2);
const CryptoJS = __importStar(__webpack_require__(119));
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-secret-encryption-key';
let EncryptionUtil = class EncryptionUtil {
    encrypt(text) {
        if (!text)
            return text;
        try {
            return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
        }
        catch (error) {
            console.error('Encryption error:', error);
            return text;
        }
    }
    decrypt(encryptedText) {
        if (!encryptedText)
            return encryptedText;
        try {
            const decrypted = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
            return decrypted.toString(CryptoJS.enc.Utf8);
        }
        catch (error) {
            console.error('Decryption error:', error);
            return encryptedText;
        }
    }
};
exports.EncryptionUtil = EncryptionUtil;
exports.EncryptionUtil = EncryptionUtil = __decorate([
    (0, common_1.Injectable)()
], EncryptionUtil);


/***/ }),
/* 119 */
/***/ ((module) => {

module.exports = require("crypto-js");

/***/ }),
/* 120 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(64);
const passport_jwt_1 = __webpack_require__(121);
const config_1 = __webpack_require__(4);
const users_service_1 = __webpack_require__(68);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService, usersService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
        this.configService = configService;
        this.usersService = usersService;
    }
    async validate(payload) {
        const user = await this.usersService.findById(payload.sub);
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return user;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _b : Object])
], JwtStrategy);


/***/ }),
/* 121 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 122 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalStrategy = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(64);
const passport_local_1 = __webpack_require__(123);
const auth_service_1 = __webpack_require__(65);
let LocalStrategy = class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    constructor(authService) {
        super({
            usernameField: 'identifier',
        });
        this.authService = authService;
    }
    async validate(identifier, password) {
        const user = await this.authService.validateUser(identifier, password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return user;
    }
};
exports.LocalStrategy = LocalStrategy;
exports.LocalStrategy = LocalStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], LocalStrategy);


/***/ }),
/* 123 */
/***/ ((module) => {

module.exports = require("passport-local");

/***/ }),
/* 124 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const notifications_service_1 = __webpack_require__(69);
const notifications_controller_1 = __webpack_require__(125);
const notification_entity_1 = __webpack_require__(26);
const axios_1 = __webpack_require__(70);
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([notification_entity_1.Notification]),
            axios_1.HttpModule
        ],
        controllers: [notifications_controller_1.NotificationsController],
        providers: [notifications_service_1.NotificationsService],
        exports: [notifications_service_1.NotificationsService],
    })
], NotificationsModule);


/***/ }),
/* 125 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const notifications_service_1 = __webpack_require__(69);
const jwt_auth_guard_1 = __webpack_require__(116);
const positive_int_pipe_1 = __webpack_require__(126);
let NotificationsController = class NotificationsController {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    findAll(req, page, limit) {
        return this.notificationsService.findUserNotifications(req.user.id, page, limit);
    }
    getUnreadCount(req) {
        return this.notificationsService.getUnreadCount(req.user.id);
    }
    markAsRead(id, req) {
        return this.notificationsService.markAsRead(id, req.user.id);
    }
    markAllAsRead(req) {
        return this.notificationsService.markAllAsRead(req.user.id);
    }
    remove(id, req) {
        return this.notificationsService.deleteNotification(id, req.user.id);
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user notifications' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notifications retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page', new positive_int_pipe_1.PositiveIntPipe(1))),
    __param(2, (0, common_1.Query)('limit', new positive_int_pipe_1.PositiveIntPipe(20, 100))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get unread notifications count' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Unread count retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark notification as read' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notification marked as read' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Notification not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Patch)('mark-all-read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark all notifications as read' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All notifications marked as read' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete notification' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notification deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Notification not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "remove", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, swagger_1.ApiTags)('Notifications'),
    (0, common_1.Controller)('notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof notifications_service_1.NotificationsService !== "undefined" && notifications_service_1.NotificationsService) === "function" ? _a : Object])
], NotificationsController);


/***/ }),
/* 126 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PositiveIntPipe = void 0;
const common_1 = __webpack_require__(2);
let PositiveIntPipe = class PositiveIntPipe {
    constructor(fallback, max) {
        this.fallback = fallback;
        this.max = max;
    }
    transform(value) {
        const n = Number(value);
        if (!Number.isFinite(n) || n < 1)
            return this.fallback;
        const int = Math.floor(n);
        return this.max ? Math.min(int, this.max) : int;
    }
};
exports.PositiveIntPipe = PositiveIntPipe;
exports.PositiveIntPipe = PositiveIntPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Number, Number])
], PositiveIntPipe);


/***/ }),
/* 127 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WalletModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const bullmq_1 = __webpack_require__(9);
const wallet_service_1 = __webpack_require__(74);
const wallet_controller_1 = __webpack_require__(128);
const wallet_entity_1 = __webpack_require__(24);
const transaction_entity_1 = __webpack_require__(25);
const payments_module_1 = __webpack_require__(131);
const notifications_module_1 = __webpack_require__(124);
const transaction_processor_1 = __webpack_require__(135);
let WalletModule = class WalletModule {
};
exports.WalletModule = WalletModule;
exports.WalletModule = WalletModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([wallet_entity_1.Wallet, transaction_entity_1.Transaction]),
            bullmq_1.BullModule.registerQueue({
                name: 'transactions',
            }),
            (0, common_1.forwardRef)(() => payments_module_1.PaymentsModule),
            notifications_module_1.NotificationsModule,
        ],
        controllers: [wallet_controller_1.WalletController],
        providers: [wallet_service_1.WalletService, transaction_processor_1.TransactionProcessor],
        exports: [wallet_service_1.WalletService],
    })
], WalletModule);


/***/ }),
/* 128 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WalletController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const wallet_service_1 = __webpack_require__(74);
const create_wallet_dto_1 = __webpack_require__(129);
const withdraw_dto_1 = __webpack_require__(130);
const jwt_auth_guard_1 = __webpack_require__(116);
const public_decorator_1 = __webpack_require__(110);
const transaction_entity_1 = __webpack_require__(25);
const positive_int_pipe_1 = __webpack_require__(126);
let WalletController = class WalletController {
    constructor(walletService) {
        this.walletService = walletService;
    }
    create(req, createWalletDto) {
        return this.walletService.createWallet(req.user.id, createWalletDto);
    }
    provisionAccount(id) {
        return this.walletService.provisionBankAccount(id);
    }
    findAll(req) {
        return this.walletService.findUserWallets(req.user.id);
    }
    getTransactionHistory(req, page, limit) {
        return this.walletService.getTransactionHistory(req.user.id, page, limit);
    }
    findOne(id) {
        return this.walletService.findWalletById(id);
    }
    withdraw(req, withdrawDto) {
        return this.walletService.withdraw(req.user.id, transaction_entity_1.TransactionType.WITHDRAWAL, withdrawDto);
    }
    processWebhook(payload) {
        return this.walletService.processWebhook(payload);
    }
};
exports.WalletController = WalletController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new wallet' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Wallet created successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_wallet_dto_1.CreateWalletDto !== "undefined" && create_wallet_dto_1.CreateWalletDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/provision-account'),
    (0, swagger_1.ApiOperation)({ summary: 'Open a real bank account for this wallet (requires completed KYC)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Bank account opened' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'KYC incomplete — BVN and date of birth are required' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "provisionAccount", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user wallets' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Wallets retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('transactions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get transaction history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transaction history retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page', new positive_int_pipe_1.PositiveIntPipe(1))),
    __param(2, (0, common_1.Query)('limit', new positive_int_pipe_1.PositiveIntPipe(20, 100))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "getTransactionHistory", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get wallet by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Wallet retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Wallet not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('withdraw'),
    (0, swagger_1.ApiOperation)({ summary: 'Withdraw from wallet' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Withdrawal initiated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Insufficient balance' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof withdraw_dto_1.WithdrawDto !== "undefined" && withdraw_dto_1.WithdrawDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "withdraw", null);
__decorate([
    (0, common_1.Post)('webhook'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Process payment webhook' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook processed successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "processWebhook", null);
exports.WalletController = WalletController = __decorate([
    (0, swagger_1.ApiTags)('Wallet'),
    (0, common_1.Controller)('wallet'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof wallet_service_1.WalletService !== "undefined" && wallet_service_1.WalletService) === "function" ? _a : Object])
], WalletController);


/***/ }),
/* 129 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateWalletDto = void 0;
const class_validator_1 = __webpack_require__(106);
const swagger_1 = __webpack_require__(3);
const wallet_entity_1 = __webpack_require__(24);
class CreateWalletDto {
}
exports.CreateWalletDto = CreateWalletDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: wallet_entity_1.WalletType, default: wallet_entity_1.WalletType.MAIN }),
    (0, class_validator_1.IsEnum)(wallet_entity_1.WalletType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof wallet_entity_1.WalletType !== "undefined" && wallet_entity_1.WalletType) === "function" ? _a : Object)
], CreateWalletDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWalletDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWalletDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'NGN' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWalletDto.prototype, "currency", void 0);


/***/ }),
/* 130 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WithdrawDto = void 0;
const class_validator_1 = __webpack_require__(106);
const swagger_1 = __webpack_require__(3);
class WithdrawDto {
}
exports.WithdrawDto = WithdrawDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000, minimum: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(100),
    __metadata("design:type", Number)
], WithdrawDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '044' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], WithdrawDto.prototype, "bankCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1234567890' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], WithdrawDto.prototype, "accountNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], WithdrawDto.prototype, "accountName", void 0);


/***/ }),
/* 131 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentsModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const payments_service_1 = __webpack_require__(76);
const transaction_entity_1 = __webpack_require__(25);
const wallet_module_1 = __webpack_require__(127);
const flutterwave_module_1 = __webpack_require__(132);
let PaymentsModule = class PaymentsModule {
};
exports.PaymentsModule = PaymentsModule;
exports.PaymentsModule = PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([transaction_entity_1.Transaction]),
            flutterwave_module_1.FlutterwaveModule,
            (0, common_1.forwardRef)(() => wallet_module_1.WalletModule),
        ],
        providers: [payments_service_1.PaymentsService],
        exports: [payments_service_1.PaymentsService],
    })
], PaymentsModule);


/***/ }),
/* 132 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FlutterwaveModule = void 0;
const common_1 = __webpack_require__(2);
const flutterwave_service_1 = __webpack_require__(133);
const axios_1 = __webpack_require__(70);
let FlutterwaveModule = class FlutterwaveModule {
};
exports.FlutterwaveModule = FlutterwaveModule;
exports.FlutterwaveModule = FlutterwaveModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule],
        providers: [flutterwave_service_1.FlutterwaveService],
        exports: [flutterwave_service_1.FlutterwaveService],
    })
], FlutterwaveModule);


/***/ }),
/* 133 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FlutterwaveService = void 0;
exports.sortByCategory = sortByCategory;
exports.getPlansByCategory = getPlansByCategory;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(4);
const flutterwave_node_v3_1 = __importDefault(__webpack_require__(134));
function sortByCategory(billers) {
    const categories = {
        airtime: [],
        data: [],
        electricity: [],
        internet: [],
        tv: [],
        betting: [],
        others: [],
    };
    for (const biller of billers) {
        if (biller.is_airtime || biller.biller_name.toLowerCase() === 'airtime') {
            categories.airtime.push(biller);
        }
        else if (biller.biller_name.toLowerCase().includes('data')) {
            categories.data.push(biller);
        }
        else if (biller.biller_name.toLowerCase().includes('prepaid') || biller.biller_name.toLowerCase().includes('postpaid') || biller.biller_name.toLowerCase().includes('electric')) {
            categories.electricity.push(biller);
        }
        else if (biller.biller_name.toLowerCase().includes('internet')) {
            categories.internet.push(biller);
        }
        else if (biller.biller_name.toLowerCase().includes('tv') || biller.biller_name.toLowerCase().includes('dstv') || biller.biller_name.toLowerCase().includes('gotv')) {
            categories.tv.push(biller);
        }
        else if (biller.biller_name.toLowerCase().includes('bet') || biller.biller_name.toLowerCase().includes('sport')) {
            categories.betting.push(biller);
        }
        else {
            categories.others.push(biller);
        }
    }
    return categories;
}
function getPlansByCategory(billers, category) {
    const categories = sortByCategory(billers);
    return categories[category] || [];
}
let FlutterwaveService = class FlutterwaveService {
    constructor(configService) {
        this.configService = configService;
        this._flw = null;
    }
    get flw() {
        if (this._flw)
            return this._flw;
        const publicKey = this.configService.get('FLUTTERWAVE_PUBLIC_KEY');
        const secretKey = this.configService.get('FLUTTERWAVE_SECRET_KEY');
        if (!publicKey || !secretKey) {
            throw new common_1.BadRequestException('Flutterwave is not configured — set FLUTTERWAVE_PUBLIC_KEY and ' +
                'FLUTTERWAVE_SECRET_KEY in .env');
        }
        this._flw = new flutterwave_node_v3_1.default(publicKey, secretKey);
        return this._flw;
    }
    async getBillCategories(category) {
        const resp = await this.flw.Bills.fetch_bills_Cat();
        if (resp.status !== 'success' || !resp.data) {
            throw new common_1.BadRequestException(resp.message);
        }
        return getPlansByCategory(resp.data, category);
    }
    async verifyPayment(transactionId) {
        const resp = await this.flw.Transaction.verify({ id: transactionId });
        if (resp.status !== 'success' || !resp.data) {
            throw new common_1.BadRequestException(resp.message);
        }
        return resp.data;
    }
    async validateBillService(billType, billerCode, customer) {
        const resp = await this.flw.Bills.validate({ item_code: billType, code: billerCode, customer });
        if (resp.status !== 'success' || !resp.data) {
            throw new common_1.BadRequestException(resp.message);
        }
        return resp.data;
    }
    async getAccountInfo() {
        const account_number = this.configService.get('FLUTTERWAVE_ACCOUNT_NUMBER');
        const account_name = this.configService.get('FLUTTERWAVE_ACCOUNT_NAME');
        const bank_name = this.configService.get('FLUTTERWAVE_BANK_NAME');
        const bank_code = this.configService.get('FLUTTERWAVE_BANK_CODE');
        const missing = Object.entries({
            FLUTTERWAVE_ACCOUNT_NUMBER: account_number,
            FLUTTERWAVE_ACCOUNT_NAME: account_name,
            FLUTTERWAVE_BANK_NAME: bank_name,
            FLUTTERWAVE_BANK_CODE: bank_code,
        })
            .filter(([, v]) => !v)
            .map(([k]) => k);
        if (missing.length) {
            throw new common_1.BadRequestException(`Flutterwave settlement account is not configured: ${missing.join(', ')}`);
        }
        return { account_number, bank_code, account_name, bank_name };
    }
    async payBill(payload) {
        const resp = await this.flw.Bills.create_bill(payload);
        if (resp.status !== 'success' || !resp.data) {
            throw new common_1.BadRequestException(resp.message);
        }
        return resp.data;
    }
};
exports.FlutterwaveService = FlutterwaveService;
exports.FlutterwaveService = FlutterwaveService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], FlutterwaveService);


/***/ }),
/* 134 */
/***/ ((module) => {

module.exports = require("flutterwave-node-v3");

/***/ }),
/* 135 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TransactionProcessor_1;
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionProcessor = void 0;
const bullmq_1 = __webpack_require__(9);
const common_1 = __webpack_require__(2);
const event_emitter_1 = __webpack_require__(12);
const bullmq_2 = __webpack_require__(75);
const wallet_service_1 = __webpack_require__(74);
let TransactionProcessor = TransactionProcessor_1 = class TransactionProcessor extends bullmq_1.WorkerHost {
    constructor(walletService, eventEmitter) {
        super();
        this.walletService = walletService;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(TransactionProcessor_1.name);
    }
    async process(job) {
        this.logger.log(`Processing job ${job.id} of type ${job.name}`);
        switch (job.name) {
            case 'process-deposit':
                return this.processDeposit(job.data);
            case 'process-withdrawal':
                return this.processWithdrawal(job.data);
            case 'reconcile-transaction':
                return this.reconcileTransaction(job.data);
            case 'retry-failed-transaction':
                return this.retryFailedTransaction(job.data);
            default:
                this.logger.warn(`Unknown job type: ${job.name}`);
        }
    }
    onCompleted(job, result) {
        this.logger.log(`Job ${job.id} completed with result:`, result);
    }
    onFailed(job, error) {
        this.logger.error(`Job ${job.id} failed:`, error);
        this.eventEmitter.emit('transaction.processing.failed', {
            jobId: job.id,
            data: job.data,
            error: error.message,
        });
    }
    async processDeposit(data) {
        this.logger.log('Processing deposit:', data);
        try {
            await this.walletService.processWebhook(data);
            this.logger.log('Deposit processed successfully');
        }
        catch (error) {
            this.logger.error('Failed to process deposit:', error);
            throw error;
        }
    }
    async processWithdrawal(data) {
        this.logger.log('Processing withdrawal:', data);
    }
    async reconcileTransaction(data) {
        this.logger.log('Reconciling transaction:', data);
    }
    async retryFailedTransaction(data) {
        this.logger.log('Retrying failed transaction:', data);
    }
};
exports.TransactionProcessor = TransactionProcessor;
__decorate([
    (0, bullmq_1.OnWorkerEvent)('completed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof bullmq_2.Job !== "undefined" && bullmq_2.Job) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", void 0)
], TransactionProcessor.prototype, "onCompleted", null);
__decorate([
    (0, bullmq_1.OnWorkerEvent)('failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof bullmq_2.Job !== "undefined" && bullmq_2.Job) === "function" ? _d : Object, typeof (_e = typeof Error !== "undefined" && Error) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], TransactionProcessor.prototype, "onFailed", null);
exports.TransactionProcessor = TransactionProcessor = TransactionProcessor_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, bullmq_1.Processor)('transaction'),
    __metadata("design:paramtypes", [typeof (_a = typeof wallet_service_1.WalletService !== "undefined" && wallet_service_1.WalletService) === "function" ? _a : Object, typeof (_b = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _b : Object])
], TransactionProcessor);


/***/ }),
/* 136 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillsModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const bills_service_1 = __webpack_require__(137);
const bills_controller_1 = __webpack_require__(139);
const bill_entity_1 = __webpack_require__(19);
const bill_payment_entity_1 = __webpack_require__(20);
const recurring_payment_entity_1 = __webpack_require__(36);
const recurring_payments_service_1 = __webpack_require__(138);
const payments_module_1 = __webpack_require__(131);
let BillsModule = class BillsModule {
};
exports.BillsModule = BillsModule;
exports.BillsModule = BillsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([bill_entity_1.Bill, bill_payment_entity_1.BillPayment, recurring_payment_entity_1.RecurringPayment]),
            payments_module_1.PaymentsModule,
        ],
        controllers: [bills_controller_1.BillsController],
        providers: [bills_service_1.BillsService, recurring_payments_service_1.RecurringPaymentsService],
        exports: [bills_service_1.BillsService],
    })
], BillsModule);


/***/ }),
/* 137 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var BillsService_1;
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillsService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(18);
const recurring_payment_entity_1 = __webpack_require__(36);
const bill_entity_1 = __webpack_require__(19);
const payments_service_1 = __webpack_require__(76);
const recurring_payments_service_1 = __webpack_require__(138);
const flutterwave_v3_1 = __importDefault(__webpack_require__(99));
const config_1 = __webpack_require__(4);
let BillsService = BillsService_1 = class BillsService {
    constructor(billRepository, recurringRepository, recurringService, paymentsService, config) {
        this.billRepository = billRepository;
        this.recurringRepository = recurringRepository;
        this.recurringService = recurringService;
        this.paymentsService = paymentsService;
        this.config = config;
        this.logger = new common_1.Logger(BillsService_1.name);
    }
    flutterwaveAuth() {
        const key = this.config.get('FLUTTERWAVE_SECRET_KEY');
        if (!key) {
            throw new common_1.ServiceUnavailableException('Bill payments are unavailable: FLUTTERWAVE_SECRET_KEY is not configured.');
        }
        return `Bearer ${key}`;
    }
    async getProviders() {
        const response = await flutterwave_v3_1.default.getV3TopBillCategories({
            country: "NG",
            Authorization: this.flutterwaveAuth()
        });
        return response.data;
    }
    async getBillers(category) {
        const response = await flutterwave_v3_1.default.getV3BillsCategoryBillers({
            country: "NG",
            category,
            Authorization: this.flutterwaveAuth()
        });
        return response.data;
    }
    async getPlans(code) {
        const response = await flutterwave_v3_1.default.getV3BillersBiller_codeItems({
            biller_code: code,
            Authorization: this.flutterwaveAuth()
        });
        return response.data;
    }
    async verifyServiceAccount(code, customer) {
        const response = await flutterwave_v3_1.default.getV3BillItemsCb141Validate({
            code,
            customer,
            Authorization: this.flutterwaveAuth()
        });
        return response.data;
    }
    async payBill(userId, walletId, dto, recurring = false, duration = 0) {
        try {
            const response = await this.paymentsService.payBill(userId, walletId, dto);
            if (recurring && duration > 0) {
                await this.recurringService.createRecurringPayment({
                    userId: userId,
                    transactionId: response.id,
                    amount: response.amount,
                    duration,
                    frequency: this.determineFrequency(duration),
                    status: recurring_payment_entity_1.RecurringStatus.ACTIVE,
                });
            }
            return response;
        }
        catch (err) {
            this.logger.error(`Bill payment failed: ${err.message}`, err.stack);
            throw new common_1.BadRequestException(`Bill payment failed: ${err.message}`);
        }
    }
    determineFrequency(duration) {
        if (duration === 1)
            return recurring_payment_entity_1.RecurrenceFrequency.DAILY;
        if (duration === 7)
            return recurring_payment_entity_1.RecurrenceFrequency.WEEKLY;
        if (duration === 30 || duration === 31)
            return recurring_payment_entity_1.RecurrenceFrequency.MONTHLY;
        return recurring_payment_entity_1.RecurrenceFrequency.CUSTOM;
    }
    async checkServiceDowntime(billerCode) {
        const bill = await this.billRepository.findOne({
            where: { billerCode },
        });
        if (!bill)
            return false;
        return bill.hasDowntime &&
            bill.downtimeStart &&
            bill.downtimeEnd &&
            new Date() >= bill.downtimeStart &&
            new Date() <= bill.downtimeEnd;
    }
};
exports.BillsService = BillsService;
exports.BillsService = BillsService = BillsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bill_entity_1.Bill)),
    __param(1, (0, typeorm_1.InjectRepository)(recurring_payment_entity_1.RecurringPayment)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => recurring_payments_service_1.RecurringPaymentsService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => payments_service_1.PaymentsService))),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof recurring_payments_service_1.RecurringPaymentsService !== "undefined" && recurring_payments_service_1.RecurringPaymentsService) === "function" ? _c : Object, typeof (_d = typeof payments_service_1.PaymentsService !== "undefined" && payments_service_1.PaymentsService) === "function" ? _d : Object, typeof (_e = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _e : Object])
], BillsService);


/***/ }),
/* 138 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RecurringPaymentsService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(18);
const recurring_payment_entity_1 = __webpack_require__(36);
const transaction_entity_1 = __webpack_require__(25);
const payments_service_1 = __webpack_require__(76);
let RecurringPaymentsService = class RecurringPaymentsService {
    constructor(recurringRepo, paymentSerice) {
        this.recurringRepo = recurringRepo;
        this.paymentSerice = paymentSerice;
    }
    async createRecurringPayment(data) {
        const recurring = this.recurringRepo.create({
            ...data,
            startDate: this.calculateNextRun(data.frequency || recurring_payment_entity_1.RecurrenceFrequency.DAILY, new Date(), data.duration || 1),
        });
        return this.recurringRepo.save(recurring);
    }
    async pauseRecurringPayment(id) {
        const recurring = await this.recurringRepo.findOne({ where: { id } });
        if (!recurring)
            throw new common_1.NotFoundException('Recurring payment not found');
        recurring.status = recurring_payment_entity_1.RecurringStatus.PAUSED;
        return this.recurringRepo.save(recurring);
    }
    async cancelRecurringPayment(id) {
        const recurring = await this.recurringRepo.findOne({ where: { id } });
        if (!recurring)
            throw new common_1.NotFoundException('Recurring payment not found');
        recurring.status = recurring_payment_entity_1.RecurringStatus.CANCELLED;
        return this.recurringRepo.save(recurring);
    }
    async resumeRecurringPayment(id) {
        const recurring = await this.recurringRepo.findOne({ where: { id } });
        if (!recurring)
            throw new common_1.NotFoundException('Recurring payment not found');
        recurring.status = recurring_payment_entity_1.RecurringStatus.ACTIVE;
        return this.recurringRepo.save(recurring);
    }
    async listRecurring(userId, type) {
        return this.recurringRepo.find({
            where: { userId, status: recurring_payment_entity_1.RecurringStatus.ACTIVE },
            relations: ['transaction'],
        });
    }
    async processDuePayments(today = new Date()) {
        const allActivePayments = await this.recurringRepo.find({
            where: { status: recurring_payment_entity_1.RecurringStatus.ACTIVE },
            relations: ['user', 'transaction', 'transaction.wallet'],
        });
        const duePayments = allActivePayments.filter(payment => payment.startDate <= today);
        for (const recurring of duePayments) {
            const shouldProcess = this.shouldProcess(recurring, today);
            if (!shouldProcess)
                continue;
            if (recurring.transaction.type === transaction_entity_1.TransactionType.BILL_PAYMENT) {
                await this.paymentSerice.payBill(recurring.user.id, recurring.transaction.wallet.id, {
                    amount: recurring.transaction.amount,
                    customer: recurring.transaction.metadata.customer,
                    biller_code: recurring.transaction.metadata.biller_code,
                    item_code: recurring.transaction.metadata.item_code,
                    type: recurring.transaction.metadata.type,
                    country: 'NG',
                });
            }
            if (recurring.transaction.type === transaction_entity_1.TransactionType.WITHDRAWAL) {
            }
            recurring.startDate = this.calculateNextRun(recurring.frequency, recurring.startDate, recurring.duration);
            await this.recurringRepo.save(recurring);
        }
    }
    shouldProcess(recurring, today) {
        const start = new Date(recurring.startDate);
        const elapsedDays = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        if (recurring.duration && elapsedDays >= recurring.duration) {
            return false;
        }
        switch (recurring.frequency) {
            case recurring_payment_entity_1.RecurrenceFrequency.DAILY:
                return true;
            case recurring_payment_entity_1.RecurrenceFrequency.WEEKLY:
                return today.getDay() === start.getDay();
            case recurring_payment_entity_1.RecurrenceFrequency.MONTHLY:
                return today.getDate() === start.getDate();
            case recurring_payment_entity_1.RecurrenceFrequency.CUSTOM:
                return (elapsedDays % recurring.duration) === 0;
            default:
                return false;
        }
    }
    calculateNextRun(frequency, from = new Date(), duration) {
        const next = new Date(from);
        switch (frequency) {
            case recurring_payment_entity_1.RecurrenceFrequency.DAILY:
                next.setDate(next.getDate() + 1);
                break;
            case recurring_payment_entity_1.RecurrenceFrequency.WEEKLY:
                next.setDate(next.getDate() + 7);
                break;
            case recurring_payment_entity_1.RecurrenceFrequency.MONTHLY:
                next.setMonth(next.getMonth() + 1);
                break;
            case recurring_payment_entity_1.RecurrenceFrequency.CUSTOM:
                next.setDate(next.getDate() + duration);
                break;
        }
        return next;
    }
};
exports.RecurringPaymentsService = RecurringPaymentsService;
exports.RecurringPaymentsService = RecurringPaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(recurring_payment_entity_1.RecurringPayment)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof payments_service_1.PaymentsService !== "undefined" && payments_service_1.PaymentsService) === "function" ? _b : Object])
], RecurringPaymentsService);


/***/ }),
/* 139 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillsController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const bills_service_1 = __webpack_require__(137);
const jwt_auth_guard_1 = __webpack_require__(116);
const recurring_payments_service_1 = __webpack_require__(138);
let BillsController = class BillsController {
    constructor(billsService, recurringService) {
        this.billsService = billsService;
        this.recurringService = recurringService;
    }
    findProvider() {
        return this.billsService.getProviders();
    }
    findBillers(category) {
        return this.billsService.getBillers(category);
    }
    findPlans(code) {
        return this.billsService.getPlans(code);
    }
    payBill(body, req) {
        const { recurring = false, duration = 0, walletId, ...prop } = body;
        return this.billsService.payBill(req.user.id, walletId, prop, recurring, duration);
    }
    resumeRecurring(id) {
        return this.recurringService.resumeRecurringPayment(id);
    }
    pauseRecurring(id) {
        return this.recurringService.pauseRecurringPayment(id);
    }
    cancelRecurring(id) {
        return this.recurringService.cancelRecurringPayment(id);
    }
    getRecurring(type, req) {
        return this.recurringService.listRecurring(req.user.id, type);
    }
    checkDowntime(billerCode) {
        return this.billsService.checkServiceDowntime(billerCode);
    }
};
exports.BillsController = BillsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all available bills' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bills retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BillsController.prototype, "findProvider", null);
__decorate([
    (0, common_1.Get)(':category'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all available bill category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categories retrieved successfully' }),
    __param(0, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BillsController.prototype, "findBillers", null);
__decorate([
    (0, common_1.Get)('plans/:code'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all available bill plans' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Plans retrieved successfully' }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BillsController.prototype, "findPlans", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Pay bill' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bill payment successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Bill not found' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], BillsController.prototype, "payBill", null);
__decorate([
    (0, common_1.Get)('recurring/resume/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Resume recurring payment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Recurring Payment Successfully Resumed' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BillsController.prototype, "resumeRecurring", null);
__decorate([
    (0, common_1.Get)('recurring/pause/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Pause recurring payment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Recurring Payment Successfully Paused' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BillsController.prototype, "pauseRecurring", null);
__decorate([
    (0, common_1.Get)('recurring/cancel/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel recurring payment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Recurring Payment Successfully Canceled' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BillsController.prototype, "cancelRecurring", null);
__decorate([
    (0, common_1.Get)('recurring/list/:type'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recurring payments' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Recurring Payment Successfully Retrieved' }),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BillsController.prototype, "getRecurring", null);
__decorate([
    (0, common_1.Get)('downtime/:billerCode'),
    (0, swagger_1.ApiOperation)({ summary: 'Check service downtime' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Downtime status retrieved successfully' }),
    __param(0, (0, common_1.Param)('billerCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BillsController.prototype, "checkDowntime", null);
exports.BillsController = BillsController = __decorate([
    (0, swagger_1.ApiTags)('Bills'),
    (0, common_1.Controller)('bills'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof bills_service_1.BillsService !== "undefined" && bills_service_1.BillsService) === "function" ? _a : Object, typeof (_b = typeof recurring_payments_service_1.RecurringPaymentsService !== "undefined" && recurring_payments_service_1.RecurringPaymentsService) === "function" ? _b : Object])
], BillsController);


/***/ }),
/* 140 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthModule = void 0;
const common_1 = __webpack_require__(2);
const health_controller_1 = __webpack_require__(141);
const health_service_1 = __webpack_require__(142);
let HealthModule = class HealthModule {
};
exports.HealthModule = HealthModule;
exports.HealthModule = HealthModule = __decorate([
    (0, common_1.Module)({
        controllers: [health_controller_1.HealthController],
        providers: [health_service_1.HealthService],
    })
], HealthModule);


/***/ }),
/* 141 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const health_service_1 = __webpack_require__(142);
let HealthController = class HealthController {
    constructor(healthService) {
        this.healthService = healthService;
    }
    check() {
        return this.healthService.check();
    }
    checkDatabase() {
        return this.healthService.checkDatabase();
    }
    checkRedis() {
        return this.healthService.checkRedis();
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Health check endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is healthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "check", null);
__decorate([
    (0, common_1.Get)('database'),
    (0, swagger_1.ApiOperation)({ summary: 'Database health check' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Database is healthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "checkDatabase", null);
__decorate([
    (0, common_1.Get)('redis'),
    (0, swagger_1.ApiOperation)({ summary: 'Redis health check' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Redis is healthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "checkRedis", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('Health'),
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [typeof (_a = typeof health_service_1.HealthService !== "undefined" && health_service_1.HealthService) === "function" ? _a : Object])
], HealthController);


/***/ }),
/* 142 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(18);
let HealthService = class HealthService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async check() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            version: process.env.npm_package_version || '1.0.0',
        };
    }
    async checkDatabase() {
        try {
            await this.dataSource.query('SELECT 1');
            return {
                status: 'ok',
                database: 'connected',
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                status: 'error',
                database: 'disconnected',
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
    async checkRedis() {
        return {
            status: 'ok',
            redis: 'connected',
            timestamp: new Date().toISOString(),
        };
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.DataSource !== "undefined" && typeorm_2.DataSource) === "function" ? _a : Object])
], HealthService);


/***/ }),
/* 143 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KycModule = void 0;
const common_1 = __webpack_require__(2);
const kyc_service_1 = __webpack_require__(144);
const axios_1 = __webpack_require__(70);
const users_module_1 = __webpack_require__(113);
let KycModule = class KycModule {
};
exports.KycModule = KycModule;
exports.KycModule = KycModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule, users_module_1.UsersModule],
        providers: [kyc_service_1.KycService],
        exports: [kyc_service_1.KycService],
    })
], KycModule);


/***/ }),
/* 144 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KycService = void 0;
const common_1 = __webpack_require__(2);
const users_service_1 = __webpack_require__(68);
const axios_1 = __importDefault(__webpack_require__(73));
const user_entity_1 = __webpack_require__(21);
let KycService = class KycService {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async verifyAndUploadDocument(userId, dto) {
        const user = await this.usersService.findById(userId);
        if (!user)
            throw new common_1.BadRequestException('User not found');
        try {
            const response = await axios_1.default.post('https://api.sumsub.com/resources/applicants', {
                externalUserId: user.id,
                fixedInfo: {
                    documentType: dto.documentType,
                },
            }, {
                headers: {
                    'X-App-Token': process.env.SUMSUB_APP_TOKEN,
                    'X-App-Secret': process.env.SUMSUB_SECRET_KEY,
                },
            });
            await axios_1.default.post(`https://api.sumsub.com/resources/applicants/${response.data.id}/info/idDoc`, {
                file: dto.documentFile,
                type: dto.documentType,
            }, {
                headers: {
                    'X-App-Token': process.env.SUMSUB_APP_TOKEN,
                    'X-App-Secret': process.env.SUMSUB_SECRET_KEY,
                },
            });
            await this.usersService.updateUser(user.id, {
                kycStatus: user_entity_1.KYCStatus.PENDING,
            });
            return {
                message: 'KYC document uploaded successfully',
                applicantId: response.data.id,
                status: 'pending',
            };
        }
        catch (err) {
            throw new common_1.BadRequestException(err.response?.data || 'KYC upload failed');
        }
    }
};
exports.KycService = KycService;
exports.KycService = KycService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object])
], KycService);


/***/ }),
/* 145 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EscrowModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const escrow_service_1 = __webpack_require__(146);
const escrow_controller_1 = __webpack_require__(147);
const escrow_entity_1 = __webpack_require__(32);
const escrow_participant_entity_1 = __webpack_require__(33);
const wallet_module_1 = __webpack_require__(127);
const notifications_module_1 = __webpack_require__(124);
let EscrowModule = class EscrowModule {
};
exports.EscrowModule = EscrowModule;
exports.EscrowModule = EscrowModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([escrow_entity_1.Escrow, escrow_participant_entity_1.EscrowParticipant]),
            wallet_module_1.WalletModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [escrow_controller_1.EscrowController],
        providers: [escrow_service_1.EscrowService],
        exports: [escrow_service_1.EscrowService],
    })
], EscrowModule);


/***/ }),
/* 146 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EscrowService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(18);
const event_emitter_1 = __webpack_require__(12);
const escrow_entity_1 = __webpack_require__(32);
const escrow_participant_entity_1 = __webpack_require__(33);
const wallet_service_1 = __webpack_require__(74);
const wallet_entity_1 = __webpack_require__(24);
const notifications_service_1 = __webpack_require__(69);
const notification_entity_1 = __webpack_require__(26);
let EscrowService = class EscrowService {
    constructor(escrowRepository, participantRepository, walletService, notificationsService, eventEmitter, dataSource) {
        this.escrowRepository = escrowRepository;
        this.participantRepository = participantRepository;
        this.walletService = walletService;
        this.notificationsService = notificationsService;
        this.eventEmitter = eventEmitter;
        this.dataSource = dataSource;
    }
    async create(creatorId, createEscrowDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const escrowWallet = await this.walletService.findUserWalletByType(creatorId, wallet_entity_1.WalletType.ESCROW);
            if (!escrowWallet) {
                throw new common_1.NotFoundException('Escrow wallet not found');
            }
            const escrow = queryRunner.manager.create(escrow_entity_1.Escrow, {
                ...createEscrowDto,
                creatorId,
                walletId: escrowWallet.id,
                reference: this.generateReference(),
                releaseDate: new Date(createEscrowDto.releaseDate),
            });
            const savedEscrow = await queryRunner.manager.save(escrow);
            const participants = createEscrowDto.participants.map(p => queryRunner.manager.create(escrow_participant_entity_1.EscrowParticipant, {
                ...p,
                escrowId: savedEscrow.id,
            }));
            await queryRunner.manager.save(participants);
            await queryRunner.commitTransaction();
            for (const participant of createEscrowDto.participants) {
                await this.notificationsService.create({
                    title: 'Escrow Invitation',
                    message: `You've been invited to participate in escrow: ${createEscrowDto.title}`,
                    type: notification_entity_1.NotificationType.GENERAL,
                    channel: notification_entity_1.NotificationChannel.IN_APP,
                    userId: participant.userId,
                    metadata: { escrowId: savedEscrow.id },
                });
            }
            return savedEscrow;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findUserEscrows(userId, page = 1, limit = 20) {
        const whereConditions = [
            { creatorId: userId },
            { participants: { userId } },
        ];
        const [escrows, total] = await this.escrowRepository.findAndCount({
            where: whereConditions,
            relations: ['participants', 'participants.user', 'wallet'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            escrows,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id, userId) {
        const escrow = await this.escrowRepository.findOne({
            where: { id },
            relations: ['participants', 'participants.user', 'wallet', 'creator'],
        });
        if (!escrow) {
            throw new common_1.NotFoundException('Escrow not found');
        }
        const hasAccess = escrow.creatorId === userId ||
            escrow.participants.some(p => p.userId === userId);
        if (!hasAccess) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return escrow;
    }
    async update(id, updateEscrowDto, userId) {
        const escrow = await this.findOne(id, userId);
        if (escrow.creatorId !== userId) {
            throw new common_1.ForbiddenException('Only creator can update escrow');
        }
        if (escrow.status !== escrow_entity_1.EscrowStatus.PENDING) {
            throw new common_1.BadRequestException('Cannot update escrow that is not pending');
        }
        await this.escrowRepository.update(id, updateEscrowDto);
        return this.findOne(id, userId);
    }
    async fundEscrow(id, userId) {
        const escrow = await this.findOne(id, userId);
        if (escrow.status !== escrow_entity_1.EscrowStatus.PENDING) {
            throw new common_1.BadRequestException('Escrow is not in pending status');
        }
        const participant = escrow.participants.find(p => p.userId === userId && p.role === escrow_participant_entity_1.ParticipantRole.PAYER);
        if (!participant) {
            throw new common_1.ForbiddenException('User is not authorized to fund this escrow');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await this.walletService.transferBetweenWallets(userId, escrow.walletId, escrow.amount, `Escrow funding: ${escrow.title}`);
            await queryRunner.manager.update(escrow_entity_1.Escrow, id, {
                status: escrow_entity_1.EscrowStatus.FUNDED,
            });
            await queryRunner.commitTransaction();
            for (const p of escrow.participants) {
                await this.notificationsService.create({
                    title: 'Escrow Funded',
                    message: `Escrow "${escrow.title}" has been funded`,
                    type: notification_entity_1.NotificationType.GENERAL,
                    channel: notification_entity_1.NotificationChannel.IN_APP,
                    userId: p.userId,
                });
            }
            return this.findOne(id, userId);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async releaseEscrow(id, userId) {
        const escrow = await this.findOne(id, userId);
        if (escrow.status !== escrow_entity_1.EscrowStatus.FUNDED) {
            throw new common_1.BadRequestException('Escrow must be funded before release');
        }
        if (new Date() < escrow.releaseDate) {
            throw new common_1.BadRequestException('Release date has not been reached');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const payees = escrow.participants.filter(p => p.role === escrow_participant_entity_1.ParticipantRole.PAYEE);
            for (const payee of payees) {
                const payeeWallet = await this.walletService.findUserWalletByType(payee.userId, wallet_entity_1.WalletType.MAIN);
                if (payeeWallet) {
                    await this.walletService.transferBetweenWallets(escrow.creatorId, payeeWallet.id, payee.contributionAmount || escrow.amount / payees.length, `Escrow release: ${escrow.title}`);
                }
            }
            await queryRunner.manager.update(escrow_entity_1.Escrow, id, {
                status: escrow_entity_1.EscrowStatus.RELEASED,
            });
            await queryRunner.commitTransaction();
            this.eventEmitter.emit('escrow.released', { escrow });
            return this.findOne(id, userId);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async disputeEscrow(id, reason, userId) {
        const escrow = await this.findOne(id, userId);
        if (escrow.status !== escrow_entity_1.EscrowStatus.FUNDED) {
            throw new common_1.BadRequestException('Can only dispute funded escrows');
        }
        await this.escrowRepository.update(id, {
            status: escrow_entity_1.EscrowStatus.DISPUTED,
            metadata: { ...escrow.metadata, disputeReason: reason, disputedBy: userId },
        });
        for (const participant of escrow.participants) {
            await this.notificationsService.create({
                title: 'Escrow Disputed',
                message: `Escrow "${escrow.title}" has been disputed`,
                type: notification_entity_1.NotificationType.SECURITY,
                channel: notification_entity_1.NotificationChannel.IN_APP,
                userId: participant.userId,
            });
        }
        return this.findOne(id, userId);
    }
    async acceptInvitation(id, userId) {
        const participant = await this.participantRepository.findOne({
            where: { escrowId: id, userId },
            relations: ['escrow'],
        });
        if (!participant) {
            throw new common_1.NotFoundException('Invitation not found');
        }
        if (participant.status !== escrow_participant_entity_1.ParticipantStatus.INVITED) {
            throw new common_1.BadRequestException('Invitation already processed');
        }
        participant.status = escrow_participant_entity_1.ParticipantStatus.ACCEPTED;
        participant.acceptedAt = new Date();
        return this.participantRepository.save(participant);
    }
    async cancel(id, userId) {
        const escrow = await this.findOne(id, userId);
        if (escrow.creatorId !== userId) {
            throw new common_1.ForbiddenException('Only creator can cancel escrow');
        }
        if (escrow.status === escrow_entity_1.EscrowStatus.FUNDED) {
            throw new common_1.BadRequestException('Cannot cancel funded escrow');
        }
        await this.escrowRepository.update(id, {
            status: escrow_entity_1.EscrowStatus.CANCELLED,
        });
    }
    generateReference() {
        return `ESC_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }
};
exports.EscrowService = EscrowService;
exports.EscrowService = EscrowService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(escrow_entity_1.Escrow)),
    __param(1, (0, typeorm_1.InjectRepository)(escrow_participant_entity_1.EscrowParticipant)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof wallet_service_1.WalletService !== "undefined" && wallet_service_1.WalletService) === "function" ? _c : Object, typeof (_d = typeof notifications_service_1.NotificationsService !== "undefined" && notifications_service_1.NotificationsService) === "function" ? _d : Object, typeof (_e = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _e : Object, typeof (_f = typeof typeorm_2.DataSource !== "undefined" && typeorm_2.DataSource) === "function" ? _f : Object])
], EscrowService);


/***/ }),
/* 147 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EscrowController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const escrow_service_1 = __webpack_require__(146);
const create_escrow_dto_1 = __webpack_require__(148);
const update_escrow_dto_1 = __webpack_require__(149);
const jwt_auth_guard_1 = __webpack_require__(116);
const positive_int_pipe_1 = __webpack_require__(126);
let EscrowController = class EscrowController {
    constructor(escrowService) {
        this.escrowService = escrowService;
    }
    create(req, createEscrowDto) {
        return this.escrowService.create(req.user.id, createEscrowDto);
    }
    findAll(req, page, limit) {
        return this.escrowService.findUserEscrows(req.user.id, page, limit);
    }
    findOne(id, req) {
        return this.escrowService.findOne(id, req.user.id);
    }
    update(id, updateEscrowDto, req) {
        return this.escrowService.update(id, updateEscrowDto, req.user.id);
    }
    fund(id, req) {
        return this.escrowService.fundEscrow(id, req.user.id);
    }
    release(id, req) {
        return this.escrowService.releaseEscrow(id, req.user.id);
    }
    dispute(id, body, req) {
        return this.escrowService.disputeEscrow(id, body.reason, req.user.id);
    }
    acceptInvitation(id, req) {
        return this.escrowService.acceptInvitation(id, req.user.id);
    }
    remove(id, req) {
        return this.escrowService.cancel(id, req.user.id);
    }
};
exports.EscrowController = EscrowController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new escrow' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Escrow created successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_escrow_dto_1.CreateEscrowDto !== "undefined" && create_escrow_dto_1.CreateEscrowDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user escrows' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Escrows retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page', new positive_int_pipe_1.PositiveIntPipe(1))),
    __param(2, (0, common_1.Query)('limit', new positive_int_pipe_1.PositiveIntPipe(20, 100))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get escrow by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Escrow retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update escrow' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Escrow updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_escrow_dto_1.UpdateEscrowDto !== "undefined" && update_escrow_dto_1.UpdateEscrowDto) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/fund'),
    (0, swagger_1.ApiOperation)({ summary: 'Fund escrow' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Escrow funded successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "fund", null);
__decorate([
    (0, common_1.Post)(':id/release'),
    (0, swagger_1.ApiOperation)({ summary: 'Release escrow funds' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Escrow funds released successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "release", null);
__decorate([
    (0, common_1.Post)(':id/dispute'),
    (0, swagger_1.ApiOperation)({ summary: 'Dispute escrow' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Escrow disputed successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "dispute", null);
__decorate([
    (0, common_1.Post)(':id/accept'),
    (0, swagger_1.ApiOperation)({ summary: 'Accept escrow invitation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Escrow invitation accepted' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "acceptInvitation", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel escrow' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Escrow cancelled successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "remove", null);
exports.EscrowController = EscrowController = __decorate([
    (0, swagger_1.ApiTags)('Escrow'),
    (0, common_1.Controller)('escrow'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof escrow_service_1.EscrowService !== "undefined" && escrow_service_1.EscrowService) === "function" ? _a : Object])
], EscrowController);


/***/ }),
/* 148 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateEscrowDto = void 0;
const class_validator_1 = __webpack_require__(106);
const swagger_1 = __webpack_require__(3);
const escrow_entity_1 = __webpack_require__(32);
class CreateEscrowDto {
}
exports.CreateEscrowDto = CreateEscrowDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEscrowDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEscrowDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ minimum: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100),
    __metadata("design:type", Number)
], CreateEscrowDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: escrow_entity_1.EscrowType }),
    (0, class_validator_1.IsEnum)(escrow_entity_1.EscrowType),
    __metadata("design:type", typeof (_a = typeof escrow_entity_1.EscrowType !== "undefined" && escrow_entity_1.EscrowType) === "function" ? _a : Object)
], CreateEscrowDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: escrow_entity_1.EscrowMode }),
    (0, class_validator_1.IsEnum)(escrow_entity_1.EscrowMode),
    __metadata("design:type", typeof (_b = typeof escrow_entity_1.EscrowMode !== "undefined" && escrow_entity_1.EscrowMode) === "function" ? _b : Object)
], CreateEscrowDto.prototype, "mode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEscrowDto.prototype, "releaseDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Object] }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", typeof (_c = typeof Array !== "undefined" && Array) === "function" ? _c : Object)
], CreateEscrowDto.prototype, "participants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateEscrowDto.prototype, "conditions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateEscrowDto.prototype, "metadata", void 0);


/***/ }),
/* 149 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateEscrowDto = void 0;
const swagger_1 = __webpack_require__(3);
const create_escrow_dto_1 = __webpack_require__(148);
class UpdateEscrowDto extends (0, swagger_1.PartialType)(create_escrow_dto_1.CreateEscrowDto) {
}
exports.UpdateEscrowDto = UpdateEscrowDto;


/***/ }),
/* 150 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillSplittingModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const bill_splitting_service_1 = __webpack_require__(151);
const bill_splitting_controller_1 = __webpack_require__(152);
const bill_split_entity_1 = __webpack_require__(27);
const bill_split_participant_entity_1 = __webpack_require__(28);
const wallet_module_1 = __webpack_require__(127);
const notifications_module_1 = __webpack_require__(124);
let BillSplittingModule = class BillSplittingModule {
};
exports.BillSplittingModule = BillSplittingModule;
exports.BillSplittingModule = BillSplittingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([bill_split_entity_1.BillSplit, bill_split_participant_entity_1.BillSplitParticipant]),
            wallet_module_1.WalletModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [bill_splitting_controller_1.BillSplittingController],
        providers: [bill_splitting_service_1.BillSplittingService],
        exports: [bill_splitting_service_1.BillSplittingService],
    })
], BillSplittingModule);


/***/ }),
/* 151 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillSplittingService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(18);
const event_emitter_1 = __webpack_require__(12);
const schedule_1 = __webpack_require__(11);
const bill_split_entity_1 = __webpack_require__(27);
const bill_split_participant_entity_1 = __webpack_require__(28);
const wallet_service_1 = __webpack_require__(74);
const notifications_service_1 = __webpack_require__(69);
const notification_entity_1 = __webpack_require__(26);
let BillSplittingService = class BillSplittingService {
    constructor(billSplitRepository, participantRepository, walletService, notificationsService, eventEmitter, dataSource) {
        this.billSplitRepository = billSplitRepository;
        this.participantRepository = participantRepository;
        this.walletService = walletService;
        this.notificationsService = notificationsService;
        this.eventEmitter = eventEmitter;
        this.dataSource = dataSource;
    }
    async create(creatorId, createBillSplitDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const billSplit = queryRunner.manager.create(bill_split_entity_1.BillSplit, {
                ...createBillSplitDto,
                creatorId,
                reference: this.generateReference(),
                nextExecutionDate: createBillSplitDto.nextExecutionDate ?
                    new Date(createBillSplitDto.nextExecutionDate) : new Date(),
            });
            const savedBillSplit = await queryRunner.manager.save(billSplit);
            const participants = createBillSplitDto.participants.map(p => queryRunner.manager.create(bill_split_participant_entity_1.BillSplitParticipant, {
                ...p,
                billSplitId: savedBillSplit.id,
            }));
            await queryRunner.manager.save(participants);
            await queryRunner.commitTransaction();
            for (const participant of createBillSplitDto.participants) {
                await this.notificationsService.create({
                    title: 'Bill Split Invitation',
                    message: `You've been invited to participate in bill split: ${createBillSplitDto.title}`,
                    type: notification_entity_1.NotificationType.GENERAL,
                    channel: notification_entity_1.NotificationChannel.IN_APP,
                    userId: participant.userId,
                    metadata: { billSplitId: savedBillSplit.id },
                });
            }
            return savedBillSplit;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findUserBillSplits(userId, page = 1, limit = 20) {
        const whereConditions = [
            { creatorId: userId },
            { participants: { userId } },
        ];
        const [billSplits, total] = await this.billSplitRepository.findAndCount({
            where: whereConditions,
            relations: ['participants', 'participants.user', 'wallet'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            billSplits,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id, userId) {
        const billSplit = await this.billSplitRepository.findOne({
            where: { id },
            relations: ['participants', 'participants.user', 'participants.wallet', 'wallet', 'creator'],
        });
        if (!billSplit) {
            throw new common_1.NotFoundException('Bill split not found');
        }
        const hasAccess = billSplit.creatorId === userId ||
            billSplit.participants.some(p => p.userId === userId);
        if (!hasAccess) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return billSplit;
    }
    async executeBillSplit(id, userId) {
        const billSplit = await this.findOne(id, userId);
        if (billSplit.status !== bill_split_entity_1.SplitStatus.ACTIVE) {
            throw new common_1.BadRequestException('Bill split is not active');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (billSplit.type === bill_split_entity_1.SplitType.ONE_TO_MANY) {
                await this.executeOneToMany(billSplit, queryRunner);
            }
            else {
                await this.executeManyToOne(billSplit, queryRunner);
            }
            if (billSplit.frequency === bill_split_entity_1.SplitFrequency.RECURRING) {
                const nextDate = this.calculateNextExecutionDate(billSplit);
                await queryRunner.manager.update(bill_split_entity_1.BillSplit, id, {
                    nextExecutionDate: nextDate,
                });
            }
            else {
                await queryRunner.manager.update(bill_split_entity_1.BillSplit, id, {
                    status: bill_split_entity_1.SplitStatus.COMPLETED,
                });
            }
            await queryRunner.commitTransaction();
            this.eventEmitter.emit('bill-split.executed', { billSplit });
            return this.findOne(id, userId);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async acceptInvitation(id, userId) {
        const participant = await this.participantRepository.findOne({
            where: { billSplitId: id, userId },
            relations: ['billSplit'],
        });
        if (!participant) {
            throw new common_1.NotFoundException('Invitation not found');
        }
        if (participant.status !== bill_split_participant_entity_1.ParticipantStatus.INVITED) {
            throw new common_1.BadRequestException('Invitation already processed');
        }
        participant.status = bill_split_participant_entity_1.ParticipantStatus.ACCEPTED;
        const allParticipants = await this.participantRepository.find({
            where: { billSplitId: id },
        });
        const allAccepted = allParticipants.every(p => p.status === bill_split_participant_entity_1.ParticipantStatus.ACCEPTED || p.id === participant.id);
        if (allAccepted) {
            await this.billSplitRepository.update(id, {
                status: bill_split_entity_1.SplitStatus.ACTIVE,
            });
        }
        return this.participantRepository.save(participant);
    }
    async cancel(id, userId) {
        const billSplit = await this.findOne(id, userId);
        if (billSplit.creatorId !== userId) {
            throw new common_1.ForbiddenException('Only creator can cancel bill split');
        }
        await this.billSplitRepository.update(id, {
            status: bill_split_entity_1.SplitStatus.CANCELLED,
        });
    }
    async processRecurringBillSplits() {
        const dueBillSplits = await this.billSplitRepository.find({
            where: {
                status: bill_split_entity_1.SplitStatus.ACTIVE,
                frequency: bill_split_entity_1.SplitFrequency.RECURRING,
                nextExecutionDate: new Date(),
            },
            relations: ['participants'],
        });
        for (const billSplit of dueBillSplits) {
            try {
                await this.executeBillSplit(billSplit.id, billSplit.creatorId);
            }
            catch (error) {
                console.error(`Failed to execute bill split ${billSplit.id}:`, error);
            }
        }
    }
    async sendReminders() {
        const pendingParticipants = await this.participantRepository.find({
            where: {
                status: bill_split_participant_entity_1.ParticipantStatus.ACCEPTED,
                role: bill_split_participant_entity_1.ParticipantRole.SENDER,
                nextReminderDate: new Date(),
            },
            relations: ['user', 'billSplit'],
        });
        for (const participant of pendingParticipants) {
            await this.notificationsService.create({
                title: 'Bill Split Reminder',
                message: `Reminder: Payment due for "${participant.billSplit.title}"`,
                type: notification_entity_1.NotificationType.GENERAL,
                channel: notification_entity_1.NotificationChannel.IN_APP,
                userId: participant.userId,
            });
            participant.nextReminderDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
            await this.participantRepository.save(participant);
        }
    }
    async executeOneToMany(billSplit, queryRunner) {
        const receivers = billSplit.participants.filter(p => p.role === bill_split_participant_entity_1.ParticipantRole.RECEIVER);
        for (const receiver of receivers) {
            await this.walletService.transferBetweenWallets(billSplit.creatorId, receiver.walletId, receiver.amount, `Bill split: ${billSplit.title}`);
        }
    }
    async executeManyToOne(billSplit, queryRunner) {
        const senders = billSplit.participants.filter(p => p.role === bill_split_participant_entity_1.ParticipantRole.SENDER);
        const receiver = billSplit.participants.find(p => p.role === bill_split_participant_entity_1.ParticipantRole.RECEIVER);
        if (!receiver) {
            throw new common_1.BadRequestException('No receiver found for many-to-one split');
        }
        for (const sender of senders) {
            await this.walletService.transferBetweenWallets(sender.userId, receiver.walletId, sender.amount, `Bill split contribution: ${billSplit.title}`);
        }
    }
    calculateNextExecutionDate(billSplit) {
        const current = billSplit.nextExecutionDate || new Date();
        const next = new Date(current);
        if (billSplit.schedule?.frequency === 'daily') {
            next.setDate(next.getDate() + 1);
        }
        else if (billSplit.schedule?.frequency === 'weekly') {
            next.setDate(next.getDate() + 7);
        }
        else if (billSplit.schedule?.frequency === 'monthly') {
            next.setMonth(next.getMonth() + 1);
        }
        return next;
    }
    generateReference() {
        return `SPLIT_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }
};
exports.BillSplittingService = BillSplittingService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], BillSplittingService.prototype, "processRecurringBillSplits", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_9AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], BillSplittingService.prototype, "sendReminders", null);
exports.BillSplittingService = BillSplittingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bill_split_entity_1.BillSplit)),
    __param(1, (0, typeorm_1.InjectRepository)(bill_split_participant_entity_1.BillSplitParticipant)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof wallet_service_1.WalletService !== "undefined" && wallet_service_1.WalletService) === "function" ? _c : Object, typeof (_d = typeof notifications_service_1.NotificationsService !== "undefined" && notifications_service_1.NotificationsService) === "function" ? _d : Object, typeof (_e = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _e : Object, typeof (_f = typeof typeorm_2.DataSource !== "undefined" && typeorm_2.DataSource) === "function" ? _f : Object])
], BillSplittingService);


/***/ }),
/* 152 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillSplittingController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const bill_splitting_service_1 = __webpack_require__(151);
const create_bill_split_dto_1 = __webpack_require__(153);
const jwt_auth_guard_1 = __webpack_require__(116);
const positive_int_pipe_1 = __webpack_require__(126);
let BillSplittingController = class BillSplittingController {
    constructor(billSplittingService) {
        this.billSplittingService = billSplittingService;
    }
    create(req, createBillSplitDto) {
        return this.billSplittingService.create(req.user.id, createBillSplitDto);
    }
    findAll(req, page, limit) {
        return this.billSplittingService.findUserBillSplits(req.user.id, page, limit);
    }
    findOne(id, req) {
        return this.billSplittingService.findOne(id, req.user.id);
    }
    execute(id, req) {
        return this.billSplittingService.executeBillSplit(id, req.user.id);
    }
    acceptInvitation(id, req) {
        return this.billSplittingService.acceptInvitation(id, req.user.id);
    }
    cancel(id, req) {
        return this.billSplittingService.cancel(id, req.user.id);
    }
};
exports.BillSplittingController = BillSplittingController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new bill split' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Bill split created successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_bill_split_dto_1.CreateBillSplitDto !== "undefined" && create_bill_split_dto_1.CreateBillSplitDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], BillSplittingController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user bill splits' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bill splits retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page', new positive_int_pipe_1.PositiveIntPipe(1))),
    __param(2, (0, common_1.Query)('limit', new positive_int_pipe_1.PositiveIntPipe(20, 100))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", void 0)
], BillSplittingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get bill split by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bill split retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BillSplittingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/execute'),
    (0, swagger_1.ApiOperation)({ summary: 'Execute bill split' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bill split executed successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BillSplittingController.prototype, "execute", null);
__decorate([
    (0, common_1.Post)(':id/accept'),
    (0, swagger_1.ApiOperation)({ summary: 'Accept bill split invitation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bill split invitation accepted' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BillSplittingController.prototype, "acceptInvitation", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel bill split' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bill split cancelled successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BillSplittingController.prototype, "cancel", null);
exports.BillSplittingController = BillSplittingController = __decorate([
    (0, swagger_1.ApiTags)('Bill Splitting'),
    (0, common_1.Controller)('bill-splitting'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof bill_splitting_service_1.BillSplittingService !== "undefined" && bill_splitting_service_1.BillSplittingService) === "function" ? _a : Object])
], BillSplittingController);


/***/ }),
/* 153 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateBillSplitDto = void 0;
const class_validator_1 = __webpack_require__(106);
const swagger_1 = __webpack_require__(3);
const bill_split_entity_1 = __webpack_require__(27);
class CreateBillSplitDto {
}
exports.CreateBillSplitDto = CreateBillSplitDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBillSplitDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBillSplitDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ minimum: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100),
    __metadata("design:type", Number)
], CreateBillSplitDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: bill_split_entity_1.SplitType }),
    (0, class_validator_1.IsEnum)(bill_split_entity_1.SplitType),
    __metadata("design:type", typeof (_a = typeof bill_split_entity_1.SplitType !== "undefined" && bill_split_entity_1.SplitType) === "function" ? _a : Object)
], CreateBillSplitDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: bill_split_entity_1.SplitFrequency }),
    (0, class_validator_1.IsEnum)(bill_split_entity_1.SplitFrequency),
    __metadata("design:type", typeof (_b = typeof bill_split_entity_1.SplitFrequency !== "undefined" && bill_split_entity_1.SplitFrequency) === "function" ? _b : Object)
], CreateBillSplitDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateBillSplitDto.prototype, "walletId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Object] }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", typeof (_c = typeof Array !== "undefined" && Array) === "function" ? _c : Object)
], CreateBillSplitDto.prototype, "participants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBillSplitDto.prototype, "nextExecutionDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateBillSplitDto.prototype, "schedule", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateBillSplitDto.prototype, "metadata", void 0);


/***/ }),
/* 154 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CrowdfundingModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const crowdfunding_service_1 = __webpack_require__(155);
const crowdfunding_controller_1 = __webpack_require__(156);
const crowdfunding_campaign_entity_1 = __webpack_require__(30);
const crowdfunding_contribution_entity_1 = __webpack_require__(31);
const wallet_module_1 = __webpack_require__(127);
const notifications_module_1 = __webpack_require__(124);
let CrowdfundingModule = class CrowdfundingModule {
};
exports.CrowdfundingModule = CrowdfundingModule;
exports.CrowdfundingModule = CrowdfundingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([crowdfunding_campaign_entity_1.CrowdfundingCampaign, crowdfunding_contribution_entity_1.CrowdfundingContribution]),
            wallet_module_1.WalletModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [crowdfunding_controller_1.CrowdfundingController],
        providers: [crowdfunding_service_1.CrowdfundingService],
        exports: [crowdfunding_service_1.CrowdfundingService],
    })
], CrowdfundingModule);


/***/ }),
/* 155 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CrowdfundingService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(18);
const event_emitter_1 = __webpack_require__(12);
const crowdfunding_campaign_entity_1 = __webpack_require__(30);
const crowdfunding_contribution_entity_1 = __webpack_require__(31);
const wallet_service_1 = __webpack_require__(74);
const wallet_entity_1 = __webpack_require__(24);
const notifications_service_1 = __webpack_require__(69);
const notification_entity_1 = __webpack_require__(26);
let CrowdfundingService = class CrowdfundingService {
    constructor(campaignRepository, contributionRepository, walletService, notificationsService, eventEmitter, dataSource) {
        this.campaignRepository = campaignRepository;
        this.contributionRepository = contributionRepository;
        this.walletService = walletService;
        this.notificationsService = notificationsService;
        this.eventEmitter = eventEmitter;
        this.dataSource = dataSource;
    }
    async createCampaign(creatorId, createCampaignDto) {
        const campaignWallet = await this.walletService.createWallet(creatorId, {
            type: wallet_entity_1.WalletType.OTHERS,
            name: `Crowdfunding: ${createCampaignDto.title}`,
            customerId: '',
        });
        const shareableLink = this.generateShareableLink();
        const campaign = this.campaignRepository.create({
            ...createCampaignDto,
            creatorId,
            walletId: campaignWallet.id,
            shareableLink,
            endDate: new Date(createCampaignDto.endDate),
        });
        return this.campaignRepository.save(campaign);
    }
    async findUserCampaigns(userId, page = 1, limit = 20) {
        const [campaigns, total] = await this.campaignRepository.findAndCount({
            where: { creatorId: userId },
            relations: ['contributions', 'wallet'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            campaigns,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getPublicCampaign(shareableLink) {
        const campaign = await this.campaignRepository.findOne({
            where: { shareableLink },
            relations: ['creator', 'contributions'],
            select: {
                creator: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            },
        });
        if (!campaign) {
            throw new common_1.NotFoundException('Campaign not found');
        }
        if (campaign.status !== crowdfunding_campaign_entity_1.CampaignStatus.ACTIVE) {
            throw new common_1.BadRequestException('Campaign is not active');
        }
        return campaign;
    }
    async findOne(id, userId) {
        const campaign = await this.campaignRepository.findOne({
            where: { id },
            relations: ['contributions', 'contributions.contributor', 'wallet', 'creator'],
        });
        if (!campaign) {
            throw new common_1.NotFoundException('Campaign not found');
        }
        if (campaign.creatorId !== userId && campaign.status !== crowdfunding_campaign_entity_1.CampaignStatus.ACTIVE) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return campaign;
    }
    async contribute(campaignId, contributorId, contributeDto) {
        const campaign = await this.campaignRepository.findOne({
            where: { id: campaignId },
            relations: ['wallet'],
        });
        if (!campaign) {
            throw new common_1.NotFoundException('Campaign not found');
        }
        if (campaign.status !== crowdfunding_campaign_entity_1.CampaignStatus.ACTIVE) {
            throw new common_1.BadRequestException('Campaign is not active');
        }
        if (new Date() > campaign.endDate) {
            throw new common_1.BadRequestException('Campaign has expired');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await this.walletService.transferBetweenWallets(contributorId, campaign.walletId, contributeDto.amount, `Crowdfunding contribution: ${campaign.title}`);
            const contribution = queryRunner.manager.create(crowdfunding_contribution_entity_1.CrowdfundingContribution, {
                ...contributeDto,
                contributorId,
                campaignId,
                reference: this.generateReference(),
            });
            const savedContribution = await queryRunner.manager.save(contribution);
            await queryRunner.manager.update(crowdfunding_campaign_entity_1.CrowdfundingCampaign, campaignId, {
                raisedAmount: () => `raised_amount + ${contributeDto.amount}`,
            });
            const updatedCampaign = await queryRunner.manager.findOne(crowdfunding_campaign_entity_1.CrowdfundingCampaign, {
                where: { id: campaignId },
            });
            if (updatedCampaign && updatedCampaign.raisedAmount >= updatedCampaign.targetAmount) {
                await queryRunner.manager.update(crowdfunding_campaign_entity_1.CrowdfundingCampaign, campaignId, {
                    status: crowdfunding_campaign_entity_1.CampaignStatus.COMPLETED,
                });
            }
            await queryRunner.commitTransaction();
            await this.notificationsService.create({
                title: 'New Contribution',
                message: `Someone contributed ₦${contributeDto.amount} to your campaign "${campaign.title}"`,
                type: notification_entity_1.NotificationType.GENERAL,
                channel: notification_entity_1.NotificationChannel.IN_APP,
                userId: campaign.creatorId,
            });
            this.eventEmitter.emit('crowdfunding.contribution', {
                campaign,
                contribution: savedContribution
            });
            return savedContribution;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getCampaignContributions(campaignId, page = 1, limit = 20) {
        const [contributions, total] = await this.contributionRepository.findAndCount({
            where: { campaignId },
            relations: ['contributor'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
            select: {
                contributor: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            },
        });
        return {
            contributions: contributions.map(c => ({
                ...c,
                contributor: c.isAnonymous ? null : c.contributor,
            })),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    generateShareableLink() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    generateReference() {
        return `CROWD_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }
};
exports.CrowdfundingService = CrowdfundingService;
exports.CrowdfundingService = CrowdfundingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(crowdfunding_campaign_entity_1.CrowdfundingCampaign)),
    __param(1, (0, typeorm_1.InjectRepository)(crowdfunding_contribution_entity_1.CrowdfundingContribution)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof wallet_service_1.WalletService !== "undefined" && wallet_service_1.WalletService) === "function" ? _c : Object, typeof (_d = typeof notifications_service_1.NotificationsService !== "undefined" && notifications_service_1.NotificationsService) === "function" ? _d : Object, typeof (_e = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _e : Object, typeof (_f = typeof typeorm_2.DataSource !== "undefined" && typeorm_2.DataSource) === "function" ? _f : Object])
], CrowdfundingService);


/***/ }),
/* 156 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CrowdfundingController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const crowdfunding_service_1 = __webpack_require__(155);
const create_campaign_dto_1 = __webpack_require__(157);
const contribute_dto_1 = __webpack_require__(158);
const jwt_auth_guard_1 = __webpack_require__(116);
const public_decorator_1 = __webpack_require__(110);
const positive_int_pipe_1 = __webpack_require__(126);
let CrowdfundingController = class CrowdfundingController {
    constructor(crowdfundingService) {
        this.crowdfundingService = crowdfundingService;
    }
    createCampaign(req, createCampaignDto) {
        return this.crowdfundingService.createCampaign(req.user.id, createCampaignDto);
    }
    findUserCampaigns(req, page, limit) {
        return this.crowdfundingService.findUserCampaigns(req.user.id, page, limit);
    }
    getPublicCampaign(shareableLink) {
        return this.crowdfundingService.getPublicCampaign(shareableLink);
    }
    findOne(id, req) {
        return this.crowdfundingService.findOne(id, req.user.id);
    }
    contribute(id, contributeDto, req) {
        return this.crowdfundingService.contribute(id, req.user.id, contributeDto);
    }
    getContributions(id, page, limit) {
        return this.crowdfundingService.getCampaignContributions(id, page, limit);
    }
};
exports.CrowdfundingController = CrowdfundingController;
__decorate([
    (0, common_1.Post)('campaigns'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create crowdfunding campaign' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Campaign created successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_campaign_dto_1.CreateCampaignDto !== "undefined" && create_campaign_dto_1.CreateCampaignDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], CrowdfundingController.prototype, "createCampaign", null);
__decorate([
    (0, common_1.Get)('campaigns'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get user campaigns' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Campaigns retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page', new positive_int_pipe_1.PositiveIntPipe(1))),
    __param(2, (0, common_1.Query)('limit', new positive_int_pipe_1.PositiveIntPipe(20, 100))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", void 0)
], CrowdfundingController.prototype, "findUserCampaigns", null);
__decorate([
    (0, common_1.Get)('campaigns/public/:shareableLink'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get public campaign by shareable link' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Campaign retrieved successfully' }),
    __param(0, (0, common_1.Param)('shareableLink')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CrowdfundingController.prototype, "getPublicCampaign", null);
__decorate([
    (0, common_1.Get)('campaigns/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get campaign by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Campaign retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CrowdfundingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('campaigns/:id/contribute'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Contribute to campaign' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Contribution successful' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof contribute_dto_1.ContributeDto !== "undefined" && contribute_dto_1.ContributeDto) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", void 0)
], CrowdfundingController.prototype, "contribute", null);
__decorate([
    (0, common_1.Get)('campaigns/:id/contributions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get campaign contributions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Contributions retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page', new positive_int_pipe_1.PositiveIntPipe(1))),
    __param(2, (0, common_1.Query)('limit', new positive_int_pipe_1.PositiveIntPipe(20, 100))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], CrowdfundingController.prototype, "getContributions", null);
exports.CrowdfundingController = CrowdfundingController = __decorate([
    (0, swagger_1.ApiTags)('Crowdfunding'),
    (0, common_1.Controller)('crowdfunding'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof crowdfunding_service_1.CrowdfundingService !== "undefined" && crowdfunding_service_1.CrowdfundingService) === "function" ? _a : Object])
], CrowdfundingController);


/***/ }),
/* 157 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCampaignDto = void 0;
const class_validator_1 = __webpack_require__(106);
const swagger_1 = __webpack_require__(3);
class CreateCampaignDto {
}
exports.CreateCampaignDto = CreateCampaignDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ minimum: 1000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1000),
    __metadata("design:type", Number)
], CreateCampaignDto.prototype, "targetAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateCampaignDto.prototype, "metadata", void 0);


/***/ }),
/* 158 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContributeDto = void 0;
const class_validator_1 = __webpack_require__(106);
const swagger_1 = __webpack_require__(3);
class ContributeDto {
}
exports.ContributeDto = ContributeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ minimum: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100),
    __metadata("design:type", Number)
], ContributeDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContributeDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ContributeDto.prototype, "isAnonymous", void 0);


/***/ }),
/* 159 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SharedWalletsModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const shared_wallets_service_1 = __webpack_require__(160);
const shared_wallets_controller_1 = __webpack_require__(161);
const shared_wallet_entity_1 = __webpack_require__(41);
const shared_wallet_member_entity_1 = __webpack_require__(42);
const shared_wallet_transaction_entity_1 = __webpack_require__(43);
const transaction_signature_entity_1 = __webpack_require__(44);
const wallet_module_1 = __webpack_require__(127);
const notifications_module_1 = __webpack_require__(124);
let SharedWalletsModule = class SharedWalletsModule {
};
exports.SharedWalletsModule = SharedWalletsModule;
exports.SharedWalletsModule = SharedWalletsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                shared_wallet_entity_1.SharedWallet,
                shared_wallet_member_entity_1.SharedWalletMember,
                shared_wallet_transaction_entity_1.SharedWalletTransaction,
                transaction_signature_entity_1.TransactionSignature,
            ]),
            wallet_module_1.WalletModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [shared_wallets_controller_1.SharedWalletsController],
        providers: [shared_wallets_service_1.SharedWalletsService],
        exports: [shared_wallets_service_1.SharedWalletsService],
    })
], SharedWalletsModule);


/***/ }),
/* 160 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SharedWalletsService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(18);
const event_emitter_1 = __webpack_require__(12);
const shared_wallet_entity_1 = __webpack_require__(41);
const shared_wallet_member_entity_1 = __webpack_require__(42);
const shared_wallet_transaction_entity_1 = __webpack_require__(43);
const transaction_signature_entity_1 = __webpack_require__(44);
const wallet_service_1 = __webpack_require__(74);
const wallet_entity_1 = __webpack_require__(24);
const notifications_service_1 = __webpack_require__(69);
const notification_entity_1 = __webpack_require__(26);
let SharedWalletsService = class SharedWalletsService {
    constructor(sharedWalletRepository, memberRepository, transactionRepository, signatureRepository, walletService, notificationsService, eventEmitter, dataSource) {
        this.sharedWalletRepository = sharedWalletRepository;
        this.memberRepository = memberRepository;
        this.transactionRepository = transactionRepository;
        this.signatureRepository = signatureRepository;
        this.walletService = walletService;
        this.notificationsService = notificationsService;
        this.eventEmitter = eventEmitter;
        this.dataSource = dataSource;
    }
    async create(creatorId, createSharedWalletDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const wallet = await this.walletService.createWallet(creatorId, {
                type: wallet_entity_1.WalletType.OTHERS,
                name: createSharedWalletDto.name,
                customerId: '',
            });
            const sharedWallet = queryRunner.manager.create(shared_wallet_entity_1.SharedWallet, {
                ...createSharedWalletDto,
                creatorId,
                walletId: wallet.id,
            });
            const savedSharedWallet = await queryRunner.manager.save(sharedWallet);
            const creatorMember = queryRunner.manager.create(shared_wallet_member_entity_1.SharedWalletMember, {
                userId: creatorId,
                sharedWalletId: savedSharedWallet.id,
                role: shared_wallet_member_entity_1.MemberRole.ADMIN,
                status: shared_wallet_member_entity_1.MemberStatus.ACTIVE,
                joinedAt: new Date(),
            });
            await queryRunner.manager.save(creatorMember);
            const members = createSharedWalletDto.members.map(m => queryRunner.manager.create(shared_wallet_member_entity_1.SharedWalletMember, {
                ...m,
                sharedWalletId: savedSharedWallet.id,
            }));
            await queryRunner.manager.save(members);
            await queryRunner.commitTransaction();
            for (const member of createSharedWalletDto.members) {
                await this.notificationsService.create({
                    title: 'Shared Wallet Invitation',
                    message: `You've been invited to join shared wallet: ${createSharedWalletDto.name}`,
                    type: notification_entity_1.NotificationType.GENERAL,
                    channel: notification_entity_1.NotificationChannel.IN_APP,
                    userId: member.userId,
                    metadata: { sharedWalletId: savedSharedWallet.id },
                });
            }
            return savedSharedWallet;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findUserSharedWallets(userId, page = 1, limit = 20) {
        const creatorWallets = await this.sharedWalletRepository.find({
            where: { creatorId: userId },
            relations: ['members', 'members.user', 'wallet'],
        });
        const memberWallets = await this.sharedWalletRepository
            .createQueryBuilder('sw')
            .leftJoinAndSelect('sw.members', 'member')
            .leftJoinAndSelect('sw.wallet', 'wallet')
            .leftJoinAndSelect('member.user', 'user')
            .where('member.userId = :userId', { userId })
            .getMany();
        const allWallets = [...creatorWallets, ...memberWallets];
        const uniqueWallets = allWallets.filter((wallet, index, self) => index === self.findIndex(w => w.id === wallet.id));
        const total = uniqueWallets.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedWallets = uniqueWallets.slice(startIndex, endIndex);
        return {
            sharedWallets: paginatedWallets,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id, userId) {
        const sharedWallet = await this.sharedWalletRepository.findOne({
            where: { id },
            relations: ['members', 'members.user', 'wallet', 'creator'],
        });
        if (!sharedWallet) {
            throw new common_1.NotFoundException('Shared wallet not found');
        }
        const hasAccess = sharedWallet.creatorId === userId ||
            sharedWallet.members.some(m => m.userId === userId);
        if (!hasAccess) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return sharedWallet;
    }
    async initiateTransaction(sharedWalletId, initiatorId, createTransactionDto) {
        const sharedWallet = await this.findOne(sharedWalletId, initiatorId);
        const member = sharedWallet.members.find(m => m.userId === initiatorId);
        if (!member || member.status !== shared_wallet_member_entity_1.MemberStatus.ACTIVE) {
            throw new common_1.ForbiddenException('User is not an active member of this shared wallet');
        }
        if (member.spendingLimit && createTransactionDto.amount > member.spendingLimit) {
            throw new common_1.BadRequestException('Transaction amount exceeds spending limit');
        }
        const transaction = this.transactionRepository.create({
            ...createTransactionDto,
            initiatorId,
            sharedWalletId,
            reference: this.generateReference(),
            status: sharedWallet.mode === shared_wallet_entity_1.SharedWalletMode.FREE_ACTION ?
                shared_wallet_transaction_entity_1.SharedTransactionStatus.APPROVED : shared_wallet_transaction_entity_1.SharedTransactionStatus.PENDING,
        });
        const savedTransaction = await this.transactionRepository.save(transaction);
        if (sharedWallet.mode === shared_wallet_entity_1.SharedWalletMode.SIGNATORY_REQUIRED) {
            const signatories = sharedWallet.members.filter(m => m.role === shared_wallet_member_entity_1.MemberRole.ADMIN && m.userId !== initiatorId);
            const signatures = signatories.map(s => this.signatureRepository.create({
                signerId: s.userId,
                transactionId: savedTransaction.id,
            }));
            await this.signatureRepository.save(signatures);
            for (const signatory of signatories) {
                await this.notificationsService.create({
                    title: 'Transaction Approval Required',
                    message: `Transaction approval required for shared wallet: ${sharedWallet.name}`,
                    type: notification_entity_1.NotificationType.GENERAL,
                    channel: notification_entity_1.NotificationChannel.IN_APP,
                    userId: signatory.userId,
                });
            }
        }
        else {
            await this.executeTransaction(savedTransaction.id);
        }
        return savedTransaction;
    }
    async signTransaction(transactionId, signerId, approved, comment) {
        const signature = await this.signatureRepository.findOne({
            where: { transactionId, signerId },
            relations: ['transaction', 'transaction.sharedWallet'],
        });
        if (!signature) {
            throw new common_1.NotFoundException('Signature request not found');
        }
        signature.status = approved ? transaction_signature_entity_1.SignatureStatus.APPROVED : transaction_signature_entity_1.SignatureStatus.REJECTED;
        signature.comment = comment;
        const savedSignature = await this.signatureRepository.save(signature);
        if (approved) {
            const allSignatures = await this.signatureRepository.find({
                where: { transactionId },
            });
            const approvedCount = allSignatures.filter(s => s.status === transaction_signature_entity_1.SignatureStatus.APPROVED).length;
            const requiredSignatures = signature.transaction.sharedWallet.requiredSignatures;
            if (approvedCount >= requiredSignatures) {
                await this.executeTransaction(transactionId);
            }
        }
        else {
            await this.transactionRepository.update(transactionId, {
                status: shared_wallet_transaction_entity_1.SharedTransactionStatus.REJECTED,
            });
        }
        return savedSignature;
    }
    async executeTransaction(transactionId) {
        const transaction = await this.transactionRepository.findOne({
            where: { id: transactionId },
            relations: ['sharedWallet', 'sharedWallet.wallet'],
        });
        if (!transaction) {
            throw new common_1.NotFoundException('Transaction not found');
        }
        await this.transactionRepository.update(transactionId, {
            status: shared_wallet_transaction_entity_1.SharedTransactionStatus.EXECUTED,
        });
    }
    generateReference() {
        return `SHARED_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }
};
exports.SharedWalletsService = SharedWalletsService;
exports.SharedWalletsService = SharedWalletsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(shared_wallet_entity_1.SharedWallet)),
    __param(1, (0, typeorm_1.InjectRepository)(shared_wallet_member_entity_1.SharedWalletMember)),
    __param(2, (0, typeorm_1.InjectRepository)(shared_wallet_transaction_entity_1.SharedWalletTransaction)),
    __param(3, (0, typeorm_1.InjectRepository)(transaction_signature_entity_1.TransactionSignature)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, typeof (_e = typeof wallet_service_1.WalletService !== "undefined" && wallet_service_1.WalletService) === "function" ? _e : Object, typeof (_f = typeof notifications_service_1.NotificationsService !== "undefined" && notifications_service_1.NotificationsService) === "function" ? _f : Object, typeof (_g = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _g : Object, typeof (_h = typeof typeorm_2.DataSource !== "undefined" && typeorm_2.DataSource) === "function" ? _h : Object])
], SharedWalletsService);


/***/ }),
/* 161 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SharedWalletsController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const shared_wallets_service_1 = __webpack_require__(160);
const create_shared_wallet_dto_1 = __webpack_require__(162);
const create_transaction_dto_1 = __webpack_require__(163);
const jwt_auth_guard_1 = __webpack_require__(116);
const positive_int_pipe_1 = __webpack_require__(126);
let SharedWalletsController = class SharedWalletsController {
    constructor(sharedWalletsService) {
        this.sharedWalletsService = sharedWalletsService;
    }
    create(req, createSharedWalletDto) {
        return this.sharedWalletsService.create(req.user.id, createSharedWalletDto);
    }
    findAll(req, page, limit) {
        return this.sharedWalletsService.findUserSharedWallets(req.user.id, page, limit);
    }
    findOne(id, req) {
        return this.sharedWalletsService.findOne(id, req.user.id);
    }
    initiateTransaction(id, createTransactionDto, req) {
        return this.sharedWalletsService.initiateTransaction(id, req.user.id, createTransactionDto);
    }
    signTransaction(id, body, req) {
        return this.sharedWalletsService.signTransaction(id, req.user.id, body.approved, body.comment);
    }
};
exports.SharedWalletsController = SharedWalletsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create shared wallet' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Shared wallet created successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_shared_wallet_dto_1.CreateSharedWalletDto !== "undefined" && create_shared_wallet_dto_1.CreateSharedWalletDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], SharedWalletsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user shared wallets' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Shared wallets retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page', new positive_int_pipe_1.PositiveIntPipe(1))),
    __param(2, (0, common_1.Query)('limit', new positive_int_pipe_1.PositiveIntPipe(20, 100))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", void 0)
], SharedWalletsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get shared wallet by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Shared wallet retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SharedWalletsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/transact'),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate shared wallet transaction' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transaction initiated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof create_transaction_dto_1.CreateSharedWalletTransactionDto !== "undefined" && create_transaction_dto_1.CreateSharedWalletTransactionDto) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", void 0)
], SharedWalletsController.prototype, "initiateTransaction", null);
__decorate([
    (0, common_1.Post)('transactions/:id/sign'),
    (0, swagger_1.ApiOperation)({ summary: 'Sign/approve transaction' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transaction signed successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], SharedWalletsController.prototype, "signTransaction", null);
exports.SharedWalletsController = SharedWalletsController = __decorate([
    (0, swagger_1.ApiTags)('Shared Wallets'),
    (0, common_1.Controller)('shared-wallets'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof shared_wallets_service_1.SharedWalletsService !== "undefined" && shared_wallets_service_1.SharedWalletsService) === "function" ? _a : Object])
], SharedWalletsController);


/***/ }),
/* 162 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateSharedWalletDto = void 0;
const class_validator_1 = __webpack_require__(106);
const swagger_1 = __webpack_require__(3);
const shared_wallet_entity_1 = __webpack_require__(41);
class CreateSharedWalletDto {
}
exports.CreateSharedWalletDto = CreateSharedWalletDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSharedWalletDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSharedWalletDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: shared_wallet_entity_1.SharedWalletMode }),
    (0, class_validator_1.IsEnum)(shared_wallet_entity_1.SharedWalletMode),
    __metadata("design:type", typeof (_a = typeof shared_wallet_entity_1.SharedWalletMode !== "undefined" && shared_wallet_entity_1.SharedWalletMode) === "function" ? _a : Object)
], CreateSharedWalletDto.prototype, "mode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ minimum: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateSharedWalletDto.prototype, "requiredSignatures", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Object] }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", typeof (_b = typeof Array !== "undefined" && Array) === "function" ? _b : Object)
], CreateSharedWalletDto.prototype, "members", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateSharedWalletDto.prototype, "rules", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateSharedWalletDto.prototype, "metadata", void 0);


/***/ }),
/* 163 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateSharedWalletTransactionDto = void 0;
const class_validator_1 = __webpack_require__(106);
const swagger_1 = __webpack_require__(3);
const shared_wallet_transaction_entity_1 = __webpack_require__(43);
class CreateSharedWalletTransactionDto {
}
exports.CreateSharedWalletTransactionDto = CreateSharedWalletTransactionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ minimum: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100),
    __metadata("design:type", Number)
], CreateSharedWalletTransactionDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: shared_wallet_transaction_entity_1.SharedTransactionType }),
    (0, class_validator_1.IsEnum)(shared_wallet_transaction_entity_1.SharedTransactionType),
    __metadata("design:type", typeof (_a = typeof shared_wallet_transaction_entity_1.SharedTransactionType !== "undefined" && shared_wallet_transaction_entity_1.SharedTransactionType) === "function" ? _a : Object)
], CreateSharedWalletTransactionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSharedWalletTransactionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateSharedWalletTransactionDto.prototype, "metadata", void 0);


/***/ }),
/* 164 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiInsightsModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const axios_1 = __webpack_require__(70);
const ai_insights_service_1 = __webpack_require__(165);
const ai_insights_controller_1 = __webpack_require__(166);
const spending_insight_entity_1 = __webpack_require__(45);
const budget_recommendation_entity_1 = __webpack_require__(29);
const wallet_module_1 = __webpack_require__(127);
let AiInsightsModule = class AiInsightsModule {
};
exports.AiInsightsModule = AiInsightsModule;
exports.AiInsightsModule = AiInsightsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([spending_insight_entity_1.SpendingInsight, budget_recommendation_entity_1.BudgetRecommendation]),
            axios_1.HttpModule,
            wallet_module_1.WalletModule,
        ],
        controllers: [ai_insights_controller_1.AiInsightsController],
        providers: [ai_insights_service_1.AiInsightsService],
        exports: [ai_insights_service_1.AiInsightsService],
    })
], AiInsightsModule);


/***/ }),
/* 165 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var AiInsightsService_1;
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiInsightsService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(18);
const axios_1 = __webpack_require__(70);
const config_1 = __webpack_require__(4);
const schedule_1 = __webpack_require__(11);
const spending_insight_entity_1 = __webpack_require__(45);
const budget_recommendation_entity_1 = __webpack_require__(29);
const wallet_service_1 = __webpack_require__(74);
const transaction_entity_1 = __webpack_require__(25);
let AiInsightsService = AiInsightsService_1 = class AiInsightsService {
    constructor(insightRepository, recommendationRepository, walletService, httpService, configService) {
        this.insightRepository = insightRepository;
        this.recommendationRepository = recommendationRepository;
        this.walletService = walletService;
        this.httpService = httpService;
        this.configService = configService;
        this.logger = new common_1.Logger(AiInsightsService_1.name);
    }
    async generateInsights(userId) {
        try {
            const transactionData = await this.walletService.getTransactionHistory(userId, 1, 100);
            const spendingAnalysis = this.analyzeSpendingPatterns(transactionData.transactions);
            const aiInsights = await this.callAIService(spendingAnalysis);
            const insights = aiInsights.map(insight => this.insightRepository.create({
                ...insight,
                userId,
            }));
            return this.insightRepository.save(insights);
        }
        catch (error) {
            this.logger.error(`Failed to generate insights for user ${userId}:`, error);
            throw error;
        }
    }
    async getUserInsights(userId, page = 1, limit = 20) {
        const [insights, total] = await this.insightRepository.findAndCount({
            where: { userId },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            insights,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getBudgetRecommendations(userId) {
        return this.recommendationRepository.find({
            where: { userId, isImplemented: false },
            order: { potentialSavings: 'DESC' },
        });
    }
    async markInsightAsRead(insightId, userId) {
        await this.insightRepository.update({ id: insightId, userId }, { isRead: true });
    }
    async implementRecommendation(recommendationId, userId) {
        await this.recommendationRepository.update({ id: recommendationId, userId }, { isImplemented: true });
    }
    async generateDailyInsights() {
        this.logger.log('Generating daily AI insights for all users');
        try {
            this.logger.log('Daily insights generation completed');
        }
        catch (error) {
            this.logger.error('Failed to generate daily insights:', error);
        }
    }
    analyzeSpendingPatterns(transactions) {
        const analysis = {
            totalSpending: 0,
            categoryBreakdown: {},
            monthlyTrend: [],
            frequentMerchants: [],
            averageTransactionAmount: 0,
        };
        transactions.forEach(transaction => {
            if (transaction.type === transaction_entity_1.TransactionType.BILL_PAYMENT ||
                transaction.type === transaction_entity_1.TransactionType.WITHDRAWAL) {
                analysis.totalSpending += Number(transaction.amount);
                const category = transaction.metadata?.category || 'other';
                analysis.categoryBreakdown[category] =
                    (analysis.categoryBreakdown[category] || 0) + Number(transaction.amount);
            }
        });
        analysis.averageTransactionAmount = analysis.totalSpending / transactions.length || 0;
        return analysis;
    }
    async callAIService(spendingData) {
        const insights = [];
        if (spendingData.totalSpending > 50000) {
            insights.push({
                type: spending_insight_entity_1.InsightType.BUDGET_ALERT,
                priority: spending_insight_entity_1.InsightPriority.HIGH,
                title: 'High Spending Alert',
                description: 'Your spending this month is significantly higher than usual',
                recommendation: 'Consider reviewing your budget and reducing discretionary spending',
                data: spendingData,
            });
        }
        if (spendingData.categoryBreakdown?.entertainment &&
            spendingData.categoryBreakdown.entertainment > spendingData.totalSpending * 0.3) {
            insights.push({
                type: spending_insight_entity_1.InsightType.CATEGORY_ANALYSIS,
                priority: spending_insight_entity_1.InsightPriority.MEDIUM,
                title: 'Entertainment Spending High',
                description: 'Entertainment expenses account for over 30% of your spending',
                recommendation: 'Consider setting a monthly entertainment budget limit',
                data: { category: 'entertainment', percentage: 30 },
            });
        }
        return insights;
    }
};
exports.AiInsightsService = AiInsightsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], AiInsightsService.prototype, "generateDailyInsights", null);
exports.AiInsightsService = AiInsightsService = AiInsightsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(spending_insight_entity_1.SpendingInsight)),
    __param(1, (0, typeorm_1.InjectRepository)(budget_recommendation_entity_1.BudgetRecommendation)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof wallet_service_1.WalletService !== "undefined" && wallet_service_1.WalletService) === "function" ? _c : Object, typeof (_d = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _d : Object, typeof (_e = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _e : Object])
], AiInsightsService);


/***/ }),
/* 166 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiInsightsController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const ai_insights_service_1 = __webpack_require__(165);
const jwt_auth_guard_1 = __webpack_require__(116);
const positive_int_pipe_1 = __webpack_require__(126);
let AiInsightsController = class AiInsightsController {
    constructor(aiInsightsService) {
        this.aiInsightsService = aiInsightsService;
    }
    generateInsights(req) {
        return this.aiInsightsService.generateInsights(req.user.id);
    }
    getInsights(req, page, limit) {
        return this.aiInsightsService.getUserInsights(req.user.id, page, limit);
    }
    getRecommendations(req) {
        return this.aiInsightsService.getBudgetRecommendations(req.user.id);
    }
    markAsRead(id, req) {
        return this.aiInsightsService.markInsightAsRead(id, req.user.id);
    }
    implementRecommendation(id, req) {
        return this.aiInsightsService.implementRecommendation(id, req.user.id);
    }
};
exports.AiInsightsController = AiInsightsController;
__decorate([
    (0, common_1.Post)('generate'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate AI spending insights' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Insights generated successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiInsightsController.prototype, "generateInsights", null);
__decorate([
    (0, common_1.Get)('insights'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user spending insights' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Insights retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page', new positive_int_pipe_1.PositiveIntPipe(1))),
    __param(2, (0, common_1.Query)('limit', new positive_int_pipe_1.PositiveIntPipe(20, 100))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", void 0)
], AiInsightsController.prototype, "getInsights", null);
__decorate([
    (0, common_1.Get)('recommendations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get budget recommendations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Recommendations retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiInsightsController.prototype, "getRecommendations", null);
__decorate([
    (0, common_1.Patch)('insights/:id/read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark insight as read' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Insight marked as read' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AiInsightsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Patch)('recommendations/:id/implement'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark recommendation as implemented' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Recommendation marked as implemented' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AiInsightsController.prototype, "implementRecommendation", null);
exports.AiInsightsController = AiInsightsController = __decorate([
    (0, swagger_1.ApiTags)('AI Insights'),
    (0, common_1.Controller)('ai-insights'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof ai_insights_service_1.AiInsightsService !== "undefined" && ai_insights_service_1.AiInsightsService) === "function" ? _a : Object])
], AiInsightsController);


/***/ }),
/* 167 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RewardsModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const rewards_service_1 = __webpack_require__(168);
const rewards_controller_1 = __webpack_require__(169);
const reward_entity_1 = __webpack_require__(37);
const user_reward_entity_1 = __webpack_require__(38);
const reward_rule_entity_1 = __webpack_require__(39);
const wallet_module_1 = __webpack_require__(127);
const notifications_module_1 = __webpack_require__(124);
let RewardsModule = class RewardsModule {
};
exports.RewardsModule = RewardsModule;
exports.RewardsModule = RewardsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([reward_entity_1.Reward, user_reward_entity_1.UserReward, reward_rule_entity_1.RewardRule]),
            wallet_module_1.WalletModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [rewards_controller_1.RewardsController],
        providers: [rewards_service_1.RewardsService],
        exports: [rewards_service_1.RewardsService],
    })
], RewardsModule);


/***/ }),
/* 168 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var RewardsService_1;
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RewardsService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(18);
const event_emitter_1 = __webpack_require__(12);
const schedule_1 = __webpack_require__(11);
const reward_entity_1 = __webpack_require__(37);
const user_reward_entity_1 = __webpack_require__(38);
const reward_rule_entity_1 = __webpack_require__(39);
const wallet_service_1 = __webpack_require__(74);
const notifications_service_1 = __webpack_require__(69);
const notification_entity_1 = __webpack_require__(26);
let RewardsService = RewardsService_1 = class RewardsService {
    constructor(rewardRepository, userRewardRepository, rewardRuleRepository, walletService, notificationsService, eventEmitter) {
        this.rewardRepository = rewardRepository;
        this.userRewardRepository = userRewardRepository;
        this.rewardRuleRepository = rewardRuleRepository;
        this.walletService = walletService;
        this.notificationsService = notificationsService;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(RewardsService_1.name);
    }
    async handleBillPayment(payload) {
        const { transaction } = payload;
        try {
            const applicableRewards = await this.getApplicableRewards(transaction.userId, reward_entity_1.RewardCategory.BILL_PAYMENT, transaction.amount);
            for (const reward of applicableRewards) {
                await this.awardReward(transaction.userId, reward.id, transaction.id);
            }
            await this.checkStreakRewards(transaction.userId, reward_entity_1.RewardCategory.BILL_PAYMENT);
        }
        catch (error) {
            this.logger.error('Failed to process bill payment rewards:', error);
        }
    }
    async getUserRewards(userId, page = 1, limit = 20) {
        const [rewards, total] = await this.userRewardRepository.findAndCount({
            where: { userId },
            relations: ['reward'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            rewards,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async redeemReward(userRewardId, userId) {
        const userReward = await this.userRewardRepository.findOne({
            where: { id: userRewardId, userId },
            relations: ['reward'],
        });
        if (!userReward) {
            throw new Error('Reward not found');
        }
        if (userReward.status !== user_reward_entity_1.UserRewardStatus.EARNED) {
            throw new Error('Reward already redeemed or expired');
        }
        await this.walletService.creditMainWallet(userId, userReward.amount, 'Reward redemption');
        userReward.status = user_reward_entity_1.UserRewardStatus.REDEEMED;
        userReward.redeemedAt = new Date();
        await this.userRewardRepository.save(userReward);
        await this.notificationsService.create({
            title: 'Reward Redeemed',
            message: `You've successfully redeemed ₦${userReward.amount} from your ${userReward.reward.name} reward`,
            type: notification_entity_1.NotificationType.GENERAL,
            channel: notification_entity_1.NotificationChannel.IN_APP,
            userId,
        });
        return userReward;
    }
    async getRewardSummary(userId) {
        const rewards = await this.userRewardRepository.find({
            where: { userId },
        });
        const totalEarned = rewards.reduce((sum, r) => sum + Number(r.amount), 0);
        const totalRedeemed = rewards
            .filter(r => r.status === user_reward_entity_1.UserRewardStatus.REDEEMED)
            .reduce((sum, r) => sum + Number(r.amount), 0);
        const availableRewards = rewards
            .filter(r => r.status === user_reward_entity_1.UserRewardStatus.EARNED)
            .reduce((sum, r) => sum + Number(r.amount), 0);
        const currentStreak = await this.calculateUserStreak(userId);
        return {
            totalEarned,
            totalRedeemed,
            availableRewards,
            currentStreak,
        };
    }
    async processExpiredRewards() {
        const expiredRewards = await this.userRewardRepository.find({
            where: {
                status: user_reward_entity_1.UserRewardStatus.EARNED,
                expiresAt: new Date(),
            },
        });
        for (const reward of expiredRewards) {
            reward.status = user_reward_entity_1.UserRewardStatus.EXPIRED;
            await this.userRewardRepository.save(reward);
        }
        this.logger.log(`Processed ${expiredRewards.length} expired rewards`);
    }
    async getApplicableRewards(userId, category, amount) {
        return this.rewardRepository.find({
            where: {
                category,
                isActive: true,
            },
        });
    }
    async awardReward(userId, rewardId, transactionId) {
        const reward = await this.rewardRepository.findOne({ where: { id: rewardId } });
        if (!reward)
            return;
        let rewardAmount = 0;
        if (reward.type === reward_entity_1.RewardType.CASHBACK) {
            const transaction = transactionId ?
                await this.walletService.getTransactionById(transactionId) : null;
            rewardAmount = transaction ? (Number(transaction.amount) * Number(reward.value)) / 100 : 0;
        }
        else {
            rewardAmount = Number(reward.value);
        }
        const userReward = this.userRewardRepository.create({
            userId,
            rewardId,
            transactionId,
            amount: rewardAmount,
            reference: this.generateReference(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
        await this.userRewardRepository.save(userReward);
        await this.notificationsService.create({
            title: 'Reward Earned!',
            message: `You've earned ₦${rewardAmount} from ${reward.name}`,
            type: notification_entity_1.NotificationType.GENERAL,
            channel: notification_entity_1.NotificationChannel.IN_APP,
            userId,
        });
    }
    async checkStreakRewards(userId, category) {
        const streak = await this.calculateUserStreak(userId);
        const streakMilestones = [7, 14, 30, 60, 90];
        if (streakMilestones.includes(streak)) {
            const bonusAmount = streak * 10;
            const userReward = this.userRewardRepository.create({
                userId,
                rewardId: null,
                amount: bonusAmount,
                reference: this.generateReference(),
                metadata: { type: 'streak_bonus', streak },
            });
            await this.userRewardRepository.save(userReward);
        }
    }
    async calculateUserStreak(userId) {
        return 0;
    }
    generateReference() {
        return `RWD_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }
};
exports.RewardsService = RewardsService;
__decorate([
    (0, event_emitter_1.OnEvent)('bill.paid'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], RewardsService.prototype, "handleBillPayment", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], RewardsService.prototype, "processExpiredRewards", null);
exports.RewardsService = RewardsService = RewardsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reward_entity_1.Reward)),
    __param(1, (0, typeorm_1.InjectRepository)(user_reward_entity_1.UserReward)),
    __param(2, (0, typeorm_1.InjectRepository)(reward_rule_entity_1.RewardRule)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof wallet_service_1.WalletService !== "undefined" && wallet_service_1.WalletService) === "function" ? _d : Object, typeof (_e = typeof notifications_service_1.NotificationsService !== "undefined" && notifications_service_1.NotificationsService) === "function" ? _e : Object, typeof (_f = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _f : Object])
], RewardsService);


/***/ }),
/* 169 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RewardsController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const rewards_service_1 = __webpack_require__(168);
const jwt_auth_guard_1 = __webpack_require__(116);
const positive_int_pipe_1 = __webpack_require__(126);
let RewardsController = class RewardsController {
    constructor(rewardsService) {
        this.rewardsService = rewardsService;
    }
    getUserRewards(req, page, limit) {
        return this.rewardsService.getUserRewards(req.user.id, page, limit);
    }
    getRewardSummary(req) {
        return this.rewardsService.getRewardSummary(req.user.id);
    }
    redeemReward(id, req) {
        return this.rewardsService.redeemReward(id, req.user.id);
    }
};
exports.RewardsController = RewardsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user rewards' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rewards retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page', new positive_int_pipe_1.PositiveIntPipe(1))),
    __param(2, (0, common_1.Query)('limit', new positive_int_pipe_1.PositiveIntPipe(20, 100))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", void 0)
], RewardsController.prototype, "getUserRewards", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reward summary' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reward summary retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RewardsController.prototype, "getRewardSummary", null);
__decorate([
    (0, common_1.Post)(':id/redeem'),
    (0, swagger_1.ApiOperation)({ summary: 'Redeem reward' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reward redeemed successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RewardsController.prototype, "redeemReward", null);
exports.RewardsController = RewardsController = __decorate([
    (0, swagger_1.ApiTags)('Rewards'),
    (0, common_1.Controller)('rewards'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof rewards_service_1.RewardsService !== "undefined" && rewards_service_1.RewardsService) === "function" ? _a : Object])
], RewardsController);


/***/ }),
/* 170 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LedgerModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const ledger_service_1 = __webpack_require__(171);
const ledger_controller_1 = __webpack_require__(172);
const ledger_entry_entity_1 = __webpack_require__(34);
const reconciliation_record_entity_1 = __webpack_require__(35);
let LedgerModule = class LedgerModule {
};
exports.LedgerModule = LedgerModule;
exports.LedgerModule = LedgerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([ledger_entry_entity_1.LedgerEntry, reconciliation_record_entity_1.ReconciliationRecord]),
        ],
        controllers: [ledger_controller_1.LedgerController],
        providers: [ledger_service_1.LedgerService],
        exports: [ledger_service_1.LedgerService],
    })
], LedgerModule);


/***/ }),
/* 171 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var LedgerService_1;
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LedgerService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(18);
const event_emitter_1 = __webpack_require__(12);
const schedule_1 = __webpack_require__(11);
const ledger_entry_entity_1 = __webpack_require__(34);
const reconciliation_record_entity_1 = __webpack_require__(35);
let LedgerService = LedgerService_1 = class LedgerService {
    constructor(ledgerRepository, reconciliationRepository, eventEmitter) {
        this.ledgerRepository = ledgerRepository;
        this.reconciliationRepository = reconciliationRepository;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(LedgerService_1.name);
    }
    async recordTransaction(payload) {
        const entry = this.ledgerRepository.create({
            ...payload,
            status: ledger_entry_entity_1.LedgerStatus.PENDING,
        });
        const savedEntry = await this.ledgerRepository.save(entry);
        this.logger.log(`Ledger entry created: ${savedEntry.reference}`);
        return savedEntry;
    }
    async updateTransactionStatus(payload) {
        await this.ledgerRepository.update({ reference: payload.reference }, {
            status: payload.status,
            providerReference: payload.providerReference,
            reconciledAt: new Date(),
        });
        this.logger.log(`Ledger entry updated: ${payload.reference} -> ${payload.status}`);
    }
    async getLedgerEntries(userId, startDate, endDate, provider, page = 1, limit = 50) {
        const where = {};
        if (userId)
            where.userId = userId;
        if (provider)
            where.provider = provider;
        if (startDate && endDate) {
            where.createdAt = (0, typeorm_2.Between)(startDate, endDate);
        }
        const [entries, total] = await this.ledgerRepository.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            entries,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getBalanceSummary(userId) {
        const where = userId ? { userId } : {};
        const entries = await this.ledgerRepository.find({ where });
        const summary = {
            totalCredits: 0,
            totalDebits: 0,
            netBalance: 0,
            byProvider: {},
        };
        Object.values(ledger_entry_entity_1.LedgerProvider).forEach(provider => {
            summary.byProvider[provider] = { credits: 0, debits: 0, net: 0 };
        });
        entries.forEach(entry => {
            const amount = Number(entry.amount);
            if (entry.type === ledger_entry_entity_1.LedgerEntryType.CREDIT) {
                summary.totalCredits += amount;
                summary.byProvider[entry.provider].credits += amount;
            }
            else {
                summary.totalDebits += amount;
                summary.byProvider[entry.provider].debits += amount;
            }
        });
        summary.netBalance = summary.totalCredits - summary.totalDebits;
        Object.keys(summary.byProvider).forEach(providerKey => {
            const provider = providerKey;
            const providerData = summary.byProvider[provider];
            providerData.net = providerData.credits - providerData.debits;
        });
        return summary;
    }
    async performDailyReconciliation() {
        this.logger.log('Starting daily reconciliation');
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        const today = new Date(yesterday);
        today.setDate(today.getDate() + 1);
        try {
            const reconciliation = await this.reconcileTransactions(yesterday, today);
            this.logger.log(`Daily reconciliation completed: ${reconciliation.reconciledEntries}/${reconciliation.totalEntries} entries reconciled`);
        }
        catch (error) {
            this.logger.error('Daily reconciliation failed:', error);
        }
    }
    async reconcileTransactions(startDate, endDate) {
        const entries = await this.ledgerRepository.find({
            where: {
                createdAt: (0, typeorm_2.Between)(startDate, endDate),
                status: ledger_entry_entity_1.LedgerStatus.COMPLETED,
            },
        });
        const reconciliation = this.reconciliationRepository.create({
            type: reconciliation_record_entity_1.ReconciliationType.AUTOMATIC,
            status: reconciliation_record_entity_1.ReconciliationStatus.PENDING,
            reconciliationDate: startDate,
            totalEntries: entries.length,
            reconciledEntries: 0,
            discrepancies: 0,
            totalAmount: entries.reduce((sum, entry) => sum + Number(entry.amount), 0),
        });
        reconciliation.status = reconciliation_record_entity_1.ReconciliationStatus.COMPLETED;
        reconciliation.reconciledEntries = entries.length;
        return this.reconciliationRepository.save(reconciliation);
    }
    async getReconciliationHistory(page = 1, limit = 20) {
        const [records, total] = await this.reconciliationRepository.findAndCount({
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            records,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
};
exports.LedgerService = LedgerService;
__decorate([
    (0, event_emitter_1.OnEvent)('transaction.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], LedgerService.prototype, "recordTransaction", null);
__decorate([
    (0, event_emitter_1.OnEvent)('transaction.completed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], LedgerService.prototype, "updateTransactionStatus", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_2AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], LedgerService.prototype, "performDailyReconciliation", null);
exports.LedgerService = LedgerService = LedgerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ledger_entry_entity_1.LedgerEntry)),
    __param(1, (0, typeorm_1.InjectRepository)(reconciliation_record_entity_1.ReconciliationRecord)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _c : Object])
], LedgerService);


/***/ }),
/* 172 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LedgerController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const ledger_service_1 = __webpack_require__(171);
const jwt_auth_guard_1 = __webpack_require__(116);
const roles_guard_1 = __webpack_require__(117);
const roles_decorator_1 = __webpack_require__(23);
const ledger_entry_entity_1 = __webpack_require__(34);
const positive_int_pipe_1 = __webpack_require__(126);
let LedgerController = class LedgerController {
    constructor(ledgerService) {
        this.ledgerService = ledgerService;
    }
    getLedgerEntries(req, page, limit, startDate, endDate, provider) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.ledgerService.getLedgerEntries(req.user.id, start, end, provider, page, limit);
    }
    getBalanceSummary(req) {
        return this.ledgerService.getBalanceSummary(req.user.id);
    }
    getAllLedgerEntries(page, limit, userId, startDate, endDate, provider) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.ledgerService.getLedgerEntries(userId, start, end, provider, page, limit);
    }
    getSystemBalanceSummary() {
        return this.ledgerService.getBalanceSummary();
    }
    performReconciliation(startDate, endDate) {
        return this.ledgerService.reconcileTransactions(new Date(startDate), new Date(endDate));
    }
    getReconciliationHistory(page, limit) {
        return this.ledgerService.getReconciliationHistory(page, limit);
    }
};
exports.LedgerController = LedgerController;
__decorate([
    (0, common_1.Get)('entries'),
    (0, swagger_1.ApiOperation)({ summary: 'Get ledger entries' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ledger entries retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page', new positive_int_pipe_1.PositiveIntPipe(1))),
    __param(2, (0, common_1.Query)('limit', new positive_int_pipe_1.PositiveIntPipe(50, 100))),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __param(5, (0, common_1.Query)('provider')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String, String, typeof (_b = typeof ledger_entry_entity_1.LedgerProvider !== "undefined" && ledger_entry_entity_1.LedgerProvider) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], LedgerController.prototype, "getLedgerEntries", null);
__decorate([
    (0, common_1.Get)('balance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get balance summary' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Balance summary retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LedgerController.prototype, "getBalanceSummary", null);
__decorate([
    (0, common_1.Get)('admin/entries'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all ledger entries (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All ledger entries retrieved successfully' }),
    __param(0, (0, common_1.Query)('page', new positive_int_pipe_1.PositiveIntPipe(1))),
    __param(1, (0, common_1.Query)('limit', new positive_int_pipe_1.PositiveIntPipe(50, 100))),
    __param(2, (0, common_1.Query)('userId')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __param(5, (0, common_1.Query)('provider')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, typeof (_c = typeof ledger_entry_entity_1.LedgerProvider !== "undefined" && ledger_entry_entity_1.LedgerProvider) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], LedgerController.prototype, "getAllLedgerEntries", null);
__decorate([
    (0, common_1.Get)('admin/balance'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get system balance summary (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'System balance summary retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LedgerController.prototype, "getSystemBalanceSummary", null);
__decorate([
    (0, common_1.Post)('admin/reconcile'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Perform manual reconciliation (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reconciliation completed successfully' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LedgerController.prototype, "performReconciliation", null);
__decorate([
    (0, common_1.Get)('admin/reconciliation-history'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get reconciliation history (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reconciliation history retrieved successfully' }),
    __param(0, (0, common_1.Query)('page', new positive_int_pipe_1.PositiveIntPipe(1))),
    __param(1, (0, common_1.Query)('limit', new positive_int_pipe_1.PositiveIntPipe(20, 100))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], LedgerController.prototype, "getReconciliationHistory", null);
exports.LedgerController = LedgerController = __decorate([
    (0, swagger_1.ApiTags)('Ledger'),
    (0, common_1.Controller)('ledger'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof ledger_service_1.LedgerService !== "undefined" && ledger_service_1.LedgerService) === "function" ? _a : Object])
], LedgerController);


/***/ }),
/* 173 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransfersModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const bullmq_1 = __webpack_require__(9);
const transfers_service_1 = __webpack_require__(174);
const transfers_controller_1 = __webpack_require__(175);
const transfer_entity_1 = __webpack_require__(46);
const scheduled_transfer_entity_1 = __webpack_require__(40);
const bank_downtime_entity_1 = __webpack_require__(17);
const wallet_module_1 = __webpack_require__(127);
const notifications_module_1 = __webpack_require__(124);
const ledger_module_1 = __webpack_require__(170);
let TransfersModule = class TransfersModule {
};
exports.TransfersModule = TransfersModule;
exports.TransfersModule = TransfersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([transfer_entity_1.Transfer, scheduled_transfer_entity_1.ScheduledTransfer, bank_downtime_entity_1.BankDowntime]),
            bullmq_1.BullModule.registerQueue({
                name: 'transfers',
            }),
            wallet_module_1.WalletModule,
            notifications_module_1.NotificationsModule,
            ledger_module_1.LedgerModule,
        ],
        controllers: [transfers_controller_1.TransfersController],
        providers: [transfers_service_1.TransfersService],
        exports: [transfers_service_1.TransfersService],
    })
], TransfersModule);


/***/ }),
/* 174 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var TransfersService_1;
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransfersService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(18);
const bullmq_1 = __webpack_require__(9);
const bullmq_2 = __webpack_require__(75);
const event_emitter_1 = __webpack_require__(12);
const schedule_1 = __webpack_require__(11);
const transfer_entity_1 = __webpack_require__(46);
const scheduled_transfer_entity_1 = __webpack_require__(40);
const bank_downtime_entity_1 = __webpack_require__(17);
const wallet_service_1 = __webpack_require__(74);
const notifications_service_1 = __webpack_require__(69);
const notification_entity_1 = __webpack_require__(26);
const ledger_service_1 = __webpack_require__(171);
const ledger_entry_entity_1 = __webpack_require__(34);
let TransfersService = TransfersService_1 = class TransfersService {
    constructor(transferRepository, scheduledTransferRepository, bankDowntimeRepository, transferQueue, walletService, notificationsService, ledgerService, eventEmitter, dataSource) {
        this.transferRepository = transferRepository;
        this.scheduledTransferRepository = scheduledTransferRepository;
        this.bankDowntimeRepository = bankDowntimeRepository;
        this.transferQueue = transferQueue;
        this.walletService = walletService;
        this.notificationsService = notificationsService;
        this.ledgerService = ledgerService;
        this.eventEmitter = eventEmitter;
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(TransfersService_1.name);
    }
    async createTransfer(userId, createTransferDto) {
        if (createTransferDto.type === transfer_entity_1.TransferType.WALLET_TO_BANK) {
            const { bankCode } = createTransferDto.destinationDetails;
            if (!bankCode) {
                throw new common_1.BadRequestException('destinationDetails.bankCode is required for a wallet-to-bank transfer');
            }
            const downtime = await this.checkBankDowntime(bankCode);
            if (downtime) {
                throw new common_1.BadRequestException(`Bank is currently experiencing downtime: ${downtime.description}`);
            }
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const transfer = queryRunner.manager.create(transfer_entity_1.Transfer, {
                ...createTransferDto,
                userId,
                reference: this.generateReference(),
                status: transfer_entity_1.TransferStatus.PENDING,
            });
            const savedTransfer = await queryRunner.manager.save(transfer);
            await this.ledgerService.recordTransaction({
                userId,
                walletId: createTransferDto.sourceWalletId,
                transactionId: savedTransfer.id,
                amount: createTransferDto.amount,
                type: ledger_entry_entity_1.LedgerEntryType.DEBIT,
                provider: ledger_entry_entity_1.LedgerProvider.INTERNAL,
                reference: savedTransfer.reference,
                description: createTransferDto.description,
                metadata: createTransferDto.metadata,
            });
            await queryRunner.commitTransaction();
            await this.transferQueue.add('process-transfer', {
                transferId: savedTransfer.id,
            });
            return savedTransfer;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async createScheduledTransfer(userId, createScheduledTransferDto) {
        const scheduledTransfer = this.scheduledTransferRepository.create({
            ...createScheduledTransferDto,
            userId,
            nextExecutionDate: new Date(createScheduledTransferDto.nextExecutionDate),
            endDate: createScheduledTransferDto.endDate ?
                new Date(createScheduledTransferDto.endDate) : null,
        });
        return this.scheduledTransferRepository.save(scheduledTransfer);
    }
    async getUserTransfers(userId, page = 1, limit = 20) {
        const [transfers, total] = await this.transferRepository.findAndCount({
            where: { userId },
            relations: ['sourceWallet', 'destinationWallet'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            transfers,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getScheduledTransfers(userId) {
        return this.scheduledTransferRepository.find({
            where: { userId, status: scheduled_transfer_entity_1.ScheduleStatus.ACTIVE },
            order: { nextExecutionDate: 'ASC' },
        });
    }
    async pauseScheduledTransfer(id, userId) {
        const transfer = await this.scheduledTransferRepository.findOne({
            where: { id, userId },
        });
        if (!transfer) {
            throw new common_1.NotFoundException('Scheduled transfer not found');
        }
        transfer.status = scheduled_transfer_entity_1.ScheduleStatus.PAUSED;
        return this.scheduledTransferRepository.save(transfer);
    }
    async resumeScheduledTransfer(id, userId) {
        const transfer = await this.scheduledTransferRepository.findOne({
            where: { id, userId },
        });
        if (!transfer) {
            throw new common_1.NotFoundException('Scheduled transfer not found');
        }
        transfer.status = scheduled_transfer_entity_1.ScheduleStatus.ACTIVE;
        return this.scheduledTransferRepository.save(transfer);
    }
    async cancelScheduledTransfer(id, userId) {
        const result = await this.scheduledTransferRepository.update({ id, userId }, { status: scheduled_transfer_entity_1.ScheduleStatus.CANCELLED });
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Scheduled transfer not found');
        }
    }
    async processScheduledTransfers() {
        const dueTransfers = await this.scheduledTransferRepository.find({
            where: {
                status: scheduled_transfer_entity_1.ScheduleStatus.ACTIVE,
            },
        });
        const now = new Date();
        const filteredTransfers = dueTransfers.filter(transfer => transfer.nextExecutionDate <= now);
        for (const scheduledTransfer of filteredTransfers) {
            try {
                await this.executeScheduledTransfer(scheduledTransfer);
            }
            catch (error) {
                this.logger.error(`Failed to execute scheduled transfer ${scheduledTransfer.id}:`, error);
            }
        }
    }
    async checkBankDowntime(bankCode) {
        return this.bankDowntimeRepository.findOne({
            where: {
                bankCode,
                status: bank_downtime_entity_1.DowntimeStatus.ACTIVE,
            },
        });
    }
    async getBankDowntimes() {
        return this.bankDowntimeRepository.find({
            where: { status: bank_downtime_entity_1.DowntimeStatus.ACTIVE },
            order: { startTime: 'DESC' },
        });
    }
    async executeScheduledTransfer(scheduledTransfer) {
        const transferData = scheduledTransfer.transferTemplate;
        try {
            await this.createTransfer(scheduledTransfer.userId, transferData);
            scheduledTransfer.executionCount += 1;
            scheduledTransfer.nextExecutionDate = this.calculateNextExecutionDate(scheduledTransfer);
            if (scheduledTransfer.maxExecutions &&
                scheduledTransfer.executionCount >= scheduledTransfer.maxExecutions) {
                scheduledTransfer.status = scheduled_transfer_entity_1.ScheduleStatus.COMPLETED;
            }
            if (scheduledTransfer.endDate && new Date() >= scheduledTransfer.endDate) {
                scheduledTransfer.status = scheduled_transfer_entity_1.ScheduleStatus.COMPLETED;
            }
            await this.scheduledTransferRepository.save(scheduledTransfer);
        }
        catch (error) {
            this.logger.error(`Scheduled transfer execution failed:`, error);
            await this.notificationsService.create({
                title: 'Scheduled Transfer Failed',
                message: `Your scheduled transfer "${scheduledTransfer.name}" failed to execute`,
                type: notification_entity_1.NotificationType.GENERAL,
                channel: notification_entity_1.NotificationChannel.IN_APP,
                userId: scheduledTransfer.userId,
            });
        }
    }
    calculateNextExecutionDate(scheduledTransfer) {
        const current = scheduledTransfer.nextExecutionDate;
        const next = new Date(current);
        switch (scheduledTransfer.frequency) {
            case scheduled_transfer_entity_1.ScheduleFrequency.DAILY:
                next.setDate(next.getDate() + 1);
                break;
            case scheduled_transfer_entity_1.ScheduleFrequency.WEEKLY:
                next.setDate(next.getDate() + 7);
                break;
            case scheduled_transfer_entity_1.ScheduleFrequency.MONTHLY:
                next.setMonth(next.getMonth() + 1);
                break;
        }
        return next;
    }
    generateReference() {
        return `TRF_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }
};
exports.TransfersService = TransfersService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], TransfersService.prototype, "processScheduledTransfers", null);
exports.TransfersService = TransfersService = TransfersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transfer_entity_1.Transfer)),
    __param(1, (0, typeorm_1.InjectRepository)(scheduled_transfer_entity_1.ScheduledTransfer)),
    __param(2, (0, typeorm_1.InjectRepository)(bank_downtime_entity_1.BankDowntime)),
    __param(3, (0, bullmq_1.InjectQueue)('transfers')),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof bullmq_2.Queue !== "undefined" && bullmq_2.Queue) === "function" ? _d : Object, typeof (_e = typeof wallet_service_1.WalletService !== "undefined" && wallet_service_1.WalletService) === "function" ? _e : Object, typeof (_f = typeof notifications_service_1.NotificationsService !== "undefined" && notifications_service_1.NotificationsService) === "function" ? _f : Object, typeof (_g = typeof ledger_service_1.LedgerService !== "undefined" && ledger_service_1.LedgerService) === "function" ? _g : Object, typeof (_h = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _h : Object, typeof (_j = typeof typeorm_2.DataSource !== "undefined" && typeorm_2.DataSource) === "function" ? _j : Object])
], TransfersService);


/***/ }),
/* 175 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransfersController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const transfers_service_1 = __webpack_require__(174);
const create_transfer_dto_1 = __webpack_require__(176);
const create_scheduled_transfer_dto_1 = __webpack_require__(177);
const jwt_auth_guard_1 = __webpack_require__(116);
const positive_int_pipe_1 = __webpack_require__(126);
let TransfersController = class TransfersController {
    constructor(transfersService) {
        this.transfersService = transfersService;
    }
    create(req, createTransferDto) {
        return this.transfersService.createTransfer(req.user.id, createTransferDto);
    }
    findAll(req, page, limit) {
        return this.transfersService.getUserTransfers(req.user.id, page, limit);
    }
    createScheduled(req, createScheduledTransferDto) {
        return this.transfersService.createScheduledTransfer(req.user.id, createScheduledTransferDto);
    }
    getScheduled(req) {
        return this.transfersService.getScheduledTransfers(req.user.id);
    }
    pauseScheduled(id, req) {
        return this.transfersService.pauseScheduledTransfer(id, req.user.id);
    }
    resumeScheduled(id, req) {
        return this.transfersService.resumeScheduledTransfer(id, req.user.id);
    }
    cancelScheduled(id, req) {
        return this.transfersService.cancelScheduledTransfer(id, req.user.id);
    }
    getBankDowntimes() {
        return this.transfersService.getBankDowntimes();
    }
};
exports.TransfersController = TransfersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create transfer' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Transfer created successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_transfer_dto_1.CreateTransferDto !== "undefined" && create_transfer_dto_1.CreateTransferDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], TransfersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user transfers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transfers retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page', new positive_int_pipe_1.PositiveIntPipe(1))),
    __param(2, (0, common_1.Query)('limit', new positive_int_pipe_1.PositiveIntPipe(20, 100))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", void 0)
], TransfersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('scheduled'),
    (0, swagger_1.ApiOperation)({ summary: 'Create scheduled transfer' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Scheduled transfer created successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof create_scheduled_transfer_dto_1.CreateScheduledTransferDto !== "undefined" && create_scheduled_transfer_dto_1.CreateScheduledTransferDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], TransfersController.prototype, "createScheduled", null);
__decorate([
    (0, common_1.Get)('scheduled'),
    (0, swagger_1.ApiOperation)({ summary: 'Get scheduled transfers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Scheduled transfers retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TransfersController.prototype, "getScheduled", null);
__decorate([
    (0, common_1.Patch)('scheduled/:id/pause'),
    (0, swagger_1.ApiOperation)({ summary: 'Pause scheduled transfer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Scheduled transfer paused successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TransfersController.prototype, "pauseScheduled", null);
__decorate([
    (0, common_1.Patch)('scheduled/:id/resume'),
    (0, swagger_1.ApiOperation)({ summary: 'Resume scheduled transfer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Scheduled transfer resumed successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TransfersController.prototype, "resumeScheduled", null);
__decorate([
    (0, common_1.Delete)('scheduled/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel scheduled transfer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Scheduled transfer cancelled successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TransfersController.prototype, "cancelScheduled", null);
__decorate([
    (0, common_1.Get)('bank-downtimes'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current bank downtimes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bank downtimes retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TransfersController.prototype, "getBankDowntimes", null);
exports.TransfersController = TransfersController = __decorate([
    (0, swagger_1.ApiTags)('Transfers'),
    (0, common_1.Controller)('transfers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof transfers_service_1.TransfersService !== "undefined" && transfers_service_1.TransfersService) === "function" ? _a : Object])
], TransfersController);


/***/ }),
/* 176 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateTransferDto = void 0;
const class_validator_1 = __webpack_require__(106);
const swagger_1 = __webpack_require__(3);
const transfer_entity_1 = __webpack_require__(46);
class CreateTransferDto {
}
exports.CreateTransferDto = CreateTransferDto;
__decorate([
    (0, swagger_1.ApiProperty)({ minimum: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100),
    __metadata("design:type", Number)
], CreateTransferDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: transfer_entity_1.TransferType }),
    (0, class_validator_1.IsEnum)(transfer_entity_1.TransferType),
    __metadata("design:type", typeof (_a = typeof transfer_entity_1.TransferType !== "undefined" && transfer_entity_1.TransferType) === "function" ? _a : Object)
], CreateTransferDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTransferDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTransferDto.prototype, "sourceWalletId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTransferDto.prototype, "destinationWalletId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Object }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateTransferDto.prototype, "sourceDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Object }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateTransferDto.prototype, "destinationDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateTransferDto.prototype, "metadata", void 0);


/***/ }),
/* 177 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateScheduledTransferDto = void 0;
const class_validator_1 = __webpack_require__(106);
const swagger_1 = __webpack_require__(3);
const scheduled_transfer_entity_1 = __webpack_require__(40);
class CreateScheduledTransferDto {
}
exports.CreateScheduledTransferDto = CreateScheduledTransferDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateScheduledTransferDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ minimum: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100),
    __metadata("design:type", Number)
], CreateScheduledTransferDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: scheduled_transfer_entity_1.ScheduleFrequency }),
    (0, class_validator_1.IsEnum)(scheduled_transfer_entity_1.ScheduleFrequency),
    __metadata("design:type", typeof (_a = typeof scheduled_transfer_entity_1.ScheduleFrequency !== "undefined" && scheduled_transfer_entity_1.ScheduleFrequency) === "function" ? _a : Object)
], CreateScheduledTransferDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateScheduledTransferDto.prototype, "nextExecutionDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateScheduledTransferDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateScheduledTransferDto.prototype, "maxExecutions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Object }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", typeof (_b = typeof Record !== "undefined" && Record) === "function" ? _b : Object)
], CreateScheduledTransferDto.prototype, "transferTemplate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateScheduledTransferDto.prototype, "metadata", void 0);


/***/ }),
/* 178 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AllExceptionsFilter = void 0;
const common_1 = __webpack_require__(2);
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    constructor() {
        this.logger = new common_1.Logger(AllExceptionsFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error = 'Internal Server Error';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const errorResponse = exception.getResponse();
            if (typeof errorResponse === 'object' && errorResponse !== null) {
                message = errorResponse.message || exception.message;
                error = errorResponse.error || error;
            }
            else {
                message = errorResponse;
            }
        }
        const errorDetails = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message,
            error,
        };
        this.logger.error(`${request.method} ${request.url}`, JSON.stringify(errorDetails), exception instanceof Error ? exception.stack : 'No stack trace');
        response.status(status).json(errorDetails);
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);


/***/ }),
/* 179 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResponseInterceptor = void 0;
const common_1 = __webpack_require__(2);
const operators_1 = __webpack_require__(180);
let ResponseInterceptor = class ResponseInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;
        return next.handle().pipe((0, operators_1.map)((data) => ({
            success: true,
            message: this.getSuccessMessage(method, url),
            data,
            timestamp: new Date().toISOString(),
        })));
    }
    getSuccessMessage(method, url) {
        const resource = this.extractResource(url);
        switch (method) {
            case 'GET':
                return `${resource} retrieved successfully`;
            case 'POST':
                return `${resource} created successfully`;
            case 'PUT':
            case 'PATCH':
                return `${resource} updated successfully`;
            case 'DELETE':
                return `${resource} deleted successfully`;
            default:
                return 'Operation completed successfully';
        }
    }
    extractResource(url) {
        const segments = url.split('/').filter(Boolean);
        const resourceSegment = segments.find(segment => !segment.includes('api') &&
            !segment.includes('v1') &&
            !['me', 'profile'].includes(segment));
        return resourceSegment ?
            resourceSegment.charAt(0).toUpperCase() + resourceSegment.slice(1) :
            'Resource';
    }
};
exports.ResponseInterceptor = ResponseInterceptor;
exports.ResponseInterceptor = ResponseInterceptor = __decorate([
    (0, common_1.Injectable)()
], ResponseInterceptor);


/***/ }),
/* 180 */
/***/ ((module) => {

module.exports = require("rxjs/operators");

/***/ }),
/* 181 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LoggingInterceptor_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoggingInterceptor = void 0;
const common_1 = __webpack_require__(2);
const operators_1 = __webpack_require__(180);
let LoggingInterceptor = LoggingInterceptor_1 = class LoggingInterceptor {
    constructor() {
        this.logger = new common_1.Logger(LoggingInterceptor_1.name);
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const { method, url, ip, headers } = request;
        const userAgent = headers['user-agent'] || '';
        const now = Date.now();
        this.logger.log(`${method} ${url} - ${ip} - ${userAgent}`);
        return next.handle().pipe((0, operators_1.tap)(() => {
            const { statusCode } = response;
            const contentLength = response.get('content-length');
            const responseTime = Date.now() - now;
            this.logger.log(`${method} ${url} ${statusCode} ${contentLength || 0}b - ${responseTime}ms`);
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = LoggingInterceptor_1 = __decorate([
    (0, common_1.Injectable)()
], LoggingInterceptor);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ })()
;