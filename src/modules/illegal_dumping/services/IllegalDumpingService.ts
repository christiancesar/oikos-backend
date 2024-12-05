import { AppError } from "@common/errors/AppError";
import { IllegalDumpingEntity } from "../entities/IllegalDumping";
import { IIllegalDumpingRepository } from "../repositories/IIllegalDumpingRepository";

type CreateIllegalDumping = {
  description: string;
  longitude: number;
  latitude: number;
};

export class IllegalDumpingService {
  constructor(private repository: IIllegalDumpingRepository) {}

  async create(data: CreateIllegalDumping): Promise<IllegalDumpingEntity> {
    const illegal = await this.repository.create(data);

    return illegal;
  }

  async show(illegalId: string): Promise<IllegalDumpingEntity> {
    const illegalDumpingExist = await this.repository.findById(illegalId);

    if (!illegalDumpingExist) {
      throw new AppError("Illegal dumping not found");
    }

    return illegalDumpingExist;
  }

  async list(): Promise<IllegalDumpingEntity[]> {
    return this.repository.listAllIllegalsDumping();
  }
}
