import { MissingParamsError } from "./errors/MissingParams_error";
import { badRequest } from "./helpers/http_helper";
import { controller } from "./protocols/controller_interface";
import { httpResponse, httpResquest } from "./protocols/http_interface";

export class SingUp implements controller {
  handle(httpResquest: httpResquest): httpResponse {
    const validats = ["name", "email", "password", "passwordConfirm"];
    for (let errorName of validats) {
      if (!httpResquest.body[errorName]) {
        return badRequest(new MissingParamsError(errorName));
      }
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
