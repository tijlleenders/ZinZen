import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";

import { lastAction, displayConfirmation, openDevMode, languageSelectionState, displayToast } from "@src/store";
import { getTheme } from "@src/store/ThemeState";
import { checkMagicGoal, getAllLevelGoalsOfId, getGoal, updateSharedStatusOfGoal } from "@src/api/GoalsAPI";
import { addSharedWMGoal, getSharedWMGoal, updateSharedWMGoal } from "@src/api/SharedWMAPI";
import { createDefaultGoals } from "@src/controllers/NewUserController";
import { refreshTaskCollection } from "@src/api/TasksAPI";
import { checkAndUpdateGoalNewUpdatesStatus, handleIncomingChanges } from "@src/helpers/InboxProcessor";
import { getContactSharedGoals, shareGoalWithContact } from "@src/services/contact.service";
import { updateAllUnacceptedContacts, getContactByRelId, clearTheQueue } from "@src/api/ContactsAPI";
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import { scheduledHintCalls } from "@src/api/HintsAPI/ScheduledHintCall";
import { LocalStorageKeys } from "@src/constants/localStorageKeys";
import { checkAndCleanupTrash } from "@src/api/TrashAPI";
import { SharedGoalMessage } from "@src/Interfaces/IContactMessages";
import { getAllInboxItems } from "@src/api/InboxAPI";
import { Payload } from "@src/models/InboxItem";
import { useQuery } from "react-query";
import { GoalActions, TaskActions } from "@src/constants/actions";

const langFromStorage = localStorage.getItem(LocalStorageKeys.LANGUAGE)?.slice(1, -1);
const exceptionRoutes = ["/", "/invest", "/feedback", "/donate"];

function useApp() {
  const language = useRecoilValue(languageSelectionState);
  const isLanguageChosen = language !== "No language chosen.";

  const setLastAction = useSetRecoilState(lastAction);
  const setShowToast = useSetRecoilState(displayToast);
  const [devMode, setDevMode] = useRecoilState(openDevMode);

  const confirmationState = useRecoilValue(displayConfirmation);

  const handleNewIncomingGoal = async (ele: SharedGoalMessage, relId: string) => {
    const { levelGoalsNode } = ele;

    try {
      await Promise.all(
        levelGoalsNode.map(async (goalNode, index) => {
          const { goals } = goalNode;
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
    getAllInboxItems().then((inboxItems) => {
      inboxItems.forEach((inboxItem) => {
        if (inboxItem.id !== "root" && Object.keys(inboxItem.changes).length > 0) {
          checkAndUpdateGoalNewUpdatesStatus(inboxItem.id);
        }
      });
    });
  }, []);

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

  useEffect(() => {
    const init = async () => {
      updateAllUnacceptedContacts().then(async (contacts) => {
        if (contacts.length === 0) {
          return;
        }
        setShowToast({
          open: true,
          message: `${contacts.map(({ name }) => name).join(", ")} accepted your invite`,
          extra: "Enjoy sharing goals",
        });
        await Promise.allSettled(
          contacts.map(async (contact) => {
            const { goalsToBeShared, relId, name } = contact;
            return Promise.allSettled([
              ...goalsToBeShared.map(async (goalId) => {
                const goal = await getGoal(goalId);
                if (!goal) {
                  return null;
                }
                const goalWithChildrens = await getAllLevelGoalsOfId(goalId, true);
                const validGoals = goalWithChildrens.map((goalNode) => ({
                  ...goalNode,
                  goals: goalNode.goals.map((goalItem) => ({
                    ...goalItem,
                    participants: [],
                    parentGoalId: goalItem.id === goal.id ? "root" : goalItem.parentGoalId,
                    notificationGoalId: goal.id,
                  })),
                }));
                return shareGoalWithContact(relId, validGoals).then(async () => {
                  await Promise.all(
                    validGoals.map(async (goalNode) => {
                      goalNode.goals.map(async (goalItem) => {
                        await updateSharedStatusOfGoal(goalItem.id, relId, name);
                      });
                    }),
                  ).catch((error) => {
                    console.error("[shareGoalWithRelId] Error updating shared status:", error);
                  });
                });
              }),
              clearTheQueue(relId),
            ]);
          }),
        );
      });

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
    const installId = localStorage.getItem(LocalStorageKeys.INSTALL_ID);
    if (!installId) {
      localStorage.setItem(LocalStorageKeys.INSTALL_ID, uuidv4());
      localStorage.setItem(LocalStorageKeys.CHECKED_IN, "on");
      localStorage.setItem(LocalStorageKeys.THEME, JSON.stringify(getTheme()));
    } else {
      init();
    }
    const currentPath = window.location.pathname.toLowerCase();
    if (!isLanguageChosen && !exceptionRoutes.includes(currentPath)) {
      window.open("/", "_self");
    }
  }, [langFromStorage, sharedGoalsData]);

  useEffect(() => {
    localStorage.setItem(LocalStorageKeys.CONFIRMATION_STATE, JSON.stringify(confirmationState));
  }, [confirmationState]);

  // Check for missed hint calls
  useEffect(() => {
    scheduledHintCalls()
      .then(() => {
        console.log("Checked for missed hint calls.");
      })
      .catch((error) => {
        console.error("Failed to check for missed hint calls:", error);
      });
  }, []);

  useEffect(() => {
    checkAndCleanupTrash();
  }, []);

  useEffect(() => {
    const checkDevMode = async () => {
      const isDevMode = await checkMagicGoal();
      if (!devMode && isDevMode) {
        setDevMode(isDevMode);
      }
    };
    const checkUpdates = async () => {
      navigator.serviceWorker
        .register("./service-worker.js")
        .then((registration) => {
          if (registration.waiting) {
            registration.waiting?.postMessage({ type: "SKIP_WAITING" });
            window.location.reload();
          }
        })
        .catch((err) => console.log(err));
    };
    checkUpdates();
    checkDevMode();
    createDefaultGoals();
  }, []);

  useEffect(() => {
    const lastRefresh = localStorage.getItem(LocalStorageKeys.LAST_REFRESH);
    const today = new Date().toLocaleDateString();
    if (lastRefresh !== today) {
      refreshTaskCollection().then(() => {
        localStorage.setItem(LocalStorageKeys.LAST_REFRESH, today);
        setLastAction(TaskActions.TASK_COLLECTION_REFRESHED);
      });
    }
  }, []);
  return {
    isLanguageChosen,
  };
}

export default useApp;
