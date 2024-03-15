export class CustomError extends Error {
  private constructor(
    public readonly statusCode: string,
    public readonly message: string
  ) {
    super(message);
  }

  static badRequest(message: string) {
    return new CustomError("400", message);
  }

  static unauthorized(message: string) {
    return new CustomError("401", message);
  }

  static notFound(message: string) {
    return new CustomError("404", message);
  }

  static internalServel(message: string) {
    return new CustomError("500", message);
  }

  static forbidden(message: string) {
    return new CustomError("403", message);
  }
}
