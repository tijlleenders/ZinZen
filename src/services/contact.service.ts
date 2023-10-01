import { GoalItem, IParticipant } from "@src/models/GoalItem";
import { typeOfChange } from "@src/models/InboxItem";
import { createContactRequest, getInstallId } from "@src/utils";

export const initRelationship = async () => {
  const url = "https://n65hkx5nehmmkzy5wp6ijyarka0qujrj.lambda-url.eu-west-1.on.aws/";

  const res = await createContactRequest(url, { method: "initiateRelationship", installId: getInstallId() });
  if (res.success) {
    const { relId } = res.response;
    return { success: true, response: { installId: getInstallId(), relId } };
  }
  return res;
};

export const acceptRelationship = async () => {
  const relId = window.location.pathname.split("/invite/")[1];
  const url = "https://n65hkx5nehmmkzy5wp6ijyarka0qujrj.lambda-url.eu-west-1.on.aws/";
  const res = await createContactRequest(url, { method: "acceptRelationship", installId: getInstallId(), relId });
  return res;
};

export const shareGoalWithContact = async (relId: string, goalWithChildrens: GoalItem[]) => {
  const url = "https://od66oidjc64tghsplm2s4seuau0dbkgy.lambda-url.eu-west-1.on.aws/";
  const res = await createContactRequest(url, {
    method: "shareMessage",
    installId: getInstallId(),
    relId,
    event: { type: "shareMessage", goalWithChildrens },
  });
  return res;
};

export const collaborateWithContact = async (relId: string, goal: GoalItem) => {
  const url = "https://od66oidjc64tghsplm2s4seuau0dbkgy.lambda-url.eu-west-1.on.aws/";
  const res = await createContactRequest(url, {
    method: "shareMessage",
    installId: getInstallId(),
    relId,
    event: { type: "collaborationInvite", goal },
  });
  return res;
};

export const getContactSharedGoals = async () => {
  const lastProcessedTimestamp = new Date(Number(localStorage.getItem("lastProcessedTimestamp"))).toISOString();
  const url = "https://od66oidjc64tghsplm2s4seuau0dbkgy.lambda-url.eu-west-1.on.aws/";
  const res = await createContactRequest(url, {
    method: "getMessages",
    installId: getInstallId(),
    ...(lastProcessedTimestamp ? { lastProcessedTimestamp } : {}),
  });
  localStorage.setItem("lastProcessedTimestamp", `${Date.now()}`);
  return res;
};

export const getRelationshipStatus = async (relationshipId: string) => {
  const url = "https://n65hkx5nehmmkzy5wp6ijyarka0qujrj.lambda-url.eu-west-1.on.aws/";
  const res = await createContactRequest(url, {
    method: "getRelationshipStatus",
    installId: getInstallId(),
    relationshipId,
  });
  return res;
};

export const sendUpdatesToSubscriber = async (
  sub: IParticipant,
  rootGoalId: string,
  changeType: typeOfChange,
  changes: { level: number; goal: GoalItem }[] | { level: number; id: string }[],
) => {
  const url = "https://od66oidjc64tghsplm2s4seuau0dbkgy.lambda-url.eu-west-1.on.aws/";
  const { relId, type } = sub;
  const requestBody = {
    method: "shareMessage",
    installId: getInstallId(),
    relId,
    debugKey: "82098435-380a-43ec-9122-0662870a5ea5",
    event: {
      type,
      changeType,
      rootGoalId,
      changes,
    },
  };
  const res = await createContactRequest(url, requestBody);
  return res;
};
