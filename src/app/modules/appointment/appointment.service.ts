import { IJWTPayload } from "../../interfaces";
import prisma from "../../shared/prisma";

const createAppointment = async (
  user: IJWTPayload,
  payload: { doctorId: string; scheduleId: string }
) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
    },
  });
  const isBookedOrNot = await prisma.doctorSchedules.findFirstOrThrow({
    where: {
      scheduleId: payload.scheduleId,
      doctorId: payload.doctorId,
      isBooked: false,
    },
  });
};

export const AppointmentService = {
  createAppointment,
};
