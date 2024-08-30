import request from 'supertest';
import { app }  from '../../index';
import { getReadingByUuid, confirmMeasure } from '../../helpers';

jest.mock('../../helpers');

describe('Confirm Controller', () => {
  it('should return 400 if required fields are missing', async () => {
    const response = await request(app)
      .patch('/api/confirm')
      .send({
        confirmed_value: 5678,
      });

    expect(response.status).toBe(400);
    expect(response.body.error_code).toBe('INVALID_DATA');
  });

  it('should return 404 if the reading does not exist', async () => {
    (getReadingByUuid as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .patch('/api/confirm')
      .send({
        measure_uuid: 'some-uuid',
        confirmed_value: 5678,
      });

    expect(response.status).toBe(404);
    expect(response.body.error_code).toBe('MEASURE_NOT_FOUND');
  });

  it('should return 409 if the reading has already been confirmed', async () => {
    (getReadingByUuid as jest.Mock).mockResolvedValue({ has_confirmed: true });

    const response = await request(app)
      .patch('/api/confirm')
      .send({
        measure_uuid: 'some-uuid',
        confirmed_value: 5678,
      });

    expect(response.status).toBe(409);
    expect(response.body.error_code).toBe('CONFIRMATION_DUPLICATE');
  });

  it('should confirm the reading successfully', async () => {
    (getReadingByUuid as jest.Mock).mockResolvedValue({ has_confirmed: false });
    (confirmMeasure as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app)
      .patch('/api/confirm')
      .send({
        measure_uuid: 'some-uuid',
        confirmed_value: 5678,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
  });
});
