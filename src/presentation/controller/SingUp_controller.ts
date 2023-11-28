import { EmailValidate } from "./protocols/emailValidator_interface";
import { MissingParamsError } from "./errors/MissingParams_error";
import { badRequest } from "./helpers/http_helper";
import { Controller } from "./protocols/controller_interface";
import { HttpResponse, HttpResquest } from "./protocols/http_interface";
import { InvalidParamsError } from "./errors/InvalidParams_error";

export class SingUpController implements Controller {
  private readonly emailValidate: EmailValidate;

  constructor(emailValidate: EmailValidate) {
    this.emailValidate = emailValidate;
  }

  handle(httpResquest: HttpResquest): HttpResponse {
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
    const isValid = this.emailValidate.isValid(httpResquest.body.email);
    if (!isValid) {
      return badRequest(new InvalidParamsError("email"));
    }
    return {
      statusCode: 200,
      body: "",
    };
  }
}
