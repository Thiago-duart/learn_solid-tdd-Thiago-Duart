import { MissingParamsError } from "../errors/MissingParams_error";
import { httpResponse } from "../protocols/http_interface";

export const badRequest = (error: Error): httpResponse => {
  return {
    statusCode: 400,
    body: error,
  };
};
