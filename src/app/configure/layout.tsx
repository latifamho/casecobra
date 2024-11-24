import MaxWithWrapper from "@/app/component/maxwithwrapper";
import { ReactNode } from "react";
import Steps from "../component/steps";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <MaxWithWrapper className=" flex-1  flex flex-col">
      <Steps/>
      {children}
      </MaxWithWrapper>
  );
};
export default Layout;
