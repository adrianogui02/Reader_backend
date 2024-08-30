import request from 'supertest';
import { app } from '../../index'; // Certifique-se de que o caminho está correto
import { uploadImageToImgur } from '../../helpers/imageHelper';
import { checkExistingReading } from '../../helpers/dbHelper';
import { interactWithImage, extractNumericValue } from '../../lib/gemini';

jest.mock('../../helpers/imageHelper');
jest.mock('../../helpers/dbHelper');
jest.mock('../../lib/gemini');

describe('Upload Controller', () => {
  it('should return 400 if required fields are missing', async () => {
    const response = await request(app)
      .post('/api/upload')
      .send({
        customer_code: '12345',
        measure_datetime: '2024-08-29T00:00:00Z',
        measure_type: 'WATER',
      });

    expect(response.status).toBe(400);
    expect(response.body.error_code).toBe('INVALID_DATA');
  });

  it('should return 409 if a reading already exists for the month', async () => {
    (checkExistingReading as jest.Mock).mockResolvedValue(true);

    const response = await request(app)
      .post('/api/upload')
      .send({
        image: 'base64_encoded_image_string',
        customer_code: '12345',
        measure_datetime: '2024-08-29T00:00:00Z',
        measure_type: 'WATER',
      });

    expect(response.status).toBe(409);
    expect(response.body.error_code).toBe('DOUBLE_REPORT');
  });

  it('should process the image and save the reading', async () => {
    (checkExistingReading as jest.Mock).mockResolvedValue(false);
    (uploadImageToImgur as jest.Mock).mockResolvedValue('http://imgur.com/someimage');
    (interactWithImage as jest.Mock).mockResolvedValue('Water meter: 1234');
    (extractNumericValue as jest.Mock).mockReturnValue(1234);

    const response = await request(app)
      .post('/api/upload')
      .send({
        image: 'base64_encoded_image_string',
        customer_code: '12345',
        measure_datetime: '2024-08-29T00:00:00Z',
        measure_type: 'WATER',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('image_url', 'http://imgur.com/someimage');
    expect(response.body).toHaveProperty('measure_value', 1234);
    expect(response.body).toHaveProperty('measure_uuid');
  });
});
