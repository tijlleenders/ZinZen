/* eslint-disable radix */
// @ts-nocheck
interface goalTimingHandlerResponse {
    status: boolean,
    start: { index: number, value: Date | null } | null,
    end: { index: number, value: Date | null } | null,
    afterTime: { index: number, value: number | null } | null,
    beforeTime: { index: number, value: number | null } | null
}

const dayStore = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };

// const startTests = [
//   "workout paper start 12/3",
//   "workout paper start tomorrow",
//   "workout paper start tomorrow @15",
//   "workout paper start tuesday",
//   "workout paper start next week",
//   "workout paper start next week thursday",
//   "workout paper start tuesday @15",
//   "workout paper start next week @15",
//   "workout paper start next week Tuesday @15",
// ];
// const endTests = [
//   "workout paper by 12/3",
//   "workout paper by tomorrow",
//   "workout paper by tomorrow @15",
//   "workout paper by tuesday",
//   "workout paper by next week",
//   "workout paper by next week thursday",
//   "workout paper by tuesday @15",
//   "workout paper by next week @15",
//   "workout paper by next week Tuesday @15",
// ];

function handleStart(lowercaseInput:string) {
  const startPatterns = [
    {
      pattern: /\sstart\s([1-9]|1[0-9]|2[0-9]|3[0-1])\/([1-9]|1[0-2])(\s|\s@([0-9]|1[0-9]|2[0-3])\s)/i,
      extractor: function extractDetail(_text : string) {
        const text = _text.split(" ").slice(0, 2).join(" ");
        const [eDate, eMonth] = text.split(" ")[1].split("/");
        return new Date(new Date().getFullYear(), parseInt(eMonth) - 1, parseInt(eDate), _text.includes("@") ? parseInt(_text.split("@")[1]) : 0);
      }
    },
    {
      pattern: /\sstart\stomorrow(\s@([0-9]|1[0-9]|2[0-3])\s|\s)/i,
      extractor: function extractDetail(_text : string) {
        const text = _text.split(" ").slice(0, 3).join(" ");
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, text.includes("@") ? parseInt(text.split("@")[1]) : 0);
      }
    },
    {
      pattern: /\sstart\s(sunday|monday|tuesday|wednesday|thursday|friday|saturday)(\s@([0-9]|1[0-9]|2[0-3])\s|\s)/i,
      extractor: function extractDetail(_text : string) {
        const text = _text.split(" ").slice(0, 3).join(" ");
        let today = new Date();
        today = new Date(today.setDate(today.getDate() + ((7 - today.getDay() + dayStore[text.split(" ")[1]]) % 7 || 7)));
        return new Date(today.setHours(text.includes("@") ? parseInt(text.split("@")[1]) : 0, 0, 0));
      }
    },
    {
      pattern: /\sstart\snext\sweek\s(sunday|monday|tuesday|wednesday|thursday|friday|saturday)(\s@([0-9]|1[0-9]|2[0-3])\s|\s)/i,
      extractor: function extractDetail(_text : string) {
        const text = _text.split(" ").slice(0, 5).join(" ");
        let today = new Date();
        const dayIndex = dayStore[text.split(" ")[3]];
        today = new Date(today.setDate(today.getDate() + ((7 - today.getDay() + dayIndex) % 7 || 7)));
        if (dayIndex > new Date().getDay()) { today = new Date(today.setDate(today.getDate() + 7)); }
        return new Date(today.setHours(text.includes("@") ? parseInt(text.split("@")[1]) : 0, 0, 0));
      }
    },
    {
      pattern: /\sstart\snext\sweek(\s@([0-9]|1[0-9]|2[0-3])\s|\s)/i,
      extractor: function extractDetail(_text : string) {
        const text = _text.split(" ").slice(0, 4).join(" ");
        let today = new Date();
        today = new Date(today.setDate(today.getDate() + ((7 - today.getDay() + 1) % 7 || 7)));
        return new Date(today.setHours(text.includes("@") ? parseInt(text.split("@")[1]) : 0, 0, 0));
      }
    },
  ];
  for (let i = 0; i < startPatterns.length; i += 1) {
    const ele = startPatterns[i];
    const found = lowercaseInput.search(ele.pattern);
    if (found >= 0) {
      return { index: found, value: ele.extractor(lowercaseInput.slice(found).trim()) };
    }
  }
  return null;
}

function handleDue(lowercaseInput:string) {
  const duePatters = [
    {
      pattern: /\s(due|by)\s([1-9]|1[0-9]|2[0-9]|3[0-1])\/([1-9]|1[0-2])(\s@([0-9]|1[0-9]|2[0-3])\s|\s)/i,
      extractor: function extractDetail(_text : string) {
        const text = _text.split(" ").slice(0, 2).join(" ");
        const [eDate, eMonth] = text.split(" ")[1].split("/");
        let endHr = 23;
        let endMin = 59;
        if (_text.includes("@")) { [endHr, endMin] = Number.isNaN(parseInt(_text.split("@")[1])) ? [23, 59] : [parseInt(_text.split("@")[1]), 0]; }
        return new Date(new Date().getFullYear(), parseInt(eMonth) - 1, parseInt(eDate), endHr, endMin);
      }
    },
    {
      pattern: /\s(due|by)\s(today|tomorrow)(\s@([0-9]|1[0-9]|2[0-3])\s|\s)/i,
      extractor: function extractDetail(_text : string) {
        const text = _text.split(" ").slice(0, 3).join(" ");
        const tmpDate = text.split(" ")[1] === "today" ? new Date() : new Date(new Date().setDate(new Date().getDate() + 1));
        let endHr = 23;
        let endMin = 59;
        if (text.includes("@")) { [endHr, endMin] = Number.isNaN(parseInt(text.split("@")[1])) ? [23, 59] : [parseInt(text.split("@")[1]), 0]; }
        return new Date(tmpDate.getFullYear(), tmpDate.getMonth(), tmpDate.getDate(), endHr, endMin);
      }
    },
    {
      pattern: /\s(due|by)\s(sunday|monday|tuesday|wednesday|thursday|friday|saturday)(\s@([0-9]|1[0-9]|2[0-3])\s|\s)/i,
      extractor: function extractDetail(_text : string) {
        const text = _text.split(" ").slice(0, 3).join(" ");
        let today = new Date();
        today = new Date(today.setDate(today.getDate() + ((7 - today.getDay() + dayStore[text.split(" ")[1]]) % 7 || 7)));
        let endHr = 23;
        let endMin = 59;
        if (text.includes("@")) { [endHr, endMin] = Number.isNaN(parseInt(text.split("@")[1])) ? [23, 59] : [parseInt(text.split("@")[1]), 0]; }
        return new Date(today.setHours(endHr, endMin));
      }
    },
    {
      pattern: /\s(due|by)\snext\sweek\s(sunday|monday|tuesday|wednesday|thursday|friday|saturday)(\s@([0-9]|1[0-9]|2[0-3])\s|\s)/i,
      extractor: function extractDetail(_text : string) {
        const text = _text.split(" ").slice(0, 5).join(" ");
        let today = new Date();
        const dayIndex = dayStore[text.split(" ")[3]];
        today = new Date(today.setDate(today.getDate() + ((7 - today.getDay() + dayIndex) % 7 || 7)));
        if (dayIndex > new Date().getDay()) { today = new Date(today.setDate(today.getDate() + 7)); }
        let endHr = 23;
        let endMin = 59;
        if (text.includes("@")) { [endHr, endMin] = Number.isNaN(parseInt(text.split("@")[1])) ? [23, 59] : [parseInt(text.split("@")[1]), 0]; }
        return new Date(today.setHours(endHr, endMin));
      }
    },
    {
      pattern: /\s(due|by)\snext\sweek(\s@([0-9]|1[0-9]|2[0-3])\s|\s)/i,
      extractor: function extractDetail(_text : string) {
        const text = _text.split(" ").slice(0, 4).join(" ");
        let today = new Date();
        today = new Date(today.setDate(today.getDate() + ((7 - today.getDay() + 1) % 7 || 7)));
        let endHr = 23;
        let endMin = 59;
        if (text.includes("@")) { [endHr, endMin] = Number.isNaN(parseInt(text.split("@")[1])) ? [23, 59] : [parseInt(text.split("@")[1]), 0]; }
        return new Date(today.setHours(endHr, endMin));
      }
    },
    {
      pattern: /\s(due|by)\sthis\syear\s/i,
      extractor: function extractDetail() {
        const today = new Date();
        return new Date(today.getFullYear(), 11, 31, 0);
      }
    },
    {
      pattern: /\s(due|by)\sthis\sweek(\s@([0-9]|1[0-9]|2[0-3])\s|\s)/i,
      extractor: function extractDetail(_text : string) {
        const text = _text.split(" ").slice(0, 4).join(" ");
        let today = new Date();
        let endHr = 23;
        let endMin = 59;
        if (text.includes("@")) { [endHr, endMin] = Number.isNaN(parseInt(text.split("@")[1])) ? [23, 59] : [parseInt(text.split("@")[1]), 0]; }
        today = new Date(today.setDate(today.getDate() + ((7 - today.getDay() + 1) % 7 || 7)));
        return new Date(today.setHours(endHr, endMin));
      }
    }

  ];
  for (let i = 0; i < duePatters.length; i += 1) {
    const ele = duePatters[i];
    const found = lowercaseInput.search(ele.pattern);
    if (found >= 0) {
      // console.log(found, ele.pattern);
      return { index: found, value: ele.extractor(`${lowercaseInput.slice(found).trim()} `) };
    }
  }
  return null;
}

function handleStartTime(lowercaseInput: string) {
  const startTimePatterns = [
    {
      pattern: /\safter\s([0-9]|1[0-9]|2[0-3])\s/i,
      extractor: function extractDetail(text : string) {
        return parseInt(text.split(" ")[1]);
      }
    }
  ];
  const ele = startTimePatterns[0];
  const found = lowercaseInput.search(ele.pattern);
  if (found >= 0) {
    // console.log(found, ele.pattern);
    return { index: found, value: ele.extractor(lowercaseInput.slice(found).trim()) };
  }
  return null;
}

function handleEndTime(lowercaseInput: string) {
  const endTimePatterns = [
    {
      pattern: /\sbefore\s([0-9]|1[0-9]|2[0-3])\s/i,
      extractor: function extractDetail(text : string) {
        return parseInt(text.split(" ")[1]);
      }
    }
  ];
  const ele = endTimePatterns[0];
  const found = lowercaseInput.search(ele.pattern);
  if (found >= 0) {
    // console.log(found, ele.pattern);
    return { index: found, value: ele.extractor(lowercaseInput.slice(found).trim()) };
  }
  return null;
}

function handleBothTime(lowercaseInput: string) {
  const endTimePatterns = [
    {
      pattern: /\s([0-9]|1[0-9]|2[0-3])-([0-9]|1[0-9]|2[0-3])\s/i,
      extractor: function extractDetail(text : string) {
        return text.split(" ")[0];
      }
    }
  ];
  const ele = endTimePatterns[0];
  const found = lowercaseInput.search(ele.pattern);
  if (found >= 0) {
    // console.log(found, ele.pattern);
    return { index: found, value: ele.extractor(lowercaseInput.slice(found).trim()) };
  }
  return null;
}

export function goalTimingHandler(input: string) {
  const lowercaseInput = input.toLowerCase();
  const res : goalTimingHandlerResponse = { status: false, start: null, end: null, afterTime: null, beforeTime: null };
  res.start = handleStart(`${lowercaseInput.trim()} `);
  res.end = handleDue(`${lowercaseInput.trim()} `);
  const tryBothTime = handleBothTime(`${lowercaseInput.trim()} `);
  const tryStartTime = handleStartTime(`${lowercaseInput.trim()} `);
  const tryEndTime = handleEndTime(`${lowercaseInput.trim()} `);

  if (tryBothTime) {
    res.afterTime = { index: tryBothTime.index, value: parseInt(tryBothTime.value.split("-")[0]) };
    res.beforeTime = { index: tryBothTime.index, value: parseInt(tryBothTime.value.split("-")[1]) };
  } else {
    res.afterTime = tryStartTime;
    res.beforeTime = tryEndTime;
  }
  return res;
}
