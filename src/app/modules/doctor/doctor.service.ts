import { Doctor, Prisma } from "@prisma/client";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { doctorSearchableFields } from "./doctor.constants";
import prisma from "../../shared/prisma";
import { IDoctorUpdateInput } from "./doctor.interface";

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

const updateIntoDB = async (id: string, payload: IDoctorUpdateInput) => {
  const docInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const { specialities, ...docData } = payload;
  console.log(payload);

  if (specialities && specialities.length > 0) {
    const deleteSpecialitiesIds = specialities.filter((s) => s.isDeleted);

    for (const speciality of deleteSpecialitiesIds) {
      await prisma.doctorSpecialities.deleteMany({
        where: {
          doctorId: id,
          specialitiesId: speciality.specialitiesId,
        },
      });
    }
    const createSpecialitiesIds = specialities.filter((s) => !s.isDeleted);

    for (const speciality of createSpecialitiesIds) {
      await prisma.doctorSpecialities.create({
        data: {
          doctorId: id,
          specialitiesId: speciality.specialitiesId,
        },
      });
    }
  }

  const updatedData = await prisma.doctor.update({
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
};
export const DoctorService = {
  getAllFromDB,
  updateIntoDB,
};
