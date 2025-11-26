import { Router } from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorScheduleValidation } from "./doctorSchedule.validation";

const router = Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  DoctorScheduleController.getAllFromDB
);

router.get(
  "/my-schedule",
  auth(UserRole.DOCTOR),
  DoctorScheduleController.getMySchedule
);

router.post(
  "/",
  validateRequest(DoctorScheduleValidation.insertIntoDBSchema),
  auth(UserRole.DOCTOR),
  DoctorScheduleController.insertIntoDB
);
router.delete(
  "/:id",
  auth(UserRole.DOCTOR),
  DoctorScheduleController.deleteFromDB
);

export const doctorScheduleRoutes = router;
