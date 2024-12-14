import { IllegalDumpingEntity } from "../entities/IllegalDumping";
// import { ReportDTO } from "../dtos/IllegalDumpingDTO";
// import { IllegalDumpingRepository } from "./IllegalDumpingRepository";

export type CreateReportDTO = {
  description: string;
  longitude: number;
  latitude: number;
};

export type assignIllegalDumpingDTO = {
  id: string;
  solverId: string;
  priority: string;
  solveUntil: Date;
};

export type unassignIllegalDumpingDTO = {
  id: string;
  solverId: string;
};

export type MarkAsResolvedDTO = {
  id: string;
  solverId: string;
  description: string;
};

export interface IIllegalDumpingRepository {
  create(data: CreateReportDTO): Promise<IllegalDumpingEntity>;
  findById(id: string): Promise<IllegalDumpingEntity | null>;
  assignIllegalDumping(
    data: assignIllegalDumpingDTO,
  ): Promise<IllegalDumpingEntity>;
  listAllIllegalsDumping({
    status,
  }: {
    status?: string;
  }): Promise<IllegalDumpingEntity[]>;

  listAllIllegalsDumpingByCompanyId({
    status,
    solverId,
  }: {
    status?: string;
    solverId: string;
  }): Promise<IllegalDumpingEntity[]>;

  findIllegalsDumpingByIllegalIdAndSolverId(data: {
    illegalId: string;
    solverId: string;
  }): Promise<IllegalDumpingEntity | null>;
  markAsResolved(data: MarkAsResolvedDTO): Promise<IllegalDumpingEntity>;

  unassignIllegalDumping(
    unassignIllegalDumpingDTO: unassignIllegalDumpingDTO,
  ): Promise<IllegalDumpingEntity>;
}
