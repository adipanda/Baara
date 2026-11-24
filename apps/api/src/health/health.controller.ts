import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      service: 'afriwork-core-api',
      timestamp: new Date().toISOString(),
    };
  }
}
