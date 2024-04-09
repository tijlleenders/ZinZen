export async function createGetHintsRequest(body: object, method = "POST") {
  const url = "https://ryah5agkswabywebsdqk7ar4om0wjdrn.lambda-url.eu-west-1.on.aws/";
  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const jsonRes = await res.json();
    return { success: res.ok, response: jsonRes };
  } catch (err) {
    return { success: false, response: "Let's focus on happy path" };
  }
}

export const shareGoal = async (goal: object) => {
  const URL = "https://ryah5agkswabywebsdqk7ar4om0wjdrn.lambda-url.eu-west-1.on.aws/";
  try {
    const res = await fetch(URL, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(goal),
    });
    return {
      success: res.ok,
      response: res.ok ? "Thank you for sharing pseudo anonymously!" : "Let's focus on happy path",
    };
  } catch (err) {
    return { success: false, response: "Let's focus on happy path" };
  }
};

export const getPublicGoals = async (goalTitle: string) => {
  const URL = "https://ryah5agkswabywebsdqk7ar4om0wjdrn.lambda-url.eu-west-1.on.aws/";
  const errorMessage = [
    "Uh oh, do you have internet?",
    "No internet. Have aliens landed?",
    "Oops. The internet seems broken...",
  ];

  try {
    const response = await (
      await fetch(URL, {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: "getGoalSuggestions",
          parentTitle: goalTitle,
        }),
      })
    ).json();
    return { status: true, data: [...response.Items] };
  } catch (err) {
    console.log(err);
    return { status: false, message: errorMessage[Math.floor(Math.random() * errorMessage.length)] };
  }
};
