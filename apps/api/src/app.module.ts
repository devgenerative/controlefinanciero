import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { CardsModule } from './modules/cards/cards.module';
import { InstallmentsModule } from './modules/installments/installments.module';
import { DebtsModule } from './modules/debts/debts.module';
import { GoalsModule } from './modules/goals/goals.module';
import { ReservesModule } from './modules/reserves/reserves.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PrismaModule } from './prisma/prisma.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
