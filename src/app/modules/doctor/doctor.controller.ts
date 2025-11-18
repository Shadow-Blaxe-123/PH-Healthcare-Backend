import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { SpecialtiesService } from "../speciality/speciality.service";
import sendResponse from "../../shared/sendResponse";
import pick from "../../helper/pick";
import { DoctorService } from "./doctor.service";
import { doctorFilterableFields } from "./doctor.constants";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sort"]);
  const filters = pick(req.query, doctorFilterableFields);
  const result = await DoctorService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctors retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

export const DoctorController = {
  getAllFromDB,
};
