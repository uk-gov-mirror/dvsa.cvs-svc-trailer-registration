import { Request } from 'jest-express/lib/request';
import { NextFunction } from 'jest-express/lib/next';
import { Response } from 'jest-express/lib/response';
import * as express from 'express';
import { DataAccess } from '../../../../src/utils/data-access';
import { InsertTrailerRegistration } from '../../../../src/interfaces/controllers/insert-trailer-registration';
import { HTTPError } from '../../../../src/domain/http-error';
// eslint-disable-next-line global-require
jest.mock('express', () => require('jest-express'));
describe('Insert Trailer Controller', () => {
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: NextFunction;
  let insertRegistrationTrailer: InsertTrailerRegistration;

  beforeEach(() => {
    mockRequest = new Request();
    mockResponse = new Response();
    mockNext = jest.fn();
    insertRegistrationTrailer = new InsertTrailerRegistration();
  });

  afterEach(() => {
    mockRequest.resetMocked();
    mockResponse.resetMocked();
    jest.resetAllMocks().restoreAllMocks();
  });

  describe('insertTrailerRegistration', () => {
    test('should insert and call 204 status for valid payload', async () => {
      const payload = {
        vin: 'ABC1321234566',
        make: 'big truck',
        trn: 'AB123AD',
        certificateExpiryDate: '2021-12-12',
        certificateIssueDate: '2021-01-01',
      };
      mockRequest.setBody(payload);

      const dataInstanceSpy = jest.spyOn(DataAccess, 'getInstance');

      dataInstanceSpy.mockReturnValue({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getByVinOrChassisWithMake: (_vinOrChassisWithMake) => null,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        deregisterTrailer: (_dregisterTrailer) => {},
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        insertTrailerRegisteration: (_insertPayload) => {},
      } as DataAccess);

      await insertRegistrationTrailer.call(
        (mockRequest as unknown) as express.Request,
        (mockResponse as unknown) as express.Response,
        mockNext,
      );
      expect(mockResponse.statusCode).toEqual(204);
    });

    test('should deregister if an existing registration is found and insert new and return 204 status for valid payload', async () => {
      const payload = {
        vin: 'ABC1321234566',
        make: 'big truck',
        trn: 'AB123AD',
        certificateExpiryDate: '2021-12-12',
        certificateIssueDate: '2021-01-01',
      };
      mockRequest.setBody(payload);

      const dataInstanceSpy = jest.spyOn(DataAccess, 'getInstance');

      dataInstanceSpy.mockReturnValue(({
        getByVinOrChassisWithMake: () => Promise.resolve([
          {
            vinOrChassisWithMake: 'ABC1321234566big truck',
            vin: 'ABC1321234566',
            make: 'big truck',
            trn: 'AB123AD',
            certificateExpiryDate: '2021-12-12',
            certificateIssueDate: '2021-01-01',
          },
        ]),
        deregisterTrailer: () => {},
        insertTrailerRegisteration: () => {},
      } as unknown) as DataAccess);
      await insertRegistrationTrailer.call(
        (mockRequest as unknown) as express.Request,
        (mockResponse as unknown) as express.Response,
        mockNext,
      );
      expect(mockResponse.statusCode).toEqual(204);
    });

    test('should call next if getByVinOrChassisWithMake throws error', async () => {
      const payload = {
        vin: 'ABC1321234566',
        make: 'big truck',
        certificateExpiryDate: '2021-12-12',
        certificateIssueDate: '2021-01-01',
      };
      mockRequest.setBody(payload);

      await insertRegistrationTrailer.call(
        (mockRequest as unknown) as express.Request,
        (mockResponse as unknown) as express.Response,
        mockNext,
      );

      const dataInstanceSpy = jest.spyOn(DataAccess, 'getInstance');

      dataInstanceSpy.mockReturnValue(({
        getByVinOrChassisWithMake: () => Promise.reject(new HTTPError(500, 'some error')),
        deregisterTrailer: () => {},
        insertTrailerRegisteration: () => {},
      } as unknown) as DataAccess);
      await insertRegistrationTrailer.call(
        (mockRequest as unknown) as express.Request,
        (mockResponse as unknown) as express.Response,
        mockNext,
      );
      expect(mockNext).toHaveBeenCalledWith(new HTTPError(500, 'some error'));
    });
    test('should call next if insert throws error', async () => {
      const payload = {
        vin: 'ABC1321234566',
        make: 'big truck',
        certificateExpiryDate: '2021-12-12',
        certificateIssueDate: '2021-01-01',
      };
      mockRequest.setBody(payload);

      await insertRegistrationTrailer.call(
        (mockRequest as unknown) as express.Request,
        (mockResponse as unknown) as express.Response,
        mockNext,
      );

      const dataInstanceSpy = jest.spyOn(DataAccess, 'getInstance');

      dataInstanceSpy.mockReturnValue(({
        getByVinOrChassisWithMake: () => null,
        deregisterTrailer: () => {},
        insertTrailerRegisteration: () => Promise.reject(new HTTPError(500, 'some error')),
      } as unknown) as DataAccess);
      await insertRegistrationTrailer.call(
        (mockRequest as unknown) as express.Request,
        (mockResponse as unknown) as express.Response,
        mockNext,
      );
      expect(mockNext).toHaveBeenCalledWith(new HTTPError(500, 'some error'));
    });
  });
});
