import { HttpResponse } from 'aws-sdk';

export class ResponseHandler {
  /**
   * To return 204 if body is not available otherwise return 200
   * @param body The body of the response object.
   */
  public static success(body?: string): HttpResponse {
    const response = new HttpResponse();
    response.statusCode = body ? 200 : 204;
    response.body = body;
    return response;
  }

  /**
   * To return all failures
   * @param statusCode can be any of 4XX or 5XX
   * @param body may contain a stringfied object
   * @returns
   */
  public static failure(statusCode: number, body: string): HttpResponse {
    const response = new HttpResponse();
    response.statusCode = statusCode;
    response.body = body;
    console.error(body);
    return response;
  }
}
