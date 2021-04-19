// import { HttpResponse } from 'aws-sdk';
export interface HttpResponse {
  body?: unknown;
  statusCode: number;
}

export class ResponseHandler {
  /**
   * To return 204 if body is not available otherwise return 200
   * @param body The body of the response object.
   */
  public static success(body?: string): HttpResponse {
    const response: HttpResponse = {
      statusCode: body ? 200 : 204,
      body,
    };
    return response;
  }

  /**
   * To return all failures
   * @param statusCode can be any of 4XX or 5XX
   * @param body may contain a stringfied object
   * @returns
   */
  public static failure(statusCode: number, body: string): HttpResponse {
    const response = { statusCode, body };
    return response;
  }
}
