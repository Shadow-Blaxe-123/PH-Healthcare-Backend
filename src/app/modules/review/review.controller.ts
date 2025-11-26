import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { ReviewService } from "./review.service";
import sendResponse from "../../shared/sendResponse";
import { IJWTPayload } from "../../interfaces";

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

export const ReviewController = {
  insertIntoDB,
};
