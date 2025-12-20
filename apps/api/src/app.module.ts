import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";
import { ScheduleModule } from "@nestjs/schedule";
import { redisStore } from "cache-manager-redis-yet";
import { AuthModule } from "./modules/auth/auth.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { TransactionsModule } from "./modules/transactions/transactions.module";
import { CardsModule } from "./modules/cards/cards.module";
import { InstallmentsModule } from "./modules/installments/installments.module";
import { DebtsModule } from "./modules/debts/debts.module";
import { GoalsModule } from "./modules/goals/goals.module";
import { ReservesModule } from "./modules/reserves/reserves.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { RecurringModule } from "./modules/recurring/recurring.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AiModule } from "./modules/ai/ai.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get('REDIS_HOST');
        const port = parseInt(configService.get('REDIS_PORT'), 10) || 1800;
        const password = configService.get('REDIS_PASSWORD');
        const username = configService.get('REDIS_USERNAME') || 'default';
        const ttl = parseInt(configService.get('REDIS_TTL'), 10) || 600000;

        console.log(`[Redis Config] Host: ${host}, Port: ${port}, Username: ${username}`);

        return {
          store: await redisStore({
            socket: {
              host,
              port,
            },
            username,
            password,
            ttl,
          }),
        };
      },
      inject: [ConfigService],
    }),
    PrismaModule,
    AuthModule,
    CategoriesModule,
    TransactionsModule,
    CardsModule,
    InstallmentsModule,
    DebtsModule,
    GoalsModule,
    ReservesModule,
    DashboardModule,
    NotificationsModule,
    RecurringModule,
    AiModule,
  ],
})
export class AppModule {}
