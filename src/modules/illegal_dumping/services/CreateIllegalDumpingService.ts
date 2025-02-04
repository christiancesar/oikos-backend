import { AppError } from "@common/errors/AppError";
import { IllegalDumpingEntity } from "../entities/IllegalDumping";
import { IIllegalDumpingRepository } from "../repositories/IIllegalDumpingRepository";

type CreateIllegalDumping = {
  description: string;
  longitude: number;
  latitude: number;
};

export class CreateIllegalDumpingService {
  constructor(private repository: IIllegalDumpingRepository) {}

  async execute(data: CreateIllegalDumping): Promise<IllegalDumpingEntity> {
    const descriptionIsEmpty = data.description.trim() === "";

    if (descriptionIsEmpty) {
      throw new AppError("Descrição não pode ser vazia");
    }

    const illegal = await this.repository.create(data);

    return illegal;
  }
}
