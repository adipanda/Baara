import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { MarketplaceModule } from './marketplace/marketplace.module';

@Module({
  imports: [MarketplaceModule],
  controllers: [HealthController],
})
export class AppModule {}
