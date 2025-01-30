import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";

import { lastAction, displayConfirmation, openDevMode, languageSelectionState, displayToast } from "@src/store";
import { getTheme } from "@src/store/ThemeState";
import { GoalItem, IParticipant } from "@src/models/GoalItem";
import { checkMagicGoal, getAllLevelGoalsOfId, getGoal, updateSharedStatusOfGoal } from "@src/api/GoalsAPI";
import { addSharedWMGoal } from "@src/api/SharedWMAPI";
import { createDefaultGoals } from "@src/controllers/NewUserController";
import { refreshTaskCollection } from "@src/api/TasksAPI";
import { checkAndUpdateGoalNewUpdatesStatus, handleIncomingChanges } from "@src/helpers/InboxProcessor";
import { getContactSharedGoals, shareGoalWithContact } from "@src/services/contact.service";
import { updateAllUnacceptedContacts, getContactByRelId, clearTheQueue } from "@src/api/ContactsAPI";
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import { scheduledHintCalls } from "@src/api/HintsAPI/ScheduledHintCall";
import { LocalStorageKeys } from "@src/constants/localStorageKeys";
import { checkAndCleanupTrash } from "@src/api/TrashAPI";
import ContactItem from "@src/models/ContactItem";
import { SharedGoalMessage } from "@src/Interfaces/IContactMessages";
import { checkAndCleanupDoneTodayCollection } from "@src/controllers/TaskDoneTodayController";
import { getAllInboxItems } from "@src/api/InboxAPI";
import { Payload } from "@src/models/InboxItem";

const langFromStorage = localStorage.getItem(LocalStorageKeys.LANGUAGE)?.slice(1, -1);
const exceptionRoutes = ["/", "/invest", "/feedback", "/donate"];

function useApp() {
  const language = useRecoilValue(languageSelectionState);
  const isLanguageChosen = language !== "No language chosen.";

  const setLastAction = useSetRecoilState(lastAction);
  const setShowToast = useSetRecoilState(displayToast);
  const [devMode, setDevMode] = useRecoilState(openDevMode);

  const confirmationState = useRecoilValue(displayConfirmation);

  const handleNewIncomingGoal = async (ele: SharedGoalMessage, contactItem: ContactItem, relId: string) => {
    const { goalWithChildrens }: { goalWithChildrens: GoalItem[] } = ele;
    const participant: IParticipant = {
      name: contactItem.name,
      relId,
      type: "sharer",
      following: true,
    };
    try {
      await Promise.all(
        goalWithChildrens.map(async (goal) => {
          const goalWithParticipant = {
            ...goal,
            participants: [participant],
          };
          console.log("🚀 ~ file: useApp.tsx:52 ~ goalWithParticipant:", goalWithParticipant);
          await addSharedWMGoal(goalWithParticipant).then(() => {
            setLastAction("goalNewUpdates");
          });
        }),
      );
    } catch (error) {
      console.error("[useApp] Error adding shared goals:", error);
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
                  await Promise.all(
                    goalWithChildrens.map(async (goalItem) => {
                      console.log(goalItem.id, relId, name);
                      await updateSharedStatusOfGoal(goalItem.id, relId, name);
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
      const res = await getContactSharedGoals();
      const resObject = res.response.reduce(
        (acc: { [key: string]: SharedGoalMessage[] }, curr) => ({
          ...acc,
          [curr.relId]: [...(acc[curr.relId] || []), curr],
        }),
        {},
      );
      if (res.success) {
        const processChangesSequentially = async (
          changes: SharedGoalMessage[],
          contactItem: ContactItem,
          relId: string,
        ) => {
          for (const change of changes) {
            try {
              if (change.type === "shareMessage") {
                await handleNewIncomingGoal(change, contactItem, relId);
              } else if (["sharer", "suggestion"].includes(change.type)) {
                await handleIncomingChanges(change as unknown as Payload, relId);
                setLastAction("goalNewUpdates");
              }
            } catch (error) {
              console.error("Error processing change:", error);
            }
          }
        };
        Object.keys(resObject).forEach(async (relId: string) => {
          const contactItem = await getContactByRelId(relId);
          if (contactItem) {
            await processChangesSequentially(resObject[relId], contactItem, relId);
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
    checkAndCleanupDoneTodayCollection();
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
        setLastAction("TaskCollectionRefreshed");
      });
    }
  }, []);
  return {
    isLanguageChosen,
  };
}

export default useApp;
