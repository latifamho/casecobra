"use server";

import { Order } from "@prisma/client";
import { db } from "@/app/db";
import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { stripe } from "@/lib/stripe";

export const createCheckoutSession = async ({
  configId,
}: {
  configId: string;
}) => {
  // getting the configuration

  const configuration = await db.configuration.findUnique({
    where: { id: configId },
  });

  if (!configuration) {
    throw new Error("No such configuration found");
  }
  // getting the user
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  console.log(user);

  if (!user) {
    throw new Error("You need to be logged in");
  }

  const { finish, material } = configuration;
  //counting the price
  let price = BASE_PRICE;
  if (finish === "textured") price += PRODUCT_PRICES.finish.textured;
  if (material === "polycarbonate")
    price += PRODUCT_PRICES.material.polycarbonate;
  let order: Order | undefined = undefined;

  // finding | creating order

  const existingOrder = await db.order.findFirst({
    where: {
      userId: user.id,
      configurationId: configuration.id,
    },
  });

  if (existingOrder) {
    order = existingOrder;
  } else {
    order = await db.order.create({
      data: {
        amount: price / 100,
        userId: user.id,
        configurationId: configuration.id,
      },
    });
  }
  // payment session
  const product = await stripe.products.create({
    name: "Custom iPhone Case",
    images: [configuration.imageUrl],
    default_price_data: {
      currency: "USD",
      unit_amount: price,
    },
  });
  // createign checkout
  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
    payment_method_types: ["card", "paypal"],
    mode: "payment",
    shipping_address_collection: { allowed_countries: ["DE", "US"] },
    metadata: {
      userId: user.id,
      orderId: order.id,
    },
    line_items: [{ price: product.default_price as string, quantity: 1 }],
  });
  return { url: stripeSession.url };
};
