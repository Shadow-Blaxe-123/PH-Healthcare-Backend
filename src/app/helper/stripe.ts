import Stripe from "stripe";
import config from "../../config";

export const stript = new Stripe(config.stripe_secret_key as string);
