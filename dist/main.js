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
const all_exceptions_filter_1 = __webpack_require__(153);
const response_interceptor_1 = __webpack_require__(154);
const logging_interceptor_1 = __webpack_require__(156);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const logger = new common_1.Logger('Bootstrap');
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    app.enableCors({
        origin: process.env.NODE_ENV === 'production' ? ['https://yourapp.com'] : true,
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
const redis_config_1 = __webpack_require__(25);
const auth_module_1 = __webpack_require__(26);
const users_module_1 = __webpack_require__(72);
const wallet_module_1 = __webpack_require__(85);
const bills_module_1 = __webpack_require__(94);
const notifications_module_1 = __webpack_require__(83);
const payments_module_1 = __webpack_require__(89);
const health_module_1 = __webpack_require__(99);
const kyc_module_1 = __webpack_require__(102);
const escrow_module_1 = __webpack_require__(104);
const bill_splitting_module_1 = __webpack_require__(111);
const crowdfunding_module_1 = __webpack_require__(117);
const shared_wallets_module_1 = __webpack_require__(124);
const ai_insights_module_1 = __webpack_require__(129);
const rewards_module_1 = __webpack_require__(134);
const ledger_module_1 = __webpack_require__(140);
const transfers_module_1 = __webpack_require__(145);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
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
const user_entity_1 = __webpack_require__(16);
const wallet_entity_1 = __webpack_require__(20);
const transaction_entity_1 = __webpack_require__(21);
const bill_entity_1 = __webpack_require__(23);
const bill_payment_entity_1 = __webpack_require__(24);
const notification_entity_1 = __webpack_require__(22);
let DatabaseConfig = class DatabaseConfig {
    constructor(configService) {
        this.configService = configService;
        this.DB_PREFIX = 'DB_PUBLIC';
        this.payload = {
            type: 'postgres',
            host: this.configService.get(`${this.DB_PREFIX}_HOST`),
            port: this.configService.get(`${this.DB_PREFIX}_PORT`),
            username: this.configService.get(`${this.DB_PREFIX}_USERNAME`),
            password: this.configService.get(`${this.DB_PREFIX}_PASSWORD`),
            database: this.configService.get(`${this.DB_PREFIX}_NAME`),
        };
    }
    createTypeOrmOptions() {
        return {
            ...this.payload,
            entities: [
                user_entity_1.User,
                wallet_entity_1.Wallet,
                transaction_entity_1.Transaction,
                bill_entity_1.Bill,
                bill_payment_entity_1.BillPayment,
                notification_entity_1.Notification,
            ],
            synchronize: this.configService.get('NODE_ENV') === 'development',
            ssl: this.configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
            logging: this.configService.get('NODE_ENV') === 'development',
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
exports.User = exports.KYCStatus = exports.UserRole = void 0;
const typeorm_1 = __webpack_require__(17);
const class_transformer_1 = __webpack_require__(18);
const roles_decorator_1 = __webpack_require__(19);
Object.defineProperty(exports, "UserRole", ({ enumerable: true, get: function () { return roles_decorator_1.Role; } }));
const wallet_entity_1 = __webpack_require__(20);
const notification_entity_1 = __webpack_require__(22);
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
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], User.prototype, "bvn", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], User.prototype, "nin", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], User.prototype, "accountNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "bank", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "accountName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)(),
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
    (0, typeorm_1.Column)(),
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
/* 17 */
/***/ ((module) => {

module.exports = require("typeorm");

/***/ }),
/* 18 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 19 */
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Wallet = exports.WalletType = void 0;
const typeorm_1 = __webpack_require__(17);
const user_entity_1 = __webpack_require__(16);
const transaction_entity_1 = __webpack_require__(21);
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Transaction = exports.TransactionStatus = exports.TransactionType = void 0;
const typeorm_1 = __webpack_require__(17);
const wallet_entity_1 = __webpack_require__(20);
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
/* 22 */
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
const typeorm_1 = __webpack_require__(17);
const user_entity_1 = __webpack_require__(16);
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
/* 23 */
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
const typeorm_1 = __webpack_require__(17);
const bill_payment_entity_1 = __webpack_require__(24);
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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillPayment = exports.BillPaymentStatus = void 0;
const typeorm_1 = __webpack_require__(17);
const user_entity_1 = __webpack_require__(16);
const bill_entity_1 = __webpack_require__(23);
const wallet_entity_1 = __webpack_require__(20);
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
/* 26 */
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
const jwt_1 = __webpack_require__(27);
const passport_1 = __webpack_require__(28);
const config_1 = __webpack_require__(4);
const auth_service_1 = __webpack_require__(29);
const auth_controller_1 = __webpack_require__(65);
const users_module_1 = __webpack_require__(72);
const jwt_strategy_1 = __webpack_require__(79);
const local_strategy_1 = __webpack_require__(81);
const notifications_module_1 = __webpack_require__(83);
const wallet_module_1 = __webpack_require__(85);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
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
/* 27 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 28 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 29 */
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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(27);
const bcrypt = __importStar(__webpack_require__(30));
const users_service_1 = __webpack_require__(31);
const notifications_service_1 = __webpack_require__(32);
const xpress_wallet_1 = __webpack_require__(37);
const config_1 = __webpack_require__(4);
const wallet_service_1 = __webpack_require__(59);
const wallet_entity_1 = __webpack_require__(20);
const crypto = __importStar(__webpack_require__(62));
let AuthService = class AuthService {
    constructor(usersService, jwtService, sendCodeService, config, walletService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.sendCodeService = sendCodeService;
        this.config = config;
        this.walletService = walletService;
        this.xpressService = new xpress_wallet_1.XpressWalletSDK({
            xpressEmail: this.config.get('XPRESS_EMAIL'),
            xpressPassword: this.config.get('XPRESS_PASSWORD'),
            baseUrl: this.config.get('XPRESS_BASEURL'),
        });
    }
    async register(createUserDto) {
        const { email, phone } = createUserDto;
        const existingUser = await this.usersService.findByEmailOrPhone(email, phone);
        if (existingUser) {
            throw new common_1.ConflictException('User with this email or phone already exists');
        }
        const contact = email || phone;
        const type = this.getContactType(contact);
        const code = this.generateCode();
        await this.sendCodeService.sendVerificationCode(contact, "", code, type);
        await this.usersService.storeVerificationCode(contact, type, 'register', code);
        return { message: 'Verification code sent' };
    }
    async registerBiometricDevice(dto) {
        const user = await this.usersService.findById(dto.userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.usersService.updateUser(user.id, {
            biometricPublicKey: dto.publicKey,
        });
    }
    async biometricLogin(dto) {
        const user = await this.usersService.findByEmailOrPhone(dto.identifier, dto.identifier);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid identifier');
        if (!user.biometricPublicKey) {
            throw new common_1.BadRequestException('Biometrics not registered for this user');
        }
        const verifier = crypto.createVerify('SHA256');
        verifier.update(dto.challenge);
        verifier.end();
        const isValid = verifier.verify(user.biometricPublicKey, dto.signature, 'base64');
        if (!isValid) {
            throw new common_1.UnauthorizedException('Invalid biometric signature');
        }
        const token = this.generateToken(user);
        const { password, pin, ...result } = user;
        return { user: result, token };
    }
    async resendCode(createUserDto) {
        const { email, phone } = createUserDto;
        const contact = email || phone;
        const type = this.getContactType(contact);
        const user = await this.usersService.findByEmailOrPhone(email, phone);
        if (!user)
            throw new common_1.NotFoundException('User with this email or phone does not exist');
        const code = this.generateCode();
        await this.sendCodeService.sendVerificationCode(contact, user.firstName ? user.firstName : "", code, type);
        await this.usersService.storeVerificationCode(contact, type, 'resend', code);
        return { message: 'Verification code sent' };
    }
    async verifyCode(contact, code) {
        const type = this.getContactType(contact);
        const isValid = await this.usersService.verifyCode(contact, type, code);
        if (isValid === null)
            throw new common_1.BadRequestException('Verification code expired');
        if (!isValid)
            throw new common_1.BadRequestException('Invalid verification code');
        return { message: 'Verification successful' };
    }
    async completeProfile(contact, data) {
        const user = await this.usersService.findByEmailOrPhone(contact, contact);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const walletResult = await this.xpressService.wallet.createCustomerWallet({
            bvn: String(data.bvn),
            firstName: data.firstName,
            lastName: data.lastName,
            dateOfBirth: data.dateOfBirth,
            phoneNumber: data.phone,
            email: data.email,
            address: data.address || ''
        });
        const wallets = [
            { name: "Main Wallet", type: wallet_entity_1.WalletType.MAIN },
            { name: "Escrow Wallet", type: wallet_entity_1.WalletType.ESCROW },
            { name: "Airtime Wallet", type: wallet_entity_1.WalletType.BILL_PAYMENT },
            { name: "Data Wallet", type: wallet_entity_1.WalletType.BILL_PAYMENT },
            { name: "Electricity Wallet", type: wallet_entity_1.WalletType.BILL_PAYMENT },
            { name: "TV Wallet", type: wallet_entity_1.WalletType.BILL_PAYMENT },
            { name: "Internet Wallet", type: wallet_entity_1.WalletType.BILL_PAYMENT },
            { name: "Betting Wallet", type: wallet_entity_1.WalletType.BILL_PAYMENT },
        ];
        await Promise.all(wallets.map((wallet) => this.walletService.createWallet(user.id, { name: wallet.name, type: wallet.type, customerId: walletResult.customer.id })));
        return this.usersService.updateUser(user.id, {
            ...data,
            accountName: walletResult.wallet.accountName,
            accountNumber: Number(walletResult.wallet.accountNumber),
            bank: walletResult.wallet.bankName,
        });
    }
    async updatePassword(userId, newPassword) {
        const user = await this.usersService.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.password)
            throw new common_1.BadRequestException('Password already set');
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        return this.usersService.updateUser(userId, { password: hashedPassword });
    }
    async getOnboardingStatus(userId) {
        const user = await this.usersService.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return {
            emailVerified: !!user.email && user.isEmailVerified,
            phoneVerified: !!user.phone && user.isPhoneVerified,
            profileCompleted: !!user.firstName && !!user.lastName && !!user.bvn,
            walletCreated: !!user.accountNumber,
            passwordSet: !!user.password,
        };
    }
    async adminLogin(email, password) {
        const admin = await this.usersService.findByEmail(email);
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            throw new common_1.UnauthorizedException('Invalid admin credentials');
        }
        return { token: this.generateToken(admin) };
    }
    async login({ identifier, password }) {
        let user = await this.usersService.findByEmailOrPhone(identifier, identifier);
        if (!user) {
            user = await this.usersService.findByUsername(identifier);
        }
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const token = this.generateToken(user);
        const { password: _, ...result } = user;
        return { user: result, token };
    }
    async validateUser(identifier, password) {
        const user = await this.usersService.findByEmailOrPhone(identifier, identifier);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password: _, ...result } = user;
            return result;
        }
        return null;
    }
    async initiateResetPin(identifier) {
        const type = this.getContactType(identifier);
        const user = await this.usersService.findByEmailOrPhone(identifier, identifier);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const code = this.generateCode();
        await this.usersService.storeVerificationCode(identifier, type, 'reset-pin', code);
        await this.sendCodeService.sendVerificationCode(identifier, user.firstName ? user.firstName : "", code, type);
        return { message: 'Verification code sent' };
    }
    async resetPin(identifier, code, pin) {
        const type = this.getContactType(identifier);
        const isValid = await this.usersService.verifyCode(identifier, type, code);
        if (!isValid)
            throw new common_1.BadRequestException('Invalid or expired verification code');
        const user = await this.usersService.findByEmailOrPhone(identifier, identifier);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.updatePin(user.id, pin);
    }
    async initiateResetPassword(identifier) {
        const type = this.getContactType(identifier);
        const user = await this.usersService.findByEmailOrPhone(identifier, identifier);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const code = this.generateCode();
        await this.usersService.storeVerificationCode(identifier, type, 'reset-password', code);
        await this.sendCodeService.sendVerificationCode(identifier, user.firstName ? user.firstName : "", code, type);
        return { message: 'Verification code sent' };
    }
    async resetPassword(identifier, code, newPassword) {
        const type = this.getContactType(identifier);
        const isValid = await this.usersService.verifyCode(identifier, type, code);
        if (!isValid)
            throw new common_1.BadRequestException('Invalid or expired verification code');
        const user = await this.usersService.findByEmailOrPhone(identifier, identifier);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.updatePassword(user.id, newPassword);
    }
    async setPin(userId, pin) {
        const hashedPin = await bcrypt.hash(pin, 10);
        return this.usersService.updateUser(userId, { pin: hashedPin });
    }
    async verifyPin(userId, pin) {
        const user = await this.usersService.findById(userId);
        if (!user || !user.pin || !(await bcrypt.compare(pin, user.pin))) {
            throw new common_1.UnauthorizedException('Invalid pin');
        }
        return { message: 'Pin verified' };
    }
    async updatePin(userId, newPin) {
        return this.setPin(userId, newPin);
    }
    generateToken(user) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return this.jwtService.sign(payload);
    }
    generateCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async verifyToken(token) {
        try {
            return this.jwtService.verify(token);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    getContactType(identifier) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(identifier) ? 'email' : 'phone';
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object, typeof (_c = typeof notifications_service_1.NotificationsService !== "undefined" && notifications_service_1.NotificationsService) === "function" ? _c : Object, typeof (_d = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _d : Object, typeof (_e = typeof wallet_service_1.WalletService !== "undefined" && wallet_service_1.WalletService) === "function" ? _e : Object])
], AuthService);


/***/ }),
/* 30 */
/***/ ((module) => {

module.exports = require("bcryptjs");

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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(17);
const user_entity_1 = __webpack_require__(16);
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
        return this.userRepository.findOne({
            where: [
                ...(email ? [{ email }] : []),
                ...(phone ? [{ phone }] : []),
            ],
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationsService_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(17);
const notification_entity_1 = __webpack_require__(22);
const axios_1 = __webpack_require__(33);
const config_1 = __webpack_require__(4);
const zeptomail_1 = __webpack_require__(34);
const verifymail_template_1 = __webpack_require__(35);
const axios_2 = __webpack_require__(36);
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(notificationRepo, httpService, configService) {
        this.notificationRepo = notificationRepo;
        this.httpService = httpService;
        this.configService = configService;
        this.logger = new common_1.Logger(NotificationsService_1.name);
        this.axios = new axios_2.Axios();
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
        try {
            let client = new zeptomail_1.SendMailClient({ url, token });
            client.sendMail({
                "from": { "address": from, "name": "Vaultiva Team" },
                "to": [{
                        "email_address": { "address": email }
                    }],
                "subject": title,
                "htmlbody": content,
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
            await this.axios.post(`https://${this.configService.get('TERMII_BASE_URL')}/api/sms/send`, data);
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
            await this.axios.post(`https://${this.configService.get('TERMII_BASE_URL')}/api/sms/send`, data);
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
/* 33 */
/***/ ((module) => {

module.exports = require("@nestjs/axios");

/***/ }),
/* 34 */
/***/ ((module) => {

module.exports = require("zeptomail");

/***/ }),
/* 35 */
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
/* 36 */
/***/ ((module) => {

module.exports = require("axios");

/***/ }),
/* 37 */
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
var xpress_wallet_sdk_1 = __webpack_require__(38);
Object.defineProperty(exports, "XpressWalletSDK", ({ enumerable: true, get: function () { return xpress_wallet_sdk_1.XpressWalletSDK; } }));
__exportStar(__webpack_require__(49), exports);
__exportStar(__webpack_require__(50), exports);
__exportStar(__webpack_require__(51), exports);
__exportStar(__webpack_require__(52), exports);
__exportStar(__webpack_require__(53), exports);
__exportStar(__webpack_require__(54), exports);
__exportStar(__webpack_require__(55), exports);
__exportStar(__webpack_require__(56), exports);
__exportStar(__webpack_require__(57), exports);
__exportStar(__webpack_require__(58), exports);
var http_client_1 = __webpack_require__(39);
Object.defineProperty(exports, "XpressWalletError", ({ enumerable: true, get: function () { return http_client_1.XpressWalletError; } }));


/***/ }),
/* 38 */
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
const http_client_1 = __webpack_require__(39);
const auth_service_1 = __webpack_require__(40);
const user_service_1 = __webpack_require__(41);
const customer_service_1 = __webpack_require__(42);
const wallet_service_1 = __webpack_require__(43);
const transaction_service_1 = __webpack_require__(44);
const transfer_service_1 = __webpack_require__(45);
const team_service_1 = __webpack_require__(46);
const merchant_service_1 = __webpack_require__(47);
const card_service_1 = __webpack_require__(48);
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
__exportStar(__webpack_require__(49), exports);
__exportStar(__webpack_require__(50), exports);
__exportStar(__webpack_require__(51), exports);
__exportStar(__webpack_require__(52), exports);
__exportStar(__webpack_require__(53), exports);
__exportStar(__webpack_require__(54), exports);
__exportStar(__webpack_require__(55), exports);
__exportStar(__webpack_require__(56), exports);
__exportStar(__webpack_require__(57), exports);
__exportStar(__webpack_require__(58), exports);
var http_client_2 = __webpack_require__(39);
Object.defineProperty(exports, "XpressWalletError", ({ enumerable: true, get: function () { return http_client_2.XpressWalletError; } }));


/***/ }),
/* 39 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.XpressWalletError = void 0;
const axios_1 = __importDefault(__webpack_require__(36));
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
        const { tokens } = await this.login({
            email: this.config.xpressEmail,
            password: this.config.xpressPassword,
        });
        this.setTokens(tokens);
        this.setupInterceptors();
    }
    async login(credentials) {
        const response = await this.client.post('/auth/login', credentials);
        const tokens = {
            accessToken: response.headers['x-access-token'],
            refreshToken: response.headers['x-refresh-token']
        };
        this.setTokens(tokens);
        return {
            response: response.data,
            tokens
        };
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
/* 40 */
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
/* 41 */
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
/* 42 */
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
/* 43 */
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
/* 44 */
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
/* 45 */
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
/* 46 */
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
/* 47 */
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
/* 48 */
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
/* 49 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 50 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 51 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 52 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 53 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 54 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 55 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 56 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 57 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 58 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 59 */
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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WalletService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(17);
const bullmq_1 = __webpack_require__(9);
const bullmq_2 = __webpack_require__(60);
const wallet_entity_1 = __webpack_require__(20);
const transaction_entity_1 = __webpack_require__(21);
const payments_service_1 = __webpack_require__(61);
const uuid_1 = __webpack_require__(64);
let WalletService = class WalletService {
    constructor(walletRepository, transactionRepository, transactionQueue, dataSource, paymentsService) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.transactionQueue = transactionQueue;
        this.dataSource = dataSource;
        this.paymentsService = paymentsService;
    }
    async createWallet(userId, createWalletDto) {
        const wallet = this.walletRepository.create({
            ...createWalletDto,
            userId,
        });
        return this.walletRepository.save(wallet);
    }
    async findUserWallets(userId) {
        return this.walletRepository.find({
            where: { userId },
            relations: ['transactions'],
            order: { createdAt: 'DESC' },
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
        const [transactions, total] = await this.transactionRepository.findAndCount({
            where: { walletId: { $in: walletIds } },
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
            relations: ['user'],
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
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wallet_entity_1.Wallet)),
    __param(1, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(2, (0, bullmq_1.InjectQueue)('transactions')),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => payments_service_1.PaymentsService))),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof bullmq_2.Queue !== "undefined" && bullmq_2.Queue) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.DataSource !== "undefined" && typeorm_2.DataSource) === "function" ? _d : Object, typeof (_e = typeof payments_service_1.PaymentsService !== "undefined" && payments_service_1.PaymentsService) === "function" ? _e : Object])
], WalletService);


/***/ }),
/* 60 */
/***/ ((module) => {

module.exports = require("bullmq");

/***/ }),
/* 61 */
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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentsService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(17);
const event_emitter_1 = __webpack_require__(12);
const wallet_service_1 = __webpack_require__(59);
const transaction_entity_1 = __webpack_require__(21);
const crypto = __importStar(__webpack_require__(62));
const xpress_wallet_1 = __webpack_require__(37);
const config_1 = __webpack_require__(4);
const flutterwave_v3_1 = __importDefault(__webpack_require__(63));
let PaymentsService = class PaymentsService {
    constructor(transactionRepository, walletService, eventEmitter, config) {
        this.transactionRepository = transactionRepository;
        this.walletService = walletService;
        this.eventEmitter = eventEmitter;
        this.config = config;
        this.xpressService = new xpress_wallet_1.XpressWalletSDK({
            xpressEmail: this.config.get('XPRESS_EMAIL'),
            xpressPassword: this.config.get('XPRESS_PASSWORD'),
            baseUrl: this.config.get('XPRESS_BASEURL'),
        });
    }
    async getAccountInfo() {
        const account_number = this.config.get('FLUTTER_WAVE_ACCOUNT_NUMBER');
        const account_name = this.config.get('FUTTER_WAVE_ACCOUNT_NAME');
        const bank_name = this.config.get('FLUTTER_WAVE_BANK_NAME');
        const bank_code = this.config.get('FLUTTER_WAVE_BANK_CODE');
        return ({
            account_number: String(account_number),
            bank_code: String(bank_code),
            account_name: String(account_name),
            bank_name: String(bank_name)
        });
    }
    async payBill(userId, walletId, billData) {
        const wallet = await this.walletService.findWalletById(walletId);
        if (!wallet) {
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
            if (deducted && !status.toLowerCase().includes("pending")) {
                this.walletService.withdrawComplete(transaction.id, reference, userId);
            }
            if (!deducted) {
                await this.walletService.withdrawFailed(transaction.id, reason, userId);
                throw new common_1.BadRequestException(reason);
            }
            this.eventEmitter.emit('bill.paid', { transaction: transaction });
            return transaction;
        }
        catch (error) {
            await this.walletService.withdrawFailed(transaction.id, error.message, userId);
            throw new common_1.BadRequestException(error.message || 'Bill payment failed');
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
                throw new common_1.ConflictException("Customer number required");
            }
            if (!biller_code) {
                throw new common_1.ConflictException("Biller Code required");
            }
            if (!item_code) {
                throw new common_1.ConflictException("Item Code required");
            }
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
                return ({ deducted: false, reason: xdata.message });
            }
            const fwResponse = await flutterwave_v3_1.default.postV3BillersBiller_codeItemsItem_codePayment({
                country: 'NG',
                customer_id: customer,
                amount: amount,
                reference,
                biller_code,
                item_code,
                Authorization: `Bearer ${this.config.get('FLUTTERWAVE_SECRET_KEY')}`
            });
            if (fwResponse.status != 200 || !fwResponse.data.data) {
                return ({ deducted: false, reason: fwResponse.data.message, status: fwResponse.data.status });
            }
            this.eventEmitter.emit('wallet.debit', { walletId, amount });
            return ({ deducted: true, reference: fwResponse.data.data.tx_ref });
        }
    }
    generateReference(prefix) {
        return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => wallet_service_1.WalletService))),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof wallet_service_1.WalletService !== "undefined" && wallet_service_1.WalletService) === "function" ? _b : Object, typeof (_c = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _c : Object, typeof (_d = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _d : Object])
], PaymentsService);


/***/ }),
/* 62 */
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),
/* 63 */
/***/ ((module) => {

module.exports = require("@api/flutterwave-v3");

/***/ }),
/* 64 */
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),
/* 65 */
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
const auth_service_1 = __webpack_require__(29);
const create_user_dto_1 = __webpack_require__(66);
const login_dto_1 = __webpack_require__(68);
const local_auth_guard_1 = __webpack_require__(69);
const biometric_login_dto_1 = __webpack_require__(70);
const register_biometric_dto_1 = __webpack_require__(71);
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
    (0, swagger_1.ApiOperation)({ summary: 'Resend verification code' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof create_user_dto_1.CreateUserDto !== "undefined" && create_user_dto_1.CreateUserDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendCode", null);
__decorate([
    (0, common_1.Post)('verify-code'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify code sent to email or phone' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyCode", null);
__decorate([
    (0, common_1.Post)('complete-profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete user profile and create wallets' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "completeProfile", null);
__decorate([
    (0, common_1.Post)('login'),
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
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 66 */
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
const class_validator_1 = __webpack_require__(67);
const swagger_1 = __webpack_require__(3);
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'user@example.com' }),
    (0, class_validator_1.ValidateIf)((o) => !o.phone),
    (0, class_validator_1.IsEmail)({}, { message: 'Invalid email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required if phone number is not provided' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+2348123456789' }),
    (0, class_validator_1.ValidateIf)((o) => !o.email),
    (0, class_validator_1.IsPhoneNumber)(undefined, { message: 'Invalid phone number' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Phone number is required if email is not provided' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phone", void 0);


/***/ }),
/* 67 */
/***/ ((module) => {

module.exports = require("class-validator");

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginDto = void 0;
const class_validator_1 = __webpack_require__(67);
const swagger_1 = __webpack_require__(3);
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user@example.com or 08012345678' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginDto.prototype, "identifier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'password123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);


/***/ }),
/* 69 */
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
const passport_1 = __webpack_require__(28);
let LocalAuthGuard = class LocalAuthGuard extends (0, passport_1.AuthGuard)('local') {
};
exports.LocalAuthGuard = LocalAuthGuard;
exports.LocalAuthGuard = LocalAuthGuard = __decorate([
    (0, common_1.Injectable)()
], LocalAuthGuard);


/***/ }),
/* 70 */
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
const class_validator_1 = __webpack_require__(67);
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
/* 71 */
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
const class_validator_1 = __webpack_require__(67);
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
/* 72 */
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
const users_service_1 = __webpack_require__(31);
const users_controller_1 = __webpack_require__(73);
const user_entity_1 = __webpack_require__(16);
const encryption_util_1 = __webpack_require__(77);
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
/* 73 */
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
const users_service_1 = __webpack_require__(31);
const update_user_dto_1 = __webpack_require__(74);
const jwt_auth_guard_1 = __webpack_require__(75);
const roles_guard_1 = __webpack_require__(76);
const roles_decorator_1 = __webpack_require__(19);
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateUserDto = void 0;
const class_validator_1 = __webpack_require__(67);
const class_validator_2 = __webpack_require__(67);
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
/* 75 */
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
const passport_1 = __webpack_require__(28);
const core_1 = __webpack_require__(1);
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(reflector) {
        super();
        this.reflector = reflector;
    }
    canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
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
/* 76 */
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
const roles_decorator_1 = __webpack_require__(19);
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
const CryptoJS = __importStar(__webpack_require__(78));
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
/* 78 */
/***/ ((module) => {

module.exports = require("crypto-js");

/***/ }),
/* 79 */
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
const passport_1 = __webpack_require__(28);
const passport_jwt_1 = __webpack_require__(80);
const config_1 = __webpack_require__(4);
const users_service_1 = __webpack_require__(31);
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
/* 80 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 81 */
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
const passport_1 = __webpack_require__(28);
const passport_local_1 = __webpack_require__(82);
const auth_service_1 = __webpack_require__(29);
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
/* 82 */
/***/ ((module) => {

module.exports = require("passport-local");

/***/ }),
/* 83 */
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
const notifications_service_1 = __webpack_require__(32);
const notifications_controller_1 = __webpack_require__(84);
const notification_entity_1 = __webpack_require__(22);
const axios_1 = __webpack_require__(33);
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
/* 84 */
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
const notifications_service_1 = __webpack_require__(32);
const jwt_auth_guard_1 = __webpack_require__(75);
let NotificationsController = class NotificationsController {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    findAll(req, page = 1, limit = 20) {
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
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
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
/* 85 */
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
const wallet_service_1 = __webpack_require__(59);
const wallet_controller_1 = __webpack_require__(86);
const wallet_entity_1 = __webpack_require__(20);
const transaction_entity_1 = __webpack_require__(21);
const payments_module_1 = __webpack_require__(89);
const notifications_module_1 = __webpack_require__(83);
const transaction_processor_1 = __webpack_require__(93);
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
/* 86 */
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
const wallet_service_1 = __webpack_require__(59);
const create_wallet_dto_1 = __webpack_require__(87);
const withdraw_dto_1 = __webpack_require__(88);
const jwt_auth_guard_1 = __webpack_require__(75);
const transaction_entity_1 = __webpack_require__(21);
let WalletController = class WalletController {
    constructor(walletService) {
        this.walletService = walletService;
    }
    create(req, createWalletDto) {
        return this.walletService.createWallet(req.user.id, createWalletDto);
    }
    findAll(req) {
        return this.walletService.findUserWallets(req.user.id);
    }
    getTransactionHistory(req, page = 1, limit = 20) {
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
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
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
/* 87 */
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
const class_validator_1 = __webpack_require__(67);
const swagger_1 = __webpack_require__(3);
const wallet_entity_1 = __webpack_require__(20);
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
/* 88 */
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
const class_validator_1 = __webpack_require__(67);
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
/* 89 */
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
const payments_service_1 = __webpack_require__(61);
const transaction_entity_1 = __webpack_require__(21);
const wallet_module_1 = __webpack_require__(85);
const flutterwave_module_1 = __webpack_require__(90);
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
/* 90 */
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
const flutterwave_service_1 = __webpack_require__(91);
const axios_1 = __webpack_require__(33);
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
/* 91 */
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
const flutterwave_node_v3_1 = __importDefault(__webpack_require__(92));
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
        this.flw = new flutterwave_node_v3_1.default(configService.get('FLUTTERWAVE_PUBLIC_KEY'), configService.get('FLUTTERWAVE_SECRET_KEY'));
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
        const account_number = this.configService.get('FLUTTER_WAVE_ACCOUNT_NUMBER');
        const account_name = this.configService.get('FUTTER_WAVE_ACCOUNT_NAME');
        const bank_name = this.configService.get('FLUTTER_WAVE_BANK_NAME');
        const bank_code = this.configService.get('FLUTTER_WAVE_BANK_CODE');
        return ({
            account_number: String(account_number),
            bank_code: String(bank_code),
            account_name: String(account_name),
            bank_name: String(bank_name)
        });
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
/* 92 */
/***/ ((module) => {

module.exports = require("flutterwave-node-v3");

/***/ }),
/* 93 */
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
const bullmq_2 = __webpack_require__(60);
const wallet_service_1 = __webpack_require__(59);
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
/* 94 */
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
const bills_service_1 = __webpack_require__(95);
const bills_controller_1 = __webpack_require__(98);
const bill_entity_1 = __webpack_require__(23);
const bill_payment_entity_1 = __webpack_require__(24);
const recurring_payment_entity_1 = __webpack_require__(96);
const recurring_payments_service_1 = __webpack_require__(97);
const payments_module_1 = __webpack_require__(89);
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
/* 95 */
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillsService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const recurring_payment_entity_1 = __webpack_require__(96);
const payments_service_1 = __webpack_require__(61);
const recurring_payments_service_1 = __webpack_require__(97);
const flutterwave_v3_1 = __importDefault(__webpack_require__(63));
const config_1 = __webpack_require__(4);
let BillsService = BillsService_1 = class BillsService {
    constructor(recurringService, paymentsService, config) {
        this.recurringService = recurringService;
        this.paymentsService = paymentsService;
        this.config = config;
        this.logger = new common_1.Logger(BillsService_1.name);
    }
    async getProviders() {
        return flutterwave_v3_1.default.getV3TopBillCategories({
            country: "NG",
            Authorization: `Bearer ${this.config.get('FLUTTERWAVE_SECRET_KEY')}`
        });
    }
    async getBillers(category) {
        return flutterwave_v3_1.default.getV3BillsCategoryBillers({
            country: "NG",
            category,
            Authorization: `Bearer ${this.config.get('FLUTTERWAVE_SECRET_KEY')}`
        });
    }
    async getPlans(code) {
        return flutterwave_v3_1.default.getV3BillersBiller_codeItems({
            biller_code: code,
            Authorization: `Bearer ${this.config.get('FLUTTERWAVE_SECRET_KEY')}`
        });
    }
    async verifyServiceAccount(code, customer) {
        return flutterwave_v3_1.default.getV3BillItemsCb141Validate({
            code,
            customer,
            Authorization: `Bearer ${this.config.get('FLUTTERWAVE_SECRET_KEY')}`
        });
    }
    async payBill(user, walletId, dto, reccuring, duration) {
        try {
            const response = await this.paymentsService.payBill(user.id, walletId, dto);
            if (reccuring)
                this.recurringService.createRecurringPayment({
                    userId: response.userId,
                    transactionId: response.id,
                    amount: response.amount,
                    duration,
                    frequency: duration == 1 ?
                        recurring_payment_entity_1.RecurrenceFrequency.DAILY
                        : duration == 7 ?
                            recurring_payment_entity_1.RecurrenceFrequency.WEEKLY
                            : duration == 30 || duration == 31 ?
                                recurring_payment_entity_1.RecurrenceFrequency.MONTHLY
                                : recurring_payment_entity_1.RecurrenceFrequency.CUSTOM,
                    status: recurring_payment_entity_1.RecurringStatus.ACTIVE,
                });
            return response;
        }
        catch (err) {
            this.logger.error(`Bill payment failed: ${err.message}`, err.stack);
            throw new common_1.BadRequestException(`Bill payment failed: ${err.message}`);
        }
    }
};
exports.BillsService = BillsService;
exports.BillsService = BillsService = BillsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(recurring_payment_entity_1.RecurringPayment)),
    __metadata("design:paramtypes", [typeof (_a = typeof recurring_payments_service_1.RecurringPaymentsService !== "undefined" && recurring_payments_service_1.RecurringPaymentsService) === "function" ? _a : Object, typeof (_b = typeof payments_service_1.PaymentsService !== "undefined" && payments_service_1.PaymentsService) === "function" ? _b : Object, typeof (_c = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _c : Object])
], BillsService);


/***/ }),
/* 96 */
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
const typeorm_1 = __webpack_require__(17);
const user_entity_1 = __webpack_require__(16);
const transaction_entity_1 = __webpack_require__(21);
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
/* 97 */
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
const typeorm_2 = __webpack_require__(17);
const recurring_payment_entity_1 = __webpack_require__(96);
const transaction_entity_1 = __webpack_require__(21);
const payments_service_1 = __webpack_require__(61);
let RecurringPaymentsService = class RecurringPaymentsService {
    constructor(recurringRepo, paymentSerice) {
        this.recurringRepo = recurringRepo;
        this.paymentSerice = paymentSerice;
    }
    async createRecurringPayment(data) {
        const recurring = this.recurringRepo.create({
            ...data,
            startDate: this.calculateNextRun(data.frequency, new Date(), data.duration),
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
        return this.recurringRepo.find({ where: { userId, status: recurring_payment_entity_1.RecurringStatus.ACTIVE, transaction: { type } } });
    }
    async processDuePayments(today = new Date()) {
        const duePayments = await this.recurringRepo.find({
            where: {
                status: recurring_payment_entity_1.RecurringStatus.ACTIVE,
                startDate: (0, typeorm_2.LessThanOrEqual)(today),
            },
            relations: ['bill', 'user', 'transaction', 'transaction.wallet'],
        });
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
/* 98 */
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
const bills_service_1 = __webpack_require__(95);
const jwt_auth_guard_1 = __webpack_require__(75);
const recurring_payments_service_1 = __webpack_require__(97);
let BillsController = class BillsController {
    constructor(billsService, recurringService) {
        this.billsService = billsService;
        this.recurringService = recurringService;
    }
    findProvider() {
        return this.billsService.getProviders();
    }
    findCategories(category) {
        return this.billsService.getBillers(category);
    }
    findPlans(code) {
        return this.billsService.getPlans(code);
    }
    payBill(body, walletId, req) {
        const { reccuring, duration, ...prop } = body;
        return this.billsService.payBill(req.user.id, walletId, prop, reccuring, duration);
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
], BillsController.prototype, "findCategories", null);
__decorate([
    (0, common_1.Get)(':code'),
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
    __param(1, (0, common_1.Param)('walletId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
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
exports.BillsController = BillsController = __decorate([
    (0, swagger_1.ApiTags)('Bills'),
    (0, common_1.Controller)('bills'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof bills_service_1.BillsService !== "undefined" && bills_service_1.BillsService) === "function" ? _a : Object, typeof (_b = typeof recurring_payments_service_1.RecurringPaymentsService !== "undefined" && recurring_payments_service_1.RecurringPaymentsService) === "function" ? _b : Object])
], BillsController);


/***/ }),
/* 99 */
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
const health_controller_1 = __webpack_require__(100);
const health_service_1 = __webpack_require__(101);
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
/* 100 */
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
const health_service_1 = __webpack_require__(101);
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
/* 101 */
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
const typeorm_2 = __webpack_require__(17);
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
/* 102 */
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
const kyc_service_1 = __webpack_require__(103);
const axios_1 = __webpack_require__(33);
const users_module_1 = __webpack_require__(72);
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
/* 103 */
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
const users_service_1 = __webpack_require__(31);
const axios_1 = __importDefault(__webpack_require__(36));
const user_entity_1 = __webpack_require__(16);
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
/* 104 */
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
const escrow_service_1 = __webpack_require__(105);
const escrow_controller_1 = __webpack_require__(108);
const escrow_entity_1 = __webpack_require__(106);
const escrow_participant_entity_1 = __webpack_require__(107);
const wallet_module_1 = __webpack_require__(85);
const notifications_module_1 = __webpack_require__(83);
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EscrowService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(17);
const event_emitter_1 = __webpack_require__(12);
const escrow_entity_1 = __webpack_require__(106);
const escrow_participant_entity_1 = __webpack_require__(107);
const wallet_service_1 = __webpack_require__(59);
const wallet_entity_1 = __webpack_require__(20);
const notifications_service_1 = __webpack_require__(32);
const notification_entity_1 = __webpack_require__(22);
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
        const [escrows, total] = await this.escrowRepository.findAndCount({
            where: [
                { creatorId: userId },
                { participants: { userId } },
            ],
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
/* 106 */
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
const typeorm_1 = __webpack_require__(17);
const user_entity_1 = __webpack_require__(16);
const wallet_entity_1 = __webpack_require__(20);
const escrow_participant_entity_1 = __webpack_require__(107);
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
/* 107 */
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
const typeorm_1 = __webpack_require__(17);
const user_entity_1 = __webpack_require__(16);
const escrow_entity_1 = __webpack_require__(106);
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EscrowController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const escrow_service_1 = __webpack_require__(105);
const create_escrow_dto_1 = __webpack_require__(109);
const update_escrow_dto_1 = __webpack_require__(110);
const jwt_auth_guard_1 = __webpack_require__(75);
let EscrowController = class EscrowController {
    constructor(escrowService) {
        this.escrowService = escrowService;
    }
    create(req, createEscrowDto) {
        return this.escrowService.create(req.user.id, createEscrowDto);
    }
    findAll(req, page = 1, limit = 20) {
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
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
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
/* 109 */
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
const class_validator_1 = __webpack_require__(67);
const swagger_1 = __webpack_require__(3);
const escrow_entity_1 = __webpack_require__(106);
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
/* 110 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateEscrowDto = void 0;
const swagger_1 = __webpack_require__(3);
const create_escrow_dto_1 = __webpack_require__(109);
class UpdateEscrowDto extends (0, swagger_1.PartialType)(create_escrow_dto_1.CreateEscrowDto) {
}
exports.UpdateEscrowDto = UpdateEscrowDto;


/***/ }),
/* 111 */
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
const bill_splitting_service_1 = __webpack_require__(112);
const bill_splitting_controller_1 = __webpack_require__(115);
const bill_split_entity_1 = __webpack_require__(113);
const bill_split_participant_entity_1 = __webpack_require__(114);
const wallet_module_1 = __webpack_require__(85);
const notifications_module_1 = __webpack_require__(83);
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillSplittingService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(17);
const event_emitter_1 = __webpack_require__(12);
const schedule_1 = __webpack_require__(11);
const bill_split_entity_1 = __webpack_require__(113);
const bill_split_participant_entity_1 = __webpack_require__(114);
const wallet_service_1 = __webpack_require__(59);
const notifications_service_1 = __webpack_require__(32);
const notification_entity_1 = __webpack_require__(22);
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
        const [billSplits, total] = await this.billSplitRepository.findAndCount({
            where: [
                { creatorId: userId },
                { participants: { userId } },
            ],
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
/* 113 */
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
const typeorm_1 = __webpack_require__(17);
const user_entity_1 = __webpack_require__(16);
const wallet_entity_1 = __webpack_require__(20);
const bill_split_participant_entity_1 = __webpack_require__(114);
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
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillSplitParticipant = exports.ParticipantStatus = exports.ParticipantRole = void 0;
const typeorm_1 = __webpack_require__(17);
const user_entity_1 = __webpack_require__(16);
const wallet_entity_1 = __webpack_require__(20);
const bill_split_entity_1 = __webpack_require__(113);
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillSplittingController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const bill_splitting_service_1 = __webpack_require__(112);
const create_bill_split_dto_1 = __webpack_require__(116);
const jwt_auth_guard_1 = __webpack_require__(75);
let BillSplittingController = class BillSplittingController {
    constructor(billSplittingService) {
        this.billSplittingService = billSplittingService;
    }
    create(req, createBillSplitDto) {
        return this.billSplittingService.create(req.user.id, createBillSplitDto);
    }
    findAll(req, page = 1, limit = 20) {
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
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateBillSplitDto = void 0;
const class_validator_1 = __webpack_require__(67);
const swagger_1 = __webpack_require__(3);
const bill_split_entity_1 = __webpack_require__(113);
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
/* 117 */
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
const crowdfunding_service_1 = __webpack_require__(118);
const crowdfunding_controller_1 = __webpack_require__(121);
const crowdfunding_campaign_entity_1 = __webpack_require__(119);
const crowdfunding_contribution_entity_1 = __webpack_require__(120);
const wallet_module_1 = __webpack_require__(85);
const notifications_module_1 = __webpack_require__(83);
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
/* 118 */
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
const typeorm_2 = __webpack_require__(17);
const event_emitter_1 = __webpack_require__(12);
const crowdfunding_campaign_entity_1 = __webpack_require__(119);
const crowdfunding_contribution_entity_1 = __webpack_require__(120);
const wallet_service_1 = __webpack_require__(59);
const wallet_entity_1 = __webpack_require__(20);
const notifications_service_1 = __webpack_require__(32);
const notification_entity_1 = __webpack_require__(22);
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
/* 119 */
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
const typeorm_1 = __webpack_require__(17);
const user_entity_1 = __webpack_require__(16);
const wallet_entity_1 = __webpack_require__(20);
const crowdfunding_contribution_entity_1 = __webpack_require__(120);
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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CrowdfundingContribution = void 0;
const typeorm_1 = __webpack_require__(17);
const user_entity_1 = __webpack_require__(16);
const crowdfunding_campaign_entity_1 = __webpack_require__(119);
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
/* 121 */
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
const crowdfunding_service_1 = __webpack_require__(118);
const create_campaign_dto_1 = __webpack_require__(122);
const contribute_dto_1 = __webpack_require__(123);
const jwt_auth_guard_1 = __webpack_require__(75);
let CrowdfundingController = class CrowdfundingController {
    constructor(crowdfundingService) {
        this.crowdfundingService = crowdfundingService;
    }
    createCampaign(req, createCampaignDto) {
        return this.crowdfundingService.createCampaign(req.user.id, createCampaignDto);
    }
    findUserCampaigns(req, page = 1, limit = 20) {
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
    getContributions(id, page = 1, limit = 20) {
        return this.crowdfundingService.getCampaignContributions(id, page, limit);
    }
};
exports.CrowdfundingController = CrowdfundingController;
__decorate([
    (0, common_1.Post)('campaigns'),
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
    (0, swagger_1.ApiOperation)({ summary: 'Get user campaigns' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Campaigns retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", void 0)
], CrowdfundingController.prototype, "findUserCampaigns", null);
__decorate([
    (0, common_1.Get)('campaigns/public/:shareableLink'),
    (0, swagger_1.ApiOperation)({ summary: 'Get public campaign by shareable link' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Campaign retrieved successfully' }),
    __param(0, (0, common_1.Param)('shareableLink')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CrowdfundingController.prototype, "getPublicCampaign", null);
__decorate([
    (0, common_1.Get)('campaigns/:id'),
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
    (0, swagger_1.ApiOperation)({ summary: 'Get campaign contributions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Contributions retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], CrowdfundingController.prototype, "getContributions", null);
exports.CrowdfundingController = CrowdfundingController = __decorate([
    (0, swagger_1.ApiTags)('Crowdfunding'),
    (0, common_1.Controller)('crowdfunding'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof crowdfunding_service_1.CrowdfundingService !== "undefined" && crowdfunding_service_1.CrowdfundingService) === "function" ? _a : Object])
], CrowdfundingController);


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCampaignDto = void 0;
const class_validator_1 = __webpack_require__(67);
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
/* 123 */
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
const class_validator_1 = __webpack_require__(67);
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
/* 124 */
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
const shared_wallets_service_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './shared-wallets.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const shared_wallets_controller_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './shared-wallets.controller'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const shared_wallet_entity_1 = __webpack_require__(125);
const shared_wallet_member_entity_1 = __webpack_require__(126);
const shared_wallet_transaction_entity_1 = __webpack_require__(127);
const wallet_module_1 = __webpack_require__(85);
const notifications_module_1 = __webpack_require__(83);
let SharedWalletsModule = class SharedWalletsModule {
};
exports.SharedWalletsModule = SharedWalletsModule;
exports.SharedWalletsModule = SharedWalletsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([shared_wallet_entity_1.SharedWallet, shared_wallet_member_entity_1.SharedWalletMember, shared_wallet_transaction_entity_1.SharedWalletTransaction]),
            wallet_module_1.WalletModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [shared_wallets_controller_1.SharedWalletsController],
        providers: [shared_wallets_service_1.SharedWalletsService],
        exports: [shared_wallets_service_1.SharedWalletsService],
    })
], SharedWalletsModule);


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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SharedWallet = exports.SharedWalletStatus = exports.SharedWalletMode = void 0;
const typeorm_1 = __webpack_require__(17);
const user_entity_1 = __webpack_require__(16);
const wallet_entity_1 = __webpack_require__(20);
const shared_wallet_member_entity_1 = __webpack_require__(126);
const shared_wallet_transaction_entity_1 = __webpack_require__(127);
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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SharedWalletMember = exports.MemberStatus = exports.MemberRole = void 0;
const typeorm_1 = __webpack_require__(17);
const user_entity_1 = __webpack_require__(16);
const shared_wallet_entity_1 = __webpack_require__(125);
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
/* 127 */
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
const typeorm_1 = __webpack_require__(17);
const user_entity_1 = __webpack_require__(16);
const shared_wallet_entity_1 = __webpack_require__(125);
const transaction_signature_entity_1 = __webpack_require__(128);
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionSignature = exports.SignatureStatus = void 0;
const typeorm_1 = __webpack_require__(17);
const user_entity_1 = __webpack_require__(16);
const shared_wallet_transaction_entity_1 = __webpack_require__(127);
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
/* 129 */
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
const axios_1 = __webpack_require__(33);
const ai_insights_service_1 = __webpack_require__(130);
const ai_insights_controller_1 = __webpack_require__(133);
const spending_insight_entity_1 = __webpack_require__(131);
const budget_recommendation_entity_1 = __webpack_require__(132);
const wallet_module_1 = __webpack_require__(85);
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AiInsightsService_1;
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiInsightsService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(17);
const axios_1 = __webpack_require__(33);
const config_1 = __webpack_require__(4);
const schedule_1 = __webpack_require__(11);
const spending_insight_entity_1 = __webpack_require__(131);
const budget_recommendation_entity_1 = __webpack_require__(132);
const wallet_service_1 = __webpack_require__(59);
const transaction_entity_1 = __webpack_require__(21);
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
        if (spendingData.categoryBreakdown.entertainment > spendingData.totalSpending * 0.3) {
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
/* 131 */
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
const typeorm_1 = __webpack_require__(17);
const user_entity_1 = __webpack_require__(16);
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
/* 132 */
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
const typeorm_1 = __webpack_require__(17);
const user_entity_1 = __webpack_require__(16);
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiInsightsController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const ai_insights_service_1 = __webpack_require__(130);
const jwt_auth_guard_1 = __webpack_require__(75);
let AiInsightsController = class AiInsightsController {
    constructor(aiInsightsService) {
        this.aiInsightsService = aiInsightsService;
    }
    generateInsights(req) {
        return this.aiInsightsService.generateInsights(req.user.id);
    }
    getInsights(req, page = 1, limit = 20) {
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
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
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
/* 134 */
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
const rewards_service_1 = __webpack_require__(135);
const rewards_controller_1 = __webpack_require__(139);
const reward_entity_1 = __webpack_require__(136);
const user_reward_entity_1 = __webpack_require__(137);
const reward_rule_entity_1 = __webpack_require__(138);
const wallet_module_1 = __webpack_require__(85);
const notifications_module_1 = __webpack_require__(83);
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RewardsService_1;
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RewardsService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(17);
const event_emitter_1 = __webpack_require__(12);
const schedule_1 = __webpack_require__(11);
const reward_entity_1 = __webpack_require__(136);
const user_reward_entity_1 = __webpack_require__(137);
const reward_rule_entity_1 = __webpack_require__(138);
const wallet_service_1 = __webpack_require__(59);
const notifications_service_1 = __webpack_require__(32);
const notification_entity_1 = __webpack_require__(22);
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
/* 136 */
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
const typeorm_1 = __webpack_require__(17);
const user_reward_entity_1 = __webpack_require__(137);
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
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserReward = exports.UserRewardStatus = void 0;
const typeorm_1 = __webpack_require__(17);
const user_entity_1 = __webpack_require__(16);
const reward_entity_1 = __webpack_require__(136);
const transaction_entity_1 = __webpack_require__(21);
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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RewardRule = exports.RuleType = void 0;
const typeorm_1 = __webpack_require__(17);
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RewardsController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const rewards_service_1 = __webpack_require__(135);
const jwt_auth_guard_1 = __webpack_require__(75);
let RewardsController = class RewardsController {
    constructor(rewardsService) {
        this.rewardsService = rewardsService;
    }
    getUserRewards(req, page = 1, limit = 20) {
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
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
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
/* 140 */
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
const ledger_service_1 = __webpack_require__(141);
const ledger_controller_1 = __webpack_require__(144);
const ledger_entry_entity_1 = __webpack_require__(142);
const reconciliation_record_entity_1 = __webpack_require__(143);
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var LedgerService_1;
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LedgerService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(17);
const event_emitter_1 = __webpack_require__(12);
const schedule_1 = __webpack_require__(11);
const ledger_entry_entity_1 = __webpack_require__(142);
const reconciliation_record_entity_1 = __webpack_require__(143);
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
        Object.keys(summary.byProvider).forEach(provider => {
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LedgerEntry = exports.LedgerStatus = exports.LedgerProvider = exports.LedgerEntryType = void 0;
const typeorm_1 = __webpack_require__(17);
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
    (0, typeorm_1.Index)(),
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
/* 143 */
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
const typeorm_1 = __webpack_require__(17);
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LedgerController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const ledger_service_1 = __webpack_require__(141);
const jwt_auth_guard_1 = __webpack_require__(75);
const roles_guard_1 = __webpack_require__(76);
const roles_decorator_1 = __webpack_require__(19);
const ledger_entry_entity_1 = __webpack_require__(142);
let LedgerController = class LedgerController {
    constructor(ledgerService) {
        this.ledgerService = ledgerService;
    }
    getLedgerEntries(req, startDate, endDate, provider, page = 1, limit = 50) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.ledgerService.getLedgerEntries(req.user.id, start, end, provider, page, limit);
    }
    getBalanceSummary(req) {
        return this.ledgerService.getBalanceSummary(req.user.id);
    }
    getAllLedgerEntries(userId, startDate, endDate, provider, page = 1, limit = 50) {
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
    getReconciliationHistory(page = 1, limit = 20) {
        return this.ledgerService.getReconciliationHistory(page, limit);
    }
};
exports.LedgerController = LedgerController;
__decorate([
    (0, common_1.Get)('entries'),
    (0, swagger_1.ApiOperation)({ summary: 'Get ledger entries' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ledger entries retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('provider')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, typeof (_b = typeof ledger_entry_entity_1.LedgerProvider !== "undefined" && ledger_entry_entity_1.LedgerProvider) === "function" ? _b : Object, Number, Number]),
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
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('provider')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, typeof (_c = typeof ledger_entry_entity_1.LedgerProvider !== "undefined" && ledger_entry_entity_1.LedgerProvider) === "function" ? _c : Object, Number, Number]),
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
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
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
/* 145 */
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
const transfers_service_1 = __webpack_require__(146);
const transfers_controller_1 = __webpack_require__(150);
const transfer_entity_1 = __webpack_require__(147);
const scheduled_transfer_entity_1 = __webpack_require__(148);
const bank_downtime_entity_1 = __webpack_require__(149);
const wallet_module_1 = __webpack_require__(85);
const notifications_module_1 = __webpack_require__(83);
const ledger_module_1 = __webpack_require__(140);
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
var TransfersService_1;
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransfersService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(17);
const bullmq_1 = __webpack_require__(9);
const bullmq_2 = __webpack_require__(60);
const event_emitter_1 = __webpack_require__(12);
const schedule_1 = __webpack_require__(11);
const transfer_entity_1 = __webpack_require__(147);
const scheduled_transfer_entity_1 = __webpack_require__(148);
const bank_downtime_entity_1 = __webpack_require__(149);
const wallet_service_1 = __webpack_require__(59);
const notifications_service_1 = __webpack_require__(32);
const ledger_service_1 = __webpack_require__(141);
const ledger_entry_entity_1 = __webpack_require__(142);
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
            const downtime = await this.checkBankDowntime(createTransferDto.destinationDetails.bankCode);
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
                nextExecutionDate: (0, typeorm_2.LessThanOrEqual)(new Date()),
            },
        });
        for (const scheduledTransfer of dueTransfers) {
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
            await this.scheduledTransferRepository.save(scheduledTransfer);
        }
        catch (error) {
            this.logger.error(`Scheduled transfer execution failed:`, error);
            await this.notificationsService.create({
                title: 'Scheduled Transfer Failed',
                message: `Your scheduled transfer "${scheduledTransfer.name}" failed to execute`,
                type: 'GENERAL',
                channel: 'IN_APP',
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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Transfer = exports.TransferStatus = exports.TransferType = void 0;
const typeorm_1 = __webpack_require__(17);
const user_entity_1 = __webpack_require__(16);
const wallet_entity_1 = __webpack_require__(20);
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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScheduledTransfer = exports.ScheduleStatus = exports.ScheduleFrequency = void 0;
const typeorm_1 = __webpack_require__(17);
const user_entity_1 = __webpack_require__(16);
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
/* 149 */
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
const typeorm_1 = __webpack_require__(17);
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
/* 150 */
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
const transfers_service_1 = __webpack_require__(146);
const create_transfer_dto_1 = __webpack_require__(151);
const create_scheduled_transfer_dto_1 = __webpack_require__(152);
const jwt_auth_guard_1 = __webpack_require__(75);
let TransfersController = class TransfersController {
    constructor(transfersService) {
        this.transfersService = transfersService;
    }
    create(req, createTransferDto) {
        return this.transfersService.createTransfer(req.user.id, createTransferDto);
    }
    findAll(req, page = 1, limit = 20) {
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
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateTransferDto = void 0;
const class_validator_1 = __webpack_require__(67);
const swagger_1 = __webpack_require__(3);
const transfer_entity_1 = __webpack_require__(147);
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
    __metadata("design:type", Object)
], CreateTransferDto.prototype, "sourceDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Object }),
    __metadata("design:type", Object)
], CreateTransferDto.prototype, "destinationDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateTransferDto.prototype, "metadata", void 0);


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateScheduledTransferDto = void 0;
const class_validator_1 = __webpack_require__(67);
const swagger_1 = __webpack_require__(3);
const scheduled_transfer_entity_1 = __webpack_require__(148);
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
    __metadata("design:type", Object)
], CreateScheduledTransferDto.prototype, "transferTemplate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateScheduledTransferDto.prototype, "metadata", void 0);


/***/ }),
/* 153 */
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
/* 154 */
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
const operators_1 = __webpack_require__(155);
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
/* 155 */
/***/ ((module) => {

module.exports = require("rxjs/operators");

/***/ }),
/* 156 */
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
const operators_1 = __webpack_require__(155);
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