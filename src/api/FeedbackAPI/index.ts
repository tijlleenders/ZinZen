export const submitFeedback = async (updatedFeedback: string) => {
  const URL = "https://tpzmoaw42e.execute-api.eu-west-1.amazonaws.com/prod/contact";
  try {
    await fetch(URL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFeedback),
    });
    return { status: "success", message: "Thank you so much for your feedback! We will improve." };
  } catch (err) {
    return {
      status: "error",
      message: "Aww... So sorry something went wrong. Please try emailing. We'd love to hear from you!",
    };
  }
};

export const fetchBuildInfo = async () => {
  const URL = "/dist/build-info.json";
  try {
    const response = await fetch(URL);
    const data = await response.json();
    return { status: "success", buildInfo: data };
  } catch (error) {
    return {
      status: "error",
      message: "Something went wrong. Error fetching build information",
    };
  }
};
