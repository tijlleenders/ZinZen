import { addPublicGroup } from "@src/api/PublicGroupsAPI";
import { GoalItem } from "@src/models/GoalItem";
import { PublicGroupItem } from "@src/models/PublicGroupItem";
import { sendNewPublicGroup } from "@src/services/group.service";
import { languagesFullForms } from "@src/translations/i18n";
import { colorPalleteList } from "@src/utils";
import { v4 as uuidv4 } from "uuid";

export const createPublicGroupObject = (params: object) => {
  const groupItem: PublicGroupItem = {
    id: uuidv4(),
    title: "N/A",
    polls: [],
    language: "English",
    groupColor: colorPalleteList[0],
    createdAt: new Date().toISOString(),
    ...params
  };
  return groupItem;
};

export const createPollObject = (goal: GoalItem) => ({
  id: uuidv4(),
  goal,
  metrics: {
    upvotes: 0,
    downvotes: 0,
    inMygoals: 0,
    completed: 0
  },
  myMetrics: {
    voteScore: 0,
    inMyGoals: false,
    completed: false,
  },
  createdAt: new Date().toISOString(),
});

export const createUserGroup = async (title: string) => {
  const lang = localStorage.getItem("language")?.slice(1, -1);
  const language = lang ? languagesFullForms[lang] : languagesFullForms.en;
  const newGroup = createPublicGroupObject({ title, language });
  await addPublicGroup(newGroup);
  await sendNewPublicGroup(newGroup.title, language, newGroup.groupColor);
};
