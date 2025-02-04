import { AppError } from "@common/errors/AppError";
import {
  IllegalDumpingEntity,
  StatusIllegalDumping,
} from "@modules/illegal_dumping/entities/IllegalDumping";
import { IIllegalDumpingRepository } from "@modules/illegal_dumping/repositories/IIllegalDumpingRepository";

export class ListAllIllegalDumpingService {
  constructor(private repository: IIllegalDumpingRepository) {}

  async execute({
    status,
  }: {
    status?: string;
  }): Promise<IllegalDumpingEntity[]> {
    const statusSearch = status?.trim() === "" ? undefined : status;

    const statusIsValid =
      StatusIllegalDumping[statusSearch as keyof typeof StatusIllegalDumping];

    if (statusSearch && !statusIsValid) {
      throw new AppError("Invalid status");
    }

    return this.repository.listAllIllegalsDumping({ status: statusSearch });
  }
}
