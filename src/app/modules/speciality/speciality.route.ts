import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../helper/fileUploader";
import { SpecialtiesController } from "./speciality.controller";
import { SpecialtiesValidtaion } from "./speciality.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.get("/", SpecialtiesController.getAllFromDB);

router.post(
  "/",
  fileUploader.upload.single("file"),
  validateRequest(SpecialtiesValidtaion.create),
  SpecialtiesController.inserIntoDB
);

router.delete(
  "/:id",
  // auth(UserRole.ADMIN, UserRole.ADMIN),
  SpecialtiesController.deleteFromDB
);

export const SpecialtiesRoutes = router;
