import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './modules/common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './modules/common/interceptors/response.interceptor';
import { LoggingInterceptor } from './modules/common/interceptors/logging.interceptor';

/**
 * Safety net.
 *
 * Node terminates the process on an unhandled rejection. A single floating
 * promise anywhere in the codebase therefore takes the whole API down — which is
 * exactly what an un-awaited ZeptoMail call did in production: registration
 * returned 201 and the next request got a 502. Log and keep serving instead;
 * a crash loop is far worse than one failed background call.
 */
function installProcessGuards(logger: Logger) {
  process.on('unhandledRejection', (reason) => {
    logger.error(
      'Unhandled promise rejection — the request that caused it may have failed silently',
      reason instanceof Error ? reason.stack : String(reason),
    );
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', error.stack);
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');
  installProcessGuards(logger);

  // Security
  app.use(helmet());
  app.use(compression());
  /**
   * Allowed browser origins.
   *
   * This previously hardcoded `https://yourapp.com` in production — a placeholder
   * that was never replaced, so the deployed API returned no
   * Access-Control-Allow-Origin header and every browser request from the real
   * frontend was blocked. Origins now come from ALLOWED_ORIGINS (comma
   * separated); development still reflects any origin.
   *
   * Native apps do not send an Origin header and are unaffected either way.
   */
  const isProd = configService.get('NODE_ENV') === 'production';
  const allowedOrigins = (configService.get<string>('ALLOWED_ORIGINS') ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  if (isProd && allowedOrigins.length === 0) {
    logger.warn(
      'ALLOWED_ORIGINS is not set — browser clients will be blocked by CORS. ' +
        'Set it to your frontend origins, comma separated.',
    );
  }

  app.enableCors({
    origin: isProd ? allowedOrigins : true,
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix(configService.get('API_PREFIX', 'api/v1'));

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters and interceptors
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor(), new LoggingInterceptor());

  // Swagger documentation
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Vaultiva API')
      .setDescription('Comprehensive Fintech APP (Vautiva) API with clean architecture')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  const port = configService.get('PORT', 3000);
  await app.listen(port);
  
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger documentation: http://localhost:${port}/docs`);
}

bootstrap();