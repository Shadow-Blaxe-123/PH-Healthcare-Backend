import { Prisma } from "@prisma/client";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { doctorSearchableFields } from "./doctor.constants";
import prisma from "../../shared/prisma";

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
export const DoctorService = {
  getAllFromDB,
};
