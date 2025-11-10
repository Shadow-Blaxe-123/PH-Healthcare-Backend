import z from "zod";

const createPatientValidationSchema = z.object({
  password: z.string(),
  patient: z.object({
    name: z.string({
      error: "Name is required",
    }),
    email: z.email({
      error: "Email is required",
    }),
    address: z.string().optional(),
  }),
});
const createDoctorValidationSchema = z.object({
  password: z.string(),
  doctor: z.object({
    name: z.string({
      error: "Name is required",
    }),
    email: z.email({
      error: "Email is required",
    }),
    address: z.string().optional(),
    contactNumber: z.string().optional(),
    experience: z.number().optional(),
    registrationNumber: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE"]).optional(),
    appointmentFee: z.number().optional(),
    qualification: z.string().optional(),
    currentWorkingPlace: z.string().optional(),
    designation: z.string().optional(),
  }),
});
const createAdminValidationSchema = z.object({
  password: z.string(),
  admin: z.object({
    name: z.string({
      error: "Name is required",
    }),
    email: z.email({
      error: "Email is required",
    }),
    contactNumber: z.string().optional(),
  }),
});

export const UserValidation = {
  createPatientValidationSchema,
  createDoctorValidationSchema,
  createAdminValidationSchema,
};
