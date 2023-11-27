import { SingUp } from "./SingUp_controller";
import { MissingParamsError } from "./errors/MissingParams_error";
describe("SingUp controller", () => {
  test("Should return 400 if no name provided", () => {
    const sut = new SingUp();
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
    const sut = new SingUp();
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
    const sut = new SingUp();
    const httpResquest = {
      body: {
        name: "any_name",
        email: "any_mail.com",
      },
    };
    const httpResponse = sut.handle(httpResquest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamsError("password"));
  });
  test("Should return 400 if password is different from passwordConfirm", () => {
    const sut = new SingUp();
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
});
