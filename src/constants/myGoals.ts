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
  let confirmButtonText = "Confirm";
  switch (actionName) {
    case "archive":
      confirmButtonText = "Complete goal";
      break;
    case "delete":
      confirmButtonText = "Delete goal";
      break;
    case "shareAnonymously":
      confirmButtonText = "Share goal";
      break;
    case "shareWithOne":
      confirmButtonText = "Choose contact";
      break;
    case "colabRequest":
      confirmButtonText = "Collaborate on goal";
      break;
    default:
  }
  return confirmButtonText;
};
