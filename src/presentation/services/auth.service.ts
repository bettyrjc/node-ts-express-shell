//gestor de estados
//manejar la carga pesada

import { RegisterUseDto } from "../../domain";
import { userModel } from "../../data/mongo/models/user.model";

export class AuthService {
  constructor(
  ) {}

  public async registerUser(registerUserDto: RegisterUseDto) {
    const existUser = await userModel.findOne({ email: registerUserDto.email });
    if (existUser) return { error: "User already exists" };
    return "todo ok";
  }
}
