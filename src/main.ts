import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import session from 'express-session';
import hbs from 'hbs';
import { AppModule } from './app.module.js';
import { registerHbsHelpers } from './common/hbs-helpers.js';
import { viewLocals } from './common/view-locals.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const root = join(import.meta.dirname, '..');

  app.useStaticAssets(join(root, 'public'));
  app.setBaseViewsDir(join(root, 'views'));
  app.setViewEngine('hbs');
  app.setLocal('layout', 'layouts/main');
  registerHbsHelpers(hbs);

  app.use(
    session({
      secret: process.env.SESSION_SECRET ?? 'dev-only-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
    }),
  );
  app.use(viewLocals);

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
