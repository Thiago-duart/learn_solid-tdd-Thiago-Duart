import { SingUpController } from "./SingUp_controller";
import { EmailValidate } from "./singUp_protocols";
import {
  ServerError,
  InvalidParamsError,
  MissingParamsError,
} from "../controller/errors";
import { AddAccount, AddAccountModel } from "../../domain/usecases/add_account";
import { AccountModel } from "../../domain/models/account";

const makeAddAccountStub = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 1,
        name: "valid_name",
        email: "valid_mail.com",
        password: "valid_password",
      };
      return fakeAccount;
    }
  }
  return new AddAccountStub();
};
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
  addAccountStub: AddAccount;
}
const makeSut = (): makeSutType => {
  const addAccountStub = makeAddAccountStub();
  const emailValidateStub = makeEmailValidatorStub();
  const sut = new SingUpController(emailValidateStub, addAccountStub);
  return { sut, emailValidateStub, addAccountStub };
};

describe("SingUp controller", () => {
  test("Should return 400 if no name provided", async () => {
    const { sut } = makeSut();
    const httpResquest = {
      body: {
        email: "any_mail.com",
        password: "any_password",
        passwordConfirm: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpResquest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamsError("name"));
  });
  test("Should return 400 if no email provided", async () => {
    const { sut } = makeSut();
    const httpResquest = {
      body: {
        name: "any_name",
        password: "any_password",
        passwordConfirm: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpResquest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamsError("email"));
  });
  test("Should return 400 if no password provided", async () => {
    const { sut } = makeSut();
    const httpResquest = {
      body: {
        name: "any_name",
        email: "any_mail.com",
        passwordConfirm: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpResquest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamsError("password"));
  });
  test("Should return 400 if no passwordConfirm provided", async () => {
    const { sut } = makeSut();
    const httpResquest = {
      body: {
        name: "any_name",
        email: "any_mail.com",
        password: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpResquest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamsError("passwordConfirm")
    );
  });
  test("Should return 400 if password is different from passwordConfirm", async () => {
    const { sut } = makeSut();
    const httpResquest = {
      body: {
        name: "any_name",
        email: "any_mail.com",
        password: "any_password",
        passwordConfirm: "invalid_password",
      },
    };
    const httpResponse = await sut.handle(httpResquest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamsError("Password does not match")
    );
  });
  test("should return 400 if the email is not valid", async () => {
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
    const httpResponse = await sut.handle(httpResquest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamsError("email"));
  });
  test("should return 400 if the email is not the one passed in the parameter", async () => {
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
    await sut.handle(httpResquest);
    expect(isValidSpy).toHaveBeenCalledWith("any_mail.com");
  });
  test("Should return 500 if emailValidate is an exception", async () => {
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
    const httpResponse = await sut.handle(httpResquest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
  test("should return 400 if the email is not the one passed in the parameter", async () => {
    const { sut, addAccountStub } = makeSut();
    const addAccountStubSpy = jest.spyOn(addAccountStub, "add");
    const httpResquest = {
      body: {
        name: "any_name",
        email: "any_mail.com",
        password: "any_password",
        passwordConfirm: "any_password",
      },
    };
    await sut.handle(httpResquest);
    expect(addAccountStubSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_mail.com",
      password: "any_password",
    });
  });
  test("Should return 500 if emailValidate is an exception", async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, "add").mockImplementationOnce(() => {
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
    const httpResponse = await sut.handle(httpResquest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
  test("should return 200 and returns the body ", async () => {
    const { sut } = makeSut();
    const httpResquest = {
      body: {
        name: "any_name",
        email: "invalid_mail.com",
        password: "any_password",
        passwordConfirm: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpResquest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: 1,
      name: "valid_name",
      email: "valid_mail.com",
      password: "valid_password",
    });
  });
});
