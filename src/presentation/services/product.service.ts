import { productModel } from "../../data";
import { CustomError, PaginationDto } from "../../domain";
import { CreateProductDto } from "../../domain/dtos";

export class ProductService {
  //DI
  constructor() {}

  createProduct = async (createProductDto: CreateProductDto) => {
    const producExists = await productModel.findOne({
      name: createProductDto.name,
    });
    if (producExists) throw CustomError.badRequest("product already exists");

    try {
      const product = new productModel({
        ...createProductDto,
      });
      await product.save();
      return product;
    } catch (error) {
      throw new Error(`internal server error ${error}`);
    }
  };
  getProducts = async (paginationDto: PaginationDto) => {
    const { page, limit } = paginationDto;
    try {
      const [total, products] = await Promise.all([
        productModel.countDocuments(),
        productModel
          .find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate('user') //llena el campo user con la informacion del usuario
          .populate('category') //llena el campo user con la informacion del usuario
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/products?page=${page + 1}&limit=${limit}`,
        prev:
          page - 1 > 0
            ? `/api/products?page=${page - 1}&limit=${limit}`
            : null,
        data: products,
      };
    } catch (error) {
      throw CustomError.internalServel(`internal error ${error}`);
    }
  };
}
