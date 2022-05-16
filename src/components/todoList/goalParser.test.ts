import { useState } from "react";

const goalObject=({
   title: 'Walk 1h daily',
    lang: 'en',
   color:  '#fff'})
   const newData =(data)=>[...data,goalObject];

//const [outputObject,setOutputObject]=useState([])

function getGoalObject(){
  if(goalObject.title.indexOf('daily')!==-1){
    return({
   newData,
   suggestion: {repetition: "daily"},
    });}
     else{
      return({
         newData
      })
    }
}

describe('getGoalObject function',()=>{
      it('should return repetition suggestion : daily',()=>{
        function fun(){
          if(goalObject.title.indexOf('daily')!==-1){
            return({
           newData,
           suggestion: {repetition: "daily"},
            });}
             else{
              return({
                newData
              })
            }
          }
        const e=fun();
        expect(getGoalObject()).toEqual(e);
      })
    })
