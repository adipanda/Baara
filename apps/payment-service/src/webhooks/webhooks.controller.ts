import { Body, Controller, Headers, HttpCode, Param, Post, UnauthorizedException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';
import type { PaymentProvider } from '@baara/shared-types';

@Controller('webhooks')
export class WebhooksController {
  @Post(':provider')
  @HttpCode(200)
  handleProviderWebhook(
    @Param('provider') provider: PaymentProvider,
    @Headers('x-signature') signature: string | undefined,
    @Body() payload: Record<string, unknown>,
  ) {
    const secret = process.env.WEBHOOK_SIGNING_SECRET;
    if (secret) {
      if (!signature) {
        throw new UnauthorizedException('Missing webhook signature');
      }
      const expected = createHmac('sha256', secret)
        .update(JSON.stringify(payload))
        .digest('hex');
      const sigBuf = Buffer.from(signature);
      const expBuf = Buffer.from(expected);
      if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
        throw new UnauthorizedException('Invalid webhook signature');
      }
    }

    return {
      accepted: true,
      provider,
      receivedAt: new Date().toISOString(),
    };
  }
}
