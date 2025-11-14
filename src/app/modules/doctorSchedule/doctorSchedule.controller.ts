import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { DoctorScheduleService } from "./doctorSchedule.service";
import sendResponse from "../../shared/sendResponse";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await DoctorScheduleService.insertIntoDB(user, req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Doctor Schedule created successfully!",
      data: result,
    });
  }
);

export const DoctorScheduleController = {
  insertIntoDB,
};
