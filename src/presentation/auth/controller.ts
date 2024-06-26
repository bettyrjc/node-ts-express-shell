//dar solo la respuesta al cliente.

import { Request, Response } from "express";
import { CustomError, LoginUserDto, RegisterUseDto } from "../../domain";
import { AuthService } from "../services/auth.service";

export class AuthController {
  //DI
  constructor(public readonly authService: AuthService) {}

  private handleError(error: any, res: Response) {
    if (error instanceof CustomError) {
      return res
        .status(Number(error.statusCode))
        .json({ error: error.message });
    }
    return res.status(500).json({ error: `internal server error ${error}` });
  }
  registerUser = (req: Request, res: Response) => {
    const [error, registerDto] = RegisterUseDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.authService
      .registerUser(registerDto!)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => this.handleError(error, res));
  };

  loginUser = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.authService
      .loginUser(loginUserDto!)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => this.handleError(error, res));
  };

  validateEmail = (req: Request, res: Response) => {
    const { token } = req.params;

    this.authService
      .validateEmail(token)
      .then(() => res.json("Email was validated properly"))
      .catch((error) => this.handleError(error, res));
  };
}
