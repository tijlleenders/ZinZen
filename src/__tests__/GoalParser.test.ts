const goalObject = ({
  title: 'Walk 22h daily',
  lang: 'en',
  color: '#fff',
});
   const newData = (data) =>[...data, goalObject];

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

function timeSuuggestion() {}

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
    const e = fun();
    expect(getGoalObject()).toEqual(e);
  });
});

describe('getTime function', () => {
  it('should return duration suggestion: num', () => {
    function time() {
      const tracker = /(1[0-9]|2[0-4]|[1-9])+(h)/;
      const label = /1[0-9]|2[0-4]|[0-9]/;
      const matchGoal = goalObject.title.match(label);

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
    const a = time();
    expect(timeSuuggestion()).toEqual(a);
  });
});
