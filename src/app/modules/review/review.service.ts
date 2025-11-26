import { AppointmentStatus, PaymentStatus, Prisma } from "@prisma/client";
import { IJWTPayload } from "../../interfaces";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import status from "http-status";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";

const insertIntoDB = async (user: IJWTPayload, payload: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      status: AppointmentStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
    },
  });
  if (appointmentData.patientId !== patientData.id) {
    throw new ApiError(status.BAD_REQUEST, "This is not your appointment!");
  }

  return await prisma.$transaction(async (tnx) => {
    const result = tnx.review.create({
      data: {
        patientId: patientData.id,
        doctorId: appointmentData.doctorId,
        appointmentId: appointmentData.id,
        rating: payload.rating,
        comment: payload.comment,
      },
    });
    const avgRating = await tnx.review.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        doctorId: appointmentData.doctorId,
      },
    });
    await tnx.doctor.update({
      where: {
        id: appointmentData.doctorId,
      },
      data: {
        averageRating: avgRating._avg.rating as number,
      },
    });
    return result;
  });
};

const getAllFromDB = async (filters: any, options: IOptions) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { patientEmail, doctorEmail } = filters;
  const andConditions = [];

  if (patientEmail) {
    andConditions.push({
      patient: {
        email: patientEmail,
      },
    });
  }

  if (doctorEmail) {
    andConditions.push({
      doctor: {
        email: doctorEmail,
      },
    });
  }

  const whereConditions: Prisma.ReviewWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.review.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sort
        ? { [options.sortBy]: options.sort }
        : {
            createdAt: "desc",
          },
    include: {
      doctor: true,
      patient: true,
      //appointment: true,
    },
  });
  const total = await prisma.review.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const ReviewService = { insertIntoDB, getAllFromDB };
