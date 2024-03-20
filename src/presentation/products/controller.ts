//dar solo la respuesta al cliente.

import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { CreateProductDto, PaginationDto } from "../../domain/dtos";
import { ProductService } from "../services/product.service";

export class ProductController {
  //DI
  constructor(private readonly productService: ProductService) {} //TODO:

  private handleError(error: any, res: Response) {
    if (error instanceof CustomError) {
      return res
        .status(Number(error.statusCode))
        .json({ error: error.message });
    }
    return res.status(500).json({ error: `internal server error ${error}` });
  }
  createProduct = async (req: Request, res: Response) => {
    const [error, createProductDto] = CreateProductDto.create({
      ...req.body,
      user: req.body.user.id, //because we have a middleware that adds the user to the request
    });
    if (error) res.status(400).json({ error });

    this.productService
      .createProduct(createProductDto!)
      .then((product) => res.status(201).json(product))
      .catch((error) => this.handleError(error, res));
      
  };
  getProducts = async (req: Request, res: Response) => {
    const { page = 1, limit = 5 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) res.status(400).json({ error });

    this.productService
      .getProducts(paginationDto!)
      .then((products) => res.status(200).json(products))
      .catch((error) => this.handleError(error, res));
  };
}
