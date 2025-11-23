import { IJWTPayload } from "../../interfaces";

const createAppointment = async (
  user: IJWTPayload,
  payload: { doctorId: string; scheduleId: string }
) => {};

export const AppointmentService = {
  createAppointment,
};
