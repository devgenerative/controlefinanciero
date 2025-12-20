import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";
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
import { PrismaModule } from "./prisma/prisma.module";
import { AiModule } from "./modules/ai/ai.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get("REDIS_HOST"),
            port: +configService.get("REDIS_PORT"),
          },
          password: configService.get("REDIS_PASSWORD"),
          ttl: +configService.get("REDIS_TTL"),
        }),
      }),
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
    AiModule,
  ],
})
export class AppModule {}
