import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEY } from "./config";
import fs from "fs";

const googleAI = new GoogleGenerativeAI(API_KEY);

  
const geminiModel = googleAI.getGenerativeModel({
    model: 'gemini-1.5-flash',

});
  
export const interactWithImage = async (filePath: string): Promise<string> => {
    try {
      const imageBase64 = fs.readFileSync(filePath).toString("base64");
  
      const promptConfig = [
        { text: "Extract the numeric value from the image" },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageBase64,
          },
        },
      ];
  
      const result = await geminiModel.generateContent({
        contents: [{ role: "user", parts: promptConfig }],
      });
  
      return result.response.text();
    } catch (error) {
      console.log("Erro ao interagir com imagem:", error);
      throw new Error("Erro ao interagir com imagem");
    }
  };
  
  export const extractNumericValue = (text: string): number => {
    const match = text.match(/\d+/g);
    if (match) {
      return parseInt(match[0], 10);
    }
    throw new Error("Nenhum valor numérico encontrado na resposta");
  };
  
