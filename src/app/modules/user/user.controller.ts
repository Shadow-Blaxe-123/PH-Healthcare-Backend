import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import pick from "../../helper/pick";
import status from "http-status";
import { IJWTPayload } from "../../interfaces";

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
  const options = pick(req.query, ["page", "limit", "sortBy", "sort"]);
  const filters = pick(req.query, ["status", "role", "email", "searchTerm"]);

  const result = await UserService.getAllUsers(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getMyProfile = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;

    const result = await UserService.getMyProfile(user as IJWTPayload);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "My profile data fetched!",
      data: result,
    });
  }
);

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.changeProfileStatus(id, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Users profile status changed!",
    data: result,
  });
});

const updateMyProfie = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;

    const result = await UserService.updateMyProfie(user as IJWTPayload, req);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "My profile updated!",
      data: result,
    });
  }
);

export const UserController = {
  createPatient,
  createDoctor,
  createAdmin,
  getAllUsers,
  getMyProfile,
  changeProfileStatus,
  updateMyProfie,
};
