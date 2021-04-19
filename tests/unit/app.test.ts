import { APIGatewayEvent, Context } from 'aws-lambda';
import { handler } from '../../src/handler';

describe('Application entry', () => {
  let event;
  let context;

  beforeEach(() => {
    event = {} as APIGatewayEvent;
    context = {} as Context;
  });

  afterEach(() => {
    jest.resetAllMocks().restoreAllMocks();
  });

  describe('Handler', () => {
    it('should call the express wrapper', async () => {
      event = { body: 'Test Body' };

      const response = await handler(event, context);
      expect(response.statusCode).toEqual(200);
      expect(typeof response.body).toBe('string');
    });
  });
});
