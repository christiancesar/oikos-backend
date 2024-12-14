import { randomUUID } from "crypto";
import { prisma } from "prisma";
import {
  IllegalDumpingEntity,
  StatusIllegalDumping,
} from "../entities/IllegalDumping";
import {
  assignIllegalDumpingDTO,
  CreateReportDTO,
  IIllegalDumpingRepository,
  MarkAsResolvedDTO,
  unassignIllegalDumpingDTO,
} from "./IIllegalDumpingRepository";
import { IllegalDumpingMapper } from "./Mappers/IllegalDumpingMapper";

export class IllegalDumpingRepository implements IIllegalDumpingRepository {
  async create({
    description,
    latitude,
    longitude,
  }: CreateReportDTO): Promise<IllegalDumpingEntity> {
    const id = randomUUID();
    const report = await prisma.illegalDumping.create({
      data: {
        id,
        shortId: id.slice(0, 8).toLocaleUpperCase(),
        description,
        longitude,
        latitude,
        status: StatusIllegalDumping.OPEN,
      },
      include: {
        attachments: true,
        solver: true,
      },
    });
    return IllegalDumpingMapper.toDomain(report);
  }

  async findById(id: string): Promise<IllegalDumpingEntity | null> {
    const illgal = await prisma.illegalDumping.findUnique({
      where: {
        id,
      },
      include: {
        attachments: true,
        solver: true,
      },
    });

    return illgal ? IllegalDumpingMapper.toDomain(illgal) : null;
  }

  async assignIllegalDumping({
    id,
    priority,
    solverId,
    solveUntil,
  }: assignIllegalDumpingDTO): Promise<IllegalDumpingEntity> {
    const updatedReport = await prisma.illegalDumping.update({
      where: {
        id,
      },
      data: {
        priority,
        solveUntil,
        status: StatusIllegalDumping.ASSIGNED,
        solver: {
          connect: {
            id: solverId,
          },
        },
      },
      include: {
        attachments: true,
        solver: true,
      },
    });
    return IllegalDumpingMapper.toDomain(updatedReport);
  }

  async unassignIllegalDumping(
    unassignIllegalDumpingDTO: unassignIllegalDumpingDTO,
  ): Promise<IllegalDumpingEntity> {
    const updatedReport = await prisma.illegalDumping.update({
      where: {
        id: unassignIllegalDumpingDTO.id,
      },
      data: {
        priority: "LOW",
        solveUntil: null,
        status: StatusIllegalDumping.OPEN,
        solver: {
          disconnect: true,
        },
      },
      include: {
        attachments: true,
        solver: true,
      },
    });
    return IllegalDumpingMapper.toDomain(updatedReport);
  }

  async listAllIllegalsDumping({
    status,
  }: {
    status?: string;
  }): Promise<IllegalDumpingEntity[]> {
    const illegals = await prisma.illegalDumping.findMany({
      where: status ? { status } : {},
      include: {
        attachments: true,
        solver: true,
      },
    });

    return illegals.map((illegal) => IllegalDumpingMapper.toDomain(illegal));
  }

  async listAllIllegalsDumpingByCompanyId({
    status,
    solverId,
  }: {
    status?: string;
    solverId: string;
  }): Promise<IllegalDumpingEntity[]> {
    const illegals = await prisma.illegalDumping.findMany({
      where: status
        ? { status, solverId }
        : {
            solverId,
          },
      include: {
        attachments: true,
        solver: true,
      },
    });

    return illegals.map((illegal) => IllegalDumpingMapper.toDomain(illegal));
  }

  async findIllegalsDumpingByIllegalIdAndSolverId(data: {
    illegalId: string;
    solverId: string;
  }): Promise<IllegalDumpingEntity | null> {
    const illegal = await prisma.illegalDumping.findFirst({
      where: {
        id: data.illegalId,
        solverId: data.solverId,
      },
      include: {
        attachments: true,
        solver: true,
      },
    });

    return illegal ? IllegalDumpingMapper.toDomain(illegal) : null;
  }

  async markAsResolved(data: MarkAsResolvedDTO): Promise<IllegalDumpingEntity> {
    const illegal = await prisma.illegalDumping.update({
      where: {
        id: data.id,
        solverId: data.solverId,
      },
      data: {
        status: StatusIllegalDumping.RESOLVED,
        resolvedAt: new Date(),
        descriptionResolver: data.description,
      },
      include: {
        attachments: true,
        solver: true,
      },
    });

    return IllegalDumpingMapper.toDomain(illegal);
  }

  async saveAttchments({
    denuciationId,
    urls,
  }: {
    denuciationId: string;
    urls: string[];
  }): Promise<IllegalDumpingEntity> {
    const illegal = await prisma.illegalDumping.update({
      where: {
        id: denuciationId,
      },
      data: {
        attachments: {
          create: urls.map((url) => ({
            url,
          })),
        },
      },
      include: {
        attachments: true,
        solver: true,
      },
    });

    return IllegalDumpingMapper.toDomain(illegal);
  }
}
