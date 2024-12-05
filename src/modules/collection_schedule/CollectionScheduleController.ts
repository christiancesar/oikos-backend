// rotas para criacao, consulta e atualizacao dos cronogramas de coleta

import { Request, Response } from "express";
import { CollectionScheduleService } from "./services/CollectionScheduleService";

export class CollectionScheduleController {
  // Rota para criar um novo cronograma de coleta
  public async create(req: Request, res: Response) {
    const { bairro, dia, periodo, materiais } = req.body;
    const collectionScheduleService = new CollectionScheduleService();
    // Chama o serviço para criar o cronograma
    const newSchedule = await collectionScheduleService.create(
      bairro,
      dia,
      periodo,
      materiais,
    );
    res.json(newSchedule);
  }

  // Rota para consultar os cronogramas de um bairro
  public async getByBairro(req: Request, res: Response) {
    const { bairro } = req.params;
    const collectionScheduleService = new CollectionScheduleService();
    try {
      // Chama o serviço para obter os cronogramas por bairro
      const schedules = await collectionScheduleService.getByBairro(bairro);
      res.status(200).json(schedules);
    } catch (err) {
      res.status(500).json({ error: "Erro ao consultar cronograma de coleta" });
    }
  }
}
