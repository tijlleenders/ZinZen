/* eslint-disable no-param-reassign */
/* eslint-disable arrow-body-style */
import { PublicGroupGoalItem } from "@src/models/PublicGroupGoalItem";

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

export const getPublicGroupGoals = async (publicGroupParentGoalId: string) => {
  const url = "https://xcmyippimqii2x76diluvd4ywu0oojhu.lambda-url.eu-west-1.on.aws/";
  const res = await createRequest(url, { method: "getPublicGroupGoals", installId: getInstallId(), publicGroupParentGoalId });
  return res;
};

export const joinPublicGroup = async (title: string) => {
  const url = "https://xcmyippimqii2x76diluvd4ywu0oojhu.lambda-url.eu-west-1.on.aws/";
  const res = await createRequest(url, { method: "joinPublicGroup", installId: getInstallId(), title });
  return res;
};

export const quitPublicGroup = async (groupId: string) => {
  const url = "https://xcmyippimqii2x76diluvd4ywu0oojhu.lambda-url.eu-west-1.on.aws/";
  const res = await createRequest(url, { method: "quitPublicGroup", installId: getInstallId(), groupId });
  return res;
};

export const updatePublicGroupGoal = async (publicGroupGoal: PublicGroupGoalItem) => {
  const url = "https://xcmyippimqii2x76diluvd4ywu0oojhu.lambda-url.eu-west-1.on.aws/";
  const res = await createRequest(url, { method: "updatePublicGroupGoal", installId: getInstallId(), publicGroupGoal });
  return res;
};
