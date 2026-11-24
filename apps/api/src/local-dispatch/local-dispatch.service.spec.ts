import test from 'node:test';
import assert from 'node:assert/strict';
import { LocalDispatchService } from './local-dispatch.service';

test('LocalDispatchService finds nearby providers sorted by Haversine distance', () => {
  const svc = new LocalDispatchService();
  const dakarResults = svc.findNearby(14.7000, -17.4500, 25);
  assert.equal(dakarResults.length, 2);
  assert.equal(dakarResults[0].city, 'Dakar');
  assert.ok(dakarResults[0].distanceKm <= dakarResults[1].distanceKm);
});

test('LocalDispatchService prevents overlapping bookings and verifies OTP check-in', () => {
  const svc = new LocalDispatchService();
  const booking = svc.createBooking('cli_01', {
    providerId: 'prov_solar_dkr_01',
    categorySlug: 'solar-tech',
    location: { lat: 14.71, lng: -17.46 },
    scheduledStartIso: '2026-12-01T09:00:00Z',
    scheduledEndIso: '2026-12-01T11:00:00Z',
    amountMinor: '45000',
    currency: 'XOF',
  });

  assert.throws(
    () =>
      svc.createBooking('cli_02', {
        providerId: 'prov_solar_dkr_01',
        categorySlug: 'solar-tech',
        location: { lat: 14.71, lng: -17.46 },
        scheduledStartIso: '2026-12-01T10:00:00Z',
        scheduledEndIso: '2026-12-01T12:00:00Z',
        amountMinor: '45000',
        currency: 'XOF',
      }),
    /already has a booking/,
  );

  assert.throws(() => svc.checkIn(booking.id, '000000'), /Invalid on-site check-in PIN/);
  const checkedIn = svc.checkIn(booking.id, booking.checkInPin);
  assert.equal(checkedIn.status, 'CHECKED_IN');
  const completed = svc.complete(booking.id);
  assert.equal(completed.status, 'COMPLETED');
});
