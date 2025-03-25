// src/modules/materials/routes/material.routes.ts

import { Router, Request, Response } from "express";
import { MaterialService } from "./services/MaterialRegistrationService";
import { MaterialRepository } from "./repositories/MaterialRegistrationRepository";
import { z } from "zod";

const materialsRoutes = Router();
const materialService = new MaterialService(new MaterialRepository());

const requestParamsSchemaValidation = z.object({
  id: z.string().uuid(),
});
// Rota para criar um material
materialsRoutes.post("/", async (req: Request, res: Response) => {
  const material = await materialService.create(req.body);
  res.status(201).json(material);
});

// Rota para obter todos os materiais
materialsRoutes.get("/", async (req: Request, res: Response) => {
  const materials = await materialService.findAll();
  res.status(200).json(materials);
});

// Rota para obter um material pelo id
materialsRoutes.get("/:id", async (req: Request, res: Response) => {
  const { id } = requestParamsSchemaValidation.parse(req.params);
  const material = await materialService.findById(id);

  res.status(200).json(material);
});

// Rota para atualizar um material
materialsRoutes.put("/:id", async (req: Request, res: Response) => {
  const { id } = requestParamsSchemaValidation.parse(req.params);
  const material = await materialService.update(id, req.body);

  res.status(200).json(material);
});

// Rota para excluir um material
materialsRoutes.delete("/:id", async (req: Request, res: Response) => {
  const { id } = requestParamsSchemaValidation.parse(req.params);
  await materialService.delete(id);
  res.status(204).send();
});

export { materialsRoutes };
