import z from "zod";

const insertIntoDBSchema = z.object({
  scheduleIds: z
    .array(z.string())
    .min(1, { message: "Schedule ids are required" }),
});

export const DoctorScheduleValidation = {
  insertIntoDBSchema,
};
