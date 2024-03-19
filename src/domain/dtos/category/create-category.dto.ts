export class CreateCategoryDto {
  private constructor(
    public readonly name: string,
    public readonly available: string
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateCategoryDto?] {
    const { name, available = false } = object;
    let availableBoolean = available;
    if (!name) {
      return ["missing name"];
    }
    if (typeof availableBoolean !== "boolean") {
      availableBoolean = availableBoolean === "true";
    }

    return [undefined, new CreateCategoryDto(name, availableBoolean)];
  }
}
