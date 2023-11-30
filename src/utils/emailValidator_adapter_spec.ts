import { EmailValidateAdapter } from "./emailValidator_adapter";
import validator from "validator";
const makeSut = () => {
  return new EmailValidateAdapter();
};
jest.mock("validator", () => ({
  isEmail(): boolean {
    return true;
  },
}));
describe("emailValidator adapter", () => {
  test("should return false if email validator returns false", () => {
    const sut = makeSut();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
    const response = sut.isValid("invalid@gmail.com");
    expect(response).toBe(false);
  });
  test("should return true if email validator returns true", () => {
    const sut = makeSut();
    const response = sut.isValid("valid@gmail.com");
    expect(response).toBe(true);
  });
  test("should call the email validation method with sent parameter", () => {
    const sut = makeSut();
    const emailSpy = jest.spyOn(validator, "isEmail");
    sut.isValid("valid@gmail.com");
    expect(emailSpy).toHaveBeenCalledWith("valid@gmail.com");
  });
});
