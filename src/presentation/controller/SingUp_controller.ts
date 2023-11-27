import { MissingParamsError } from "./errors/MissingParams_error";
import { badRequest } from "./helpers/http_helper";
import { controller } from "./protocols/controller_interface";
import { httpResponse, httpResquest } from "./protocols/http_interface";

export class SingUp implements controller {
  handle(httpResquest: httpResquest): httpResponse {
    if (!httpResquest.body.name) {
      return badRequest(new MissingParamsError("name"));
    }
    if (!httpResquest.body.email) {
      return {
        statusCode: 400,
        body: new Error("missing param: email"),
      };
    }
    if (!httpResquest.body.password && !httpResquest.body.passwordConfirm) {
      return {
        statusCode: 400,
        body: new Error("missing param: password"),
      };
    }
    if (httpResquest.body.password !== httpResquest.body.passwordConfirm) {
      return {
        statusCode: 400,
        body: new Error("Password does not match"),
      };
    }
    return {
      statusCode: 200,
      body: "",
    };
  }
}
