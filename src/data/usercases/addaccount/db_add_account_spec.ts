import { DbAddAccount } from "./db_add_account";

describe("db_add_account", () => {
  test("should call the encypter with the passed parameters", () => {
    class EncypterStub {
      async encrypt(password: string): Promise<string> {
        return password;
      }
    }
    const encypterStub = new EncypterStub();
    const sut = new DbAddAccount(encypterStub);
    const body = {
      name: "any_name",
      email: "any_mail.com",
      password: "any_password",
    };
    const encypterSpy = jest.spyOn(encypterStub, "encrypt");
    sut.add(body);
    expect(encypterSpy).toHaveBeenCalledWith("any_password");
  });
});
