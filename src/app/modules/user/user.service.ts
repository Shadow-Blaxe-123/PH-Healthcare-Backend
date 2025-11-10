import config from "../../../config";
import prisma from "../../shared/prisma";
import { ICreatePatientInput } from "./user.interface";
import bcrypt from "bcryptjs";

const createPatient = async (payload: ICreatePatientInput) => {
  const hashedPassword = await bcrypt.hash(payload.password, config.hash_salt);
  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
      },
    });
    return tx.patient.create({
      data: {
        email: payload.email,
        name: payload.name,
      },
    });
  });

  return result;
};

export const UserService = {
  createPatient,
};
