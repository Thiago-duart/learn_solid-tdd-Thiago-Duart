export class InvalidParamsError extends Error {
  constructor(errorName: string) {
    super(`invalid param: ${errorName}`);
    this.name = "InvalidParamsError";
  }
}
