import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/", DoctorController.getAllFromDB);
router.get("/suggestion", DoctorController.getAISuggestions);
router.get("/:id", DoctorController.getSingleFromDB);
``;

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.DOCTOR),
  DoctorController.updateIntoDB
);

router.delete("/:id", auth(UserRole.ADMIN), DoctorController.deleteFromDB);
router.delete("/soft/:id", auth(UserRole.ADMIN), DoctorController.softDelete);

export const doctorRoutes = router;
