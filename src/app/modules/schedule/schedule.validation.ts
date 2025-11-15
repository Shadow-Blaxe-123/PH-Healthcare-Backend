import z from "zod";

export const insertIntoDBSchema = z
  .object({
    startDate: z
      .string()
      .refine((v) => !isNaN(Date.parse(v)), "Invalid start date"),
    endDate: z
      .string()
      .refine((v) => !isNaN(Date.parse(v)), "Invalid end date"),

    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid start time"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid end time"),
  })
  .refine(
    (data) => {
      // Compare dates
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end >= start;
    },
    {
      message: "End date must be equal to or after start date",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      // If same day, check times
      if (start.toDateString() === end.toDateString()) {
        const [sh, sm] = data.startTime.split(":").map(Number);
        const [eh, em] = data.endTime.split(":").map(Number);

        const startMinutes = sh * 60 + sm;
        const endMinutes = eh * 60 + em;

        return endMinutes > startMinutes;
      }

      // Different dates → time doesn't matter
      return true;
    },
    {
      message:
        "End time must be after start time when startDate and endDate are the same",
      path: ["endTime"],
    }
  );

export const ScheduleValidation = {
  insertIntoDBSchema,
};
