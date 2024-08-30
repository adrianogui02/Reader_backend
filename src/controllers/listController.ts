import { Request, Response } from 'express';
import { getMeasuresByCustomer } from '../helpers/index';

const listController = async (req: Request, res: Response) => {
  const { customer_code } = req.params;
  let { measure_type } = req.query;

  // Validação de measure_type
  if (measure_type) {
    measure_type = measure_type.toString().toUpperCase();
    if (measure_type !== "WATER" && measure_type !== "GAS") {
      return res.status(400).json({
        error_code: "INVALID_TYPE",
        error_description: "Tipo de medição não permitida",
      });
    }
  }

  try {
    // Obter as medições do banco de dados
    const measures = await getMeasuresByCustomer(customer_code, measure_type as string);

    if (!measures.length) {
      return res.status(404).json({
        error_code: "MEASURES_NOT_FOUND",
        error_description: "Nenhuma leitura encontrada",
      });
    }

    // Formatar a resposta
    const formattedMeasures = measures.map(measure => ({
      measure_uuid: measure.measure_uuid,
      measure_datetime: measure.measure_datetime,
      measure_type: measure.measure_type,
      has_confirmed: measure.has_confirmed,
      image_url: measure.image_url,
    }));

    res.status(200).json({
      customer_code,
      measures: formattedMeasures,
    });
  } catch (error) {
    console.error("Erro ao buscar medidas:", error);
    res.status(500).json({
      error_code: "SERVER_ERROR",
      error_description: "Erro interno ao buscar as medidas",
    });
  }
};

export default listController;
