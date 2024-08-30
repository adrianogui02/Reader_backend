import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

export const uploadImageToImgur = async (imageBase64: string): Promise<string> => {
  try {
    const response = await axios.post(
      "https://api.imgur.com/3/image",
      {
        image: imageBase64,
        type: "base64",
      },
      {
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
        },
      }
    );

    return response.data.data.link; // Retorna o link da imagem no Imgur
  } catch (error) {
    console.error("Erro ao fazer upload para o Imgur, foi gerado um link genérico:", 
       {
      error_code: "INVALID_IMGUR_CLIENT_ID",
      error_description: "Imgur client id inválido."});
    // Retorna um link genérico em caso de falha
    return "https://your-storage-service.com/generic-image.jpg";
  }
};
