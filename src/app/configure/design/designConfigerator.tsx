"use client";
import HandleCompoenet from "@/components/handleComponent";
import { cn, fromatPrice } from "@/lib/utils";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import NextImage from "next/image";
import { Rnd } from "react-rnd";
import { RadioGroup } from "@headlessui/react";
import { useRef, useState } from "react";
import {
  COLORS,
  FINISHES,
  MATERIALS,
  MODELS,
} from "../../../validators/option-validator";
import { Label } from "@/components/ui/label";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/app/component/ui/button";
import { ArrowRight, Check, ChevronsUpDown } from "lucide-react";
import { BASE_PRICE } from "@/config/products";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { saveConfig as _saveConfig, SaveConfigArgs } from "./actions";
import { useRouter } from "next/navigation";
import { PhoneModel } from "@prisma/client";

interface DesignConfiguratorProps {
  configId: string;
  imageUrl: string;
  imageDimensions: { width: number; height: number };
}

const DesignConfigurator = ({
  configId,
  imageUrl,
  imageDimensions,
}: DesignConfiguratorProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const { mutate: saveConfig } = useMutation({
    mutationKey: ["save-config"],
    mutationFn: async (args: SaveConfigArgs) => {
      await Promise.all([saveConfiguration(), _saveConfig(args)]);
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "There was an error on our end. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.push(`/configure/preview?id=${configId}`);
    },
  });

  const [options, setOptions] = useState<{
    color: (typeof COLORS)[number];
    model: (typeof MODELS.options)[number];
    material: (typeof MATERIALS.options)[number];
    finish: (typeof FINISHES.options)[number];
  }>({
    color: COLORS[0],
    model: MODELS.options[0],
    material: MATERIALS.options[0],
    finish: FINISHES.options[0],
  });

  const [renderDimension, setRenderDimension] = useState({
    width: imageDimensions.width,
    height: imageDimensions.height,
  });

  const [renderPosition, setRenderPosition] = useState({
    //same value as Ren down there
    x: 150,
    y: 205,
  });
  const phoneCaseRef = useRef<HTMLDivElement>(null);
  const ContainerRef = useRef<HTMLDivElement>(null);

  const { startUpload } = useUploadThing("imageUploader");

  async function saveConfiguration() {
    // if (!phoneCaseRef) return; we can do this or add ! to the ref down there
    try {
      // to get the rectangle angles x and y of the image on the case
      const {
        left: caseLeft,
        top: caseTop,
        // the actual width of the phone case
        width,
        height,
      } = phoneCaseRef.current!.getBoundingClientRect();
      const { left: containerLeft, top: containerTop } =
        ContainerRef.current!.getBoundingClientRect();

      const leftOffset = caseLeft - containerLeft;
      const topOffset = caseTop - containerTop;

      const actualX = renderPosition.x - leftOffset;
      const actualY = renderPosition.y - topOffset;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      // to modify the canvas
      const ctx = canvas.getContext("2d");
      const userImage = new Image();
      userImage.crossOrigin = "anonymous";
      userImage.src = imageUrl;
      // waiting until the image is loaded
      await new Promise((resolve) => (userImage.onload = resolve));

      // draw on canvas
      ctx?.drawImage(
        userImage,
        actualX,
        actualY,
        renderDimension.width,
        renderDimension.height
      );
      // converting canvas to export it
      const base64 = canvas.toDataURL();
      const base64Data = base64.split(",")[1];

      // save the file but first convert it to image because it is string
      const blob = base64ToBlog(base64Data, "image/png");
      const file = new File([blob], "fileName", { type: "image/png" });

      await startUpload([file], { configId });
    } catch (error) {
      console.log(error);

      toast({
        title: "Something went wrong !",
        description: " please try again ",
        variant: "destructive",
      });
    }

    function base64ToBlog(base64: string, mineType: string) {
      const byteCharacters = atob(base64);
      const byteNymbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; ++i) {
        // pushing carachers to numbers
        byteNymbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNymbers);
      return new Blob([byteArray], { type: mineType });
    }
  }
  return (
    <div className="relative mt-20 grid grid-cols-1 lg:grid-cols-3 mb-20 pb-20">
      <div
        ref={ContainerRef}
        className="relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <div className="relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]">
          <AspectRatio
            ref={phoneCaseRef}
            ratio={896 / 1831}
            className="pointer-events-none relative z-50 aspect-[896/1831] w-full"
          >
            <NextImage
              fill
              alt="phone image"
              src="/phone-template.png"
              className="pointer-events-none z-50 select-none"
            />
          </AspectRatio>
          <div className=" absolute z-40 inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]" />
          <div
            style={{
              backgroundColor: `bg-${options.color.tw}`,
            }}
            className={cn(
              "absolute inset-0 left-[3px] top-px  right-[3px] bottom-px rounded-[32px] "
              // ` bg-${options.color.tw} `
            )}
          />
        </div>
        <Rnd
          className=" absolute z-20 border-[3px] border-primary"
          default={{
            x: 150,
            y: 205,
            height: imageDimensions.height / 4,
            width: imageDimensions.width / 4,
          }}
          lockAspectRatio
          resizeHandleComponent={{
            bottomRight: <HandleCompoenet />,
            bottomLeft: <HandleCompoenet />,
            topRight: <HandleCompoenet />,
            topLeft: <HandleCompoenet />,
          }}
          // toget the x,y of the resized image
          // ref is for the current image in Rand
          onResizeStop={(_, __, ref, ___, { x, y }) => {
            setRenderDimension({
              // sliced by -2 because the width ex: 20px we dont need px
              width: parseInt(ref.style.width.slice(0, -2)),
              height: parseInt(ref.style.height.slice(0, -2)),
            });
            setRenderPosition({
              x,
              y,
            });
          }}
          // to get the x,y of the draged image
          onDragStop={(_, data) => {
            const { x, y } = data;
            setRenderPosition({ x, y });
          }}
        >
          <div className=" relative h-full w-full ">
            <NextImage
              src={imageUrl}
              alt="userPhone"
              fill
              className=" pointer-events-none "
            />
          </div>
        </Rnd>
      </div>
      <div className=" h-[37.5rem] w-full col-span-full lg:col-span-1 flex flex-col bg-white">
        <ScrollArea className=" relative flex-1 overflow-auto">
          <div
            aria-hidden
            className=" absolute z-10 inset-x-0  bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none "
          />
          <div className=" px-8 pb-12 pt-8 ">
            <h2 className=" tracking-tight font-bold text-3xl ">
              Customize Your Case
            </h2>
            <div className=" w-full h-px bg-zinc-200 my-6 " />
            <div className=" relative mt-4 h-full flex flex-col ">
              <div className=" flex flex-col gap-6">
                <RadioGroup
                  value={options.color}
                  onChange={(val) => {
                    setOptions((prev) => ({
                      ...prev,
                      color: val,
                    }));
                  }}
                >
                  <Label>Color: {options.color.label}</Label>
                  <div className="mt-3 flex items-center space-x-3">
                    {COLORS.map((color) => (
                      <RadioGroup.Option
                        key={color.label}
                        value={color}
                        className={({ active, checked }) =>
                          cn(
                            "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent",
                            {
                              [`border-${color.tw}`]: active || checked,
                            }
                          )
                        }
                      >
                        <span
                          className={cn(
                            ` bg-${color.tw} `,
                            "h-8 w-8 rounded-full border border-black border-opacity-10"
                          )}
                        />
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
                <div className=" relative  flex flex-col gap-3 w-full">
                  <Label>Model</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {options.model.label}
                        <ChevronsUpDown className=" ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {MODELS.options.map((model) => (
                        <DropdownMenuItem
                          key={model.label}
                          className={cn(
                            "flex text-sm gap-1 w-full shadow-sm items-center p-2 px-5 cursor-default hover:bg-zinc-100",
                            {
                              "bg-zinc-100":
                                model.label === options.model.label,
                            }
                          )}
                          onClick={() => {
                            setOptions((prev) => ({ ...prev, model }));
                          }}
                        >
                          <Check
                            className={
                              (cn(" mr-2 h-4 w-4 "),
                              model.label === options.model.label)
                                ? "opacity-10"
                                : "opacity-0"
                            }
                          />
                          {model.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {[MATERIALS, FINISHES].map(
                  ({ name, options: selectobleOptions }) => (
                    <RadioGroup
                      key={name}
                      value={options[name]}
                      onChange={(val) => {
                        setOptions((prev) => ({
                          ...prev,
                          // we put it in [] because it is dynamic ( material or finish )
                          [name]: val,
                        }));
                      }}
                    >
                      <Label>
                        {/* to make it uppercase  */}
                        {name.slice(0, 1).toUpperCase() + name.slice(1)}
                      </Label>
                      <div className=" mt-3 space-y-4">
                        {selectobleOptions.map((option) => (
                          <RadioGroup.Option
                            key={option.value}
                            value={option}
                            className={({ active, checked }) =>
                              cn(
                                " relative block cursor-pointer rounded-lg px-6 py-4 shadow-md border-2 border-zinc-200 focus:outline-none ring-0 focus:ring-0 outline-none sm:flex sm:justify-between ",
                                {
                                  "border-primary": active || checked,
                                }
                              )
                            }
                          >
                            <span className=" flex items-center">
                              <span className=" flex flex-col text-sm">
                                <RadioGroup.Label
                                  className="font-medium text-gray-900"
                                  as="span"
                                >
                                  {option.label}
                                </RadioGroup.Label>
                                {option.description ? (
                                  <RadioGroup.Description className="text-gray-500">
                                    {" "}
                                    <span className="block sm:inline">
                                      {option.description}
                                    </span>
                                  </RadioGroup.Description>
                                ) : null}
                              </span>
                            </span>
                            <RadioGroup.Description
                              as="span"
                              className="mt-2 flex text-sm sm:ml-4 sm:mt0
                             sm:flex-col sm:text-right"
                            >
                              <span className=" font-medium text-gray-900">
                                {fromatPrice(option.price / 100)}
                              </span>
                            </RadioGroup.Description>
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  )
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className=" w-full px-8 h-1/6 bg-white">
          {/* seperator  */}
          <div className=" h-px w-full bg-zinc-200 " />
          <div className=" w-full h-full flex justify-end items-center">
            <div className=" w-full flex gap-6 items-center">
              <p className=" font-medium whitespace-nowrap">
                {fromatPrice(
                  (BASE_PRICE + options.finish.price + options.material.price) /
                    100
                )}
              </p>
              <Button
                onClick={() =>
                  saveConfig({
                    color: options.color.value,
                    finish: options.finish.value,
                    material: options.material.value,
                    model: options.model.value as PhoneModel,
                    configId,
                  })
                }
                size="sm"
                className=" w-full"
              >
                Contiue
                <ArrowRight className=" h-4 w-4 ml-1.5 inline-block" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignConfigurator;
