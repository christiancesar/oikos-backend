import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

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
}

main()
  .then(() => console.log("Seed data created successfully!"))
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
