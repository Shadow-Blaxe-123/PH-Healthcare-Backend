import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import config from "./config";
import router from "./app/routes";
import cookieParser from "cookie-parser";
import { PaymentController } from "./app/modules/payment/payment.controller";
import nodeCron from "node-cron";
import { AppointmentService } from "./app/modules/appointment/appointment.service";

const app: Application = express();

nodeCron.schedule("* * * * *", () => {
  try {
    console.log("Node cron called at ", new Date());
    AppointmentService.cancelUnpaidAppointments();
  } catch (error) {
    console.error(error);
  }
});

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhookEvent
);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//parser
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Ph health care server is running...",
    enivronment: config.node_env,
    uptime: process.uptime().toFixed(2) + " seconds",
    timestamp: new Date().toISOString(),
  });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
