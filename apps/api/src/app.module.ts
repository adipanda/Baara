import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health/health.controller';
import { MarketplaceModule } from './marketplace/marketplace.module';

@Module({
  imports: [AuthModule, MarketplaceModule],
  controllers: [HealthController],
})
export class AppModule {}
