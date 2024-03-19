import { categoryModel } from "../../data";
import { CreateCategoryDto, CustomError, PaginationDto } from "../../domain";
import { UserEntity } from "../../domain/entities/user.entity";

export class CategoryService {
  //DI
  constructor() {}

  createCategory = async (
    createCategoryDto: CreateCategoryDto,
    user: UserEntity
  ) => {
    const categoryExists = await categoryModel.findOne({
      name: createCategoryDto.name,
    });
    if (categoryExists) throw CustomError.badRequest("category already exists");

    try {
      const category = new categoryModel({
        ...createCategoryDto,
        user: user.id,
      });
      await category.save();
      return {
        id: category.id,
        name: category.name,
        available: category.available,
      };
    } catch (error) {
      throw new Error(`internal server error ${error}`);
    }
  };
  getCategory = async (paginationDto: PaginationDto) => {
    const { page, limit } = paginationDto;
    try {
      const [total, categories] = await Promise.all([
        categoryModel.countDocuments(),
        categoryModel
          .find()
          .skip((page - 1) * limit)
          .limit(limit),
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/categories?page=${page + 1}&limit=${limit}`,
        prev:
          page - 1 > 0
            ? `/api/categories?page=${page - 1}&limit=${limit}`
            : null,
        data: categories.map((category) => ({
          id: category.id,
          name: category.name,
          available: category.available,
        })),
      };
    } catch (error) {
      throw CustomError.internalServel(`internal error ${error}`);
    }
  };
}
