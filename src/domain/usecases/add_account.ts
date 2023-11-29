import { AccountModel } from "../models/account";

export interface AddAccountModel {
  name: "valid_name";
  email: "valid_mail.com";
  password: "valid_password";
}
export interface AddAccount {
  add(accountData: AddAccountModel): Promise<AccountModel>;
}
