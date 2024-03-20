import { Router } from "express";
import { FileUploadedController } from "./controller";
import { FileUploadService } from "../services/file-upload.service";
import { FileUploadMiddleware } from "../middlewares/file-upload.middleware";
import { TypeMiddleware } from "../middlewares/type.middleware";

export class FilesUploadRoutes {
  static get routes(): Router {
    const router = Router();
    const fileUploadService = new FileUploadService();
    const controller = new FileUploadedController(fileUploadService);

    router.use(FileUploadMiddleware.containFile);
    router.use(TypeMiddleware.validateType(["user", "category", "product"]));
    //?definir
    //api/upload/single/ >use|category|product>
    //api/upload/multiple/ >use|category|product>

    router.post(`/single/:type`, controller.uploadFile);
    router.post(`/multiple/:type`, controller.uploadMultipleFiles);

    return router;
  }
}
