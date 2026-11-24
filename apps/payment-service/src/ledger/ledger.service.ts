import { BadRequestException, Injectable } from '@nestjs/common';
import type { CurrencyCode } from '@baara/shared-types';

export interface LedgerPostingInput {
  idempotencyKey: string;
  debitAccountId: string;
  creditAccountId: string;
  amountMinor: bigint;
  currency: CurrencyCode;
  referenceId: string;
}

@Injectable()
export class LedgerService {
  /**
   * Validates double-entry invariants before committing an atomic Prisma transaction.
   * Ensures amount > 0, distinct accounts, and balanced debit/credit legs.
   */
  validateDoubleEntry(input: LedgerPostingInput): void {
    if (input.amountMinor <= 0n) {
      throw new BadRequestException('Ledger amountMinor must be strictly positive.');
    }
    if (input.debitAccountId === input.creditAccountId) {
      throw new BadRequestException('Debit and credit accounts must be distinct.');
    }
    if (!input.idempotencyKey) {
      throw new BadRequestException('Idempotency-Key is mandatory for financial postings.');
    }
  }

  /**
   * Computes automatic platform commission and tax split in minor units (bps = basis points).
   */
  computeSplit(grossMinor: bigint, commissionBps = 1000n, taxBps = 0n) {
    const commissionMinor = (grossMinor * commissionBps) / 10000n;
    const taxMinor = (commissionMinor * taxBps) / 10000n;
    const providerNetMinor = grossMinor - commissionMinor - taxMinor;
    return {
      grossMinor,
      commissionMinor,
      taxMinor,
      providerNetMinor,
    };
  }
}
