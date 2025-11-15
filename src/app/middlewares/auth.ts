import { NextFunction, Request, Response } from "express";
import { jwtHelper } from "../helper/jwtHelper";
import config from "../../config";
import { IJWTPayload } from "../interfaces";
import ApiError from "../errors/ApiError";
import status from "http-status";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: IJWTPayload },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.cookies.accessToken;
      if (!token) {
        throw new ApiError(status.UNAUTHORIZED, "You are not logged in!");
      }
      const verifiedUser = jwtHelper.verifyToken(
        token,
        config.jwt.access_token_secret
      );
      req.user = verifiedUser as IJWTPayload;
      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(status.UNAUTHORIZED, "You are not authorized!");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
