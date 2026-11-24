import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { CreateJobRequest, CreateProposalRequest } from '@baara/shared-types';

export interface JobRecord extends CreateJobRequest {
  id: string;
  clientId: string;
  status: 'OPEN' | 'AWARDED' | 'CLOSED';
  createdAt: string;
}

export interface ProposalRecord extends CreateProposalRequest {
  id: string;
  jobId: string;
  providerId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export interface ContractRecord {
  id: string;
  jobId: string;
  proposalId: string;
  clientId: string;
  providerId: string;
  totalAmountMinor: string;
  currency: string;
  status: 'DRAFT_AWAITING_ESCROW';
  createdAt: string;
}

@Injectable()
export class JobsService {
  private readonly jobs = new Map<string, JobRecord>();
  private readonly proposals = new Map<string, ProposalRecord>();
  private readonly contracts = new Map<string, ContractRecord>();

  createJob(clientId: string, req: CreateJobRequest): JobRecord {
    if (BigInt(req.budgetMaxMinor) < BigInt(req.budgetMinMinor)) {
      throw new BadRequestException('budgetMaxMinor must be >= budgetMinMinor');
    }
    const job: JobRecord = {
      ...req,
      id: crypto.randomUUID(),
      clientId,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };
    this.jobs.set(job.id, job);
    return job;
  }

  listJobs(countryCode?: string) {
    const all = Array.from(this.jobs.values()).filter((j) => j.status === 'OPEN');
    return countryCode ? all.filter((j) => j.countryCode === countryCode) : all;
  }

  submitProposal(jobId: string, providerId: string, req: CreateProposalRequest): ProposalRecord {
    const job = this.jobs.get(jobId);
    if (!job || job.status !== 'OPEN') {
      throw new NotFoundException('Open job not found');
    }
    if (job.clientId === providerId) {
      throw new BadRequestException('Client cannot submit a proposal to their own job');
    }
    const proposal: ProposalRecord = {
      ...req,
      id: crypto.randomUUID(),
      jobId,
      providerId,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    this.proposals.set(proposal.id, proposal);
    return proposal;
  }

  acceptProposal(jobId: string, proposalId: string, clientId: string): ContractRecord {
    const job = this.jobs.get(jobId);
    if (!job) throw new NotFoundException('Job not found');
    if (job.clientId !== clientId) {
      throw new ForbiddenException('Only the job owner can accept a proposal');
    }
    if (job.status !== 'OPEN') {
      throw new BadRequestException('Job is no longer OPEN');
    }

    const proposal = this.proposals.get(proposalId);
    if (!proposal || proposal.jobId !== jobId) {
      throw new NotFoundException('Proposal not found for this job');
    }

    job.status = 'AWARDED';
    proposal.status = 'ACCEPTED';
    for (const p of this.proposals.values()) {
      if (p.jobId === jobId && p.id !== proposalId) {
        p.status = 'REJECTED';
      }
    }

    const contract: ContractRecord = {
      id: crypto.randomUUID(),
      jobId,
      proposalId,
      clientId,
      providerId: proposal.providerId,
      totalAmountMinor: proposal.amountMinor,
      currency: proposal.currency,
      status: 'DRAFT_AWAITING_ESCROW',
      createdAt: new Date().toISOString(),
    };
    this.contracts.set(contract.id, contract);
    return contract;
  }
}
