import { Prisma } from "@prisma/client";
import prisma from "../../shared/prisma";

const insertIntoDB = async (user: any, payload: { scheduleIds: string[] }) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  const data: Prisma.DoctorSchedulesDoctorIdScheduleIdCompoundUniqueInput[] =
    payload.scheduleIds.map((scheduleId) => ({
      doctorId: doctorData.id,
      scheduleId,
    }));
  return await prisma.doctorSchedules.createManyAndReturn({ data });
};

export const DoctorScheduleService = {
  insertIntoDB,
};
