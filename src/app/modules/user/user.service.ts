import { Request } from "express";
import config from "../../../config";
import prisma from "../../shared/prisma";
import { ICreatePatientInput } from "./user.interface";
import bcrypt from "bcryptjs";
import { fileUploader } from "../../helper/fileUploader";

const createPatient = async (req: Request) => {
  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    req.body.patient.profilePhoto = uploadResult?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, config.hash_salt);
  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: {
        email: req.body.patient.email,
        password: hashedPassword,
      },
    });
    return tx.patient.create({
      data: req.body.patient,
    });
  });

  return result;
};
const createDoctor = async (req: Request) => {
  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    req.body.doctor.profilePhoto = uploadResult?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, config.hash_salt);
  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: {
        email: req.body.doctor.email,
        password: hashedPassword,
      },
    });
    return tx.doctor.create({
      data: req.body.doctor,
    });
  });

  return result;
};

export const UserService = {
  createPatient,
  createDoctor,
};
