//gestor de estados
//manejar la carga pesada

import { CustomError, LoginUserDto, RegisterUseDto } from "../../domain";
import { userModel } from "../../data/mongo/models/user.model";
import { UserEntity } from "../../domain/entities/user.entity";
import { JwtAdapter, bcryptAdapter, envs } from "../../config";
import { EmailService } from "./email.service";

export class AuthService {
  constructor(private readonly emailService: EmailService) {}

  public async registerUser(registerUserDto: RegisterUseDto) {
    const existUser = await userModel.findOne({ email: registerUserDto.email });
    if ( existUser ) throw CustomError.badRequest('Email already exist');
    try {
      const user = new userModel(registerUserDto);

      //encriptar la constraseña
      user.password = bcryptAdapter.hash(registerUserDto.password);
      await user.save();
      //email del usuario
      await this.sendEmailValidationLink(user.email);
      const { password, ...userEntity } = UserEntity.fromObject(user);
      //JWT <- mantener la auth del user
      const token = await JwtAdapter.generateToken({ id: user.id });
      if (!token) throw CustomError.internalServel("Error generating token");

      return { user: userEntity, token: token };
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

    const token = await JwtAdapter.generateToken({ id: user.id });
    if (!token) throw CustomError.internalServel("Error generating token");

    return { user: userEntity, token: token };
  }

  private sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email });
    if (!token) throw CustomError.internalServel("Error generating token");

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
    const html = `
      <h1>Validate your email</h1>
      <p>Click the following link to validate your email</p>
      <a href="${link}">Validate email: ${email}</a>
    `;

    const result = await this.emailService.sendEmail({
      to: email,
      subject: "Validate your email",
      htmlBody: html,
    });

    if (!result) throw CustomError.internalServel("Error sending email");
    return true;
  };

  public async validateEmail(token: string) {
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw CustomError.unauthorized("Invalid token");

    const { email } = payload as { email: string };
    if (!email) throw CustomError.internalServel("email not in token");

    const user = await userModel.findOne({ email });
    if (!user) throw CustomError.internalServel("User no exists");

    user.emailValidated = true;
    await user.save();
    return true;
  }
}
