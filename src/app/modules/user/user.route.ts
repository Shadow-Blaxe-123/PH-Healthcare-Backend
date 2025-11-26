import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import { fileUploader } from "../../helper/fileUploader";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.DOCTOR),
  UserController.getAllUsers
);

router.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  UserController.getMyProfile
);

// Create User
router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  validateRequest(UserValidation.createPatientValidationSchema),
  UserController.createPatient
);
router.post(
  "/create-doctor",
  auth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  validateRequest(UserValidation.createDoctorValidationSchema),
  UserController.createDoctor
);
router.post(
  "/create-admin",
  auth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  validateRequest(UserValidation.createAdminValidationSchema),
  UserController.createAdmin
);

router.patch(
  "/:id/status",
  auth(UserRole.ADMIN),
  UserController.changeProfileStatus
);

router.patch(
  "/update-my-profile",
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return UserController.updateMyProfie(req, res, next);
  }
);

export const userRoutes = router;
