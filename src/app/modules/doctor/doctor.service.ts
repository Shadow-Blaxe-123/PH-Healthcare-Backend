import { Prisma } from "@prisma/client";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { doctorSearchableFields } from "./doctor.constants";

const getAllFromDB = async (filters: any, options: IOptions) => {
  const { limit, page, skip, sort, sortBy } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = filters;

  const andconditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    OR: doctorSearchableFields.map((field) => ({
      [field]: {
        contains: searchTerm,
        mode: "insensitive",
      },
    }));
  }
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));

    andconditions.push(...filterConditions);
  }
};

export const DoctorService = {
  getAllFromDB,
};
