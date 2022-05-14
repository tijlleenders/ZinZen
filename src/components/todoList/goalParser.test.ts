function getGoalObject(){}

describe('getGoalObject function',()=>{
      it('should return repetition suggestion : daily',()=>{

        const expected="daily";
        expect(getGoalObject()).toBe(expected);
      })
    })
