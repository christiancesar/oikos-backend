import { Prisma } from "@prisma/client";
import {
  IllegalDumpingEntity,
  PriorityIllegalDumping,
  Solver,
  StatusIllegalDumping,
} from "../../entities/IllegalDumping";

type IllegalDumpingPrisma = Prisma.IllegalDumpingGetPayload<{
  include: {
    attachments: true;
    solver: true;
  };
}>;

export class IllegalDumpingMapper {
  static toDomain(data: IllegalDumpingPrisma): IllegalDumpingEntity {
    const solver = data.solver
      ? new Solver({
          priority:
            PriorityIllegalDumping[
              data.priority as keyof typeof PriorityIllegalDumping
            ],
          company: {
            id: data.solver?.id,
            corporateName: data.solver?.corporateName,
          },
          solveUntil: data.solveUntil,
          resolvedAt: data.resolvedAt,
          description: data.descriptionResolver,
        })
      : null;

    return new IllegalDumpingEntity({
      id: data.id,
      description: data.description,
      longitude: data.longitude,
      latitude: data.latitude,
      status:
        StatusIllegalDumping[data.status as keyof typeof StatusIllegalDumping],
      solver,
      attachments: data.attachments.map((attachment) => attachment.url),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
