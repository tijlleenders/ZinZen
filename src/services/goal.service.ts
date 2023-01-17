export const shareGoal = async (goal: object) => {
  const URL = "https://jb65zz5efi3jy5rw5f2y5ke2u40hobkq.lambda-url.eu-west-1.on.aws/";
  try {
    const res = await fetch(URL, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(goal),
    });
    return { success: res.ok, response: res.ok ? "Thank you for sharing anonymously!" : "Let's focus on happy path" };
  } catch (err) {
    return { success: false, response: "Let's focus on happy path" };
  }
};

export const getPublicGoals = async (goalTitle: string) => {
  const URL = "https://jb65zz5efi3jy5rw5f2y5ke2u40hobkq.lambda-url.eu-west-1.on.aws/";
  const errorMessage = ["Uh oh, do you have internet?", "No internet. Have aliens landed?", "Oops. The internet seems broken..."];

  try {
    const response = await (await fetch(URL, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method: "getGoalSuggestions",
        parentTitle: goalTitle
      }),
    })).json();
    return { status: true, data: [...response.Items] };
  } catch (err) {
    console.log(err);
    return { status: false, message: errorMessage[Math.floor(Math.random() * errorMessage.length)] };
  }
};
