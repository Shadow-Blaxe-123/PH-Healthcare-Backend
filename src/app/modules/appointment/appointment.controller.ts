import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AppointmentService } from "./appointment.service";
import { IJWTPayload } from "../../interfaces";
import pick from "../../helper/pick";

const createAppointment = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await AppointmentService.createAppointment(
      user as IJWTPayload,
      req.body
    );
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Appointment created successfully!",
      data: result,
    });
  }
);

const getMyAppointment = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sort"]);
    const filters = pick(req.query, ["status", "paymentStatus"]);
    const user = req.user as IJWTPayload;
    const result = await AppointmentService.getMyAppointment(
      user,
      filters,
      options
    );
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Appointments retrieved successfully!",
      meta: result.meta,
      data: result.data,
    });
  }
);
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sort"]);
  const filters = pick(req.query, ["status", "paymentStatus"]);
  const result = await AppointmentService.getAllFromDB(filters, options);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Appointments retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

export const AppointmentController = {
  createAppointment,
  getMyAppointment,
  getAllFromDB,
};
