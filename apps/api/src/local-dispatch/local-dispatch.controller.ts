import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { CreateLocalBookingRequest, JwtPayload } from '@baara/shared-types';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/auth.guard';
import { LocalDispatchService } from './local-dispatch.service';

@Controller('local')
export class LocalDispatchController {
  constructor(private readonly localDispatch: LocalDispatchService) {}

  @Get('providers/nearby')
  findNearby(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radiusKm') radiusKm?: string,
    @Query('category') category?: string,
  ) {
    return {
      items: this.localDispatch.findNearby(
        Number(lat),
        Number(lng),
        radiusKm ? Number(radiusKm) : 20,
        category,
      ),
    };
  }

  @Post('bookings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT', 'ENTERPRISE')
  createBooking(@Req() req: { user: JwtPayload }, @Body() body: CreateLocalBookingRequest) {
    return this.localDispatch.createBooking(req.user.sub, body);
  }

  @Post('bookings/:id/checkin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LOCAL_PROVIDER', 'AGENCY')
  checkIn(@Param('id') id: string, @Body() body: { pin: string }) {
    return this.localDispatch.checkIn(id, body.pin);
  }

  @Post('bookings/:id/complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT', 'ENTERPRISE', 'LOCAL_PROVIDER')
  complete(@Param('id') id: string) {
    return this.localDispatch.complete(id);
  }
}
