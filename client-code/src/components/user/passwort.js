import bcrypt from "bcryptjs";

export const PasswordEntcrypt = (pwd) => {
  return bcrypt.hashSync(pwd, 10);
};

export const PasswordDecrypt = (pwd, hash) => {
  return bcrypt.compareSync(pwd, hash);
};
