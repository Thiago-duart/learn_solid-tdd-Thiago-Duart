import { EmailValidateAdapter } from "./emailValidator_adapter";

describe("emailValidator adapter", () => {
  test("should return false if email validator returns false", () => {
    const sut = new EmailValidateAdapter();
    const response = sut.isValid("invalid@gmail.com");
    expect(response).toBe(false);
  });
  test("should return true if email validator returns true", () => {
    const sut = new EmailValidateAdapter();
    const response = sut.isValid("valid@gmail.com");
    expect(response).toBe(true);
  });
});
