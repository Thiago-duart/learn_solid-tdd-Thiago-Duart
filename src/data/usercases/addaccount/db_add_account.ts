import { Encrypter } from "./protocols/encrypter_interface";
import { AccountModel } from "../../../domain/models/account";
import {
  AddAccount,
  AddAccountModel,
} from "../../../domain/usecases/add_account";

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;
  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter;
  }
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    this.encrypter.encrypt(accountData.password);
    return { id: 1, ...accountData };
  }
}
