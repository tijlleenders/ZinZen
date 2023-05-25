import { useTranslation } from "react-i18next";

export const goalConfigTags = ["Duration", "Due date", "Filter", "Habit", "Time budget", "Start date"];

export const getHeadingOfTag = (tagName: string, warningMessage = false) => {
  let heading = "";
  switch (tagName) {
    case "Duration":
      heading = warningMessage ? "This goal already has a budget so no duration can be added." : "Add a duration to show on calendar";
      break;
    case "Start date":
      heading = "When you want to start?";
      break;
    case "Due date":
      heading = "What's the deadline?";
      break;
    case "Habit":
      heading = "So, do you repeat this goal daily?";
      break;
    case "Filter":
      heading = "When you want to work on this?";
      break;
    case "Time budget":
      heading = warningMessage ? "This goal already has a duration so no budget can be added." : "Let's decide a budget for this goal?";
      break;
    default:
      break;
  }
  return heading;
};

export const getConfirmButtonText = (actionName: string) => {
  const { t } = useTranslation();

  let confirmButtonText = "confirm";
  switch (actionName) {
    case "archive":
      confirmButtonText = t("completeGoal");
      break;
    case "delete":
      confirmButtonText = t("deleteGoal");
      break;
    case "shareAnonymously":
      confirmButtonText = t("shareGoal");
      break;
    case "shareWithOne":
      confirmButtonText = t("chooseContact");
      break;
    case "colabRequest":
      confirmButtonText = t("collaborateOnGoal");
      break;
    default:
  }
  return confirmButtonText;
};
