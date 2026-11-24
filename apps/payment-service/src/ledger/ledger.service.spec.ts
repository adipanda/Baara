import test from 'node:test';
import assert from 'node:assert/strict';
import { LedgerService } from './ledger.service';

test('LedgerService computes exact commission and tax splits in minor units', () => {
  const ledger = new LedgerService();
  const split = ledger.computeSplit(100000n, 1000n, 1800n); // 10% fee, 18% VAT on fee
  assert.equal(split.commissionMinor, 10000n);
  assert.equal(split.taxMinor, 1800n);
  assert.equal(split.providerNetMinor, 88200n);
  assert.equal(
    split.providerNetMinor + split.commissionMinor + split.taxMinor,
    split.grossMinor,
  );
});

test('LedgerService enforces idempotency on escrow fund and release', () => {
  const ledger = new LedgerService();
  const firstFund = ledger.fundEscrow({
    contractId: 'cnt_01',
    clientId: 'cli_01',
    providerId: 'pro_01',
    amountMinor: '50000',
    currency: 'XOF',
    paymentProvider: 'WAVE',
    idempotencyKey: 'idem_fund_01',
  });
  const secondFund = ledger.fundEscrow({
    contractId: 'cnt_01',
    clientId: 'cli_01',
    providerId: 'pro_01',
    amountMinor: '50000',
    currency: 'XOF',
    paymentProvider: 'WAVE',
    idempotencyKey: 'idem_fund_01',
  });
  assert.deepEqual(firstFund, secondFund);

  const released = ledger.releaseEscrow({
    contractId: 'cnt_01',
    commissionBps: 1000,
    taxBps: 0,
    idempotencyKey: 'idem_rel_01',
  });
  assert.deepEqual(released, {
    contractId: 'cnt_01',
    status: 'RELEASED',
    currency: 'XOF',
    providerNetMinor: '45000',
    commissionMinor: '5000',
    taxMinor: '0',
    event: 'com.afriwork.payment.escrow.released.v1',
  });
});
