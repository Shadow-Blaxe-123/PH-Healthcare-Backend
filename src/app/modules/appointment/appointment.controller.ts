import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AppointmentService } from "./appointment.service";

const createAppointment = catchAsync(async (req: Request, res: Response) => {
  const result = await AppointmentService.createAppointment(req);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Appointment created successfully!",
    data: result,
  });
});

export const AppointmentController = {
  createAppointment,
};
