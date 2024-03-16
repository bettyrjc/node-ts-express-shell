import { regularExps } from "../../../config";

export class LoginUserDto {
  private constructor(
    public email: string,
    public password: string,
  ){}

  static create(object: any): [string?, LoginUserDto?] {
    const { email, password } = object;
    if (!email) return(["email is required"]);
    if(!regularExps.email.test(email)) return(["email is not invalid"]);
    if (!password) return(["password is required"]);
    if (password.length < 6) return(["password is too short"]);

    return [undefined, new LoginUserDto(email, password)];
  }

}