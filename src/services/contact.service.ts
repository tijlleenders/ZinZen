import { ILevelGoals } from "@src/api/GoalsAPI";
import { LocalStorageKeys } from "@src/constants/localStorageKeys";
import {
  API_SERVER_URL_GOAL_SHARING_PRODUCTION,
  API_SERVER_URL_RELATIONSHIPS_PRODUCTION,
} from "@src/constants/serverUrls";
import { SharedGoalMessageResponse } from "@src/Interfaces/IContactMessages";
import { GoalItem, IParticipant } from "@src/models/GoalItem";
import { typeOfChange } from "@src/models/InboxItem";
import { createContactRequest, getInstallId } from "@src/utils";
import { SharedGoalItem } from "@src/utils/sharedGoalUtils";

export const initRelationship = async () => {
  const url = API_SERVER_URL_RELATIONSHIPS_PRODUCTION;

  const res = await createContactRequest(url, { method: "initiateRelationship", installId: getInstallId() });
  if (res.success) {
    const { relId } = res.response;
    return { success: true, response: { installId: getInstallId(), relId } };
  }
  return res;
};

export const acceptRelationship = async () => {
  const relId = window.location.pathname.split("/invite/")[1];
  const url = API_SERVER_URL_RELATIONSHIPS_PRODUCTION;
  const res = await createContactRequest(url, { method: "acceptRelationship", installId: getInstallId(), relId });
  return res;
};

export const shareGoalWithContact = async (relId: string, levelGoalsNode: ILevelGoals[], sharedAncestorId: string) => {
  const url = API_SERVER_URL_GOAL_SHARING_PRODUCTION;
  const res = await createContactRequest(url, {
    method: "shareMessage",
    installId: getInstallId(),
    relId,
    event: { type: "shareMessage", levelGoalsNode, sharedAncestorId },
  });
  return res;
};

export const collaborateWithContact = async (relId: string, goal: GoalItem) => {
  const url = API_SERVER_URL_GOAL_SHARING_PRODUCTION;
  const res = await createContactRequest(url, {
    method: "shareMessage",
    installId: getInstallId(),
    relId,
    event: { type: "collaborationInvite", goal },
  });
  return res;
};

// export const getContactSharedGoals = async (): Promise<SharedGoalMessageResponse> => {
//   const lastProcessedTimestamp = localStorage.getItem(LocalStorageKeys.LAST_PROCESSED_TIMESTAMP) ?? "";
//   const url = "https://x7phxjeuwd4aqpgbde6f74s4ey0yobfi.lambda-url.eu-west-1.on.aws/";
//   const res = await createContactRequest(url, {
//     method: "getMessages",
//     installId: getInstallId(),
//     ...(lastProcessedTimestamp ? { lastProcessedTimestamp } : {}),
//   });
//   const parsed = res as SharedGoalMessageResponse;
//   if (parsed.success && parsed.response?.length > 0) {
//     localStorage.setItem(LocalStorageKeys.LAST_PROCESSED_TIMESTAMP, `${new Date().toISOString()}`);
//   }
//   return parsed;
// };

export const getContactSharedGoals = async (): Promise<SharedGoalMessageResponse> => {
  // read the last processed message id from localStorage
  const lastProcessedMessageId = localStorage.getItem(LocalStorageKeys.LAST_PROCESSED_TIMESTAMP);

  const url = API_SERVER_URL_GOAL_SHARING_PRODUCTION;
  const res = await createContactRequest(url, {
    method: "getMessages",
    installId: getInstallId(),
    ...(lastProcessedMessageId ? { lastProcessedMessageId } : {}),
  });

  // find the newest messageId from the response and store it
  const parsed = res as SharedGoalMessageResponse;

  // 2. ensure response is valid
  if (parsed.success && parsed.response?.length > 0) {
    // 3. find the last messageId (they should be ordered by backend query on SK)
    console.log("parsed", parsed);
    const latestMessageId = parsed.response[parsed.response.length - 1].messageId;

    // 4. persist it for next request
    localStorage.setItem(LocalStorageKeys.LAST_PROCESSED_TIMESTAMP, latestMessageId);
  }

  return parsed;
};

export const getRelationshipStatus = async (relationshipId: string) => {
  const url = API_SERVER_URL_RELATIONSHIPS_PRODUCTION;
  const res = await createContactRequest(url, {
    method: "getRelationshipStatus",
    installId: getInstallId(),
    relationshipId,
  });
  return res;
};

export const sendUpdatesToSubscriber = async (
  sub: IParticipant,
  notificationGoalId: string,
  changeType: typeOfChange,
  changes: { level: number; goal: SharedGoalItem }[] | { level: number; id: string; timestamp: number }[],
  customEventType = "",
) => {
  const url = API_SERVER_URL_GOAL_SHARING_PRODUCTION;
  const { relId, type } = sub;
  const changesWithParticipants = changes.map((change) => {
    if ("goal" in change) {
      const { participants, ...goalWithoutParticipants } = change.goal;
      return { ...change, goal: goalWithoutParticipants };
    }
    return change;
  });
  const requestBody = {
    method: "shareMessage",
    installId: getInstallId(),
    relId,
    debugKey: "82098435-380a-43ec-9122-0662870a5ea5",
    event: {
      type: customEventType !== "" ? customEventType : type,
      changeType,
      notificationGoalId,
      changes: changesWithParticipants,
      timestamp: Date.now(),
    },
  };
  const res = await createContactRequest(url, requestBody);
  return res;
};
