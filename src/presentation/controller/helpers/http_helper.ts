import { AccountModel } from "../../../domain/models/account";
import { HttpResponse } from "../protocols/http_interface";

export const badRequest = (error: Error): HttpResponse => {
  return {
    statusCode: 400,
    body: error,
  };
};

export const serverError = (error: Error): HttpResponse => {
  return {
    statusCode: 500,
    body: error,
  };
};

export const ok = (accountData: AccountModel): HttpResponse => {
  return {
    statusCode: 200,
    body: accountData,
  };
};
