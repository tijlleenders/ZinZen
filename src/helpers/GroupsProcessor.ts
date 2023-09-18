import { languagesFullForms } from "@src/translations/i18n";
import { createPublicGroupObject } from "@src/utils/defaultGenerators";
import { IMyMetrics, PollActionType } from "@src/models/PublicGroupItem";
import { sendNewPublicGroup, sendReactionOnPoll } from "@src/services/group.service";
import { addPublicGroup, updateMyMetric, updatePollMetrics } from "@src/api/PublicGroupsAPI";

export const createUserGroup = async (title: string) => {
  const lang = localStorage.getItem("language")?.slice(1, -1);
  const language = lang ? languagesFullForms[lang] : languagesFullForms.en;
  const newGroup = createPublicGroupObject({ title, language });
  await addPublicGroup(newGroup);
  await sendNewPublicGroup(newGroup.id, newGroup.title, language, newGroup.groupColor);
};

export const sendUpdatesOfThisPoll = async (
  groupId: string,
  pollId: string,
  newMetricsState: IMyMetrics,
  typeOfAction: PollActionType,
) => {
  sendReactionOnPoll(groupId, pollId, newMetricsState);
  await updatePollMetrics(groupId, pollId, typeOfAction, 1);
  await updateMyMetric(groupId, pollId, newMetricsState);
};
