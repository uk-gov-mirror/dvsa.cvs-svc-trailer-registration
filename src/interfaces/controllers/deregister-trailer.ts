import { HttpResponse } from 'aws-sdk';
import { ResponseHandler } from '../../utils/response-handler';

export class DeregisterTrailer {
  public deregisterTrailer(trn: string): HttpResponse {
    return ResponseHandler.success();
  }
}
