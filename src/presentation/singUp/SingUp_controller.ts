import { AddAccount } from "../../domain/usecases/add_account";
import {
  EmailValidate,
  Controller,
  HttpResponse,
  HttpResquest,
} from "./singUp_protocols";
import { badRequest, ok, serverError } from "../controller/helpers/http_helper";
import {
  ServerError,
  InvalidParamsError,
  MissingParamsError,
} from "../controller/errors";

export class SingUpController implements Controller {
  private readonly emailValidate: EmailValidate;
  private readonly addAccount: AddAccount;

  constructor(emailValidate: EmailValidate, addAccount: AddAccount) {
    this.emailValidate = emailValidate;
    this.addAccount = addAccount;
  }

  async handle(httpResquest: HttpResquest): Promise<HttpResponse> {
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
      const responseAccount = await this.addAccount.add({
        name,
        email,
        password,
      });
      return ok(responseAccount);
    } catch (error) {
      return serverError(new ServerError());
    }
  }
}
