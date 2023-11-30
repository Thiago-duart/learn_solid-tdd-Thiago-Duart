import { EmailValidate } from "../presentation/controller/protocols/emailValidator_interface";
import validator from "validator";
export class EmailValidateAdapter implements EmailValidate {
  isValid(email: string): boolean {
    return validator.isEmail(email);
  }
}
