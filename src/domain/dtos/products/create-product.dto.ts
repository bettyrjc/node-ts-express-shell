import { Validators } from "../../../config/validators";

export class CreateProductDto {
  private constructor(
    public readonly name: string,
    public readonly available: string,
    public readonly price: number,
    public readonly description: string,
    public readonly user: string, //id del usuario que crea el producto
    public readonly category: string //id de la categoria a la que pertenece el producto
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateProductDto?] {
    const {
      name,
      available = false,
      price,
      description,
      user,
      category,
    } = props;
    let availableBoolean = available;

    if (!name) return ["missing name"];
    if (!user) return ["missing user"];
    if (Validators.isMongoId(user) === false) return ["invalid usermongo id"];
    if (!category) return ["missing category"];
    if (Validators.isMongoId(category) === false) return ["invalid mongo user id"];

    if (!price) return ["missing price"];

    if (typeof availableBoolean !== "boolean") {
      availableBoolean = availableBoolean === "true";
    }

    return [
      undefined,
      new CreateProductDto(
        name,
        availableBoolean,
        price,
        description,
        user,
        category
      ),
    ];
  }
}
