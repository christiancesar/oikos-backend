import "dotenv/config";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateCircuitService } from "./CreateCircuitService";
import { CircuitsRepositoryInMemory } from "../repositories/inMemory/CircuitsRepositoryInMemory";
import { Frequency, ServiceType } from "../entities/Circuit";
import { AppError } from "@common/errors/AppError";
import { GetCircuitByAddressService } from "./GetCircuitByAddressService";

let circuitsRepository: CircuitsRepositoryInMemory;
let createCircuitService: CreateCircuitService;
let getCircuitByAddressService: GetCircuitByAddressService;

describe("Criar circuito de coleta fornecido pelo municipio", () => {
  beforeEach(() => {
    circuitsRepository = new CircuitsRepositoryInMemory();
    createCircuitService = new CreateCircuitService(circuitsRepository);
    getCircuitByAddressService = new GetCircuitByAddressService(
      circuitsRepository,
    );
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

    const circuit = await getCircuitByAddressService.execute({
      address: "Rua A",
      city: "Brasília",
      state: "DF",
    });

    expect(circuit).toHaveProperty("id");
  });

  it("Não deve ser retornar nenhum endereço caso não exista. [funcional] [negativo]", async () => {
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

    await expect(
      getCircuitByAddressService.execute({
        address: "Rua E",
        city: "Brasília",
        state: "DF",
      }),
    ).rejects.toThrow(AppError);
  });

  // Ao executar os teste foram encontrados erros de implementação, pois não contia validações para os campos obrigatórios, caso enviar os campos vazios

  it("Não deve ser possível procurar um circuito sem informar o endereço. [estrutural] [negativo]", async () => {
    await expect(
      getCircuitByAddressService.execute({
        address: "",
        city: "Brasília",
        state: "DF",
      }),
    ).rejects.toThrow(AppError);
  });

  it("Não deve ser possível procurar um circuito sem informar a cidade. [estrutural] [negativo]", async () => {
    await expect(
      getCircuitByAddressService.execute({
        address: "Rua A",
        city: "",
        state: "DF",
      }),
    ).rejects.toThrow(AppError);
  });

  it("Não deve ser possível procurar um circuito sem informar o estado. [estrutural] [negativo]", async () => {
    await expect(
      getCircuitByAddressService.execute({
        address: "Rua A",
        city: "Brasília",
        state: "",
      }),
    ).rejects.toThrow(AppError);
  });
});
