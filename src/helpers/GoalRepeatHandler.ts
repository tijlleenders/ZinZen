interface goalRepeatHandlerResponse {
    status: boolean,
    value: {
        index: number,
        value: "Once" | "Daily" | "Weekly" |
        "Mondays" | "Tuesdays"| "Wednesdays"| "Thursdays" | "Fridays" | "Saturdays" | "Sundays"
    } | null
}
function capitalizeFirstLetter(text : string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function handleRepeat(lowercaseInput: string) {
  const duePatters = [
    {
      pattern: /\s(daily|weekly|monthly)\s/i,
      extractor: function extractDetail(_text : string) {
        return _text.split(" ")[0];
      }
    },
    {
      pattern: /\severy\s(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s/i,
      extractor: function extractDetail(_text : string) {
        return `${_text.split(" ")[1]}s`;
      }
    },
    {
      pattern: /\s(mondays|tuesdays|wednesdays|thursdays|fridays|saturdays|sundays)\s/i,
      extractor: function extractDetail(_text : string) {
        return _text.split(" ")[0];
      }
    },

  ];
  for (let i = 0; i < duePatters.length; i += 1) {
    const ele = duePatters[i];
    const found = lowercaseInput.search(ele.pattern);
    if (found >= 0) {
      console.log(found, ele.pattern);
      return { index: found, value: capitalizeFirstLetter(ele.extractor(`${lowercaseInput.slice(found).trim()} `)) };
    }
  }
  return null;
}
export function goalRepeatHandler(input:string) {
  const lowercaseInput = input.toLowerCase();
  const res : goalRepeatHandlerResponse = { status: false, value: null };

  if (!lowercaseInput) { return res; }

  res.value = handleRepeat(`${lowercaseInput.trim()} `);
  if (res.value) { res.status = true; }
  return res;
}
