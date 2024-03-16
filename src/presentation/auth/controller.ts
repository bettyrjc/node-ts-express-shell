//dar solo la respuesta al cliente.

import { Request, Response } from "express";
import { CustomError, RegisterUseDto } from "../../domain";
import { AuthService } from "../services/auth.service";

export class AuthController {
  //DI
  constructor(public readonly authService: AuthService) {}

  private handleError(error: any, res: Response) {
    if (error instanceof CustomError) {
      return res.status(Number(error.statusCode)).json({ error: error.message });
    }
    return res.status(500).json({ error: `internal server error ${error}` });
  }
  registerUser = (req: Request, res: Response) => {
    const [error, registerDto] = RegisterUseDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.authService.registerUser(registerDto!).then((result) => {
      res.json(result);
    })
    .catch((error) => this.handleError(error, res));
  };

  loginUser = (req: Request, res: Response) => {
    res.json("loginUser");
  };

  validateEmail = (req: Request, res: Response) => {
    res.json("validateEmail");
  };
}
