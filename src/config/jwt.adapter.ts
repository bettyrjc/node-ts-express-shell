import jwt from "jsonwebtoken";
import { envs } from "./envs";

const JWT_SEED = envs.JWT_SEED;
export class JwtAdapter {
  //DI?
  static async generateToken(payload: any, duration: string = "2h") {
    return new Promise((resolve) => {
      //"SEED" es super importante es de cuidado nadie del equipo debe saberlo
      jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
        if (err) return resolve(null);

        return resolve(token);
      });
    });
  }

  static validateToken<T>(token: string): Promise<T | null>{
    return new Promise((resolve) => {
      jwt.verify(token, envs.JWT_SEED, async (err, decoded) => {
        if (err) return null;
        resolve(decoded as T);
      });
    });
  }
}
