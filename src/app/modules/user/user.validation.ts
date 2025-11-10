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
    address: z.string(),
    contactNumber: z.string(),
    experience: z.number(),
    registrationNumber: z.string(),
    gender: z.enum(["MALE", "FEMALE"]),
    appointmentFee: z.number(),
    qualification: z.string(),
    currentWorkingPlace: z.string(),
    designation: z.string(),
  }),
});

export const UserValidation = {
  createPatientValidationSchema,
  createDoctorValidationSchema,
};
