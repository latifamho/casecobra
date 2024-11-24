import { notFound } from "next/navigation";
import { db } from "../db";
import ThankYou from "./thankYou";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const { id } = searchParams;
  if (!id || typeof id !== "string") {
    return notFound();
  }

  const configuration = await db.configuration.findUnique({
    where: { id },
  });

  if (!configuration) {
    return notFound();
  }
  return <ThankYou configuration={configuration} />;
};
export default Page;
