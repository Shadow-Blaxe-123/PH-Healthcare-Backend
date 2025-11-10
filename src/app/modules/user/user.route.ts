import { Router } from "express";
import { UserController } from "./user.controller";
import { fileUploader } from "../../helper/fileUploader";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";

const router = Router();

router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  validateRequest(UserValidation.createPatientValidationSchema),
  UserController.createPatient
);

export const userRoutes = router;
