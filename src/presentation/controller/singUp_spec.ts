import { SingUpController } from "./SingUp_controller";
import { InvalidParamsError } from "./errors/InvalidParams_error";
import { MissingParamsError } from "./errors/MissingParams_error";
import { EmailValidate } from "./protocols/emailValidator_interface";

interface makeSutType {
  sut: SingUpController;
  emailValidateStub: EmailValidate;
}

const makeSut = (): makeSutType => {
  class EmailValidateStub implements EmailValidate {
    isValid(email: string): boolean {
      return true;
    }
  }
  const emailValidateStub = new EmailValidateStub();
  const sut = new SingUpController(emailValidateStub);
  return { sut, emailValidateStub };
};

describe("SingUp controller", () => {
  test("Should return 400 if no name provided", () => {
    const { sut } = makeSut();
    const httpResquest = {
      body: {
        email: "any_mail.com",
        password: "any_password",
        passwordConfirm: "any_password",
      },
    };
    const httpResponse = sut.handle(httpResquest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamsError("name"));
  });
  test("Should return 400 if no email provided", () => {
    const { sut } = makeSut();
    const httpResquest = {
      body: {
        name: "any_name",
        password: "any_password",
        passwordConfirm: "any_password",
      },
    };
    const httpResponse = sut.handle(httpResquest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamsError("email"));
  });
  test("Should return 400 if no password provided", () => {
    const { sut } = makeSut();
    const httpResquest = {
      body: {
        name: "any_name",
        email: "any_mail.com",
        passwordConfirm: "any_password",
      },
    };
    const httpResponse = sut.handle(httpResquest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamsError("password"));
  });
  test("Should return 400 if no passwordConfirm provided", () => {
    const { sut } = makeSut();
    const httpResquest = {
      body: {
        name: "any_name",
        email: "any_mail.com",
        password: "any_password",
      },
    };
    const httpResponse = sut.handle(httpResquest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamsError("passwordConfirm")
    );
  });
  test("Should return 400 if password is different from passwordConfirm", () => {
    const { sut } = makeSut();
    const httpResquest = {
      body: {
        name: "any_name",
        email: "any_mail.com",
        password: "any_password",
        passwordConfirm: "any_passwordConfirm",
      },
    };
    const httpResponse = sut.handle(httpResquest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new Error("Password does not match"));
  });
  test("should return 400 if the email is not valid", () => {
    const { sut, emailValidateStub } = makeSut();
    jest.spyOn(emailValidateStub, "isValid").mockReturnValueOnce(false);
    const httpResquest = {
      body: {
        name: "any_name",
        email: "any_mail.com",
        password: "any_password",
        passwordConfirm: "any_password",
      },
    };
    const httpResponse = sut.handle(httpResquest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamsError("email"));
  });
});
