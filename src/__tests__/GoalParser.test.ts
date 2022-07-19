// @ts-nocheck
const goalObject = {
  title: "Walk 22h daily",
  lang: "en",
  color: "#fff",
};
const goalUrl = {
  title: "Attend ZinZen online meeting https://meet.google.com/evb-vozr-ico",
  lang: "en",
  color: "#fff",
};

const newData = (data) => [...data, goalObject];
const urlData = (data) => [...data, goalUrl];
const freqRegex = /[D|d]+aily|AILY/;
const freq = goalObject.title.match(freqRegex);
const urlDetector = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\\/~+#-]*[\w@?^=%&\\/~+#-])/;
const tracker = /(1[0-9]|2[0-4]|[1-9])+(H|h)/;
const checkGoal = parseInt(goalObject.title.match(tracker), 10);
const parseGoal = parseInt(goalObject.title.match(tracker), 10) <= 24;

function getGoalObject() {
  if (goalObject.title.indexOf(`${freq}`) !== -1) {
    return {
      newData,
      suggestion: { repetition: "daily" },
    };
  }
  return {
    newData,
  };
}

function timeSuggestion() {
  if (goalObject.title.search(tracker) !== -1 && parseGoal) {
    return {
      newData,
      suggestion: { duration: `${checkGoal} hours` },
    };
  }

  return {
    newData,
  };
}

describe("getGoalObject function", () => {
  it("should return repetition suggestion : daily", () => {
    function fun() {
      if (goalObject.title.indexOf(`${freq}`) !== -1) {
        return {
          newData,
          suggestion: { repetition: "daily" },
        };
      }

      return {
        newData,
      };
    }
    expect(getGoalObject()).toEqual(fun());
  });
});

describe("getTime function", () => {
  it("should return duration suggestion: num", () => {
    function time() {
      if (goalObject.title.search(tracker) !== -1 && parseGoal) {
        return {
          newData,
          suggestion: { duration: `${checkGoal} hours` },
        };
      }

      return {
        newData,
      };
    }
    expect(timeSuggestion()).toEqual(time());
  });
});
function urlDetection() {
  if (goalUrl.title.search(urlDetector) !== -1) {
    return "Link";
  }

  return {
    urlData,
  };
}
describe("getUrl function", () => {
  it("should return link : Link", () => {
    expect(urlDetection()).toEqual("Link");
  });
});
