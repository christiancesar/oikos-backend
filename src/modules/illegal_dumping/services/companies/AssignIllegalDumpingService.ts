import { AppError } from "@common/errors/AppError";
import { ICompaniesRepository } from "@modules/companies/repositories/ICompaniesRepository";
import {
  IllegalDumpingEntity,
  StatusIllegalDumping,
} from "@modules/illegal_dumping/entities/IllegalDumping";
import { IIllegalDumpingRepository } from "@modules/illegal_dumping/repositories/IIllegalDumpingRepository";

type AssignIllegalDumpingServiceParams = {
  denunciationId: string;
  solverId: string;
  priority: string;
  solveUntil: Date;
};

export class AssignIllegalDumpingService {
  constructor(
    private illegalDumpingRepository: IIllegalDumpingRepository,
    private companiesRepository: ICompaniesRepository,
  ) {}

  async execute({
    denunciationId,
    priority,
    solveUntil,
    solverId,
  }: AssignIllegalDumpingServiceParams): Promise<IllegalDumpingEntity> {
    const companyExist =
      await this.companiesRepository.findCompayById(solverId);

    if (!companyExist) {
      throw new AppError("Company not found");
    }

    const illegalDumpingExist =
      await this.illegalDumpingRepository.findById(denunciationId);

    if (!illegalDumpingExist) {
      throw new AppError("Illegal dumping not found");
    }

    if (illegalDumpingExist.status !== StatusIllegalDumping.OPEN) {
      throw new AppError("Illegal dumping already assigned or resolved");
    }

    const updatedIllegalDumping =
      await this.illegalDumpingRepository.assignIllegalDumping({
        id: denunciationId,
        priority,
        solverId,
        solveUntil,
      });

    return updatedIllegalDumping;
  }
}
