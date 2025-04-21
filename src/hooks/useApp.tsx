import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";

import { lastAction, displayConfirmation, openDevMode, languageSelectionState, displayToast } from "@src/store";
import { getTheme } from "@src/store/ThemeState";
import { checkMagicGoal, getAllLevelGoalsOfId, getGoal, updateSharedStatusOfGoal } from "@src/api/GoalsAPI";
import { createDefaultGoals } from "@src/controllers/NewUserController";
import { refreshTaskCollection } from "@src/api/TasksAPI";
import { shareGoalWithContact } from "@src/services/contact.service";
import { updateAllUnacceptedContacts, clearTheQueue } from "@src/api/ContactsAPI";
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import { scheduledHintCalls } from "@src/api/HintsAPI/ScheduledHintCall";
import { LocalStorageKeys } from "@src/constants/localStorageKeys";
import { checkAndCleanupTrash } from "@src/api/TrashAPI";
import { TaskActions } from "@src/constants/actions";
import useScheduler from "./useScheduler";
import { findMostRecentSharedAncestor } from "@components/MoveGoal/MoveGoalHelper";

const langFromStorage = localStorage.getItem(LocalStorageKeys.LANGUAGE)?.slice(1, -1);
const exceptionRoutes = ["/", "/invest", "/feedback", "/donate"];

function useApp() {
  const language = useRecoilValue(languageSelectionState);
  const isLanguageChosen = language !== "No language chosen.";

  const setLastAction = useSetRecoilState(lastAction);
  const setShowToast = useSetRecoilState(displayToast);
  const [devMode, setDevMode] = useRecoilState(openDevMode);
  const { generateInitialSchedule } = useScheduler();

  const confirmationState = useRecoilValue(displayConfirmation);

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
                const sharedAncestorId = await findMostRecentSharedAncestor(goal.parentGoalId, relId);
                const goalWithChildrens = await getAllLevelGoalsOfId(goalId, true);
                const validGoals = goalWithChildrens.map((goalNode) => ({
                  ...goalNode,
                  goals: goalNode.goals.map((goalItem) => ({
                    ...goalItem,
                    participants: [],
                    parentGoalId: goalItem.id === goal.id ? "root" : goalItem.parentGoalId,
                    notificationGoalId: goalItem.id === goal.id ? goal.id : goalItem.notificationGoalId,
                  })),
                }));
                return shareGoalWithContact(relId, validGoals, sharedAncestorId).then(async () => {
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
  }, [langFromStorage]);

  useEffect(() => {
    localStorage.setItem(LocalStorageKeys.CONFIRMATION_STATE, JSON.stringify(confirmationState));
  }, [confirmationState]);

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
    const initializeApp = async () => {
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

      await checkUpdates();
      await checkDevMode();
      await createDefaultGoals();
      try {
        await generateInitialSchedule();
      } catch (error) {
        console.error("Failed to generate initial schedule:", error);
      }
    };

    initializeApp();
  }, [generateInitialSchedule, setDevMode, devMode]);

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
