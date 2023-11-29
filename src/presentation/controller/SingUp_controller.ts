import { AddAccount } from "../../domain/usecases/add_account";
import { EmailValidate, Controller } from "./protocols";
import { badRequest, serverError } from "./helpers/http_helper";
import { HttpResponse, HttpResquest } from "./protocols/http_interface";
import { ServerError, InvalidParamsError, MissingParamsError } from "./errors";

export class SingUpController implements Controller {
  private readonly emailValidate: EmailValidate;
  private readonly addAccount: AddAccount;

  constructor(emailValidate: EmailValidate, addAccount: AddAccount) {
    this.emailValidate = emailValidate;
    this.addAccount = addAccount;
  }

  handle(httpResquest: HttpResquest): HttpResponse {
    const { name, email, password, passwordConfirm } = httpResquest.body;
    try {
      const validats = ["name", "email", "password", "passwordConfirm"];
      for (let errorName of validats) {
        if (!httpResquest.body[errorName]) {
          return badRequest(new MissingParamsError(errorName));
        }
      }
      if (password !== passwordConfirm) {
        return badRequest(new InvalidParamsError("Password does not match"));
      }
      const isValid = this.emailValidate.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamsError("email"));
      }
      const responseAccount = this.addAccount.add({ name, email, password });
      return {
        statusCode: 1,
        body: {},
      };
    } catch (error) {
      return serverError(new ServerError());
    }
  }
}
