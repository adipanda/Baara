import { BadRequestException, Injectable } from '@nestjs/common';
import type { CurrencyCode, EscrowFundRequest, EscrowReleaseRequest } from '@baara/shared-types';

export interface LedgerPostingInput {
  idempotencyKey: string;
  debitAccountId: string;
  creditAccountId: string;
  amountMinor: bigint;
  currency: CurrencyCode;
  referenceId: string;
}

export interface EscrowRecord {
  contractId: string;
  clientId: string;
  providerId: string;
  currency: CurrencyCode;
  fundedMinor: bigint;
  releasedMinor: bigint;
  status: 'FUNDED' | 'RELEASED';
}

@Injectable()
export class LedgerService {
  private readonly processedKeys = new Map<string, unknown>();
  private readonly escrows = new Map<string, EscrowRecord>();

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

  computeSplit(grossMinor: bigint, commissionBps = 1000n, taxBps = 0n) {
    if (grossMinor <= 0n) {
      throw new BadRequestException('grossMinor must be positive.');
    }
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

  fundEscrow(req: EscrowFundRequest) {
    if (this.processedKeys.has(req.idempotencyKey)) {
      return this.processedKeys.get(req.idempotencyKey);
    }

    const amountMinor = BigInt(req.amountMinor);
    this.validateDoubleEntry({
      idempotencyKey: req.idempotencyKey,
      debitAccountId: `wallet:${req.clientId}:${req.currency}`,
      creditAccountId: `escrow:${req.contractId}:${req.currency}`,
      amountMinor,
      currency: req.currency,
      referenceId: req.contractId,
    });

    const record: EscrowRecord = {
      contractId: req.contractId,
      clientId: req.clientId,
      providerId: req.providerId,
      currency: req.currency,
      fundedMinor: amountMinor,
      releasedMinor: 0n,
      status: 'FUNDED',
    };
    this.escrows.set(req.contractId, record);

    const result = {
      contractId: req.contractId,
      status: record.status,
      fundedMinor: record.fundedMinor.toString(),
      currency: record.currency,
      event: 'com.afriwork.payment.escrow.funded.v1',
    };
    this.processedKeys.set(req.idempotencyKey, result);
    return result;
  }

  releaseEscrow(req: EscrowReleaseRequest) {
    if (this.processedKeys.has(req.idempotencyKey)) {
      return this.processedKeys.get(req.idempotencyKey);
    }

    const escrow = this.escrows.get(req.contractId);
    if (!escrow || escrow.status !== 'FUNDED') {
      throw new BadRequestException('Contract escrow is not in FUNDED state.');
    }

    const split = this.computeSplit(
      escrow.fundedMinor,
      BigInt(req.commissionBps ?? 1000),
      BigInt(req.taxBps ?? 0),
    );

    escrow.releasedMinor = escrow.fundedMinor;
    escrow.status = 'RELEASED';

    const result = {
      contractId: req.contractId,
      status: escrow.status,
      currency: escrow.currency,
      providerNetMinor: split.providerNetMinor.toString(),
      commissionMinor: split.commissionMinor.toString(),
      taxMinor: split.taxMinor.toString(),
      event: 'com.afriwork.payment.escrow.released.v1',
    };
    this.processedKeys.set(req.idempotencyKey, result);
    return result;
  }
}
