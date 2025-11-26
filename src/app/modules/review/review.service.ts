import { AppointmentStatus, PaymentStatus } from "@prisma/client";
import { IJWTPayload } from "../../interfaces";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import status from "http-status";

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

export const ReviewService = { insertIntoDB };
