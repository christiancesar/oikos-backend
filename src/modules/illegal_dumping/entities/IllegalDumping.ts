import { randomUUID } from "crypto";

export enum PriorityIllegalDumping {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum StatusIllegalDumping {
  OPEN = "OPEN",
  RESOLVED = "RESOLVED",
}

export class Solver {
  priority?: PriorityIllegalDumping | null;
  solveUntil?: Date | null; // data de previsão de resolução
  resolvedAt?: Date | null; // data que foi resolvido
  company?: {
    id?: string;
    corporateName?: string;
  } | null; // empresa que se propôs a resolver

  description?: string | null;

  constructor(data: Solver) {
    this.priority = data.priority;
    this.solveUntil = data.solveUntil;
    this.resolvedAt = data.resolvedAt;
    this.company = data.company;
    this.description = data.description;
  }
}

type IllegalDumpingConstructor = {
  id?: string;
  status?: StatusIllegalDumping | null;
  description: string;
  longitude: number;
  latitude: number;
  solver?: Solver | null;
  attachments?: string[] | null;
  createdAt: Date;
  updatedAt?: Date | null;
};

export class IllegalDumpingEntity {
  id: string;
  shortId: string;
  description: string;
  longitude: number;
  latitude: number;
  status?: StatusIllegalDumping | null;
  attachments?: string[] | null;
  solver?: Solver | null;
  createdAt: Date;
  updatedAt?: Date | null;

  constructor(data: IllegalDumpingConstructor) {
    this.id = data.id ?? randomUUID();
    this.shortId = this.id.slice(0, 8).toLocaleUpperCase();
    this.description = data.description;
    this.longitude = data.longitude;
    this.latitude = data.latitude;
    this.status = this.status ?? StatusIllegalDumping.OPEN;
    this.attachments = data.attachments;
    this.solver = data.solver ?? new Solver({});
    this.createdAt = data.createdAt;
  }
}
