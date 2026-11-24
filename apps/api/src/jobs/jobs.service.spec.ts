import test from 'node:test';
import assert from 'node:assert/strict';
import { JobsService } from './jobs.service';

test('JobsService creates job, accepts proposal, rejects others, and spawns draft contract', () => {
  const jobs = new JobsService();
  const job = jobs.createJob('cli_01', {
    title: 'Build Wave & Orange Money Checkout',
    description: 'NestJS webhook integration',
    categorySlug: 'software-dev',
    vertical: 'DIGITAL_FREELANCE',
    budgetMinMinor: '100000',
    budgetMaxMinor: '250000',
    currency: 'XOF',
    countryCode: 'SN',
  });

  const p1 = jobs.submitProposal(job.id, 'dev_01', {
    amountMinor: '180000',
    currency: 'XOF',
    coverLetter: 'Built 5 WAEMU integrations.',
    deliveryDays: 7,
  });
  const p2 = jobs.submitProposal(job.id, 'dev_02', {
    amountMinor: '200000',
    currency: 'XOF',
    coverLetter: 'Senior fintech engineer.',
    deliveryDays: 10,
  });

  const contract = jobs.acceptProposal(job.id, p1.id, 'cli_01');
  assert.equal(contract.status, 'DRAFT_AWAITING_ESCROW');
  assert.equal(contract.providerId, 'dev_01');
  assert.equal(p1.status, 'ACCEPTED');
  assert.equal(p2.status, 'REJECTED');
  assert.equal(job.status, 'AWARDED');
});
