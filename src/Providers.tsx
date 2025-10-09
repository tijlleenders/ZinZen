import React, { ReactNode } from "react";
import { QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";
import { ReactQueryDevtools } from "react-query/devtools";
import { queryClient } from "./router";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} position="top-right" />
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export default Providers;
