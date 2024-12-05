import { AppError } from "@common/errors/AppError";
import { IllegalDumpingEntity } from "../entities/IllegalDumping";
import { IIllegalDumpingRepository } from "../repositories/IIllegalDumpingRepository";
import { ICompaniesRepository } from "@modules/companies/repositories/ICompaniesRepository";

type AssignIllegalDumpingServiceParams = {
  id: string;
  solverId: string;
  priority: string;
  solveUntil: Date;
};

export class AssignIllegalDumpingService {
  constructor(
    private illegalDumpingRepository: IIllegalDumpingRepository,
    private companiesRepository: ICompaniesRepository,
  ) {}

  async execute(
    data: AssignIllegalDumpingServiceParams,
  ): Promise<IllegalDumpingEntity> {
    const companyExist = await this.companiesRepository.findCompayById(
      data.solverId,
    );

    if (!companyExist) {
      throw new AppError("Company not found");
    }

    const illegalDumpingExist = await this.illegalDumpingRepository.findById(
      data.id,
    );

    if (!illegalDumpingExist) {
      throw new AppError("Illegal dumping not found");
    }

    const updatedIllegalDumping =
      await this.illegalDumpingRepository.assignIllegalDumping(data);

    return updatedIllegalDumping;
  }
}
