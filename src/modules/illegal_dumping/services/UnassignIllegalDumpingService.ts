import { AppError } from "@common/errors/AppError";
import { ICompaniesRepository } from "@modules/companies/repositories/ICompaniesRepository";
import {
  IllegalDumpingEntity,
  StatusIllegalDumping,
} from "../entities/IllegalDumping";
import { IIllegalDumpingRepository } from "../repositories/IIllegalDumpingRepository";

type UnassignIllegalDumpingServiceParams = {
  denunciationId: string;
  solverId: string;
};

export class UnassignIllegalDumpingService {
  constructor(
    private illegalDumpingRepository: IIllegalDumpingRepository,
    private companiesRepository: ICompaniesRepository,
  ) {}

  async execute({
    denunciationId,
    solverId,
  }: UnassignIllegalDumpingServiceParams): Promise<IllegalDumpingEntity> {
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

    if (illegalDumpingExist.status !== StatusIllegalDumping.ASSIGNED) {
      throw new AppError("Illegal dumping already unassigned or resolved");
    }

    if (illegalDumpingExist.solver?.company?.id !== solverId) {
      throw new AppError(
        "You are not allowed to unassign this illegal dumping",
      );
    }

    const updatedIllegalDumping =
      await this.illegalDumpingRepository.unassignIllegalDumping({
        id: denunciationId,
        solverId,
      });

    return updatedIllegalDumping;
  }
}
