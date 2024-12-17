import "dotenv/config";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateCircuitService } from "./CreateCircuitService";
import { CircuitsRepositoryInMemory } from "../repositories/inMemory/CircuitsRepositoryInMemory";
import { Frequency, ServiceType } from "../entities/Circuit";
import { AppError } from "@common/errors/AppError";

let createCircuitService: CreateCircuitService;
let circuitsRepository: CircuitsRepositoryInMemory;
describe("Criar circuito de coleta fornecido pelo municipio", () => {
  beforeEach(() => {
    circuitsRepository = new CircuitsRepositoryInMemory();
    createCircuitService = new CreateCircuitService(circuitsRepository);
  });

  it("Deve ser possivel fazer cadastro de curcuitos de reciclagem. [funcional] [negativo]", async () => {
    const circuit = await createCircuitService.execute({
      addresses: ["Rua A", "Rua B"],
      city: "Brasília",
      frequency: [Frequency.MONDAY, Frequency.WEDNESDAY, Frequency.FRIDAY],
      serviceType: ServiceType.CONVENTIONAL,
      state: "DF",
    });

    expect(circuit.id).toBeDefined();
    expect(circuit).toHaveProperty("id");
  });

  // Ao executar os teste foram encontrados erros de implementação, pois não contia validações para os campos obrigatórios

  it("Não deve ser possível criar um circuito sem informar o endereço. [estrutural] [negativo]", async () => {
    await expect(
      createCircuitService.execute({
        addresses: [],
        city: "Brasília",
        frequency: [Frequency.MONDAY, Frequency.WEDNESDAY, Frequency.FRIDAY],
        serviceType: ServiceType.CONVENTIONAL,
        state: "DF",
      }),
    ).rejects.toThrow(AppError);
  });

  it("Não deve ser possível criar um circuito sem informar a frequência. [estrutural] [negativo]", async () => {
    await expect(
      createCircuitService.execute({
        addresses: ["Rua A", "Rua B"],
        city: "Brasília",
        frequency: [],
        serviceType: ServiceType.CONVENTIONAL,
        state: "DF",
      }),
    ).rejects.toThrow(AppError);
  });

  it("Não deve ser possível criar um circuito sem informar o tipo de serviço. [estrutural] [negativo]", async () => {
    await expect(
      createCircuitService.execute({
        addresses: ["Rua A", "Rua B"],
        city: "Brasília",
        frequency: [Frequency.MONDAY, Frequency.WEDNESDAY, Frequency.FRIDAY],
        serviceType: "INVALID_SERVICE_TYPE" as ServiceType,
        state: "DF",
      }),
    ).rejects.toThrow(AppError);
  });

  it("Não deve ser possível criar um circuito sem informar a cidade e o estado. [estrutural] [negativo]", async () => {
    await expect(
      createCircuitService.execute({
        addresses: ["Rua A", "Rua B"],
        city: "",
        frequency: [Frequency.MONDAY, Frequency.WEDNESDAY, Frequency.FRIDAY],
        serviceType: ServiceType.CONVENTIONAL,
        state: "",
      }),
    ).rejects.toThrow(AppError);
  });

  it("Não deve ser possível criar um circuito com endereço vazio. [estrutural] [negativo]", async () => {
    await expect(
      createCircuitService.execute({
        addresses: [""],
        city: "Brasília",
        frequency: [Frequency.MONDAY, Frequency.WEDNESDAY, Frequency.FRIDAY],
        serviceType: ServiceType.CONVENTIONAL,
        state: "DF",
      }),
    ).rejects.toThrow(AppError);
  });

  it("Não deve ser possível criar um circuito com frequência inválida. [estrutural] [negativo]", async () => {
    await expect(
      createCircuitService.execute({
        addresses: ["Rua A", "Rua B"],
        city: "Brasília",
        frequency: ["INVALID_FREQUENCY" as Frequency],
        serviceType: ServiceType.CONVENTIONAL,
        state: "DF",
      }),
    ).rejects.toThrow(AppError);
  });
});
