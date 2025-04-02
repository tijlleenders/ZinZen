import { getContactByRelId } from "@src/api/ContactsAPI";
import { createSharedGoalMetadata } from "@src/api/SharedGoalNotMoved";
import { addSharedWMGoal, getSharedWMGoal, updateSharedWMGoal } from "@src/api/SharedWMAPI";
import { GoalActions } from "@src/constants/actions";
import { handleIncomingChanges } from "@src/helpers/InboxProcessor";
import { SharedGoalMessage } from "@src/Interfaces/IContactMessages";
import { Payload } from "@src/models/InboxItem";
import { getContactSharedGoals } from "@src/services/contact.service";
import { lastAction } from "@src/store";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useSetRecoilState } from "recoil";

export const useProcessSharedGoalData = () => {
  const setLastAction = useSetRecoilState(lastAction);

  const { data: sharedGoalsData } = useQuery({
    queryKey: ["contactSharedGoals"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await getContactSharedGoals();
      if (!res.success) {
        throw new Error("Failed to fetch shared goals");
      }
      return res.response.reduce(
        (acc: { [key: string]: SharedGoalMessage[] }, curr) => ({
          ...acc,
          [curr.relId]: [...(acc[curr.relId] || []), curr],
        }),
        {},
      );
    },
  });

  console.log("sharedGoalsData", sharedGoalsData);

  const handleNewIncomingGoal = async (ele: SharedGoalMessage, relId: string) => {
    const { levelGoalsNode, sharedAncestorId } = ele;

    try {
      await Promise.all(
        levelGoalsNode.map(async (goalNode) => {
          const { goals, parentId: tempParentGoalId } = goalNode;
          await Promise.all(
            goals.map(async (goal) => {
              try {
                const existingGoal = await getSharedWMGoal(goal.id);
                if (existingGoal) {
                  const { parentGoalId } = goal;
                  if (parentGoalId === "root") {
                    console.log("No parent goal id");
                    return;
                  }
                  await updateSharedWMGoal(goal.id, {
                    ...existingGoal,
                    parentGoalId,
                  });
                } else {
                  await addSharedWMGoal(goal, relId);
                  await createSharedGoalMetadata(goal.id, tempParentGoalId, sharedAncestorId);
                }
              } catch (error) {
                console.error("[handleNewIncomingGoal] Error processing goal:", error);
              }
            }),
          );
        }),
      );

      setLastAction(GoalActions.GOAL_NEW_UPDATES);
    } catch (error) {
      console.error("[useApp] Error processing shared goals:", error);
    }
  };

  useEffect(() => {
    const processSharedGoals = async () => {
      if (sharedGoalsData) {
        // Process all relIds in parallel using Promise.all
        await Promise.all(
          Object.keys(sharedGoalsData).map(async (relId) => {
            const contactItem = await getContactByRelId(relId);
            if (contactItem) {
              // Process all changes for this contact in parallel
              const changes = sharedGoalsData[relId];
              await Promise.all(
                changes.map(async (change) => {
                  try {
                    if (change.type === "shareMessage") {
                      console.log("change", change);
                      await handleNewIncomingGoal(change, relId);
                    } else if (["sharer", "suggestion"].includes(change.type)) {
                      await handleIncomingChanges(change as unknown as Payload, relId);
                      setLastAction(GoalActions.GOAL_NEW_UPDATES);
                    }
                  } catch (error) {
                    console.error("Error processing change:", error);
                  }
                }),
              );
            }
          }),
        );
      }
    };
    processSharedGoals();
  }, [sharedGoalsData]);
};
