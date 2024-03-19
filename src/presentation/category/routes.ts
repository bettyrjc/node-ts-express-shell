import { Router } from "express";
import { CategoryController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { CategoryService } from "../services/category.service";

export class CategoryRoutes {
  static get routes(): Router {
    const router = Router();
    const categoryServices = new CategoryService();
    const controller = new CategoryController(categoryServices);

    router.get(`/`, controller.getCategory);
    // el middleware para validar el token se ejecuta antes de llegar al controlador.
    router.post(`/`, [AuthMiddleware.validateJwt], controller.createCategory);

    return router;
  }
}
