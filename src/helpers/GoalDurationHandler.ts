interface goalDurationHandlerResponse {
    status: boolean,
    value: { index: number, value: string} | null
}

function handleDuration(lowercaseInput: string) {
  const durationPatterns = [
    {
      pattern: /\s(\d+-\d+)+h\s/i,
      extractor(input: string) {
        return input.split("h")[0];
      }
    },
    {
      pattern: /\s\d+h\s/i,
      extractor(input: string) {
        return input.split("h")[0];
      }
    }
  ];
  for (let i = 0; i < durationPatterns.length; i += 1) {
    const ele = durationPatterns[i];
    const found = lowercaseInput.search(ele.pattern);
    if (found >= 0) {
      return { index: found, value: ele.extractor(`${lowercaseInput.slice(found).trim()}`) };
    }
  }
  return null;
}

export const goalDurationHandler = (input:string) => {
  const lowercaseInput = input.toLowerCase();
  const res : goalDurationHandlerResponse = { status: false, value: null };

  if (!lowercaseInput) { return res; }

  const output = handleDuration(`${lowercaseInput} `);
  if (output) {
    res.status = true;
    res.value = output;
  }

  return res;
};
