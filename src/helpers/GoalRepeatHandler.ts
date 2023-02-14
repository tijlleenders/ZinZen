interface goalRepeatHandlerResponse {
    status: boolean,
    value: {
        index: number,
        endIndex: number,
        value: string
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
    {
      pattern: /\severy\s([0-9]|1[0-9]|2[0-3])\s?(h|hr|hrs|hour|hours)\s/i,
      extractor: function extractDetail(_text: string) {
        return `every ${_text.split("every ")[1].split(" ").join("").split("h")[0]}h`;
      }
    },
    {
      pattern: /\severy\s([0-9]|1[0-9]|2[0-3])\sdays\s/i,
      extractor: function extractDetail(_text: string) {
        return `every ${_text.split("every ")[1].split(" ")[0]} days`;
      }
    }

  ];
  for (let i = 0; i < duePatters.length; i += 1) {
    const ele = duePatters[i];
    const matchRes = lowercaseInput.match(ele.pattern);
    if (matchRes && matchRes.length > 0 && matchRes.index && matchRes.index >= 0) {
      const found = matchRes.index;
      return { index: found, endIndex: found + matchRes[0].trim().length, value: capitalizeFirstLetter(ele.extractor(`${lowercaseInput.slice(found).trim()} `)) };
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
