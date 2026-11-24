import { Body, Controller, Headers, Post } from '@nestjs/common';
import type { EscrowFundRequest, EscrowReleaseRequest } from '@baara/shared-types';
import { LedgerService } from './ledger.service';

@Controller('escrow')
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Post('fund')
  fund(
    @Headers('idempotency-key') headerKey: string | undefined,
    @Body() body: EscrowFundRequest,
  ) {
    return this.ledgerService.fundEscrow({
      ...body,
      idempotencyKey: headerKey || body.idempotencyKey,
    });
  }

  @Post('release')
  release(
    @Headers('idempotency-key') headerKey: string | undefined,
    @Body() body: EscrowReleaseRequest,
  ) {
    return this.ledgerService.releaseEscrow({
      ...body,
      idempotencyKey: headerKey || body.idempotencyKey,
    });
  }
}
