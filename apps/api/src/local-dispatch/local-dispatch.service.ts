import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { CreateLocalBookingRequest, GeoPoint } from '@baara/shared-types';

export interface LocalProviderListing {
  providerId: string;
  name: string;
  categorySlug: string;
  city: string;
  countryCode: string;
  location: GeoPoint;
  radiusKm: number;
  ratingAvg: number;
}

export interface LocalBookingRecord {
  id: string;
  clientId: string;
  providerId: string;
  categorySlug: string;
  location: GeoPoint;
  scheduledStartIso: string;
  scheduledEndIso: string;
  amountMinor: string;
  currency: string;
  status: 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED';
  checkInPin: string;
}

@Injectable()
export class LocalDispatchService {
  private readonly providers: LocalProviderListing[] = [
    {
      providerId: 'prov_solar_dkr_01',
      name: 'Moussa Diop — Solar & Inverter Tech',
      categorySlug: 'solar-tech',
      city: 'Dakar',
      countryCode: 'SN',
      location: { lat: 14.7167, lng: -17.4677 },
      radiusKm: 25,
      ratingAvg: 4.92,
    },
    {
      providerId: 'prov_elec_abj_01',
      name: 'Kouamé Yao — Certified Electrician',
      categorySlug: 'electricians',
      city: 'Abidjan',
      countryCode: 'CI',
      location: { lat: 5.36, lng: -4.0083 },
      radiusKm: 20,
      ratingAvg: 4.88,
    },
    {
      providerId: 'prov_plumb_dkr_02',
      name: 'Awa Ndiaye — Residential Plumber',
      categorySlug: 'plumbers',
      city: 'Dakar',
      countryCode: 'SN',
      location: { lat: 14.6937, lng: -17.4441 },
      radiusKm: 15,
      ratingAvg: 4.85,
    },
  ];

  private readonly bookings = new Map<string, LocalBookingRecord>();

  haversineKm(a: GeoPoint, b: GeoPoint): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const sinLat = Math.sin(dLat / 2);
    const sinLng = Math.sin(dLng / 2);
    const h =
      sinLat * sinLat +
      Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  findNearby(lat: number, lng: number, radiusKm = 20, categorySlug?: string) {
    const origin: GeoPoint = { lat, lng };
    return this.providers
      .filter((p) => (!categorySlug ? true : p.categorySlug === categorySlug))
      .map((p) => ({
        ...p,
        distanceKm: Number(this.haversineKm(origin, p.location).toFixed(2)),
      }))
      .filter((p) => p.distanceKm <= Math.min(radiusKm, p.radiusKm))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  createBooking(clientId: string, req: CreateLocalBookingRequest): LocalBookingRecord {
    const start = Date.parse(req.scheduledStartIso);
    const end = Date.parse(req.scheduledEndIso);
    if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
      throw new BadRequestException('Invalid scheduling time window');
    }

    for (const existing of this.bookings.values()) {
      if (existing.providerId !== req.providerId || existing.status === 'COMPLETED') continue;
      const exStart = Date.parse(existing.scheduledStartIso);
      const exEnd = Date.parse(existing.scheduledEndIso);
      if (start < exEnd && end > exStart) {
        throw new ConflictException('Provider already has a booking in this time window');
      }
    }

    const pin = String(Math.floor(100000 + Math.random() * 900000));
    const booking: LocalBookingRecord = {
      id: crypto.randomUUID(),
      clientId,
      providerId: req.providerId,
      categorySlug: req.categorySlug,
      location: req.location,
      scheduledStartIso: req.scheduledStartIso,
      scheduledEndIso: req.scheduledEndIso,
      amountMinor: req.amountMinor,
      currency: req.currency,
      status: 'CONFIRMED',
      checkInPin: pin,
    };
    this.bookings.set(booking.id, booking);
    return booking;
  }

  checkIn(bookingId: string, pin: string): LocalBookingRecord {
    const booking = this.bookings.get(bookingId);
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== 'CONFIRMED') {
      throw new BadRequestException('Booking must be CONFIRMED to check in');
    }
    if (booking.checkInPin !== pin) {
      throw new BadRequestException('Invalid on-site check-in PIN');
    }
    booking.status = 'CHECKED_IN';
    return booking;
  }

  complete(bookingId: string): LocalBookingRecord {
    const booking = this.bookings.get(bookingId);
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== 'CHECKED_IN') {
      throw new BadRequestException('Booking must be CHECKED_IN before completion');
    }
    booking.status = 'COMPLETED';
    return booking;
  }
}
