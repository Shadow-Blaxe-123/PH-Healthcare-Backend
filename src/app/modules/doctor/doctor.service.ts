import { Doctor, Prisma, UserStatus } from "@prisma/client";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { doctorSearchableFields } from "./doctor.constants";
import prisma from "../../shared/prisma";
import { IDoctorUpdateInput } from "./doctor.interface";
import ApiError from "../../errors/ApiError";
import status from "http-status";

const getAllFromDB = async (filters: any, options: IOptions) => {
  const { limit, page, skip, sort, sortBy } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, specialities, ...filterData } = filters;

  const andconditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andconditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (specialities && specialities.length > 0) {
    andconditions.push({
      doctorSpecialities: {
        some: {
          specialities: {
            title: {
              contains: specialities,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));

    andconditions.push(...filterConditions);
  }
  const whereConditions: Prisma.DoctorWhereInput =
    andconditions.length > 0 ? { AND: andconditions } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sort,
    },
    include: {
      doctorSpecialities: {
        include: {
          specialities: true,
        },
      },
    },
  });
  const total = await prisma.doctor.count({ where: whereConditions });
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleFromDB = async (id: string) => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
    },
    include: {
      doctorSpecialities: {
        include: {
          specialities: true,
        },
      },
    },
  });
  return result;
};

const updateIntoDB = async (id: string, payload: IDoctorUpdateInput) => {
  const docInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const { specialities, ...docData } = payload;
  return await prisma.$transaction(async (tx) => {
    if (specialities && specialities.length > 0) {
      const deleteSpecialitiesIds = specialities.filter((s) => s.isDeleted);

      for (const speciality of deleteSpecialitiesIds) {
        await tx.doctorSpecialities.deleteMany({
          where: {
            doctorId: id,
            specialitiesId: speciality.specialitiesId,
          },
        });
      }
      const createSpecialitiesIds = specialities.filter((s) => !s.isDeleted);

      for (const speciality of createSpecialitiesIds) {
        await tx.doctorSpecialities.create({
          data: {
            doctorId: id,
            specialitiesId: speciality.specialitiesId,
          },
        });
      }
    }

    const updatedData = await tx.doctor.update({
      where: {
        id: docInfo.id,
      },
      data: docData,
      include: {
        doctorSpecialities: {
          include: {
            specialities: true,
          },
        },
      },
    });
    return updatedData;
  });
};

const deleteFromDB = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    // Check existence + lock row during transaction
    const doctor = await tx.doctor.findUnique({
      where: { id },
    });

    if (!doctor) {
      throw new ApiError(status.NOT_FOUND, "Doctor not found!");
    }

    // Delete relations first
    await tx.doctorSpecialities.deleteMany({
      where: { doctorId: id },
    });

    await tx.doctorSchedules.deleteMany({
      where: {
        doctorId: id,
      },
    });

    await tx.user.delete({
      where: {
        email: doctor.email,
      },
    });

    // Delete doctor
    return await tx.doctor.delete({
      where: { id },
    });
  });
};

const softDelete = async (id: string): Promise<Doctor> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deleteDoctor = await transactionClient.doctor.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: deleteDoctor.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return deleteDoctor;
  });
};

export const DoctorService = {
  getAllFromDB,
  updateIntoDB,
  getSingleFromDB,
  deleteFromDB,
  softDelete,
};
