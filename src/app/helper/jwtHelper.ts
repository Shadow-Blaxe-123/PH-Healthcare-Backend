import { JwtPayload, sign, SignOptions } from "jsonwebtoken";

const generateToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string
) => {
  const token = sign(payload, secret, { expiresIn } as SignOptions);
  return token;
};

export const jwtHelper = {
  generateToken,
};
