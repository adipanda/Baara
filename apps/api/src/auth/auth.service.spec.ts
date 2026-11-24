import test from 'node:test';
import assert from 'node:assert/strict';
import { AuthService } from './auth.service';

test('AuthService hashes and verifies passwords with scrypt', () => {
  const auth = new AuthService();
  const hash = auth.hashPassword('BaaraSecure2026!');
  assert.equal(auth.verifyPassword('BaaraSecure2026!', hash), true);
  assert.equal(auth.verifyPassword('WrongPassword', hash), false);
});

test('AuthService signs and verifies JWT payload and rejects tampered tokens', () => {
  const auth = new AuthService();
  const token = auth.signAccessToken({
    id: 'usr_123',
    email: 'aminata@afriwork.africa',
    roles: ['FREELANCER'],
    countryCode: 'SN',
    kycTier: 'TIER_1',
  });

  const payload = auth.verifyAccessToken(token);
  assert.equal(payload.sub, 'usr_123');
  assert.equal(payload.countryCode, 'SN');
  assert.deepEqual(payload.roles, ['FREELANCER']);

  const tampered = `${token.slice(0, -2)}xx`;
  assert.throws(() => auth.verifyAccessToken(tampered), /Invalid JWT signature/);
});
