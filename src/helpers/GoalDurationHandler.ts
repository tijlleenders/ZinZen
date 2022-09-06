interface goalDurationHandlerResponse {
    status: boolean,
    value: { index: number, value: number} | null
}

export const goalDurationHandler = (input:string) => {
  const lowercaseInput = input.toLowerCase();
  const res : goalDurationHandlerResponse = { status: false, value: null };

  if (!lowercaseInput) { return res; }

  const tracker = /(1[0-9]|2[0-4]|[1-9])+h/i;
  const reverseInputArr = lowercaseInput.split(" ");
  let lastIndex = -1;
  let tmpSum = 0;

  for (let i = 0; i < reverseInputArr.length; i += 1) {
    const reverseInput = reverseInputArr[i];
    const checkGoalHr = parseInt(String(reverseInput.match(tracker)), 10);
    const parseGoal = parseInt(String(reverseInput.match(tracker)), 10) <= 24;
    const tempIndex = reverseInput.search(tracker);
    if (tempIndex !== -1 && parseGoal) {
      lastIndex += tmpSum;
      res.value = { index: lastIndex + 1, value: checkGoalHr };
    }
    tmpSum += reverseInput.length + 1;
  }

  if (lastIndex < 0) { res.value = null; } else { res.status = true; }

  return res;
};
