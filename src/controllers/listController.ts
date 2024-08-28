import { Request, Response } from 'express';
import { getMeasuresByCustomer } from '../helpers/index';

const listController = async (req: Request, res: Response) => {
  const { customer_code } = req.params;
  const { measure_type } = req.query;

  // Validação de measure_type
  if (measure_type && measure_type !== "WATER" && measure_type !== "GAS") {
    return res.status(400).json({
      error_code: "INVALID_TYPE",
      error_description: "Tipo de medição não permitida"
    });
  }

  // Obter as medições do banco de dados
  const measures = await getMeasuresByCustomer(customer_code, measure_type as string);

  if (!measures.length) {
    return res.status(404).json({
      error_code: "MEASURES_NOT_FOUND",
      error_description: "Nenhuma leitura encontrada"
    });
  }

  res.status(200).json({
    customer_code,
    measures,
  });
};

export default listController;
