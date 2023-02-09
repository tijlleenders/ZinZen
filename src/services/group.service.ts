import { createGroupRequest, getInstallId } from "@src/utils";

const groupServiceUrl = "https://dcsakxxfk54ouxlgdqeoqyuify0kmrgt.lambda-url.eu-west-1.on.aws/";
const debugKey = "82098435-380a-43ec-9122-0662870a5ea5";

export const findPublicGroups = async (searchKeyword = "") => {
  const res = await createGroupRequest(groupServiceUrl, {
    debugKey,
    eventType: "command",
    command: {
      commandType: "getPublicGroups",
      installId: getInstallId(),
      ...(searchKeyword !== "" ? { searchKeyword } : {})
    }
  });
  return res;
};
