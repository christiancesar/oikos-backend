import "dotenv/config";
import { beforeEach, describe, expect, it } from "vitest";
import { Frequency, ServiceType } from "../entities/Circuit";
import { CircuitsRepositoryInMemory } from "../repositories/inMemory/CircuitsRepositoryInMemory";
import { CreateCircuitService } from "./CreateCircuitService";
import { ListCircuitsService } from "./ListCircuitsService";

let circuitsRepository: CircuitsRepositoryInMemory;
let createCircuitService: CreateCircuitService;
let listCircuitsService: ListCircuitsService;

describe("Criar circuito de coleta fornecido pelo municipio", () => {
  beforeEach(() => {
    circuitsRepository = new CircuitsRepositoryInMemory();
    createCircuitService = new CreateCircuitService(circuitsRepository);
    listCircuitsService = new ListCircuitsService(circuitsRepository);
  });

  it("Deve ser possivel procurar endereço especifico. [funcional] [negativo]", async () => {
    await createCircuitService.execute({
      addresses: ["Rua A", "Rua B"],
      city: "Brasília",
      frequency: [Frequency.MONDAY, Frequency.WEDNESDAY, Frequency.FRIDAY],
      serviceType: ServiceType.CONVENTIONAL,
      state: "DF",
    });

    await createCircuitService.execute({
      addresses: ["Rua C", "Rua D"],
      city: "Brasília",
      frequency: [Frequency.MONDAY],
      serviceType: ServiceType.CONVENTIONAL,
      state: "DF",
    });

    const circuits = await listCircuitsService.execute();

    expect(circuits.length).toBe(2);
  });
});
