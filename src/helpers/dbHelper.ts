import Measure from "../models/Measure";

// Verifica se já existe uma leitura no mês para o mesmo tipo
export const checkExistingReading = async (
  customer_code: string,
  measure_datetime: string,
  measure_type: 'WATER' | 'GAS'
): Promise<boolean> => {
  const startOfMonth = new Date(new Date(measure_datetime).setDate(1));
  const endOfMonth = new Date(new Date(startOfMonth).setMonth(startOfMonth.getMonth() + 1));

  const existingReading = await Measure.findOne({
    customer_code,
    measure_datetime: { $gte: startOfMonth, $lt: endOfMonth },
    measure_type,
  });

  return !!existingReading;
};

// Salva uma nova leitura no banco de dados
export const saveReading = async (
  customer_code: string,
  measure_datetime: string,
  measure_type: 'WATER' | 'GAS',
  measure_value: number,
  measure_uuid: string,
  image_url: string
): Promise<void> => {
  const newMeasure = new Measure({
    customer_code,
    measure_datetime: new Date(measure_datetime),
    measure_type,
    measure_value,
    measure_uuid,
    image_url,
    has_confirmed: false,
  });

  await newMeasure.save();
};

// Confirma ou corrige um valor lido
export const confirmReading = async (
  measure_uuid: string,
  confirmed_value: number
): Promise<boolean> => {
  const measure = await Measure.findOne({ measure_uuid });

  if (!measure) {
    throw new Error("Leitura não encontrada");
  }

  if (measure.has_confirmed) {
    throw new Error("Leitura já confirmada");
  }

  measure.measure_value = confirmed_value;
  measure.has_confirmed = true;

  await measure.save();

  return true;
};

