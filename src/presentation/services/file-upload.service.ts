import { UploadedFile } from "express-fileupload";
import path from "path";
import fs from "fs";
import { Uuid } from "../../config/uuid.adapter";
import { CustomError } from "../../domain";

export class FileUploadService {
  constructor(private readonly uuid = Uuid.v4) {}

  private checkFolder(folderPath: string) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  }

  async uploadSingle(
    file: UploadedFile,
    folder: string = "uploads",
    validExtensions: string[] = ["png", "jpg", "jpeg", "gif"]
  ) {
    try {
      console.log(file);
      const fileExtension = file.mimetype.split("/").at(1) ?? "";

      if (!validExtensions.includes(fileExtension))
        throw CustomError.badRequest(
          `Invalid file extension: ${fileExtension}`
        );

      const destination = path.resolve(__dirname, `../../../`, folder);
      this.checkFolder(destination);

      const fileName = `${this.uuid()}.${fileExtension}`;
      file.mv(`${destination}/${fileName}`);
      return { fileName };
    } catch (error) {
      throw error;
    }
  }
  async uploadMultiple(
    files: any[],
    folder: string = "uploads",
    validExtensions: string[] = ["png", "jpg", "jpeg", "gif"]
  ) {
    const filesName = await Promise.all(
      files.map(async (file) => {
        return await this.uploadSingle(file, folder, validExtensions);
      })
    );
    return filesName
  }
}
