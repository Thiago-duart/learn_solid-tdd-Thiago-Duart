import { EmailValidate, Controller } from "./protocols";
import { badRequest, serverError } from "./helpers/http_helper";
import { HttpResponse, HttpResquest } from "./protocols/http_interface";
import { ServerError, InvalidParamsError, MissingParamsError } from "./errors";

export class SingUpController implements Controller {
  private readonly emailValidate: EmailValidate;

  constructor(emailValidate: EmailValidate) {
    this.emailValidate = emailValidate;
  }

  handle(httpResquest: HttpResquest): HttpResponse {
    try {
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
        statusCode: 1,
        body: {},
      };
    } catch (error) {
      return serverError(new ServerError());
    }
  }
}
