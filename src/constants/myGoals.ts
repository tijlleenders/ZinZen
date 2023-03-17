export const goalConfigTags = ["Duration", "Due date", "Filter", "Habit", "Time budget", "Start date"];

export const getHeadingOfTag = (tagName: string) => {
  let heading = "";
  switch (tagName) {
    case "Duration":
      heading = "Add a duration to show on calendar";
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
      heading = "Let's decide a budget for this goal?";
      break;
    default:
      break;
  }
  return heading;
};
