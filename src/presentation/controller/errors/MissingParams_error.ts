export class MissingParamsError extends Error {
  constructor(errorName: string) {
    super(`missing param: ${errorName}`);
    this.name = "MissingParamsError";
  }
}
