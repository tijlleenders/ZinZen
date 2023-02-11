import { GoalItem } from "@src/models/GoalItem";
import { typeOfChange } from "@src/models/InboxItem";
import { ISubscriber } from "@src/models/PubSubItem";
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

export const shareGoalWithContact = async (relId: string, goal: GoalItem) => {
  const url = "https://j6hf6i4ia5lpkutkhdkmhpyf4q0ueufu.lambda-url.eu-west-1.on.aws/";
  const res = await createContactRequest(url, { method: "shareGoal", installId: getInstallId(), relId, event: { type: "shareGoal", goal } });
  return res;
};

export const collaborateWithContact = async (relId: string, goal: GoalItem) => {
  const url = "https://j6hf6i4ia5lpkutkhdkmhpyf4q0ueufu.lambda-url.eu-west-1.on.aws/";
  const res = await createContactRequest(url, { method: "shareGoal", installId: getInstallId(), relId, event: { type: "collaborationInvite", goal } });
  return res;
};

export const sendResponseOfColabInvite = async (status: string, relId: string, goalId: string) => {
  const url = "https://j6hf6i4ia5lpkutkhdkmhpyf4q0ueufu.lambda-url.eu-west-1.on.aws/";
  const res = await createContactRequest(url, { method: "shareGoal", installId: getInstallId(), relId, event: { type: "colabInviteResponse", goalId, status } });
  return res;
};

export const getContactSharedGoals = async () => {
  const lastProcessedTimestamp = new Date(Number(localStorage.getItem("lastProcessedTimestamp"))).toISOString();
  const url = "https://j6hf6i4ia5lpkutkhdkmhpyf4q0ueufu.lambda-url.eu-west-1.on.aws/";
  const res = await createContactRequest(url, { method: "getGoals", installId: getInstallId(), ...(lastProcessedTimestamp ? { lastProcessedTimestamp } : {}) });
  localStorage.setItem("lastProcessedTimestamp", `${Date.now()}`);
  return res;
};

export const getRelationshipStatus = async (relationshipId: string) => {
  const url = "https://n65hkx5nehmmkzy5wp6ijyarka0qujrj.lambda-url.eu-west-1.on.aws/";
  const res = await createContactRequest(url, { method: "getRelationshipStatus", installId: getInstallId(), relationshipId });
  return res;
};

export const sendUpdatesToSubscriber = async (
  sub: ISubscriber, rootGoalId: string,
  changeType: typeOfChange,
  changes: { level: number, goal: GoalItem }[] | { level: number, id: string }[]) => {
  const url = "https://j6hf6i4ia5lpkutkhdkmhpyf4q0ueufu.lambda-url.eu-west-1.on.aws/";
  const { subId, type } = sub;
  const res = await createContactRequest(url, {
    method: "shareGoal",
    installId: getInstallId(),
    relId: subId,
    event: {
      type,
      changeType,
      rootGoalId,
      changes
    }
  });
  return res;
};
