import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { FileUploadedController } from "./controller";

export class FilesUploadRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new FileUploadedController();

    //?definir
    //api/upload/single/ >use|category|product>
    //api/upload/multiple/ >use|category|product>

    router.post(`/single/:type`, controller.uploadFile);
    router.post(`/single/:type`, controller.uploadMultipleFiles );

    return router;
  }
}
