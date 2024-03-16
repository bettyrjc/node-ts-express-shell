//gestor de estados
//manejar la carga pesada

import { CustomError, RegisterUseDto } from "../../domain";
import { userModel } from "../../data/mongo/models/user.model";
import { UserEntity } from "../../domain/entities/user.entity";
import { bcryptAdapter } from "../../config";

export class AuthService {
  constructor() {}

  public async registerUser(registerUserDto: RegisterUseDto) {
    const existUser = await userModel.findOne({ email: registerUserDto.email });
    if (existUser) return { error: "User already exists" };
    try {
      const user = new userModel(registerUserDto);
      
      //encriptar la constraseña
      user.password = bcryptAdapter.hash(registerUserDto.password)
      await user.save();
      //JWT <- mantener la auth del user

      //email del usuario
      const { password, ...rest } = UserEntity.fromObject(user);
      return { user: { ...rest }, token: "abc" };
    } catch (e) {
      throw CustomError.internalServel(`${e}`);
    }
  }
}
