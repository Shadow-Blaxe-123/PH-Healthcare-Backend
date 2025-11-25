import { stripe } from "../../helper/stripe";
import { IJWTPayload } from "../../interfaces";
import prisma from "../../shared/prisma";
import { v4 as uuidv4 } from "uuid";

const createAppointment = async (
  user: IJWTPayload,
  payload: { doctorId: string; scheduleId: string }
) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
    },
  });
  const isBookedOrNot = await prisma.doctorSchedules.findFirstOrThrow({
    where: {
      scheduleId: payload.scheduleId,
      doctorId: payload.doctorId,
      isBooked: false,
    },
  });

  const videoCallId = uuidv4();

  const res = await prisma.$transaction(async (tnx) => {
    const appointmentData = await tnx.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: isBookedOrNot.scheduleId,
        videoCallingId: videoCallId,
      },
    });
    await tnx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: payload.doctorId,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
      },
    });

    const transactionId = uuidv4();
    await tnx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee as number,
        transactionId,
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: patientData.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Appointment with ${doctorData.name}`,
            },
            unit_amount: (doctorData.appointmentFee as number) * 100,
          },
          quantity: 1,
        },
      ],
      success_url: "https://google.com",
      cancel_url: "https://youtube.com",
    });

    return appointmentData;
  });
  return res;
};

export const AppointmentService = {
  createAppointment,
};
