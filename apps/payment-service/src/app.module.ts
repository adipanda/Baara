import { Controller, Get, Module } from '@nestjs/common';
import { LedgerController } from './ledger/ledger.controller';
import { LedgerService } from './ledger/ledger.service';
import { WebhooksController } from './webhooks/webhooks.controller';

@Controller('health')
class PaymentHealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      service: 'afriwork-payment-escrow',
      timestamp: new Date().toISOString(),
    };
  }
}

@Module({
  controllers: [PaymentHealthController, LedgerController, WebhooksController],
  providers: [LedgerService],
})
export class AppModule {}
