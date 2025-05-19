import React, { ReactNode } from "react";
import { MutationCache, QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";
import { ReactQueryDevtools } from "react-query/devtools";

const EXCLUDED_MUTATION_KEYS = ["archiveGoal", "addGoal", "updatePositions"];

const Providers = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    mutationCache: new MutationCache({
      onSuccess: (data, variables, context, mutation) => {
        const { mutationKey } = mutation.options;
        console.log(mutationKey);
        if (mutationKey && !EXCLUDED_MUTATION_KEYS.includes(mutationKey as string)) {
          queryClient.invalidateQueries({ queryKey: mutationKey });
        }
      },
    }),
  });
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
