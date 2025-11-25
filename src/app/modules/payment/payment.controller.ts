import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { PaymentService } from "./payment.service";
import sendResponse from "../../shared/sendResponse";
import { stripe } from "../../helper/stripe";

const handleStripeWebhookEvent = catchAsync(
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = "";
    let event;
    try {
      event = await stripe.webhooks.constructEvent(
        req.body,
        sig,
        webhookSecret
      );
    } catch (err: any) {
      console.error("⚠️ Webhook signature verification failed.", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const result = await PaymentService.handleStripeWebhookEvent(event);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Stripe webhook event handled successfully",
      data: result,
    });
  }
);

export const PaymentController = {
  handleStripeWebhookEvent,
};
