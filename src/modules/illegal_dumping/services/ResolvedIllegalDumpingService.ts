import { ICompaniesRepository } from "@modules/companies/repositories/ICompaniesRepository";
import { IIllegalDumpingRepository } from "../repositories/IIllegalDumpingRepository";
import { IllegalDumpingEntity } from "../entities/IllegalDumping";
import { AppError } from "@common/errors/AppError";

type ResolvedIllegalDumpingServiceParams = {
  id: string;
  solverId: string;
  description: string;
};

export class ResolvedIllegalDumpingService {
  constructor(
    private illegalDumpingRepository: IIllegalDumpingRepository,
    private companiesRepository: ICompaniesRepository,
  ) {}

  async execute(
    data: ResolvedIllegalDumpingServiceParams,
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

    const illegalIsTheSameSolver =
      await this.illegalDumpingRepository.findIllegalsDumpingByIllegalIdAndSolverId(
        { illegalId: data.id, solverId: data.solverId },
      );

    if (!illegalIsTheSameSolver) {
      throw new AppError("The only Resolver to close the denunciation.");
    }

    const illegal = await this.illegalDumpingRepository.markAsResolved(data);

    return illegal;
  }
}
