import { ILevelGoals } from "@src/api/GoalsAPI";
import { LocalStorageKeys } from "@src/constants/localStorageKeys";
import { SharedGoalMessageResponse } from "@src/Interfaces/IContactMessages";
import { GoalItem, IParticipant } from "@src/models/GoalItem";
import { typeOfChange } from "@src/models/InboxItem";
import { createContactRequest, getInstallId } from "@src/utils";

export const initRelationship = async () => {
  const url = "https://sfk3sq5mfzgfjfy3hytp4tmon40bbjpu.lambda-url.eu-west-1.on.aws/";

  const res = await createContactRequest(url, { method: "initiateRelationship", installId: getInstallId() });
  if (res.success) {
    const { relId } = res.response;
    return { success: true, response: { installId: getInstallId(), relId } };
  }
  return res;
};

export const acceptRelationship = async () => {
  const relId = window.location.pathname.split("/invite/")[1];
  const url = "https://sfk3sq5mfzgfjfy3hytp4tmon40bbjpu.lambda-url.eu-west-1.on.aws/";
  const res = await createContactRequest(url, { method: "acceptRelationship", installId: getInstallId(), relId });
  return res;
};

export const shareGoalWithContact = async (relId: string, levelGoalsNode: ILevelGoals[], sharedAncestorId: string) => {
  const url = "https://x7phxjeuwd4aqpgbde6f74s4ey0yobfi.lambda-url.eu-west-1.on.aws/";
  const res = await createContactRequest(url, {
    method: "shareMessage",
    installId: getInstallId(),
    relId,
    event: { type: "shareMessage", levelGoalsNode, sharedAncestorId },
  });
  return res;
};

export const collaborateWithContact = async (relId: string, goal: GoalItem) => {
  const url = "https://x7phxjeuwd4aqpgbde6f74s4ey0yobfi.lambda-url.eu-west-1.on.aws/";
  const res = await createContactRequest(url, {
    method: "shareMessage",
    installId: getInstallId(),
    relId,
    event: { type: "collaborationInvite", goal },
  });
  return res;
};

export const getContactSharedGoals = async (): Promise<SharedGoalMessageResponse> => {
  const lastProcessedTimestamp = new Date(
    Number(localStorage.getItem(LocalStorageKeys.LAST_PROCESSED_TIMESTAMP)),
  ).toISOString();
  const url = "https://x7phxjeuwd4aqpgbde6f74s4ey0yobfi.lambda-url.eu-west-1.on.aws/";
  const res = await createContactRequest(url, {
    method: "getMessages",
    installId: getInstallId(),
    ...(lastProcessedTimestamp ? { lastProcessedTimestamp } : {}),
  });
  localStorage.setItem(LocalStorageKeys.LAST_PROCESSED_TIMESTAMP, `${Date.now()}`);
  return res as SharedGoalMessageResponse;
};

export const getRelationshipStatus = async (relationshipId: string) => {
  const url = "https://sfk3sq5mfzgfjfy3hytp4tmon40bbjpu.lambda-url.eu-west-1.on.aws/";
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
  changes: { level: number; goal: GoalItem }[] | { level: number; id: string; timestamp: number }[],
  customEventType = "",
) => {
  const url = "https://x7phxjeuwd4aqpgbde6f74s4ey0yobfi.lambda-url.eu-west-1.on.aws/";
  const { relId, type } = sub;
  const requestBody = {
    method: "shareMessage",
    installId: getInstallId(),
    relId,
    debugKey: "82098435-380a-43ec-9122-0662870a5ea5",
    event: {
      type: customEventType !== "" ? customEventType : type,
      changeType,
      notificationGoalId,
      changes,
      timestamp: Date.now(),
    },
  };
  const res = await createContactRequest(url, requestBody);
  return res;
};
