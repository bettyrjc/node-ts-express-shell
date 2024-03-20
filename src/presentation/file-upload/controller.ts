//dar solo la respuesta al cliente.

import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { FileUploadService } from "../services/file-upload.service";
import { UploadedFile } from "express-fileupload";

export class FileUploadedController {
  //DI
  constructor(private readonly fileUploadService: FileUploadService) {}

  private handleError(error: any, res: Response) {
    if (error instanceof CustomError) {
      return res
        .status(Number(error.statusCode))
        .json({ error: error.message });
    }
    return res.status(500).json({ error: `internal server error ${error}` });
  }
  uploadFile = async (req: Request, res: Response) => {
    const type = req.params.type;
    const file = req.body.files.at(0) as UploadedFile;
    this.fileUploadService
      .uploadSingle(file, `uploads/${type}`)
      .then((uploaded) => res.json(uploaded))
      .catch((error) => this.handleError(error, res));
  };
  uploadMultipleFiles = async (req: Request, res: Response) => {
    const type = req.params.type;
    const validTypes = ["user", "category", "product"];
    if(!validTypes.includes(type)) return res.status(400).json({error: "Invalid type"});

    const files = req.body.files as UploadedFile[];
    this.fileUploadService
      .uploadMultiple(files, `uploads/${type}`)
      .then((uploaded) => res.json(uploaded))
      .catch((error) => this.handleError(error, res));
  };
}
