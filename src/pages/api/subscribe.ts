import { stripe } from "@/services/stripe";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/services/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const session = await getSession({ req });

    if (!session || !session.user || !session.user.email) {
      return res.status(401).end("Not authenticated");
    }

    const userEmail = session.user.email;
    const userRef = doc(db, "users", userEmail);
    const userSnap = await getDoc(userRef);

    let stripeCustomerId = "";

    if (userSnap.exists()) {
      const userData = userSnap.data();
      if (userData.stripe_customer_id) {
        stripeCustomerId = userData.stripe_customer_id;
      } else {
        const stripeCustomer = await stripe.customers.create({
          email: userEmail,
        });

        await updateDoc(userRef, {
          stripe_customer_id: stripeCustomer.id,
        });

        stripeCustomerId = stripeCustomer.id;
      }
    } else {
      const stripeCustomer = await stripe.customers.create({
        email: userEmail,
      });

      await setDoc(userRef, {
        email: userEmail,
        stripe_customer_id: stripeCustomer.id,
        createdAt: new Date(),
      });

      stripeCustomerId = stripeCustomer.id;
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        {
          price: "price_1PEtW3EwQJByZ5tFQFcRUqvG", 
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCESS_URL!,
      cancel_url: process.env.STRIPE_CANCEL_URL!,
    });

    return res.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};

