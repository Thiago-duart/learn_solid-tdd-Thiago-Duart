import { HttpResponse } from "../protocols/http_interface";

export const badRequest = (error: Error): HttpResponse => {
  return {
    statusCode: 400,
    body: error,
  };
};
