export class SingUp {
  handle(httpResquest: any) {
    if (!httpResquest.name) {
      return {
        statusCode: 400,
        body: new Error("missing param: name"),
      };
    }
    if (!httpResquest.email) {
      return {
        statusCode: 400,
        body: new Error("missing param: email"),
      };
    }
    if (!httpResquest.password && !httpResquest.passwordConfirm) {
      return {
        statusCode: 400,
        body: new Error("missing param: password"),
      };
    }
    if (httpResquest.password !== httpResquest.passwordConfirm) {
      return {
        statusCode: 400,
        body: new Error("Password does not match"),
      };
    }
    return {};
  }
}
