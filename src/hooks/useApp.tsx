import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";

import { lastAction, displayConfirmation, openDevMode, languageSelectionState, displayToast } from "@src/store";
import { getTheme } from "@src/store/ThemeState";
import { GoalItem } from "@src/models/GoalItem";
import { checkMagicGoal, getAllLevelGoalsOfId, getGoal, updateSharedStatusOfGoal } from "@src/api/GoalsAPI";
import { addSharedWMGoal } from "@src/api/SharedWMAPI";
import { createDefaultGoals } from "@src/controllers/NewUserController";
import { refreshTaskCollection } from "@src/api/TasksAPI";
import { handleIncomingChanges } from "@src/helpers/InboxProcessor";
import { getContactSharedGoals, shareGoalWithContact } from "@src/services/contact.service";
import { updateAllUnacceptedContacts, getContactByRelId, clearTheQueue } from "@src/api/ContactsAPI";
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import { scheduledHintCalls } from "@src/api/HintsAPI/ScheduledHintCall";
import { LocalStorageKeys } from "@src/constants/localStorageKeys";
import { checkAndCleanupTrash } from "@src/api/TrashAPI";
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
                const goal = getGoal(goalId);
                if (!goal) {
                  return null;
                }
                const goalWithChildrens = await getAllLevelGoalsOfId(goalId, true);
                return shareGoalWithContact(relId, [
                  ...goalWithChildrens.map((ele) => ({
                    ...ele,
                    participants: [],
                    parentGoalId: ele.id === goalId ? "root" : ele.parentGoalId,
                    rootGoalId: goalId,
                  })),
                ]).then(async () => {
                  updateSharedStatusOfGoal(goalId, relId, name).then(() => console.log("status updated"));
                });
              }),
              clearTheQueue(relId),
            ]);
          }),
        );
      });
      const res = await getContactSharedGoals();
      // @ts-ignore
      const resObject = res.response.reduce(
        (acc, curr) => ({ ...acc, [curr.relId]: [...(acc[curr.relId] || []), curr] }),
        {},
      );
      if (res.success) {
        Object.keys(resObject).forEach(async (relId: string) => {
          const contactItem = await getContactByRelId(relId);
          if (contactItem) {
            // @ts-ignore
            resObject[relId].forEach(async (ele) => {
              console.log("🚀 ~ file: useApp.tsx:45 ~ resObject[relId].forEach ~ ele:", ele);
              if (ele.type === "shareMessage") {
                const { goalWithChildrens }: { goalWithChildrens: GoalItem[] } = ele;
                const rootGoal = goalWithChildrens[0];
                rootGoal.participants.push({
                  name: contactItem.name,
                  relId,
                  type: "sharer",
                  following: true,
                });
                addSharedWMGoal(rootGoal)
                  .then(() => {
                    goalWithChildrens.slice(1).forEach((goal) => {
                      addSharedWMGoal(goal).catch((err) => console.log(`Failed to add in inbox ${goal.title}`, err));
                    });
                  })
                  .then(() => {
                    setLastAction(GoalActions.GOAL_NEW_UPDATES);
                  })
                  .catch((err) => console.log(`Failed to add root goal ${rootGoal.title}`, err));
              } else if (["sharer", "suggestion"].includes(ele.type)) {
                handleIncomingChanges(ele, relId).then(() => setLastAction(GoalActions.GOAL_NEW_UPDATES));
              }
            });
          }
        });
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
  }, [langFromStorage]);

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
