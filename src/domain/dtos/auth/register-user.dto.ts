import { regularExps } from "../../../config";

export class RegisterUseDto {
  private constructor(
    public name: string,
    public email: string,
    public password: string,
  ){}

  static create(object: any): [string?, RegisterUseDto?] {
    const { name, email, password } = object;
    if (!name) return(["name is required"]);
    if (!email) return(["email is required"]);
    if(!regularExps.email.test(email)) return(["email is not invalid"]);
    if (!password) return(["password is required"]);
    if (password.length < 6) return(["password is too short"]);

    return [undefined, new RegisterUseDto(name, email, password)];
  }

}