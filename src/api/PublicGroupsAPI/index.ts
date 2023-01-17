/* eslint-disable no-param-reassign */
/* eslint-disable arrow-body-style */
import { db } from "@models";
import { PublicGroupGoalItem } from "@src/models/PublicGroupGoalItem";
import { getJustDate } from "@src/utils";
import { v4 as uuidv4 } from "uuid";

const getInstallId = () => { return localStorage.getItem("installId"); };

const createRequest = async (url: string, body : object | null = null, method = "POST") => {
  try {
    const res = await fetch(url, {
      method,
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body || {})
    });
    return { success: res.ok, response: await res.json() };
  } catch (err) {
    return {
      success: false,
      message: "Aww... So sorry something went wrong. Try again later",
    };
  }
};
export const getPublicGroupGoals = async (ParentGoalId: string) => {
  const url = "https://xcmyippimqii2x76diluvd4ywu0oojhu.lambda-url.eu-west-1.on.aws/";
  const res = await createRequest(url, { method: "getPublicGroupGoals", installId: getInstallId(), publicGroupParentGoalId: ParentGoalId });
  if (res.success) {
    const { relId } = res.response;
    return { success: true, response: { installId: getInstallId(), relId } };
  }
  return res;
};
