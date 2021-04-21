import supertest from 'supertest';
import { app } from '../../../src/infrastructure/api';
import { DataAccess } from '../../../src/utils/data-access';

describe('API', () => {
  afterEach(() => {
    jest.resetAllMocks().restoreAllMocks();
  });

  describe('POST /', () => {
    test('should return status code of 204 when inserting a valid trailer registration', async () => {
      const payload = {
        vin: 'ABC1321234566',
        make: 'big truck',
        trn: 'AB123AD',
        certificateExpiryDate: '2021-12-12',
        certificateIssueDate: '2021-01-01',
      };

      const dataInstanceSpy = jest.spyOn(DataAccess, 'getInstance');

      dataInstanceSpy.mockReturnValue({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getByVinOrChassisWithMake: (_vinOrChassisWithMake) => null,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        deregisterTrailer: (_dregisterTrailer) => {},
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        insertTrailerRegisteration: (_insertPayload) => {},
      } as DataAccess);
      return supertest(app).post('/').send(payload).expect(204);
    });
  });

  test('should return status code of 400 when inserting an invalid trailer registration', async () => {
    const payload = {
      vin: 'ABC1321234566',
      make: 'big truck',
      certificateExpiryDate: '2021-12-12',
      certificateIssueDate: '2021-01-01',
    };

    const dataInstanceSpy = jest.spyOn(DataAccess, 'getInstance');

    dataInstanceSpy.mockReturnValue({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getByVinOrChassisWithMake: (_vinOrChassisWithMake) => null,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      deregisterTrailer: (_dregisterTrailer) => {},
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      insertTrailerRegisteration: (_insertPayload) => {},
    } as DataAccess);
    const result = await supertest(app).post('/').send(payload);
    expect(result.status).toEqual(400);
    expect(result.text).toEqual('"trn" is required');
  });
});
