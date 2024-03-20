//dar solo la respuesta al cliente.

import { Request, Response } from "express";
import { CustomError } from "../../domain";

export class FileUploadedController {
  //DI
  constructor() // private readonly categoryService: CategoryService
  {}

  private handleError(error: any, res: Response) {
    if (error instanceof CustomError) {
      return res
        .status(Number(error.statusCode))
        .json({ error: error.message });
    }
    return res.status(500).json({ error: `internal server error ${error}` });
  }
  uploadFile = async (req: Request, res: Response) => {
    res.json({ message: "File uploaded successfully" });
  };
  uploadMultipleFiles = async (req: Request, res: Response) => {
    res.json({ message: "multiple uploaded successfully" });
  };
}
