import { EmailValidate } from "../presentation/controller/protocols/emailValidator_interface";
export class EmailValidateAdapter implements EmailValidate {
  isValid(email: string): boolean {
    return false;
  }
}
