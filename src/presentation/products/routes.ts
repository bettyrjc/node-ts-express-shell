import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { ProductController } from "./controller";
import { ProductService } from "../services/product.service";

export class ProductRoutes {
  static get routes(): Router {
    const router = Router();
    const productServices = new ProductService();

    const controller = new ProductController(productServices);

    router.get(`/`, controller.getProducts);
    // // el middleware para validar el token se ejecuta antes de llegar al controlador.
    router.post(`/`, [AuthMiddleware.validateJwt], controller.createProduct);

    return router;
  }
}
