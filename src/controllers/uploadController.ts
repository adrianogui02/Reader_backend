import { Request, Response } from "express";
import { interactWithImage, extractNumericValue } from "../lib/gemini";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { checkExistingReading, saveReading } from "../helpers/dbHelper";
import { uploadImageToImgur } from "../helpers/imageHelper";

export const uploadController = async (req: Request, res: Response) => {
  const { image, customer_code, measure_datetime, measure_type } = req.body;

  if (!image || !customer_code || !measure_datetime || !measure_type) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Dados inválidos fornecidos",
    });
  }

  // Verifica se já existe uma leitura no mês para este tipo de leitura
  const existingReading = await checkExistingReading(customer_code, measure_datetime, measure_type);
  if (existingReading) {
    return res.status(409).json({
      error_code: "DOUBLE_REPORT",
      error_description: "Leitura do mês já realizada",
    });
  }

  const imageId = uuidv4();
  const tempImagePath = path.join(__dirname, "../temp", `${imageId}.jpg`);

  try {
    // Salvar a imagem temporariamente
    const imageBuffer = Buffer.from(image, "base64");
    fs.writeFileSync(tempImagePath, imageBuffer);

    // Fazer upload da imagem para o Imgur e obter a URL
    const imageUrl = await uploadImageToImgur(image.toString("base64"));

    // Interagir com a imagem usando o modelo Gemini Vision
    const caption = await interactWithImage(tempImagePath);

    // Extrair o valor numérico da legenda
    const measure_value = extractNumericValue(caption);

    // Salvar a leitura no banco de dados
    await saveReading(customer_code, measure_datetime, measure_type, measure_value, imageId, imageUrl);

    res.status(200).json({
      image_url: imageUrl,
      measure_value,
      measure_uuid: imageId,
    });
  } catch (error) {
    console.error("Erro ao processar imagem:", error);
    res.status(500).json({
      error_code: "PROCESSING_ERROR",
      error_description: "Erro ao processar a imagem",
    });
  } finally {
    // Remover o arquivo temporário
    if (fs.existsSync(tempImagePath)) {
      fs.unlinkSync(tempImagePath);
    }
  }
};
