"use client";

import Phone from "@/app/component/Phone";
import { Button } from "@/app/component/ui/button";
import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { cn, fromatPrice } from "@/lib/utils";
import { COLORS, MODELS } from "@/validators/option-validator";
import { configuration } from "@prisma/client";
import { ArrowRight, Check } from "lucide-react";
import { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";
import { useRouter } from "next/navigation";
// import { useMutation } from "@tanstack/react-query";
// import { createCheckoutSession } from "./actions";
// import { useToast } from "@/hooks/use-toast";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import LoginModal from "@/app/component/LoginModal";

const DesignPreview = ({ configuration }: { configuration: configuration }) => {
  // const { toast } = useToast();
  const router = useRouter();
  const { user } = useKindeBrowserClient();
  const { id } = configuration;

  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setShowConfetti(true); 
  }, []);
  const { color, model, finish, material } = configuration;
  const tw = COLORS.find(
    (supportedColor) => supportedColor.value === color
  )?.tw;

  const { label: ModelLabel } = MODELS.options.find(
    (supportedModel) => supportedModel.value === model
  )!;
  let TotalPrice = BASE_PRICE;
  if (material === "polycarbonate")
    TotalPrice += PRODUCT_PRICES.material.polycarbonate;
  if (finish === "textured") TotalPrice += PRODUCT_PRICES.finish.textured;
  // going to return checkout session url
  // const { mutate } = useMutation({
  //   mutationKey: ["get-checkout-session"],
  //   mutationFn: createCheckoutSession,
  //   onSuccess: ({ url }) => {
  //     if (url) router.push(url);
  //     else throw new Error("Unable to retrieve payment URL.");
  //   },
  //   onError: () => {
  //     toast({
  //       title: "Something went wrong",
  //       description: "There was an error on our end. Please try again.",
  //       variant: "destructive",
  //     });
  //   },
  // });

  const handleCheckout = () => {
    if (user) {
      // create payment session
      router.push(
        `/thank-you?id=${id}`
      );

      // createPaymentSession({ configId: id });
    } else {
      // need to log in
      localStorage.setItem("configurationId", id);
      setIsLoginModalOpen(true);
    }
  };
  return (
    <>
      <div
        className=" pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center  "
        aria-hidden="true"
      >
        <Confetti
          active={showConfetti}
          config={{ elementCount: 200, spread: 900 }}
        />
      </div>
      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />
      <div className="  mt-20 grid grid-cols-1 text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12">
        <div className="  sm:col-span-4 md:col-span-3 md:row-span-2 md:row-end-2">
          <Phone
            imgSrc={configuration.croppedImageUrl!}
            className={cn(`bg-${tw}`)}
          />
        </div>
        <div className=" mt-6 sm:col-span-9 sm:mt-0 md:row-end-1 ">
          <h3 className=" text-3xl font-bold tracking-tight text-gray-900">
            Your {ModelLabel} Case
          </h3>
          <div className=" mt-3 flex items-center gap1.5 text-base">
            <Check className=" h-4 w-4 text-green-500" /> In stock and ready to
            ship
          </div>
        </div>
        <div className=" sm:col-span-12 md:col-span-9 text-base">
          <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
            <div>
              <p className="font-medium text-zinc-950">Highlights</p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>Wireless charging compatible</li>
                <li>TPU shock absorption</li>
                <li>Packaging made from recycled materials</li>
                <li>5 year print warranty</li>
              </ol>
            </div>
            <div>
              <p className="font-medium text-zinc-950">Materials</p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>High-quality, durable material</li>
                <li>Scratch- and fingerprint resistant coating</li>
              </ol>
            </div>
          </div>
          <div className=" mt-8">
            <div className=" bg-green-50 p-6 sm:rounded-lg sm:p-8">
              <div className=" flow-root text-sm">
                <div className=" flex items-center justify-between placeholder-gray-100 mt-2 ">
                  <p className=" text-gray-600 "> Base Price </p>
                  <p className=" font-medium text-gray-900">
                    {fromatPrice(BASE_PRICE / 100)}
                  </p>
                </div>
                {finish === "textured" ? (
                  <div className=" flex items-center justify-between placeholder-gray-100 mt-2 ">
                    <p className=" text-gray-600 "> Textrued Finish </p>
                    <p className=" font-medium text-gray-900">
                      {fromatPrice(PRODUCT_PRICES.finish.textured / 100)}
                    </p>
                  </div>
                ) : null}
                {material === "polycarbonate" ? (
                  <div className=" flex items-center justify-between placeholder-gray-100 mt-2 ">
                    <p className=" text-gray-600 ">
                      {" "}
                      Sofnt Polycarbonate mateial{" "}
                    </p>
                    <p className=" font-medium text-gray-900">
                      {fromatPrice(PRODUCT_PRICES.material.polycarbonate / 100)}
                    </p>
                  </div>
                ) : null}
                <div className="my-2 h-px bg-gray-200  " />
                <div className=" flex items-center justify-between py-2 ">
                  <p className=" font-semibold text-gray-900 ">Order Total</p>
                  <p className=" font-semibold text-gray-900 ">
                    {fromatPrice(TotalPrice / 100)}
                  </p>
                </div>
              </div>
            </div>
            <div className=" mt-8 justify-end pb-12">
              <Button
                // disabled={true}
                // isLoading={true}
                // loadingText="loading"
                className=" px-4 sm:px-6  lg:px-8 "
                onClick={() => handleCheckout()}
              >
                {" "}
                Check out <ArrowRight className=" h4' w-4 ml-1.5  inline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DesignPreview;
