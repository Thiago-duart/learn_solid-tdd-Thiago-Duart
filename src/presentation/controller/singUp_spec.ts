import { SingUpController } from "./SingUp_controller";
import { EmailValidate } from "./protocols";
import { ServerError, InvalidParamsError, MissingParamsError } from "./errors";

const makeEmailValidatorStub = (): EmailValidate => {
  class EmailValidateStub implements EmailValidate {
    isValid(email: string): boolean {
      return true;
    }
  }
  const emailValidateStub = new EmailValidateStub();
  return emailValidateStub;
};

interface makeSutType {
  sut: SingUpController;
  emailValidateStub: EmailValidate;
}
const makeSut = (): makeSutType => {
  const emailValidateStub = makeEmailValidatorStub();
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
        passwordConfirm: "invalid_password",
      },
    };
    const httpResponse = sut.handle(httpResquest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamsError("Password does not match")
    );
  });
  test("should return 400 if the email is not valid", () => {
    const { sut, emailValidateStub } = makeSut();
    jest.spyOn(emailValidateStub, "isValid").mockReturnValueOnce(false);
    const httpResquest = {
      body: {
        name: "any_name",
        email: "invalid_mail.com",
        password: "any_password",
        passwordConfirm: "any_password",
      },
    };
    const httpResponse = sut.handle(httpResquest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamsError("email"));
  });
  test("should return 400 if the email is not the one passed in the parameter", () => {
    const { sut, emailValidateStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidateStub, "isValid");
    const httpResquest = {
      body: {
        name: "any_name",
        email: "any_mail.com",
        password: "any_password",
        passwordConfirm: "any_password",
      },
    };
    sut.handle(httpResquest);
    expect(isValidSpy).toHaveBeenCalledWith("any_mail.com");
  });
  test("Should return 500 if emailValidate is an exception", () => {
    const { sut, emailValidateStub } = makeSut();
    jest.spyOn(emailValidateStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResquest = {
      body: {
        name: "any_name",
        email: "any_mail.com",
        password: "any_password",
        passwordConfirm: "any_password",
      },
    };
    const httpResponse = sut.handle(httpResquest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});
