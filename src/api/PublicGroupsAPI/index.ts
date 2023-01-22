import { UpdatePublicGroupGoalItem } from "@src/models/UpdatePublicGroupGoalItem";
import { RetrievePublicGroupGoalItem } from "@src/models/RetrievePublicGroupGoalItem";
import { getInstallId, createContactRequest } from "@src/utils";

export const getPublicGroupGoals = async (publicGroupParentGoalId: string) => {
  const url = "https://xcmyippimqii2x76diluvd4ywu0oojhu.lambda-url.eu-west-1.on.aws/";
  const res = await createContactRequest(url, {
    method: "getPublicGroupGoals",
    installId: getInstallId(),
    publicGroupParentGoalId,
  });
  const publicGroupGoals: RetrievePublicGroupGoalItem[] = res?.response?.map((response) => response?.publicGroupGoal);

  return publicGroupGoals;
};

export const joinPublicGroup = async (title: string) => {
  const url = "https://xcmyippimqii2x76diluvd4ywu0oojhu.lambda-url.eu-west-1.on.aws/";
  const res = await createContactRequest(url, { method: "joinPublicGroup", installId: getInstallId(), title });
  return res;
};

export const quitPublicGroup = async (groupId: string) => {
  const url = "https://xcmyippimqii2x76diluvd4ywu0oojhu.lambda-url.eu-west-1.on.aws/";
  const res = await createContactRequest(url, { method: "quitPublicGroup", installId: getInstallId(), groupId });
  return res;
};

export const updatePublicGroupGoal = async (publicGroupGoal: UpdatePublicGroupGoalItem) => {
  const url = "https://xcmyippimqii2x76diluvd4ywu0oojhu.lambda-url.eu-west-1.on.aws/";
  const res = await createContactRequest(url, {
    method: "updatePublicGroupGoal",
    installId: getInstallId(),
    publicGroupGoal,
  });
  return res;
};

export const createRootGroup = async () => {
  const res = await joinPublicGroup("Root Group"); // creates a new root group
  return res.response.groups[res.response.groups.length - 1]; // returns the id of the created root group
};

export const addGroupToRootGroup = async (_publicGroupGoal: UpdatePublicGroupGoalItem) => {
  let publicGroupGoal = { ..._publicGroupGoal };
  publicGroupGoal.parentId = await createRootGroup(); // gets the id of the created root group (without recreating another group)
  const res = await updatePublicGroupGoal(publicGroupGoal); // add a new group to the created root group (for explore groups screen)
  const rootGroupAddedGroup: RetrievePublicGroupGoalItem = res.response.publicGroupGoal;
  return rootGroupAddedGroup;
};

export const getRootGroupGroups = async () => {
  const publicGroupParentGoalId = await createRootGroup();
  const res = await getPublicGroupGoals(publicGroupParentGoalId); // gets the sub groups of the root group (for explore groups screen)
  const rootGroupPublicGroups: RetrievePublicGroupGoalItem[] = res;
  return rootGroupPublicGroups;
};
