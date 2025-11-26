import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { ReviewService } from "./review.service";
import sendResponse from "../../shared/sendResponse";
import { IJWTPayload } from "../../interfaces";
import { reviewFilterableFields } from "./review.constants";
import pick from "../../helper/pick";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user as IJWTPayload;
    const result = await ReviewService.insertIntoDB(user, req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Review created successfully!",
      data: result,
    });
  }
);
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, reviewFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await ReviewService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reviews retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const ReviewController = {
  insertIntoDB,
  getAllFromDB,
};
