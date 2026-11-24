import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health/health.controller';
import { JobsModule } from './jobs/jobs.module';
import { LocalDispatchModule } from './local-dispatch/local-dispatch.module';
import { MarketplaceModule } from './marketplace/marketplace.module';

@Module({
  imports: [AuthModule, MarketplaceModule, LocalDispatchModule, JobsModule],
  controllers: [HealthController],
})
export class AppModule {}
