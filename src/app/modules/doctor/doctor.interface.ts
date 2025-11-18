import { Doctor } from "@prisma/client";

export interface IDoctorUpdateInput extends Partial<Doctor> {
  specialities?: {
    specialitiesId: string;
    isDeleted?: boolean;
  }[];
}
