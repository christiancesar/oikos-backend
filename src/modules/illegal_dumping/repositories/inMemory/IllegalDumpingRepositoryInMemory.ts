import {
  IllegalDumpingEntity,
  PriorityIllegalDumping,
  Solver,
  StatusIllegalDumping,
} from "@modules/illegal_dumping/entities/IllegalDumping";
import {
  CreateReportDTO,
  MarkAsResolvedDTO,
  assignIllegalDumpingDTO,
  unassignIllegalDumpingDTO,
} from "../IIllegalDumpingRepository";
import { IllegalDumpingRepository } from "../IllegalDumpingRepository";

export class IllegalDumpingRepositoryInMemory
  implements IllegalDumpingRepository
{
  private illegals: IllegalDumpingEntity[] = [];

  async create({
    description,
    latitude,
    longitude,
  }: CreateReportDTO): Promise<IllegalDumpingEntity> {
    const illegal = new IllegalDumpingEntity({
      description,
      latitude,
      longitude,
      status: StatusIllegalDumping.OPEN,
      createdAt: new Date(),
    });

    this.illegals.push(illegal);

    return illegal;
  }

  async findById(id: string): Promise<IllegalDumpingEntity | null> {
    const illegal = this.illegals.find((illegal) => illegal.id === id);

    return illegal || null;
  }

  async assignIllegalDumping({
    id,
    priority,
    solverId,
    solveUntil,
  }: assignIllegalDumpingDTO): Promise<IllegalDumpingEntity> {
    const illegalIndex = this.illegals.findIndex(
      (illegal) => illegal.id === id && illegal.id === id,
    );

    Object.assign<IllegalDumpingEntity, IllegalDumpingEntity>(
      this.illegals[illegalIndex],
      {
        ...this.illegals[illegalIndex],
        status: StatusIllegalDumping.ASSIGNED,
        solver: new Solver({
          company: {
            id: solverId,
          },
          priority: priority as PriorityIllegalDumping,
          solveUntil,
          description: null,
          resolvedAt: null,
        }),
      },
    );

    return this.illegals[illegalIndex];
  }

  async unassignIllegalDumping({
    id,
    solverId,
  }: unassignIllegalDumpingDTO): Promise<IllegalDumpingEntity> {
    const illegalIndex = this.illegals.findIndex(
      (illegal) =>
        illegal.id === id && illegal.solver?.company?.id === solverId,
    );

    Object.assign<IllegalDumpingEntity, IllegalDumpingEntity>(
      this.illegals[illegalIndex],
      {
        ...this.illegals[illegalIndex],
        solver: null,
        status: StatusIllegalDumping.OPEN,
      },
    );

    return this.illegals[illegalIndex];
  }

  async listAllIllegalsDumping({
    status,
  }: {
    status?: string;
  }): Promise<IllegalDumpingEntity[]> {
    const allIllegal = status
      ? this.illegals.filter((illegal) => illegal.status === status)
      : this.illegals;

    return allIllegal;
  }

  async listAllIllegalsDumpingByCompanyId({
    status,
    solverId,
  }: {
    status?: string;
    solverId: string;
  }): Promise<IllegalDumpingEntity[]> {
    const illegalsByCompany = this.illegals.filter((illegal) =>
      status
        ? illegal.solver?.company?.id === solverId && illegal.status === status
        : illegal.solver?.company?.id === solverId,
    );

    return illegalsByCompany;
  }

  async findIllegalsDumpingByIllegalIdAndSolverId(data: {
    illegalId: string;
    solverId: string;
  }): Promise<IllegalDumpingEntity | null> {
    const illegalByCompany = this.illegals.find(
      (illegal) =>
        illegal.solver?.company?.id === data.solverId &&
        illegal.id === data.illegalId,
    );

    return illegalByCompany || null;
  }

  async markAsResolved({
    description,
    id,
    solverId,
  }: MarkAsResolvedDTO): Promise<IllegalDumpingEntity> {
    const illegalIndex = await this.illegals.findIndex(
      (illegal) =>
        illegal.id === id && illegal.solver?.company?.id === solverId,
    );

    Object.assign<IllegalDumpingEntity, IllegalDumpingEntity>(
      this.illegals[illegalIndex],
      {
        ...this.illegals[illegalIndex],
        status: StatusIllegalDumping.RESOLVED,
        description,
      },
    );

    return this.illegals[illegalIndex];
  }

  async saveAttchments({
    denuciationId,
    urls,
  }: {
    denuciationId: string;
    urls: string[];
  }): Promise<IllegalDumpingEntity> {
    const illegalIndex = this.illegals.findIndex(
      (illegal) => illegal.id === denuciationId,
    );

    Object.assign<IllegalDumpingEntity, IllegalDumpingEntity>(
      this.illegals[illegalIndex],
      {
        ...this.illegals[illegalIndex],
        attachments: urls,
      },
    );

    return this.illegals[illegalIndex];
  }
}
