import { genSaltSync, hashSync, compareSync } from "bcryptjs";

export const bcryptAdapter = {
  hash: (pasword: string) => {
    const salt = genSaltSync();
    return hashSync(pasword, salt);
  },
  compare: (password: string, hash: string) => {
    return compareSync(password, hash);
  },
};
