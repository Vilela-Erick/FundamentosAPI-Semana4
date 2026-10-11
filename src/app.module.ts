import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { EventsModule } from './events/events.module.js';
import { OrganizersModule } from './organizers/organizers.module.js';
import { AttendeesModule } from './attendees/attendees.module.js';
import { RegistrationsModule } from './registrations/registrations.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isDevelopment =
          configService.get<string>('NODE_ENV', 'development') === 'development';
        const syncEnabled =
          configService.get<string>('DB_SYNCHRONIZE') === 'true';

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: Number(configService.get<number>('DB_PORT', 5432)),
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', ''),
          database: configService.get<string>('DB_DATABASE', 'api_eventos'),
          autoLoadEntities: true,
          // En entrega/producción synchronize nunca debe estar activo;
          // sólo se permite si NODE_ENV=development Y DB_SYNCHRONIZE=true explícitamente.
          synchronize: isDevelopment && syncEnabled,
        };
      },
    }),

    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'semana5-server',
    }),

    EventsModule,

    OrganizersModule,

    AttendeesModule,

    RegistrationsModule,

    UsersModule,

    AuthModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
