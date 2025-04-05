/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
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
      for (const goalNode of levelGoalsNode) {
        const { goals, parentId: tempParentGoalId } = goalNode;

        for (const goal of goals) {
          try {
            const existingGoal = await getSharedWMGoal(goal.id);
            const isSharedParentGoalAvailable = await getSharedWMGoal(goal.parentGoalId);

            if (existingGoal) {
              const { parentGoalId } = goal;
              if (parentGoalId !== "root") {
                await updateSharedWMGoal(goal.id, {
                  ...existingGoal,
                  parentGoalId: isSharedParentGoalAvailable ? parentGoalId : "root",
                });
              } else {
                console.log("No parent goal id");
              }
            } else {
              await addSharedWMGoal(
                { ...goal, parentGoalId: isSharedParentGoalAvailable ? goal.parentGoalId : "root" },
                relId,
              );
              await createSharedGoalMetadata(goal.id, tempParentGoalId, sharedAncestorId);
            }
          } catch (error) {
            console.error("[handleNewIncomingGoal] Error processing goal:", error);
          }
        }
      }

      setLastAction(GoalActions.GOAL_NEW_UPDATES);
    } catch (error) {
      console.error("[useApp] Error processing shared goals:", error);
    }
  };

  useEffect(() => {
    const processSharedGoals = async () => {
      if (sharedGoalsData) {
        // we need to process the updates sequentially thus cant use Promise.all
        for (const relId of Object.keys(sharedGoalsData)) {
          try {
            const contactItem = await getContactByRelId(relId);
            if (contactItem) {
              const changes = sharedGoalsData[relId];
              for (const change of changes) {
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
              }
            }
          } catch (error) {
            console.error(`Error processing relId ${relId}:`, error);
          }
        }
      }
    };
    processSharedGoals();
  }, [sharedGoalsData]);
};
