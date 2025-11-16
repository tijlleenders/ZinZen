/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRouter } from "@tanstack/react-router";
import { QueryClient, MutationCache } from "react-query";
import { ActionModal } from "@components/GoalsComponents/MyGoal/MyGoal";
import { routeTree } from "./routeTree.gen";

const EXCLUDED_MUTATION_KEYS = ["archiveGoal", "addGoal", "updatePositions"];

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: (data, variables, context, mutation) => {
      const { mutationKey } = mutation.options;
      if (mutationKey && !EXCLUDED_MUTATION_KEYS.includes(mutationKey as unknown as string)) {
        queryClient.invalidateQueries({ queryKey: mutationKey });
      }
      // queryClient.invalidateQueries({ queryKey: ["scheduler"] });
    },
  }),
});

export const router = createRouter({ routeTree, defaultPreload: "viewport", context: { queryClient } });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }

  // // Extend HistoryState to match ILocationState
  interface HistoryState {
    goalsHistory?: Array<{ goalID: string; goalColor: string; goalTitle: string }>;
    displayUpdateGoal?: string;
    rootGoalId?: string;
    activeGoalId?: string;
    displayAddGoal?: string;
    displayShareModal?: any;
    displayConfirmation?: any;
    displayNoteModal?: number;
    actionModalType?: ActionModal;
    displaySearch?: boolean;
    from?: string;
    displayFocus?: boolean;
    note?: string;
  }
}
