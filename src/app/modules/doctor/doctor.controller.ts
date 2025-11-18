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
const getSingleFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await DoctorService.getSingleFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctors retrieved successfully!",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await DoctorService.updateIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Doctor updated successfully!",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.deleteFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor deleted successfully!",
    data: result,
  });
});
const softDelete = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.softDelete(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor soft deleted successfully",
    data: result,
  });
});

export const DoctorController = {
  getAllFromDB,
  updateIntoDB,
  getSingleFromDB,
  deleteFromDB,
  softDelete,
};
