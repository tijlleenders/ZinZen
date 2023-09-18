import { IPoll } from "@src/models/PublicGroupItem";
import { createGroupRequest, getInstallId } from "@src/utils";
import { createPublicGroupObject } from "@src/utils/defaultGenerators";

const groupServiceUrl = "https://kuwwyp2dq4kvnxib46isqttfru0gwmyq.lambda-url.eu-west-1.on.aws/";
const debugKey = "82098435-380a-43ec-9122-0662870a5ea5";

export const findPublicGroupsOnline = async (searchKeyword = "") => {
  const res = await createGroupRequest(groupServiceUrl, {
    debugKey,
    eventType: "command",
    command: {
      commandType: "getPublicGroups",
      installId: getInstallId(),
      publicGroupIds: [],
      ...(searchKeyword !== "" ? { searchKeyword } : {}),
    },
  });
  if (res.success) {
    res.response = res.response.map((ele) =>
      createPublicGroupObject({
        id: ele.publicGroupId,
        title: ele.title,
        polls: ele.polls,
        language: ele.language,
        groupColor: ele.color,
      }),
    );
  }
  return res;
};

export const sendUpdateOfNewPoll = async (publicGroupId: string, poll: IPoll) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { metrics, myMetrics, ...publicGroupPoll } = poll;
  const body = {
    debugKey,
    eventType: "command",
    command: {
      commandType: "addPollInPublicGroup",
      installId: getInstallId(),
      publicGroupId,
      publicGroupPoll,
    },
  };
  console.log(JSON.stringify(body));
  const res = await createGroupRequest(groupServiceUrl, body);
  return res;
};

export const sendNewPublicGroup = async (publicGroupId: string, title: string, language: string, color: string) => {
  const res = await createGroupRequest(groupServiceUrl, {
    debugKey,
    eventType: "command",
    command: {
      commandType: "createPublicGroup",
      installId: getInstallId(),
      publicGroup: {
        publicGroupId,
        title,
        language,
        color,
      },
    },
  });
  return res;
};

export const sendReactionOnPoll = async (publicGroupId: string, publicGroupPollId: string, metrics: object) => {
  const res = await createGroupRequest(groupServiceUrl, {
    debugKey,
    eventType: "command",
    command: {
      commandType: "updatePoll",
      installId: getInstallId(),
      publicGroupId,
      publicGroupPollId,
      pollUpdate: metrics,
    },
  });
  return res;
};
