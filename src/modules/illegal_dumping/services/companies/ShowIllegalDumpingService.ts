import { AppError } from "@common/errors/AppError";
import { IllegalDumpingEntity } from "@modules/illegal_dumping/entities/IllegalDumping";
import { IIllegalDumpingRepository } from "@modules/illegal_dumping/repositories/IIllegalDumpingRepository";

export class ShowIllegalDumpingService {
  constructor(private repository: IIllegalDumpingRepository) {}

  async execute(illegalId: string): Promise<IllegalDumpingEntity> {
    const illegalDumpingExist = await this.repository.findById(illegalId);

    if (!illegalDumpingExist) {
      throw new AppError("Illegal dumping not found");
    }

    return illegalDumpingExist;
  }
}
