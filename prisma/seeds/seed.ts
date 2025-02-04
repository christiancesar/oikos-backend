import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import { brasilApi } from "./brasil-api";
import { companiesIdentity } from "./companies-identity";

type MaterialJSON = {
  name: string;
  category: string;
};

type CircuitJSON = {
  code?: string;
  addresses: string[];
  sectors: string;
  frequency: string[];
  startTime: string;
  endTime: string;
  serviceType: string;
  equipment: string;
  destination: string;
  city: string;
  state: string;
};

type CompanyBrasilAPI = {
  cnpj: string;
  pais: string;
  email: string;
  identificador_matriz_filial: number;
  descricao_matriz_filial: string;
  razao_social: string;
  nome_fantasia: string;
  situacao_cadastral: number;
  descricao_situacao_cadastral: string;
  data_situacao_cadastral: string;
  motivo_situacao_cadastral: number;
  nome_cidade_exterior: string | null;
  codigo_natureza_juridica: number;
  data_inicio_atividade: string;
  cnae_fiscal: number;
  cnae_fiscal_descricao: string;
  descricao_tipo_de_logradouro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  uf: string;
  codigo_municipio: number;
  municipio: string;
  ddd_telefone_1: string;
  ddd_telefone_2: string | null;
  ddd_fax: string | null;
  qualificacao_do_responsavel: number;
  capital_social: number;
  porte: number;
  descricao_porte: string;
  opcao_pelo_simples: false;
  data_opcao_pelo_simples: string | null;
  data_exclusao_do_simples: string | null;
  opcao_pelo_mei: false;
  situacao_especial: string | null;
  data_situacao_especial: string | null;
  descricao_identificador_matriz_filial: string;
  cnaes_secundarios: [
    {
      codigo: number;
      descricao: string;
    },
    {
      codigo: number;
      descricao: string;
    },
    {
      codigo: number;
      descricao: string;
    },
    {
      codigo: number;
      descricao: string;
    },
    {
      codigo: number;
      descricao: string;
    },
  ];
  qsa: [
    {
      identificador_de_socio: number;
      nome_socio: string;
      cnpj_cpf_do_socio: string;
      codigo_qualificacao_socio: number;
      percentual_capital_social: number;
      data_entrada_sociedade: string;
      cpf_representante_legal: string | null;
      nome_representante_legal: string | null;
      codigo_qualificacao_representante_legal: string | null;
    },
  ];
};

const businessHour = [
  {
    dayOfWeek: "MONDAY",
    timeSlots: [
      {
        startTime: "07:00",
        endTime: "11:00",
      },
      {
        startTime: "13:00",
        endTime: "17:00",
      },
    ],
  },
  {
    dayOfWeek: "TUESDAY",
    timeSlots: [
      {
        startTime: "07:00",
        endTime: "11:00",
      },
      {
        startTime: "13:00",
        endTime: "17:00",
      },
    ],
  },
  {
    dayOfWeek: "WEDNESDAY",
    timeSlots: [
      {
        startTime: "07:00",
        endTime: "11:00",
      },
      {
        startTime: "13:00",
        endTime: "17:00",
      },
    ],
  },
  {
    dayOfWeek: "THURSDAY",
    timeSlots: [
      {
        startTime: "07:00",
        endTime: "11:00",
      },
      {
        startTime: "13:00",
        endTime: "17:00",
      },
    ],
  },
  {
    dayOfWeek: "FRIDAY",
    timeSlots: [
      {
        startTime: "07:00",
        endTime: "11:00",
      },
      {
        startTime: "13:00",
        endTime: "17:00",
      },
    ],
  },
  {
    dayOfWeek: "SATURDAY",
    timeSlots: [],
  },
  {
    dayOfWeek: "SUNDAY",
    timeSlots: [],
  },
];

const prisma = new PrismaClient();
async function main() {
  const materialsFile = fs.readFileSync(
    path.resolve(__dirname, "materials.json"),
    "utf8",
  );
  const materials = JSON.parse(materialsFile) as MaterialJSON[];

  await Promise.all(
    materials.map(async (material) => {
      await prisma.material.createMany({
        data: [{ name: material.name, category: material.category }],
      });
    }),
  );

  const circuitsFile = fs.readFileSync(
    path.resolve(__dirname, "circuits.json"),
    "utf8",
  );
  const circuits = JSON.parse(circuitsFile) as CircuitJSON[];

  await Promise.all(
    circuits.map(async (circuit) => {
      const id = randomUUID();
      await prisma.circuit.create({
        data: {
          id,
          code: circuit.code ?? id.slice(0, 8).toLocaleUpperCase(),
          addresses: JSON.stringify(circuit.addresses),
          sectors: circuit.sectors,
          frequency: JSON.stringify(circuit.frequency),
          startTime: circuit.startTime,
          endTime: circuit.endTime,
          serviceType: circuit.serviceType,
          equipment: circuit.equipment,
          destination: circuit.destination,
          city: circuit.city,
          state: circuit.state,
        },
      });
    }),
  );

  const materialIds = await prisma.material.findMany({
    select: {
      id: true,
    },
  });

  companiesIdentity.forEach(async (identity, index) => {
    if (index === 19) {
      return;
    }

    const result = await brasilApi.get<CompanyBrasilAPI>(
      `/cnpj/v1/${identity}`,
    );

    await prisma.company.create({
      data: {
        identity: result.data.cnpj,
        companyType: "COMPANY",
        identityType: "CNPJ",
        status: result.data.descricao_situacao_cadastral === "ATIVA",
        email: result.data.email,
        isHeadquarters:
          result.data.descricao_identificador_matriz_filial === "MATRIZ",
        corporateName: result.data.razao_social,
        businessName: result.data.nome_fantasia,
        phones: JSON.stringify([
          result.data.ddd_telefone_1,
          result.data.ddd_telefone_2,
        ]),
        startedActivityIn: new Date(result.data.data_inicio_atividade),
        acceptAppointments: false,
        stateRegistration: "",
        address: {
          create: {
            city: result.data.municipio,
            district: result.data.bairro,
            number: result.data.numero,
            state: "Mato Grosso",
            stateAcronym: result.data.uf,
            street: result.data.logradouro,
            zipCode: result.data.cep,
            complement: result.data.complemento,
          },
        },
        businessHours: {
          create: businessHour.map((hour) => ({
            dayOfWeek: hour.dayOfWeek,
            timeSlots: {
              create: hour.timeSlots.map((slot) => ({
                startTime: slot.startTime,
                endTime: slot.endTime,
              })),
            },
          })),
        },
        wasteItems: {
          createMany: {
            data: [
              {
                materialId: materialIds[getRandomIndex(materialIds.length)].id,
                amount: Math.random(),
              },
              {
                materialId: materialIds[getRandomIndex(materialIds.length)].id,
                amount: Math.random(),
              },
              {
                materialId: materialIds[getRandomIndex(materialIds.length)].id,
                amount: Math.random(),
              },
            ],
          },
        },
        user: {
          create: {
            email: faker.internet.email(),
            password: faker.internet.password(),
          },
        },
      },
    });
  });
}

function getRandomIndex(arrayLength: number) {
  return Math.floor(Math.random() * arrayLength);
}

main()
  .then(() => console.log("Seed data created successfully!"))
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
