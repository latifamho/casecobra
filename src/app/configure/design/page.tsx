import { db } from "@/app/db";
import { notFound } from "next/navigation";
import DesignConfigurator from "./designConfigerator";

// it means that the params could be a lot of variables as long as they are string
interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const { id } = searchParams;
  // throw 404 page error if the id is not string
  if (!id || typeof id !== "string") {
    return notFound();
  }
  // make a db call in server to get the image
  
    const configuration = await db.configuration.findUnique({
      where: { id },
    });
  if (!configuration) {
    return notFound();
  }

  const { imageUrl, width, height } = configuration;
  
  return (
    <DesignConfigurator
      configId={configuration.id}
      imageDimensions={{ width, height }}
      imageUrl={imageUrl}
    />
  );
};
export default Page;
