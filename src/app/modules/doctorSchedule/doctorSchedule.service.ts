const insertIntoDB = async (user: any, payload: any) => {
  return { user, payload };
};

export const DoctorScheduleService = {
  insertIntoDB,
};
