import { Router } from "express";
import { ScheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { ScheduleValidation } from "./schedule.validation";

const router = Router();

router.get(
  "/",
  auth(UserRole.DOCTOR, UserRole.ADMIN),
  ScheduleController.schedulesForDoctor
);

router.post(
  "/",
  auth(UserRole.ADMIN),
  validateRequest(ScheduleValidation.insertIntoDBSchema),
  ScheduleController.insertIntoDB
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  ScheduleController.deleteScheduleFromDB
);

export const scheduleRoutes = router;
