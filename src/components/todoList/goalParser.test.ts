import { useState } from "react";

const goalObject=({
   title: 'Walk 1h daily',
    lang: 'en',
   color:  '#fff'})

const [outputObject,setOutputObject]=useState([])

function getGoalObject(){}

describe('getGoalObject function',()=>{
      it('should return repetition suggestion : daily',()=>{

        function fun(){
          if(goalObject.title.indexOf('daily')!==-1){
            const newData =(data)=>[...data,goalObject]
            setOutputObject({
           newData,
           suggestion: {repetition: "daily"},
            });}
             else{
              setOutputObject({
                newData
              })
            }
            return outputObject;
          }

        expect(getGoalObject()).toBe(fun);
      })
    })
