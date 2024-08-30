import request from 'supertest';
import { app } from '../../index';
import { getMeasuresByCustomer } from '../../helpers';

jest.mock('../../helpers');

describe('List Controller', () => {
  it('should return 400 for invalid measure_type', async () => {
    const response = await request(app)
      .get('/api/12345/list?measure_type=invalid');

    expect(response.status).toBe(400);
    expect(response.body.error_code).toBe('INVALID_TYPE');
  });

  it('should return 404 if no measures are found', async () => {
    (getMeasuresByCustomer as jest.Mock).mockResolvedValue([]);

    const response = await request(app)
      .get('/api/12345/list');

    expect(response.status).toBe(404);
    expect(response.body.error_code).toBe('MEASURES_NOT_FOUND');
  });

  it('should list the measures successfully', async () => {
    (getMeasuresByCustomer as jest.Mock).mockResolvedValue([
      { measure_uuid: 'uuid1', measure_datetime: '2024-08-29', measure_type: 'WATER', has_confirmed: true, image_url: 'http://imgur.com/someimage' }
    ]);

    const response = await request(app)
      .get('/api/12345/list');

    expect(response.status).toBe(200);
    expect(response.body.measures).toHaveLength(1);
    expect(response.body.measures[0]).toHaveProperty('measure_uuid', 'uuid1');
  });
});
