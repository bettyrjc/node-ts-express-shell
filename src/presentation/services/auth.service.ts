//gestor de estados
//manejar la carga pesada

import { CustomError, LoginUserDto, RegisterUseDto } from "../../domain";
import { userModel } from "../../data/mongo/models/user.model";
import { UserEntity } from "../../domain/entities/user.entity";
import { JwtAdapter, bcryptAdapter } from "../../config";

export class AuthService {
  constructor() {}

  public async registerUser(registerUserDto: RegisterUseDto) {
    const existUser = await userModel.findOne({ email: registerUserDto.email });
    if (existUser) return { error: "User already exists" };
    try {
      const user = new userModel(registerUserDto);

      //encriptar la constraseña
      user.password = bcryptAdapter.hash(registerUserDto.password);
      await user.save();
      //JWT <- mantener la auth del user

      //email del usuario
      const { password, ...rest } = UserEntity.fromObject(user);
      return { user: { ...rest }, token: "abc" };
    } catch (e) {
      throw CustomError.internalServel(`${e}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    //FIND ONE
    const user = await userModel.findOne({ email: loginUserDto.email });
    if (!user) throw CustomError.badRequest("Email no exists");
    //IS MATCH PASSWORD
    const isMatching = bcryptAdapter.compare(
      loginUserDto.password,
      user.password
    );
    if (!isMatching) throw CustomError.badRequest("Password is invalid");
    const { password, ...userEntity } = UserEntity.fromObject(user);

    const token =await JwtAdapter.generateToken({ id: user.id });
    if(!token) throw CustomError.internalServel("Error generating token");

    return { user: userEntity, token: token };
  }
}
