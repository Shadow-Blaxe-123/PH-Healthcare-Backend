import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createPatient(req);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Patient created successfully!",
    data: result,
  });
});
const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createDoctor(req);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Doctor created successfully!",
    data: result,
  });
});
const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createAdmin(req);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Admin created successfully!",
    data: result,
  });
});
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, searchTerm, sortBy, sort } = req.query;

  const result = await UserService.getAllUsers(
    Number(page ? page : 1),
    Number(limit ? limit : 10),
    searchTerm as string,
    sortBy as string,
    sort as string
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully!",
    data: result,
  });
});

export const UserController = {
  createPatient,
  createDoctor,
  createAdmin,
  getAllUsers,
};
