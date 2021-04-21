import { APIGatewayEvent, APIGatewayProxyEvent, Context } from 'aws-lambda';
import { handler } from '../../src/handler';
import { DataAccess } from '../../src/utils/data-access';

describe('Application entry', () => {
  let event: APIGatewayProxyEvent;
  let context: Context;

  beforeEach(() => {
    event = {} as APIGatewayEvent;
    context = {} as Context;
  });

  afterEach(() => {
    jest.resetAllMocks().restoreAllMocks();
  });

  describe('Handler', () => {
    it('should initialize and call the correct route on express wrapper', async () => {
      const payload = {
        vin: 'ABC1321234566',
        make: 'big truck',
        trn: 'AB123AD',
        certificateExpiryDate: '2021-12-12',
        certificateIssueDate: '2021-01-01',
      };
      event = ({
        headers: {
          Accept: 'application/json',
          Host: 'localhost:3020',
          Connection: 'keep-alive',
        },
        httpMethod: 'POST',
        path: '/local/cvs-svc-trailer-registration/',
        body: JSON.stringify(payload),
      } as unknown) as APIGatewayProxyEvent;
      try {
        const dataInstanceSpy = jest.spyOn(DataAccess, 'getInstance');

        dataInstanceSpy.mockReturnValue({
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          getByVinOrChassisWithMake: (_vinOrChassisWithMake) => null,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          deregisterTrailer: (_dregisterTrailer) => {},
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          insertTrailerRegisteration: (_insertPayload) => {},
        } as DataAccess);

        const response = await handler(event, context);
        expect(response.statusCode).toEqual(204);
      } catch (err) {
        console.log(err);
      }
    });
  });
});
