/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.module.ts":
/*!***************************!*\
  !*** ./src/app.module.ts ***!
  \***************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const bullmq_1 = __webpack_require__(/*! @nestjs/bullmq */ "@nestjs/bullmq");
const throttler_1 = __webpack_require__(/*! @nestjs/throttler */ "@nestjs/throttler");
const schedule_1 = __webpack_require__(/*! @nestjs/schedule */ "@nestjs/schedule");
const event_emitter_1 = __webpack_require__(/*! @nestjs/event-emitter */ "@nestjs/event-emitter");
const nest_winston_1 = __webpack_require__(/*! nest-winston */ "nest-winston");
const winston = __importStar(__webpack_require__(/*! winston */ "winston"));
const database_config_1 = __webpack_require__(/*! ./config/database.config */ "./src/config/database.config.ts");
const redis_config_1 = __webpack_require__(/*! ./config/redis.config */ "./src/config/redis.config.ts");
const auth_module_1 = __webpack_require__(/*! @/modules/auth/auth.module */ "./src/modules/auth/auth.module.ts");
const users_module_1 = __webpack_require__(/*! @/modules/users/users.module */ "./src/modules/users/users.module.ts");
const wallet_module_1 = __webpack_require__(/*! @/modules/wallet/wallet.module */ "./src/modules/wallet/wallet.module.ts");
const bills_module_1 = __webpack_require__(/*! @/modules/bills/bills.module */ "./src/modules/bills/bills.module.ts");
const notifications_module_1 = __webpack_require__(/*! @/modules/notifications/notifications.module */ "./src/modules/notifications/notifications.module.ts");
const payments_module_1 = __webpack_require__(/*! @/modules/payments/payments.module */ "./src/modules/payments/payments.module.ts");
const health_module_1 = __webpack_require__(/*! @/modules/health/health.module */ "./src/modules/health/health.module.ts");
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
        ],
    })
], AppModule);


/***/ }),

/***/ "./src/config/database.config.ts":
/*!***************************************!*\
  !*** ./src/config/database.config.ts ***!
  \***************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const user_entity_1 = __webpack_require__(/*! @/modules/users/entities/user.entity */ "./src/modules/users/entities/user.entity.ts");
const wallet_entity_1 = __webpack_require__(/*! @/modules/wallet/entities/wallet.entity */ "./src/modules/wallet/entities/wallet.entity.ts");
const transaction_entity_1 = __webpack_require__(/*! @/modules/wallet/entities/transaction.entity */ "./src/modules/wallet/entities/transaction.entity.ts");
const bill_entity_1 = __webpack_require__(/*! @/modules/bills/entities/bill.entity */ "./src/modules/bills/entities/bill.entity.ts");
const bill_payment_entity_1 = __webpack_require__(/*! @/modules/bills/entities/bill-payment.entity */ "./src/modules/bills/entities/bill-payment.entity.ts");
const notification_entity_1 = __webpack_require__(/*! @/modules/notifications/entities/notification.entity */ "./src/modules/notifications/entities/notification.entity.ts");
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

/***/ "./src/config/redis.config.ts":
/*!************************************!*\
  !*** ./src/config/redis.config.ts ***!
  \************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
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

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const helmet_1 = __importDefault(__webpack_require__(/*! helmet */ "helmet"));
const compression_1 = __importDefault(__webpack_require__(/*! compression */ "compression"));
const app_module_1 = __webpack_require__(/*! ./app.module */ "./src/app.module.ts");
const all_exceptions_filter_1 = __webpack_require__(/*! ./modules/common/filters/all-exceptions.filter */ "./src/modules/common/filters/all-exceptions.filter.ts");
const response_interceptor_1 = __webpack_require__(/*! ./modules/common/interceptors/response.interceptor */ "./src/modules/common/interceptors/response.interceptor.ts");
const logging_interceptor_1 = __webpack_require__(/*! ./modules/common/interceptors/logging.interceptor */ "./src/modules/common/interceptors/logging.interceptor.ts");
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

/***/ "./src/modules/auth/auth.controller.ts":
/*!*********************************************!*\
  !*** ./src/modules/auth/auth.controller.ts ***!
  \*********************************************/
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
exports.AuthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const throttler_1 = __webpack_require__(/*! @nestjs/throttler */ "@nestjs/throttler");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/modules/auth/auth.service.ts");
const create_user_dto_1 = __webpack_require__(/*! ../users/dto/create-user.dto */ "./src/modules/users/dto/create-user.dto.ts");
const login_dto_1 = __webpack_require__(/*! ./dto/login.dto */ "./src/modules/auth/dto/login.dto.ts");
const local_auth_guard_1 = __webpack_require__(/*! ../common/guards/local-auth.guard */ "./src/modules/common/guards/local-auth.guard.ts");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(createUserDto) {
        return this.authService.register(createUserDto);
    }
    async login(loginDto, req) {
        return this.authService.login(loginDto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User successfully registered' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'User already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_user_dto_1.CreateUserDto !== "undefined" && create_user_dto_1.CreateUserDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Login user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User successfully logged in' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof login_dto_1.LoginDto !== "undefined" && login_dto_1.LoginDto) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),

/***/ "./src/modules/auth/auth.module.ts":
/*!*****************************************!*\
  !*** ./src/modules/auth/auth.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/modules/auth/auth.service.ts");
const auth_controller_1 = __webpack_require__(/*! ./auth.controller */ "./src/modules/auth/auth.controller.ts");
const users_module_1 = __webpack_require__(/*! ../users/users.module */ "./src/modules/users/users.module.ts");
const jwt_strategy_1 = __webpack_require__(/*! ./strategies/jwt.strategy */ "./src/modules/auth/strategies/jwt.strategy.ts");
const local_strategy_1 = __webpack_require__(/*! ./strategies/local.strategy */ "./src/modules/auth/strategies/local.strategy.ts");
const local_auth_guard_1 = __webpack_require__(/*! ../common/guards/local-auth.guard */ "./src/modules/common/guards/local-auth.guard.ts");
const notifications_module_1 = __webpack_require__(/*! ../notifications/notifications.module */ "./src/modules/notifications/notifications.module.ts");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            passport_1.PassportModule,
            notifications_module_1.NotificationsModule,
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRES_IN', '7d'),
                    },
                }),
            })
        ],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, local_strategy_1.LocalStrategy, local_auth_guard_1.LocalAuthGuard],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService, local_auth_guard_1.LocalAuthGuard],
    })
], AuthModule);


/***/ }),

/***/ "./src/modules/auth/auth.service.ts":
/*!******************************************!*\
  !*** ./src/modules/auth/auth.service.ts ***!
  \******************************************/
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const bcrypt = __importStar(__webpack_require__(/*! bcryptjs */ "bcryptjs"));
const users_service_1 = __webpack_require__(/*! ../users/users.service */ "./src/modules/users/users.service.ts");
const notifications_service_1 = __webpack_require__(/*! ../notifications/notifications.service */ "./src/modules/notifications/notifications.service.ts");
let AuthService = class AuthService {
    constructor(usersService, jwtService, sendCodeService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.sendCodeService = sendCodeService;
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
        await this.sendCodeService.sendVerificationCode(contact, code, type);
        await this.usersService.storeVerificationCode(contact, type, 'register', code);
        return { message: 'Verification code sent' };
    }
    async resendCode(createUserDto) {
        const { email, phone } = createUserDto;
        const contact = email || phone;
        const type = this.getContactType(contact);
        const user = await this.usersService.findByEmailOrPhone(email, phone);
        if (!user)
            throw new common_1.NotFoundException('User with this email or phone does not exist');
        const code = this.generateCode();
        await this.sendCodeService.sendVerificationCode(contact, code, type);
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
        return this.usersService.updateUser(user.id, data);
    }
    async updatePassword(userId, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        return this.usersService.updateUser(userId, { password: hashedPassword });
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
    async initiateResetPassword(identifier) {
        const type = this.getContactType(identifier);
        const user = await this.usersService.findByEmailOrPhone(identifier, identifier);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const code = this.generateCode();
        await this.usersService.storeVerificationCode(identifier, type, 'reset-password', code);
        await this.sendCodeService.sendVerificationCode(identifier, code, type);
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
    async updatePin(userId, oldPin, newPin) {
        await this.verifyPin(userId, oldPin);
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
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object, typeof (_c = typeof notifications_service_1.NotificationsService !== "undefined" && notifications_service_1.NotificationsService) === "function" ? _c : Object])
], AuthService);


/***/ }),

/***/ "./src/modules/auth/dto/login.dto.ts":
/*!*******************************************!*\
  !*** ./src/modules/auth/dto/login.dto.ts ***!
  \*******************************************/
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
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
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

/***/ "./src/modules/auth/strategies/jwt.strategy.ts":
/*!*****************************************************!*\
  !*** ./src/modules/auth/strategies/jwt.strategy.ts ***!
  \*****************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const passport_jwt_1 = __webpack_require__(/*! passport-jwt */ "passport-jwt");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const users_service_1 = __webpack_require__(/*! ../../users/users.service */ "./src/modules/users/users.service.ts");
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

/***/ "./src/modules/auth/strategies/local.strategy.ts":
/*!*******************************************************!*\
  !*** ./src/modules/auth/strategies/local.strategy.ts ***!
  \*******************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const passport_local_1 = __webpack_require__(/*! passport-local */ "passport-local");
const auth_service_1 = __webpack_require__(/*! ../auth.service */ "./src/modules/auth/auth.service.ts");
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

/***/ "./src/modules/bills/bills.controller.ts":
/*!***********************************************!*\
  !*** ./src/modules/bills/bills.controller.ts ***!
  \***********************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const bills_service_1 = __webpack_require__(/*! ./bills.service */ "./src/modules/bills/bills.service.ts");
const bill_entity_1 = __webpack_require__(/*! ./entities/bill.entity */ "./src/modules/bills/entities/bill.entity.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../common/guards/jwt-auth.guard */ "./src/modules/common/guards/jwt-auth.guard.ts");
let BillsController = class BillsController {
    constructor(billsService) {
        this.billsService = billsService;
    }
    findAll() {
        return this.billsService.findAll();
    }
    findByType(type) {
        return this.billsService.findByType(type);
    }
    getUserPayments(req) {
        return this.billsService.getUserBillPayments(req.user.id);
    }
    getPaymentById(id) {
        return this.billsService.getBillPaymentById(id);
    }
    findOne(id) {
        return this.billsService.findById(id);
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
], BillsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('type/:type'),
    (0, swagger_1.ApiOperation)({ summary: 'Get bills by type' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bills retrieved successfully' }),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof bill_entity_1.BillType !== "undefined" && bill_entity_1.BillType) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], BillsController.prototype, "findByType", null);
__decorate([
    (0, common_1.Get)('payments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user bill payment history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bill payments retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BillsController.prototype, "getUserPayments", null);
__decorate([
    (0, common_1.Get)('payments/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get bill payment by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bill payment retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Bill payment not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BillsController.prototype, "getPaymentById", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get bill by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bill retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Bill not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BillsController.prototype, "findOne", null);
exports.BillsController = BillsController = __decorate([
    (0, swagger_1.ApiTags)('Bills'),
    (0, common_1.Controller)('bills'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof bills_service_1.BillsService !== "undefined" && bills_service_1.BillsService) === "function" ? _a : Object])
], BillsController);


/***/ }),

/***/ "./src/modules/bills/bills.module.ts":
/*!*******************************************!*\
  !*** ./src/modules/bills/bills.module.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const bills_service_1 = __webpack_require__(/*! ./bills.service */ "./src/modules/bills/bills.service.ts");
const bills_controller_1 = __webpack_require__(/*! ./bills.controller */ "./src/modules/bills/bills.controller.ts");
const bill_entity_1 = __webpack_require__(/*! ./entities/bill.entity */ "./src/modules/bills/entities/bill.entity.ts");
const bill_payment_entity_1 = __webpack_require__(/*! ./entities/bill-payment.entity */ "./src/modules/bills/entities/bill-payment.entity.ts");
const payments_module_1 = __webpack_require__(/*! ../payments/payments.module */ "./src/modules/payments/payments.module.ts");
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

/***/ "./src/modules/bills/bills.service.ts":
/*!********************************************!*\
  !*** ./src/modules/bills/bills.service.ts ***!
  \********************************************/
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
exports.BillsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const bill_entity_1 = __webpack_require__(/*! ./entities/bill.entity */ "./src/modules/bills/entities/bill.entity.ts");
const bill_payment_entity_1 = __webpack_require__(/*! ./entities/bill-payment.entity */ "./src/modules/bills/entities/bill-payment.entity.ts");
const payments_service_1 = __webpack_require__(/*! ../payments/payments.service */ "./src/modules/payments/payments.service.ts");
let BillsService = class BillsService {
    constructor(billRepository, billPaymentRepository, paymentsService) {
        this.billRepository = billRepository;
        this.billPaymentRepository = billPaymentRepository;
        this.paymentsService = paymentsService;
    }
    async findAll() {
        return this.billRepository.find({
            where: { isActive: true },
            order: { name: 'ASC' },
        });
    }
    async findByType(type) {
        return this.billRepository.find({
            where: { type, isActive: true },
            order: { name: 'ASC' },
        });
    }
    async findById(id) {
        const bill = await this.billRepository.findOne({
            where: { id },
            relations: ['payments'],
        });
        if (!bill) {
            throw new common_1.NotFoundException(`Bill with ID ${id} not found`);
        }
        return bill;
    }
    async getUserBillPayments(userId) {
        return this.billPaymentRepository.find({
            where: { userId },
            relations: ['bill'],
            order: { createdAt: 'DESC' },
        });
    }
    async getBillPaymentById(id) {
        const payment = await this.billPaymentRepository.findOne({
            where: { id },
            relations: ['bill', 'user'],
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Bill payment with ID ${id} not found`);
        }
        return payment;
    }
};
exports.BillsService = BillsService;
exports.BillsService = BillsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bill_entity_1.Bill)),
    __param(1, (0, typeorm_1.InjectRepository)(bill_payment_entity_1.BillPayment)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof payments_service_1.PaymentsService !== "undefined" && payments_service_1.PaymentsService) === "function" ? _c : Object])
], BillsService);


/***/ }),

/***/ "./src/modules/bills/entities/bill-payment.entity.ts":
/*!***********************************************************!*\
  !*** ./src/modules/bills/entities/bill-payment.entity.ts ***!
  \***********************************************************/
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
exports.BillPayment = exports.PaymentStatus = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const bill_entity_1 = __webpack_require__(/*! ./bill.entity */ "./src/modules/bills/entities/bill.entity.ts");
const user_entity_1 = __webpack_require__(/*! ../../users/entities/user.entity */ "./src/modules/users/entities/user.entity.ts");
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PROCESSING"] = "processing";
    PaymentStatus["COMPLETED"] = "completed";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["CANCELLED"] = "cancelled";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
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
], BillPayment.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING }),
    __metadata("design:type", String)
], BillPayment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BillPayment.prototype, "customerIdentifier", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BillPayment.prototype, "providerReference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], BillPayment.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], BillPayment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], BillPayment.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], BillPayment.prototype, "billId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], BillPayment.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bill_entity_1.Bill, (bill) => bill.payments),
    (0, typeorm_1.JoinColumn)({ name: 'billId' }),
    __metadata("design:type", typeof (_c = typeof bill_entity_1.Bill !== "undefined" && bill_entity_1.Bill) === "function" ? _c : Object)
], BillPayment.prototype, "bill", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", typeof (_d = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _d : Object)
], BillPayment.prototype, "user", void 0);
exports.BillPayment = BillPayment = __decorate([
    (0, typeorm_1.Entity)('bill_payments')
], BillPayment);


/***/ }),

/***/ "./src/modules/bills/entities/bill.entity.ts":
/*!***************************************************!*\
  !*** ./src/modules/bills/entities/bill.entity.ts ***!
  \***************************************************/
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
exports.Bill = exports.BillType = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const bill_payment_entity_1 = __webpack_require__(/*! ./bill-payment.entity */ "./src/modules/bills/entities/bill-payment.entity.ts");
var BillType;
(function (BillType) {
    BillType["ELECTRICITY"] = "electricity";
    BillType["AIRTIME"] = "airtime";
    BillType["DATA"] = "data";
    BillType["INTERNET"] = "internet";
    BillType["TV_SUBSCRIPTION"] = "tv_subscription";
})(BillType || (exports.BillType = BillType = {}));
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
    (0, typeorm_1.Column)({ type: 'enum', enum: BillType }),
    __metadata("design:type", String)
], Bill.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Bill.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Bill.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Bill.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Bill.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Bill.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Bill.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bill_payment_entity_1.BillPayment, (payment) => payment.bill),
    __metadata("design:type", Array)
], Bill.prototype, "payments", void 0);
exports.Bill = Bill = __decorate([
    (0, typeorm_1.Entity)('bills')
], Bill);


/***/ }),

/***/ "./src/modules/common/decorators/roles.decorator.ts":
/*!**********************************************************!*\
  !*** ./src/modules/common/decorators/roles.decorator.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = exports.ROLES_KEY = exports.Role = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
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

/***/ "./src/modules/common/filters/all-exceptions.filter.ts":
/*!*************************************************************!*\
  !*** ./src/modules/common/filters/all-exceptions.filter.ts ***!
  \*************************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
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

/***/ "./src/modules/common/guards/jwt-auth.guard.ts":
/*!*****************************************************!*\
  !*** ./src/modules/common/guards/jwt-auth.guard.ts ***!
  \*****************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
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

/***/ "./src/modules/common/guards/local-auth.guard.ts":
/*!*******************************************************!*\
  !*** ./src/modules/common/guards/local-auth.guard.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalAuthGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
let LocalAuthGuard = class LocalAuthGuard extends (0, passport_1.AuthGuard)('local') {
};
exports.LocalAuthGuard = LocalAuthGuard;
exports.LocalAuthGuard = LocalAuthGuard = __decorate([
    (0, common_1.Injectable)()
], LocalAuthGuard);


/***/ }),

/***/ "./src/modules/common/guards/roles.guard.ts":
/*!**************************************************!*\
  !*** ./src/modules/common/guards/roles.guard.ts ***!
  \**************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const roles_decorator_1 = __webpack_require__(/*! ../decorators/roles.decorator */ "./src/modules/common/decorators/roles.decorator.ts");
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

/***/ "./src/modules/common/interceptors/logging.interceptor.ts":
/*!****************************************************************!*\
  !*** ./src/modules/common/interceptors/logging.interceptor.ts ***!
  \****************************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const operators_1 = __webpack_require__(/*! rxjs/operators */ "rxjs/operators");
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


/***/ }),

/***/ "./src/modules/common/interceptors/response.interceptor.ts":
/*!*****************************************************************!*\
  !*** ./src/modules/common/interceptors/response.interceptor.ts ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResponseInterceptor = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const operators_1 = __webpack_require__(/*! rxjs/operators */ "rxjs/operators");
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

/***/ "./src/modules/common/utils/encryption.util.ts":
/*!*****************************************************!*\
  !*** ./src/modules/common/utils/encryption.util.ts ***!
  \*****************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const CryptoJS = __importStar(__webpack_require__(/*! crypto-js */ "crypto-js"));
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

/***/ "./src/modules/flutterwave/flutterwave.module.ts":
/*!*******************************************************!*\
  !*** ./src/modules/flutterwave/flutterwave.module.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FlutterwaveModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const flutterwave_service_1 = __webpack_require__(/*! ./flutterwave.service */ "./src/modules/flutterwave/flutterwave.service.ts");
const axios_1 = __webpack_require__(/*! @nestjs/axios */ "@nestjs/axios");
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

/***/ "./src/modules/flutterwave/flutterwave.service.ts":
/*!********************************************************!*\
  !*** ./src/modules/flutterwave/flutterwave.service.ts ***!
  \********************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const flutterwave_node_v3_1 = __importDefault(__webpack_require__(/*! flutterwave-node-v3 */ "flutterwave-node-v3"));
let FlutterwaveService = class FlutterwaveService {
    constructor(configService) {
        this.configService = configService;
        this.flw = new flutterwave_node_v3_1.default(configService.get('FLUTTERWAVE_PUBLIC_KEY'), configService.get('FLUTTERWAVE_SECRET_KEY'));
    }
    async initializePayment(data) {
        const payload = {
            tx_ref: data.reference,
            amount: data.amount,
            currency: 'NGN',
            redirect_url: process.env.FLW_REDIRECT_URL,
            payment_options: 'card,banktransfer',
            customer: {
                email: data.email,
            },
            customizations: {
                title: 'Wallet Funding',
                description: 'Fund your wallet',
            },
            meta: data.metadata || {},
        };
        const response = await this.flw.Payment.initialize(payload);
        return response.data;
    }
    async getBillCategories() {
        const resp = await this.flw.Bills.fetch_bills();
        if (resp.status !== 'success' || !resp.data) {
            throw new common_1.BadRequestException(resp.message);
        }
        return resp.data;
    }
    async verifyPayment(transactionId) {
        const resp = await this.flw.Transaction.verify({ id: transactionId });
        if (resp.status !== 'success' || !resp.data) {
            throw new common_1.BadRequestException(resp.message);
        }
        return resp.data;
    }
    async validateBillService(billType, billerCode, customer) {
        const resp = await this.flw.Bills.validate({ item_code: billType, biller_code: billerCode, customer });
        if (resp.status !== 'success' || !resp.data) {
            throw new common_1.BadRequestException(resp.message);
        }
        return resp.data;
    }
    async initiateTransfer(payload) {
        const resp = await this.flw.Transfer.initiate(payload);
        if (resp.status !== 'success' || !resp.data) {
            throw new common_1.BadRequestException(resp.message);
        }
        return resp.data;
    }
    async createVirtualAccount(input) {
        const resp = await this.flw.VirtualAcct.create({
            ...input,
            is_permanent: true,
            bvn: '12345678901',
            tx_ref: `VA_${Date.now()}`,
            firstname: input.firstName,
            lastname: input.lastName,
            phonenumber: input.phone,
        });
        if (resp.status !== 'success' || !resp.data) {
            throw new common_1.BadRequestException(resp.message);
        }
        return resp.data;
    }
    async payBill(payload) {
        const resp = await this.flw.Bills.create_bill(payload);
        if (resp.status !== 'success' || !resp.data) {
            throw new common_1.BadRequestException(resp.message);
        }
        return resp.data;
    }
    async getBanks(country = 'NG') {
        const resp = await this.flw.Bank.country({ country });
        if (resp.status !== 'success' || !resp.data) {
            throw new common_1.BadRequestException(resp.message);
        }
        return resp.data;
    }
    async resolveAccountNumber(account_number, account_bank) {
        const resp = await this.flw.Misc.verify_Account({ account_number, account_bank });
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

/***/ "./src/modules/health/health.controller.ts":
/*!*************************************************!*\
  !*** ./src/modules/health/health.controller.ts ***!
  \*************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const health_service_1 = __webpack_require__(/*! ./health.service */ "./src/modules/health/health.service.ts");
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

/***/ "./src/modules/health/health.module.ts":
/*!*********************************************!*\
  !*** ./src/modules/health/health.module.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const health_controller_1 = __webpack_require__(/*! ./health.controller */ "./src/modules/health/health.controller.ts");
const health_service_1 = __webpack_require__(/*! ./health.service */ "./src/modules/health/health.service.ts");
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

/***/ "./src/modules/health/health.service.ts":
/*!**********************************************!*\
  !*** ./src/modules/health/health.service.ts ***!
  \**********************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
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

/***/ "./src/modules/notifications/entities/notification.entity.ts":
/*!*******************************************************************!*\
  !*** ./src/modules/notifications/entities/notification.entity.ts ***!
  \*******************************************************************/
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
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const user_entity_1 = __webpack_require__(/*! ../../users/entities/user.entity */ "./src/modules/users/entities/user.entity.ts");
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

/***/ "./src/modules/notifications/notifications.controller.ts":
/*!***************************************************************!*\
  !*** ./src/modules/notifications/notifications.controller.ts ***!
  \***************************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const notifications_service_1 = __webpack_require__(/*! ./notifications.service */ "./src/modules/notifications/notifications.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../common/guards/jwt-auth.guard */ "./src/modules/common/guards/jwt-auth.guard.ts");
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

/***/ "./src/modules/notifications/notifications.module.ts":
/*!***********************************************************!*\
  !*** ./src/modules/notifications/notifications.module.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const notifications_service_1 = __webpack_require__(/*! ./notifications.service */ "./src/modules/notifications/notifications.service.ts");
const notifications_controller_1 = __webpack_require__(/*! ./notifications.controller */ "./src/modules/notifications/notifications.controller.ts");
const notification_entity_1 = __webpack_require__(/*! ./entities/notification.entity */ "./src/modules/notifications/entities/notification.entity.ts");
const axios_1 = __webpack_require__(/*! @nestjs/axios */ "@nestjs/axios");
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

/***/ "./src/modules/notifications/notifications.service.ts":
/*!************************************************************!*\
  !*** ./src/modules/notifications/notifications.service.ts ***!
  \************************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const notification_entity_1 = __webpack_require__(/*! ./entities/notification.entity */ "./src/modules/notifications/entities/notification.entity.ts");
const axios_1 = __webpack_require__(/*! @nestjs/axios */ "@nestjs/axios");
const rxjs_1 = __webpack_require__(/*! rxjs */ "rxjs");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const twilio_1 = __webpack_require__(/*! twilio */ "twilio");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(notificationRepo, httpService, configService) {
        this.notificationRepo = notificationRepo;
        this.httpService = httpService;
        this.configService = configService;
        this.logger = new common_1.Logger(NotificationsService_1.name);
        this.twilioClient = new twilio_1.Twilio(this.configService.get('TWILIO_ACCOUNT_SID'), this.configService.get('TWILIO_AUTH_TOKEN'));
    }
    async sendVerificationCode(recipient, code, type) {
        if (type == "email") {
            return this.sendEmail(recipient, code);
        }
        else if (type == "phone") {
            await this.sendSms(recipient, code);
            await this.sendWhatsApp(recipient, code);
            return;
        }
        throw new Error('Invalid recipient type');
    }
    async sendEmail(email, code) {
        const zeptoApiKey = this.configService.get('ZEPTO_API_KEY');
        const zeptoFrom = this.configService.get('ZEPTO_FROM');
        const payload = {
            from: { address: zeptoFrom, name: 'SwiftBank' },
            to: [{ email }],
            subject: 'Your Verification Code',
            htmlbody: `<p>Your SwiftBank verification code is <b>${code}</b>.</p>`,
        };
        const headers = {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'X-API-KEY': zeptoApiKey,
        };
        try {
            await (0, rxjs_1.firstValueFrom)(this.httpService.post('https://api.zeptomail.com/v1.1/email', payload, { headers }));
            this.logger.log(`Verification code sent to email: ${email}`);
        }
        catch (error) {
            this.logger.error('Failed to send email:', error?.response?.data || error.message);
            throw error;
        }
    }
    async sendSms(phone, code) {
        try {
            await this.twilioClient.messages.create({
                body: `Your SwiftBank verification code is ${code}`,
                to: phone,
                from: this.configService.get('TWILIO_SMS_FROM'),
            });
            this.logger.log(`SMS sent to ${phone}`);
        }
        catch (error) {
            this.logger.error('Failed to send SMS:', error.message);
            throw error;
        }
    }
    async sendWhatsApp(phone, code) {
        const formatted = phone.startsWith('+') ? phone : `+${phone}`;
        try {
            await this.twilioClient.messages.create({
                body: `Your SwiftBank WhatsApp verification code is ${code}`,
                to: `whatsapp:${formatted}`,
                from: this.configService.get('TWILIO_WHATSAPP_FROM'),
            });
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

/***/ "./src/modules/payments/payments.module.ts":
/*!*************************************************!*\
  !*** ./src/modules/payments/payments.module.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const payments_service_1 = __webpack_require__(/*! ./payments.service */ "./src/modules/payments/payments.service.ts");
const transaction_entity_1 = __webpack_require__(/*! ../wallet/entities/transaction.entity */ "./src/modules/wallet/entities/transaction.entity.ts");
const wallet_module_1 = __webpack_require__(/*! ../wallet/wallet.module */ "./src/modules/wallet/wallet.module.ts");
const flutterwave_module_1 = __webpack_require__(/*! ../flutterwave/flutterwave.module */ "./src/modules/flutterwave/flutterwave.module.ts");
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

/***/ "./src/modules/payments/payments.service.ts":
/*!**************************************************!*\
  !*** ./src/modules/payments/payments.service.ts ***!
  \**************************************************/
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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const event_emitter_1 = __webpack_require__(/*! @nestjs/event-emitter */ "@nestjs/event-emitter");
const flutterwave_service_1 = __webpack_require__(/*! ../flutterwave/flutterwave.service */ "./src/modules/flutterwave/flutterwave.service.ts");
const wallet_service_1 = __webpack_require__(/*! ../wallet/wallet.service */ "./src/modules/wallet/wallet.service.ts");
const transaction_entity_1 = __webpack_require__(/*! ../wallet/entities/transaction.entity */ "./src/modules/wallet/entities/transaction.entity.ts");
const wallet_entity_1 = __webpack_require__(/*! ../wallet/entities/wallet.entity */ "./src/modules/wallet/entities/wallet.entity.ts");
const crypto = __importStar(__webpack_require__(/*! crypto */ "crypto"));
let PaymentsService = class PaymentsService {
    constructor(transactionRepository, flutterwaveService, walletService, eventEmitter) {
        this.transactionRepository = transactionRepository;
        this.flutterwaveService = flutterwaveService;
        this.walletService = walletService;
        this.eventEmitter = eventEmitter;
    }
    async initializePayment(data) {
        try {
            const response = await this.flutterwaveService.initializePayment(data);
            return response;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || 'Payment initialization failed');
        }
    }
    async getBillCategories() {
        return this.flutterwaveService.getBillCategories();
    }
    async payBill(userId, billData) {
        const wallets = await this.walletService.findUserWallets(userId);
        if (!wallets || wallets.length === 0) {
            throw new common_1.NotFoundException('Wallet not found for user');
        }
        const wallet = wallets.find(w => w.type === wallet_entity_1.WalletType.BILL_PAYMENT);
        if (wallet.balance < billData.amount) {
            throw new common_1.BadRequestException('Insufficient wallet balance');
        }
        const reference = this.generateReference('BILL');
        const transaction = this.transactionRepository.create({
            reference,
            type: transaction_entity_1.TransactionType.BILL_PAYMENT,
            amount: billData.amount,
            status: transaction_entity_1.TransactionStatus.PROCESSING,
            description: `${billData.type} payment`,
            walletId: wallet.id,
            userId,
            metadata: {
                billType: billData.type,
                customer: billData.customer,
                biller_name: billData.biller_name,
            },
        });
        const savedTransaction = await this.transactionRepository.save(transaction);
        try {
            const paymentResponse = await this.flutterwaveService.payBill({
                ...billData,
                reference,
                country: billData.country || 'NG',
                recurrence: billData.recurrence || 'ONCE',
            });
            await this.deductFromWallet(wallet.id, billData.amount);
            savedTransaction.status = transaction_entity_1.TransactionStatus.COMPLETED;
            savedTransaction.providerReference = paymentResponse.tx_ref;
            await this.transactionRepository.save(savedTransaction);
            this.eventEmitter.emit('bill.paid', { transaction: savedTransaction });
            return savedTransaction;
        }
        catch (error) {
            savedTransaction.status = transaction_entity_1.TransactionStatus.FAILED;
            savedTransaction.failureReason = error.message;
            await this.transactionRepository.save(savedTransaction);
            throw new common_1.BadRequestException(error.message || 'Bill payment failed');
        }
    }
    async buyAirtime(userId, airtimeData) {
        const billData = {
            type: 'AIRTIME',
            amount: airtimeData.amount,
            customer: airtimeData.phone,
            biller_name: airtimeData.network,
        };
        return this.payBill(userId, billData);
    }
    async buyData(userId, dataData) {
        const billData = {
            type: 'DATA_BUNDLE',
            amount: dataData.amount,
            customer: dataData.phone,
            biller_name: `${dataData.network}_${dataData.plan}`,
        };
        return this.payBill(userId, billData);
    }
    async payElectricity(userId, electricityData) {
        const billData = {
            type: 'ELECTRICITY',
            amount: electricityData.amount,
            customer: electricityData.meterNumber,
            biller_name: electricityData.discoName,
        };
        return this.payBill(userId, billData);
    }
    async payTvSubscription(userId, tvData) {
        const billData = {
            type: 'TV_SUBSCRIPTION',
            amount: tvData.amount,
            customer: tvData.smartCardNumber,
            biller_name: `${tvData.tvProvider}_${tvData.package}`,
        };
        return this.payBill(userId, billData);
    }
    async payInternetBill(userId, internetData) {
        const billData = {
            type: 'INTERNET',
            amount: internetData.amount,
            customer: internetData.customerId,
            biller_name: `${internetData.provider}_${internetData.plan}`,
        };
        return this.payBill(userId, billData);
    }
    async validateCustomer(billType, customer, billerCode) {
        try {
            return await this.flutterwaveService.validateBillService(billType, billerCode, customer);
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
    async deductFromWallet(walletId, amount) {
        this.eventEmitter.emit('wallet.debit', { walletId, amount });
    }
    generateReference(prefix) {
        return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => wallet_service_1.WalletService))),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof flutterwave_service_1.FlutterwaveService !== "undefined" && flutterwave_service_1.FlutterwaveService) === "function" ? _b : Object, typeof (_c = typeof wallet_service_1.WalletService !== "undefined" && wallet_service_1.WalletService) === "function" ? _c : Object, typeof (_d = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _d : Object])
], PaymentsService);


/***/ }),

/***/ "./src/modules/users/dto/create-user.dto.ts":
/*!**************************************************!*\
  !*** ./src/modules/users/dto/create-user.dto.ts ***!
  \**************************************************/
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
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
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
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '[{ id: "random_string", category: "create-account", code: "123456", expires: "expiration_date" }]' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateUserDto.prototype, "codes", void 0);


/***/ }),

/***/ "./src/modules/users/dto/update-user.dto.ts":
/*!**************************************************!*\
  !*** ./src/modules/users/dto/update-user.dto.ts ***!
  \**************************************************/
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
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const class_validator_2 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
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

/***/ "./src/modules/users/entities/user.entity.ts":
/*!***************************************************!*\
  !*** ./src/modules/users/entities/user.entity.ts ***!
  \***************************************************/
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
exports.User = exports.UserRole = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");
const roles_decorator_1 = __webpack_require__(/*! ../../common/decorators/roles.decorator */ "./src/modules/common/decorators/roles.decorator.ts");
Object.defineProperty(exports, "UserRole", ({ enumerable: true, get: function () { return roles_decorator_1.Role; } }));
const wallet_entity_1 = __webpack_require__(/*! @/modules/wallet/entities/wallet.entity */ "./src/modules/wallet/entities/wallet.entity.ts");
const notification_entity_1 = __webpack_require__(/*! @/modules/notifications/entities/notification.entity */ "./src/modules/notifications/entities/notification.entity.ts");
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
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], User.prototype, "lastLoginAt", void 0);
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

/***/ "./src/modules/users/users.controller.ts":
/*!***********************************************!*\
  !*** ./src/modules/users/users.controller.ts ***!
  \***********************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const users_service_1 = __webpack_require__(/*! ./users.service */ "./src/modules/users/users.service.ts");
const update_user_dto_1 = __webpack_require__(/*! ./dto/update-user.dto */ "./src/modules/users/dto/update-user.dto.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../common/guards/jwt-auth.guard */ "./src/modules/common/guards/jwt-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../common/guards/roles.guard */ "./src/modules/common/guards/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../common/decorators/roles.decorator */ "./src/modules/common/decorators/roles.decorator.ts");
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

/***/ "./src/modules/users/users.module.ts":
/*!*******************************************!*\
  !*** ./src/modules/users/users.module.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const users_service_1 = __webpack_require__(/*! ./users.service */ "./src/modules/users/users.service.ts");
const users_controller_1 = __webpack_require__(/*! ./users.controller */ "./src/modules/users/users.controller.ts");
const user_entity_1 = __webpack_require__(/*! ./entities/user.entity */ "./src/modules/users/entities/user.entity.ts");
const encryption_util_1 = __webpack_require__(/*! ../common/utils/encryption.util */ "./src/modules/common/utils/encryption.util.ts");
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

/***/ "./src/modules/users/users.service.ts":
/*!********************************************!*\
  !*** ./src/modules/users/users.service.ts ***!
  \********************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const user_entity_1 = __webpack_require__(/*! ./entities/user.entity */ "./src/modules/users/entities/user.entity.ts");
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

/***/ "./src/modules/wallet/dto/create-wallet.dto.ts":
/*!*****************************************************!*\
  !*** ./src/modules/wallet/dto/create-wallet.dto.ts ***!
  \*****************************************************/
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
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const wallet_entity_1 = __webpack_require__(/*! ../entities/wallet.entity */ "./src/modules/wallet/entities/wallet.entity.ts");
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
    (0, swagger_1.ApiProperty)({ default: 'NGN' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWalletDto.prototype, "currency", void 0);


/***/ }),

/***/ "./src/modules/wallet/dto/fund-wallet.dto.ts":
/*!***************************************************!*\
  !*** ./src/modules/wallet/dto/fund-wallet.dto.ts ***!
  \***************************************************/
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
exports.FundWalletDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class FundWalletDto {
}
exports.FundWalletDto = FundWalletDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000, minimum: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(100),
    __metadata("design:type", Number)
], FundWalletDto.prototype, "amount", void 0);


/***/ }),

/***/ "./src/modules/wallet/dto/withdraw.dto.ts":
/*!************************************************!*\
  !*** ./src/modules/wallet/dto/withdraw.dto.ts ***!
  \************************************************/
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
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
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

/***/ "./src/modules/wallet/entities/transaction.entity.ts":
/*!***********************************************************!*\
  !*** ./src/modules/wallet/entities/transaction.entity.ts ***!
  \***********************************************************/
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
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const wallet_entity_1 = __webpack_require__(/*! ./wallet.entity */ "./src/modules/wallet/entities/wallet.entity.ts");
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

/***/ "./src/modules/wallet/entities/wallet.entity.ts":
/*!******************************************************!*\
  !*** ./src/modules/wallet/entities/wallet.entity.ts ***!
  \******************************************************/
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
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const user_entity_1 = __webpack_require__(/*! ../../users/entities/user.entity */ "./src/modules/users/entities/user.entity.ts");
const transaction_entity_1 = __webpack_require__(/*! ./transaction.entity */ "./src/modules/wallet/entities/transaction.entity.ts");
var WalletType;
(function (WalletType) {
    WalletType["MAIN"] = "main";
    WalletType["ESCROW"] = "escrow";
    WalletType["SAVINGS"] = "savings";
    WalletType["BILL_PAYMENT"] = "bill_payment";
})(WalletType || (exports.WalletType = WalletType = {}));
let Wallet = class Wallet {
};
exports.Wallet = Wallet;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Wallet.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Wallet.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: WalletType, default: WalletType.MAIN }),
    __metadata("design:type", String)
], Wallet.prototype, "type", void 0);
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

/***/ "./src/modules/wallet/processors/transaction.processor.ts":
/*!****************************************************************!*\
  !*** ./src/modules/wallet/processors/transaction.processor.ts ***!
  \****************************************************************/
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
const bullmq_1 = __webpack_require__(/*! @nestjs/bullmq */ "@nestjs/bullmq");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const event_emitter_1 = __webpack_require__(/*! @nestjs/event-emitter */ "@nestjs/event-emitter");
const bullmq_2 = __webpack_require__(/*! bullmq */ "bullmq");
const wallet_service_1 = __webpack_require__(/*! ../wallet.service */ "./src/modules/wallet/wallet.service.ts");
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

/***/ "./src/modules/wallet/wallet.controller.ts":
/*!*************************************************!*\
  !*** ./src/modules/wallet/wallet.controller.ts ***!
  \*************************************************/
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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WalletController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const wallet_service_1 = __webpack_require__(/*! ./wallet.service */ "./src/modules/wallet/wallet.service.ts");
const create_wallet_dto_1 = __webpack_require__(/*! ./dto/create-wallet.dto */ "./src/modules/wallet/dto/create-wallet.dto.ts");
const fund_wallet_dto_1 = __webpack_require__(/*! ./dto/fund-wallet.dto */ "./src/modules/wallet/dto/fund-wallet.dto.ts");
const withdraw_dto_1 = __webpack_require__(/*! ./dto/withdraw.dto */ "./src/modules/wallet/dto/withdraw.dto.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../common/guards/jwt-auth.guard */ "./src/modules/common/guards/jwt-auth.guard.ts");
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
    fundWallet(req, fundWalletDto) {
        return this.walletService.fundWallet(req.user.id, fundWalletDto);
    }
    withdraw(req, withdrawDto) {
        return this.walletService.withdraw(req.user.id, withdrawDto);
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
    (0, common_1.Post)('fund'),
    (0, swagger_1.ApiOperation)({ summary: 'Fund wallet' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Wallet funding initiated successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof fund_wallet_dto_1.FundWalletDto !== "undefined" && fund_wallet_dto_1.FundWalletDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "fundWallet", null);
__decorate([
    (0, common_1.Post)('withdraw'),
    (0, swagger_1.ApiOperation)({ summary: 'Withdraw from wallet' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Withdrawal initiated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Insufficient balance' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof withdraw_dto_1.WithdrawDto !== "undefined" && withdraw_dto_1.WithdrawDto) === "function" ? _d : Object]),
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

/***/ "./src/modules/wallet/wallet.module.ts":
/*!*********************************************!*\
  !*** ./src/modules/wallet/wallet.module.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WalletModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const bullmq_1 = __webpack_require__(/*! @nestjs/bullmq */ "@nestjs/bullmq");
const wallet_service_1 = __webpack_require__(/*! ./wallet.service */ "./src/modules/wallet/wallet.service.ts");
const wallet_controller_1 = __webpack_require__(/*! ./wallet.controller */ "./src/modules/wallet/wallet.controller.ts");
const wallet_entity_1 = __webpack_require__(/*! ./entities/wallet.entity */ "./src/modules/wallet/entities/wallet.entity.ts");
const transaction_entity_1 = __webpack_require__(/*! ./entities/transaction.entity */ "./src/modules/wallet/entities/transaction.entity.ts");
const payments_module_1 = __webpack_require__(/*! @/modules/payments/payments.module */ "./src/modules/payments/payments.module.ts");
const notifications_module_1 = __webpack_require__(/*! @/modules/notifications/notifications.module */ "./src/modules/notifications/notifications.module.ts");
const transaction_processor_1 = __webpack_require__(/*! ./processors/transaction.processor */ "./src/modules/wallet/processors/transaction.processor.ts");
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

/***/ "./src/modules/wallet/wallet.service.ts":
/*!**********************************************!*\
  !*** ./src/modules/wallet/wallet.service.ts ***!
  \**********************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const bullmq_1 = __webpack_require__(/*! @nestjs/bullmq */ "@nestjs/bullmq");
const bullmq_2 = __webpack_require__(/*! bullmq */ "bullmq");
const wallet_entity_1 = __webpack_require__(/*! ./entities/wallet.entity */ "./src/modules/wallet/entities/wallet.entity.ts");
const transaction_entity_1 = __webpack_require__(/*! ./entities/transaction.entity */ "./src/modules/wallet/entities/transaction.entity.ts");
const payments_service_1 = __webpack_require__(/*! ../payments/payments.service */ "./src/modules/payments/payments.service.ts");
const uuid_1 = __webpack_require__(/*! uuid */ "uuid");
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
    async fundWallet(userId, fundWalletDto) {
        const wallet = await this.getUserMainWallet(userId);
        const reference = this.generateReference();
        const transaction = await this.createTransaction({
            walletId: wallet.id,
            amount: fundWalletDto.amount,
            type: transaction_entity_1.TransactionType.DEPOSIT,
            status: transaction_entity_1.TransactionStatus.PENDING,
            reference,
            description: 'Wallet funding',
        });
        const paymentData = await this.paymentsService.initializePayment({
            amount: fundWalletDto.amount,
            email: wallet.user.email,
            reference,
            metadata: {
                userId,
                walletId: wallet.id,
                transactionId: transaction.id,
            },
        });
        await this.transactionRepository.update(transaction.id, {
            reference: paymentData.data.tx_ref,
            metadata: paymentData.data,
        });
        return {
            transaction,
            paymentLink: paymentData.data.link,
        };
    }
    async withdraw(userId, withdrawDto) {
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
                type: transaction_entity_1.TransactionType.WITHDRAWAL,
                status: transaction_entity_1.TransactionStatus.PROCESSING,
                reference,
                description: 'Wallet withdrawal',
                metadata: {
                    bankCode: withdrawDto.bankCode,
                    accountNumber: withdrawDto.accountNumber,
                    accountName: withdrawDto.accountName,
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
    async processWebhook(payload) {
        const { tx_ref, status, transaction_id } = payload;
        const transaction = await this.transactionRepository.findOne({
            where: { reference: tx_ref },
            relations: ['wallet'],
        });
        if (!transaction) {
            throw new common_1.NotFoundException('Transaction not found');
        }
        if (status === 'successful' && transaction.status === transaction_entity_1.TransactionStatus.PENDING) {
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                await queryRunner.manager.update(wallet_entity_1.Wallet, transaction.walletId, {
                    balance: () => `balance + ${transaction.amount}`,
                });
                await queryRunner.manager.update(transaction_entity_1.Transaction, transaction.id, {
                    status: transaction_entity_1.TransactionStatus.COMPLETED,
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
            return this.createWallet(userId, { type: wallet_entity_1.WalletType.MAIN });
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

/***/ "@nestjs/axios":
/*!********************************!*\
  !*** external "@nestjs/axios" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("@nestjs/axios");

/***/ }),

/***/ "@nestjs/bullmq":
/*!*********************************!*\
  !*** external "@nestjs/bullmq" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/bullmq");

/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/event-emitter":
/*!****************************************!*\
  !*** external "@nestjs/event-emitter" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("@nestjs/event-emitter");

/***/ }),

/***/ "@nestjs/jwt":
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/passport":
/*!***********************************!*\
  !*** external "@nestjs/passport" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),

/***/ "@nestjs/schedule":
/*!***********************************!*\
  !*** external "@nestjs/schedule" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/schedule");

/***/ }),

/***/ "@nestjs/swagger":
/*!**********************************!*\
  !*** external "@nestjs/swagger" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),

/***/ "@nestjs/throttler":
/*!************************************!*\
  !*** external "@nestjs/throttler" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("@nestjs/throttler");

/***/ }),

/***/ "@nestjs/typeorm":
/*!**********************************!*\
  !*** external "@nestjs/typeorm" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@nestjs/typeorm");

/***/ }),

/***/ "bcryptjs":
/*!***************************!*\
  !*** external "bcryptjs" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),

/***/ "bullmq":
/*!*************************!*\
  !*** external "bullmq" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bullmq");

/***/ }),

/***/ "class-transformer":
/*!************************************!*\
  !*** external "class-transformer" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),

/***/ "class-validator":
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),

/***/ "compression":
/*!******************************!*\
  !*** external "compression" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("compression");

/***/ }),

/***/ "crypto-js":
/*!****************************!*\
  !*** external "crypto-js" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("crypto-js");

/***/ }),

/***/ "flutterwave-node-v3":
/*!**************************************!*\
  !*** external "flutterwave-node-v3" ***!
  \**************************************/
/***/ ((module) => {

module.exports = require("flutterwave-node-v3");

/***/ }),

/***/ "helmet":
/*!*************************!*\
  !*** external "helmet" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("helmet");

/***/ }),

/***/ "nest-winston":
/*!*******************************!*\
  !*** external "nest-winston" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("nest-winston");

/***/ }),

/***/ "passport-jwt":
/*!*******************************!*\
  !*** external "passport-jwt" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),

/***/ "passport-local":
/*!*********************************!*\
  !*** external "passport-local" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("passport-local");

/***/ }),

/***/ "rxjs":
/*!***********************!*\
  !*** external "rxjs" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("rxjs");

/***/ }),

/***/ "rxjs/operators":
/*!*********************************!*\
  !*** external "rxjs/operators" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("rxjs/operators");

/***/ }),

/***/ "twilio":
/*!*************************!*\
  !*** external "twilio" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("twilio");

/***/ }),

/***/ "typeorm":
/*!**************************!*\
  !*** external "typeorm" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("typeorm");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),

/***/ "winston":
/*!**************************!*\
  !*** external "winston" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("winston");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ })

/******/ 	});
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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	
/******/ })()
;