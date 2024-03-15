//dar solo la respuesta al cliente.

import { Request, Response } from "express";
import { RegisterUseDto } from "../../domain";
import { AuthService } from "../services/auth.service";

export class AuthController {
  //DI
  constructor(public readonly authService: AuthService) {}
  registerUser = (req: Request, res: Response) => {
    const [error, registerDto] = RegisterUseDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.authService.registerUser(registerDto!).then((result) => {
      res.json(result);
    });
  };

  loginUser = (req: Request, res: Response) => {
    res.json("loginUser");
  };

  validateEmail = (req: Request, res: Response) => {
    res.json("validateEmail");
  };
}
