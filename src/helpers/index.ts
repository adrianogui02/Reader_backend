import Measure from '../models/Measure';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();


export const checkExistingReading = async (customer_code: string, measure_type: string, measure_datetime: Date | string) => {

  const date = new Date(measure_datetime);

  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return await Measure.findOne({
    customer_code,
    measure_type,
    measure_datetime: {
      $gte: startOfMonth,
      $lte: endOfMonth,
    }
  });
};

export const callGeminiAPI = async (imageBase64: string) => {
  try {
    const url = 'https://vision.googleapis.com/v1/images:annotate?key=' + process.env.GOOGLE_API_KEY;
    const requestBody = {
      requests: [
        {
          image: {
            content: imageBase64,
          },
          features: [
            {
              type: "TEXT_DETECTION", // ou "LABEL_DETECTION", dependendo do que você precisa
            },
          ],
        },
      ],
    };

    const response = await axios.post(url, requestBody);
    return response.data;
  } catch (error) {
    console.error("Erro ao consultar a API Gemini", error);
    throw new Error("Erro ao consultar a API Gemini");
  }
};

export const saveMeasure = async (customer_code: string, measure_datetime: Date, measure_type: string, measure_value: number, measure_uuid: string, image_url: string) => {
  const newMeasure = new Measure({
    customer_code,
    measure_datetime,
    measure_type,
    measure_value,
    measure_uuid,
    image_url,
  });

  return await newMeasure.save();
};

export const getMeasuresByCustomer = async (customer_code: string, measure_type?: string) => {
  const query: any = { customer_code };
  if (measure_type) {
    query.measure_type = measure_type;
  }
  return await Measure.find(query);
};

export const getReadingByUuid = async (measure_uuid: string) => {
  return await Measure.findOne({ measure_uuid });
};

export const confirmMeasure = async (measure_uuid: string, confirmed_value: number) => {
  return await Measure.findOneAndUpdate(
    { measure_uuid },
    { measure_value: confirmed_value, has_confirmed: true },
    { new: true }
  );
};
