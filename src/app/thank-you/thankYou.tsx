import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { configuration } from "@prisma/client";
import PhonePreview from "../component/PhonePreview";
import { fromatPrice } from "@/lib/utils";

const ThankYou = ({ configuration }: { configuration: configuration }) => {
  const { color, finish, material } = configuration;

  let TotalPrice = BASE_PRICE;
  if (material === "polycarbonate")
    TotalPrice += PRODUCT_PRICES.material.polycarbonate;
  if (finish === "textured") TotalPrice += PRODUCT_PRICES.finish.textured;
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-xl">
          <p className="text-base font-medium text-primary">Thank you!</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Your case is on the way!
          </h1>
          <p className="mt-2 text-base text-zinc-500">
            We have received your order and are now processing it.
          </p>
        </div>
        <div className="mt-10 border-t border-zinc-200">
          <div className="mt-10 flex flex-auto flex-col">
            <h4 className="font-semibold text-zinc-900">
              You made a great choice!
            </h4>
            <p className="mt-2 text-sm text-zinc-600">
              We at CaseCobra believe that a phone case does not only need to
              look good, but also last you for the years to come. We offer a
              5-year print guarantee: If you case is not of the highest quality,
              we will replace it for free.
            </p>
          </div>
        </div>

        <div className="flex space-x-6 overflow-hidden mt-4 rounded-xl bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl">
          <PhonePreview
            croppedImageUrl={configuration.croppedImageUrl!}
            color={color!}
          />
        </div>
        <div>
          {" "}
          <div className="grid grid-cols-2 gap-x-6 border-t border-zinc-200 py-10 text-sm">
            <div>
              <p className="font-medium text-zinc-900">Payment status</p>
              <p className="mt-2 text-zinc-700">Paid</p>
            </div>

            <div>
              <p className="font-medium text-zinc-900">Shipping Method</p>
              <p className="mt-2 text-zinc-700">
                DHL, takes up to 3 working days
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 border-t border-zinc-200 pt-10 text-sm">
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Subtotal</p>
            <p className="text-zinc-700">{fromatPrice(TotalPrice-200)}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Shipping</p>
            <p className="text-zinc-700">{fromatPrice(200)}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Total</p>
            <p className="text-zinc-700">{fromatPrice(TotalPrice)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ThankYou;
