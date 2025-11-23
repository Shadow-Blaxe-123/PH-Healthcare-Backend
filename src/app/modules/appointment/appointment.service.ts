import { IJWTPayload } from "../../interfaces";
import prisma from "../../shared/prisma";
import { v4 as uuidv4 } from "uuid";

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

  const videoCallId = uuidv4();

  const res = await prisma.$transaction(async (tnx) => {
    const appointmentData = tnx.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: isBookedOrNot.scheduleId,
        videoCallingId: videoCallId,
      },
    });
    await tnx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: payload.doctorId,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
      },
    });
    return appointmentData;
  });
  return res;
};

export const AppointmentService = {
  createAppointment,
};
