import { Request, Response } from 'express';
import { getReadingByUuid, confirmMeasure } from '../helpers/index';

const confirmController = async (req: Request, res: Response) => {
  const { measure_uuid, confirmed_value } = req.body;

  // Validação dos dados
  if (!measure_uuid || confirmed_value == null) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Dados inválidos fornecidos"
    });
  }

  // Verificação se a leitura existe e se já foi confirmada
  const reading = await getReadingByUuid(measure_uuid);

  if (!reading) {
    return res.status(404).json({
      error_code: "MEASURE_NOT_FOUND",
      error_description: "Leitura não encontrada"
    });
  }

  if (reading.has_confirmed) {
    return res.status(409).json({
      error_code: "CONFIRMATION_DUPLICATE",
      error_description: "Leitura já confirmada"
    });
  }

  // Atualizar a leitura no banco de dados
  await confirmMeasure(measure_uuid, confirmed_value);

  res.status(200).json({ success: true });
};

export default confirmController;
