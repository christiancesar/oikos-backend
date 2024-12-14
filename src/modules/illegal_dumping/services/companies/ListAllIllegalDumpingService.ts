import { IllegalDumpingEntity } from "@modules/illegal_dumping/entities/IllegalDumping";
import { IIllegalDumpingRepository } from "@modules/illegal_dumping/repositories/IIllegalDumpingRepository";

export class ListAllIllegalDumpingService {
  constructor(private repository: IIllegalDumpingRepository) {}

  async execute({
    status,
  }: {
    status?: string;
  }): Promise<IllegalDumpingEntity[]> {
    const statusSearch = status?.trim() === "" ? undefined : status;
    return this.repository.listAllIllegalsDumping({ status: statusSearch });
  }
}
