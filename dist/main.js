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
const all_exceptions_filter_1 = __webpack_require__(102);
const response_interceptor_1 = __webpack_require__(103);
const logging_interceptor_1 = __webpack_require__(105);
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
const redis_config_1 = __webpack_require__(23);
const auth_module_1 = __webpack_require__(24);
const users_module_1 = __webpack_require__(70);
const wallet_module_1 = __webpack_require__(83);
const bills_module_1 = __webpack_require__(92);
const notifications_module_1 = __webpack_require__(81);
const payments_module_1 = __webpack_require__(87);
const health_module_1 = __webpack_require__(97);
const kyc_module_1 = __webpack_require__(100);
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
            kyc_module_1.KycModule
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
const bill_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@/modules/bills/entities/bill.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const bill_payment_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@/modules/bills/entities/bill-payment.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
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
/* 24 */
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
const jwt_1 = __webpack_require__(25);
const passport_1 = __webpack_require__(26);
const config_1 = __webpack_require__(4);
const auth_service_1 = __webpack_require__(27);
const auth_controller_1 = __webpack_require__(63);
const users_module_1 = __webpack_require__(70);
const jwt_strategy_1 = __webpack_require__(77);
const local_strategy_1 = __webpack_require__(79);
const notifications_module_1 = __webpack_require__(81);
const wallet_module_1 = __webpack_require__(83);
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
/* 25 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 26 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 27 */
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
const jwt_1 = __webpack_require__(25);
const bcrypt = __importStar(__webpack_require__(28));
const users_service_1 = __webpack_require__(29);
const notifications_service_1 = __webpack_require__(30);
const xpress_wallet_1 = __webpack_require__(35);
const config_1 = __webpack_require__(4);
const wallet_service_1 = __webpack_require__(57);
const wallet_entity_1 = __webpack_require__(20);
const crypto = __importStar(__webpack_require__(60));
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
        const user = await this.usersService.findByEmailOrPhone(identifier, identifier);
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
/* 28 */
/***/ ((module) => {

module.exports = require("bcryptjs");

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
const axios_1 = __webpack_require__(31);
const config_1 = __webpack_require__(4);
const zeptomail_1 = __webpack_require__(32);
const verifymail_template_1 = __webpack_require__(33);
const axios_2 = __webpack_require__(34);
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
/* 31 */
/***/ ((module) => {

module.exports = require("@nestjs/axios");

/***/ }),
/* 32 */
/***/ ((module) => {

module.exports = require("zeptomail");

/***/ }),
/* 33 */
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
/* 34 */
/***/ ((module) => {

module.exports = require("axios");

/***/ }),
/* 35 */
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
var xpress_wallet_sdk_1 = __webpack_require__(36);
Object.defineProperty(exports, "XpressWalletSDK", ({ enumerable: true, get: function () { return xpress_wallet_sdk_1.XpressWalletSDK; } }));
__exportStar(__webpack_require__(47), exports);
__exportStar(__webpack_require__(48), exports);
__exportStar(__webpack_require__(49), exports);
__exportStar(__webpack_require__(50), exports);
__exportStar(__webpack_require__(51), exports);
__exportStar(__webpack_require__(52), exports);
__exportStar(__webpack_require__(53), exports);
__exportStar(__webpack_require__(54), exports);
__exportStar(__webpack_require__(55), exports);
__exportStar(__webpack_require__(56), exports);
var http_client_1 = __webpack_require__(37);
Object.defineProperty(exports, "XpressWalletError", ({ enumerable: true, get: function () { return http_client_1.XpressWalletError; } }));


/***/ }),
/* 36 */
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
const http_client_1 = __webpack_require__(37);
const auth_service_1 = __webpack_require__(38);
const user_service_1 = __webpack_require__(39);
const customer_service_1 = __webpack_require__(40);
const wallet_service_1 = __webpack_require__(41);
const transaction_service_1 = __webpack_require__(42);
const transfer_service_1 = __webpack_require__(43);
const team_service_1 = __webpack_require__(44);
const merchant_service_1 = __webpack_require__(45);
const card_service_1 = __webpack_require__(46);
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
__exportStar(__webpack_require__(47), exports);
__exportStar(__webpack_require__(48), exports);
__exportStar(__webpack_require__(49), exports);
__exportStar(__webpack_require__(50), exports);
__exportStar(__webpack_require__(51), exports);
__exportStar(__webpack_require__(52), exports);
__exportStar(__webpack_require__(53), exports);
__exportStar(__webpack_require__(54), exports);
__exportStar(__webpack_require__(55), exports);
__exportStar(__webpack_require__(56), exports);
var http_client_2 = __webpack_require__(37);
Object.defineProperty(exports, "XpressWalletError", ({ enumerable: true, get: function () { return http_client_2.XpressWalletError; } }));


/***/ }),
/* 37 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.XpressWalletError = void 0;
const axios_1 = __importDefault(__webpack_require__(34));
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
/* 38 */
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
/* 39 */
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
/* 40 */
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
/* 41 */
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
/* 42 */
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
/* 43 */
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
/* 44 */
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
/* 45 */
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
/* 46 */
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
/* 47 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 48 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


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
const bullmq_2 = __webpack_require__(58);
const wallet_entity_1 = __webpack_require__(20);
const transaction_entity_1 = __webpack_require__(21);
const payments_service_1 = __webpack_require__(59);
const uuid_1 = __webpack_require__(62);
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
/* 58 */
/***/ ((module) => {

module.exports = require("bullmq");

/***/ }),
/* 59 */
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
const wallet_service_1 = __webpack_require__(57);
const transaction_entity_1 = __webpack_require__(21);
const crypto = __importStar(__webpack_require__(60));
const xpress_wallet_1 = __webpack_require__(35);
const config_1 = __webpack_require__(4);
const flutterwave_v3_1 = __importDefault(__webpack_require__(61));
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
/* 60 */
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),
/* 61 */
/***/ ((module) => {

module.exports = require("@api/flutterwave-v3");

/***/ }),
/* 62 */
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),
/* 63 */
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
const auth_service_1 = __webpack_require__(27);
const create_user_dto_1 = __webpack_require__(64);
const login_dto_1 = __webpack_require__(66);
const local_auth_guard_1 = __webpack_require__(67);
const biometric_login_dto_1 = __webpack_require__(68);
const register_biometric_dto_1 = __webpack_require__(69);
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
/* 64 */
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
const class_validator_1 = __webpack_require__(65);
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
/* 65 */
/***/ ((module) => {

module.exports = require("class-validator");

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
exports.LoginDto = void 0;
const class_validator_1 = __webpack_require__(65);
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
/* 67 */
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
const passport_1 = __webpack_require__(26);
let LocalAuthGuard = class LocalAuthGuard extends (0, passport_1.AuthGuard)('local') {
};
exports.LocalAuthGuard = LocalAuthGuard;
exports.LocalAuthGuard = LocalAuthGuard = __decorate([
    (0, common_1.Injectable)()
], LocalAuthGuard);


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
exports.BiometricLoginDto = void 0;
const class_validator_1 = __webpack_require__(65);
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterBiometricDto = void 0;
const class_validator_1 = __webpack_require__(65);
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
/* 70 */
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
const users_service_1 = __webpack_require__(29);
const users_controller_1 = __webpack_require__(71);
const user_entity_1 = __webpack_require__(16);
const encryption_util_1 = __webpack_require__(75);
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const users_service_1 = __webpack_require__(29);
const update_user_dto_1 = __webpack_require__(72);
const jwt_auth_guard_1 = __webpack_require__(73);
const roles_guard_1 = __webpack_require__(74);
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
/* 72 */
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
const class_validator_1 = __webpack_require__(65);
const class_validator_2 = __webpack_require__(65);
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(26);
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
/* 75 */
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
const CryptoJS = __importStar(__webpack_require__(76));
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
/* 76 */
/***/ ((module) => {

module.exports = require("crypto-js");

/***/ }),
/* 77 */
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
const passport_1 = __webpack_require__(26);
const passport_jwt_1 = __webpack_require__(78);
const config_1 = __webpack_require__(4);
const users_service_1 = __webpack_require__(29);
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
/* 78 */
/***/ ((module) => {

module.exports = require("passport-jwt");

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalStrategy = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(26);
const passport_local_1 = __webpack_require__(80);
const auth_service_1 = __webpack_require__(27);
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
/* 80 */
/***/ ((module) => {

module.exports = require("passport-local");

/***/ }),
/* 81 */
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
const notifications_service_1 = __webpack_require__(30);
const notifications_controller_1 = __webpack_require__(82);
const notification_entity_1 = __webpack_require__(22);
const axios_1 = __webpack_require__(31);
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
/* 82 */
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
const notifications_service_1 = __webpack_require__(30);
const jwt_auth_guard_1 = __webpack_require__(73);
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
/* 83 */
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
const wallet_service_1 = __webpack_require__(57);
const wallet_controller_1 = __webpack_require__(84);
const wallet_entity_1 = __webpack_require__(20);
const transaction_entity_1 = __webpack_require__(21);
const payments_module_1 = __webpack_require__(87);
const notifications_module_1 = __webpack_require__(81);
const transaction_processor_1 = __webpack_require__(91);
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WalletController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const wallet_service_1 = __webpack_require__(57);
const create_wallet_dto_1 = __webpack_require__(85);
const withdraw_dto_1 = __webpack_require__(86);
const jwt_auth_guard_1 = __webpack_require__(73);
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
/* 85 */
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
const class_validator_1 = __webpack_require__(65);
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WithdrawDto = void 0;
const class_validator_1 = __webpack_require__(65);
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
/* 87 */
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
const payments_service_1 = __webpack_require__(59);
const transaction_entity_1 = __webpack_require__(21);
const wallet_module_1 = __webpack_require__(83);
const flutterwave_module_1 = __webpack_require__(88);
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
/* 88 */
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
const flutterwave_service_1 = __webpack_require__(89);
const axios_1 = __webpack_require__(31);
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
/* 89 */
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
const flutterwave_node_v3_1 = __importDefault(__webpack_require__(90));
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
/* 90 */
/***/ ((module) => {

module.exports = require("flutterwave-node-v3");

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
var TransactionProcessor_1;
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionProcessor = void 0;
const bullmq_1 = __webpack_require__(9);
const common_1 = __webpack_require__(2);
const event_emitter_1 = __webpack_require__(12);
const bullmq_2 = __webpack_require__(58);
const wallet_service_1 = __webpack_require__(57);
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
/* 92 */
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
const bills_service_1 = __webpack_require__(93);
const bills_controller_1 = __webpack_require__(96);
const bill_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './entities/bill.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const bill_payment_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './entities/bill-payment.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const payments_module_1 = __webpack_require__(87);
let BillsModule = class BillsModule {
};
exports.BillsModule = BillsModule;
exports.BillsModule = BillsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([bill_entity_1.Bill, bill_payment_entity_1.BillPayment]),
            payments_module_1.PaymentsModule,
        ],
        controllers: [bills_controller_1.BillsController],
        providers: [bills_service_1.BillsService],
        exports: [bills_service_1.BillsService],
    })
], BillsModule);


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
const recurring_payment_entity_1 = __webpack_require__(94);
const payments_service_1 = __webpack_require__(59);
const recurring_payments_service_1 = __webpack_require__(95);
const flutterwave_v3_1 = __importDefault(__webpack_require__(61));
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
/* 94 */
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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RecurringPaymentsService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(17);
const recurring_payment_entity_1 = __webpack_require__(94);
const transaction_entity_1 = __webpack_require__(21);
const payments_service_1 = __webpack_require__(59);
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillsController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const bills_service_1 = __webpack_require__(93);
const jwt_auth_guard_1 = __webpack_require__(73);
const recurring_payments_service_1 = __webpack_require__(95);
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
/* 97 */
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
const health_controller_1 = __webpack_require__(98);
const health_service_1 = __webpack_require__(99);
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const health_service_1 = __webpack_require__(99);
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
/* 99 */
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
/* 100 */
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
const kyc_service_1 = __webpack_require__(101);
const axios_1 = __webpack_require__(31);
const users_module_1 = __webpack_require__(70);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KycService = void 0;
const common_1 = __webpack_require__(2);
const users_service_1 = __webpack_require__(29);
const axios_1 = __importDefault(__webpack_require__(34));
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
/* 102 */
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
/* 103 */
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
const operators_1 = __webpack_require__(104);
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
/* 104 */
/***/ ((module) => {

module.exports = require("rxjs/operators");

/***/ }),
/* 105 */
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
const operators_1 = __webpack_require__(104);
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