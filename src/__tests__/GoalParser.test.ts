const goalObject = ({
  title: 'Walk 22h daily',
  lang: 'en',
  color: '#fff',
});

const newData = (data) =>[...data, goalObject];
const tracker = /(1[0-9]|2[0-4]|[1-9])+(h)/;
const label = /1[0-9]|2[0-4]|[0-9]/;
const matchGoal = goalObject.title.match(label);

function getGoalObject() {
  if (goalObject.title.indexOf('daily') !== -1) {
    return ({
      newData,
      suggestion: { repetition: 'daily' },
    });
  }
  return ({
    newData,
  });
}


function timeSuggestion() { if (goalObject.title.search(tracker) !== -1) {
  return ({
    newData,
    suggestion: { duration: `${matchGoal} hours` },
  });
}

return ({
  newData,
});
}

describe('getGoalObject function', () => {
  it('should return repetition suggestion : daily', () => {
    function fun() {
      if (goalObject.title.indexOf('daily') !== -1) {
        return ({
          newData,
          suggestion: { repetition: 'daily' },
        });
      }

      return ({
        newData,
      });
    }
    expect(getGoalObject()).toEqual(fun());
  });
});

describe('getTime function', () => {
  it('should return duration suggestion: num', () => {
    function time() {

      if (goalObject.title.search(tracker) !== -1) {
        return ({
          newData,
          suggestion: { duration: `${matchGoal} hours` },
        });
      }

      return ({
        newData,
      });
    }
    expect(timeSuggestion()).toEqual(time());
  });
});
