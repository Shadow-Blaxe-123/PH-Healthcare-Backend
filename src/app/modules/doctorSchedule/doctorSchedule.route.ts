import { Router } from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorScheduleValidation } from "./doctorSchedule.validation";

const router = Router();

router.post(
  "/",
  validateRequest(DoctorScheduleValidation.insertIntoDBSchema),
  auth(UserRole.DOCTOR),
  DoctorScheduleController.insertIntoDB
);

export const doctorScheduleRoutes = router;
