import Stripe from "stripe";

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const appointmentId = session.metadata?.appointmentId;
      const paymentIntentId = session.payment_intent;
      const email = session.customer_email;

      console.log("✅ Payment successful!");
      console.log("👉 Appointment ID:", appointmentId);
      console.log("👉 Payment Intent ID:", paymentIntentId);
      console.log("👉 Customer Email:", email);

      break;
    }

    case "payment_intent.payment_failed": {
      const intent = event.data.object;
      console.log("❌ Payment failed:", intent.id);
      break;
    }
    default:
      console.log(`❕Unhandled event type: ${event.type}`);
  }
};

export const PaymentService = {
  handleStripeWebhookEvent,
};
