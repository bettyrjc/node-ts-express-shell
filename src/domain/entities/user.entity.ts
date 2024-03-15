//cuando regrese un usuario devuelvo este usuario y no moongose

import { CustomError } from "../errors/custom.error";

export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public role: string,
    public emailValidated: boolean,
    public img?: string
  ) {}

  static fromJSON(object: { [key: string]: any }): any {
    const { id, _id, name, email, password, emailValidated, img, role } =
      object;
    if (id || _id) {
      throw CustomError.badRequest("id or _id is not allowed in the object");
    }
    if (!name) throw CustomError.badRequest("name is required");
    if (!email) throw CustomError.badRequest("email is required");
    if (!emailValidated)
      throw CustomError.badRequest("email is emailValidated");
    if (!password) throw CustomError.badRequest("password is required");
    if (!role) throw CustomError.badRequest("role is required");
    if (!img) throw CustomError.badRequest("img is required");

    return new UserEntity(id || _id, name, email, password, emailValidated, img, role);
  }
}
