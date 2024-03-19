//dar solo la respuesta al cliente.

import { Request, Response } from "express";
import { CreateCategoryDto, CustomError } from "../../domain";
import { CategoryService } from "../services/category.service";
import { PaginationDto } from "../../domain/dtos";

export class CategoryController {
  //DI
  constructor(private readonly categoryService: CategoryService) {}

  private handleError(error: any, res: Response) {
    if (error instanceof CustomError) {
      return res
        .status(Number(error.statusCode))
        .json({ error: error.message });
    }
    return res.status(500).json({ error: `internal server error ${error}` });
  }
  createCategory = async (req: Request, res: Response) => {
    const [error, createCategoryDto] = CreateCategoryDto.create(req.body);
    if (error) res.status(400).json({ error });

    this.categoryService
      .createCategory(createCategoryDto!, req.body.user)
      .then((category) => res.status(201).json(category))
      .catch((error) => this.handleError(error, res));
  };
  getCategory = async (req: Request, res: Response) => {
    const { page = 1, limit = 5 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if(error) res.status(400).json({error});

    this.categoryService
      .getCategory(paginationDto!)
      .then((categories) => res.status(200).json(categories))
      .catch((error) => this.handleError(error, res));
  };
}
