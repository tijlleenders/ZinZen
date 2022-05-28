import React, { useState, useEffect } from 'react';
import {
  PlusLg, Trash3Fill, PencilSquare, CheckLg, Search,
} from 'react-bootstrap-icons';
import { useRecoilValue } from 'recoil';

import addIcon from '@assets/images/GoalsAddIcon.svg';
import { darkModeState } from '@src/store';
import { Button, Container } from 'react-bootstrap';

import './MyGoalsPage.scss';
import {
  addGoal, getAllGoals, removeGoal, updateGoal,
} from '@src/api/GoalsAPI';
import { GoalItem } from '@src/models/GoalItem';

export const MyGoalsPage = () => {
  const [allowEdit, setAllowEdit] = useState([-1, '']);
  const [showOptionsOfGoalIndex, setShowOptionsOfGoalIndex] = useState(-1);
  const [userGoals, setUserGoals] = useState<GoalItem[]>();
  const darkModeStatus = useRecoilValue(darkModeState);

  let debounceTimeout : ReturnType<typeof setTimeout>;

  // async function dummyCall() {
  //   const dummyData = ['shopping karni hai',
  //     'sabji lekr kaun ayega',
  //     'padosi ke ghar se aam leke ane hai',
  //     'shopping karni hai',
  //     'sabji lekr kaun ayega',
  //     'padosi ke ghar se aam leke ane hai',
  //     'sabji lekr kaun ayega',
  //     'padosi ke ghar se aam leke ane hai',
  //     'shopping karni hai',
  //     'sabji lekr kaun ayega',
  //     'padosi ke ghar se aam leke ane hai',
  //   ];
  //   dummyData.map((goal:string) => (addGoal({
  //     title: goal,
  //     duration: 2,
  //     sublist: ['abc', 'xyz'],
  //     repeat: 'Daily',
  //     start: null,
  //     finish: null,
  //   })));
  // }

  async function updateUserGoals(goal:GoalItem, index:number) {
    if (allowEdit[0] === index && allowEdit[1] !== goal.title) {
      await updateGoal(goal.id, { title: allowEdit[1] });
      const goals:GoalItem[] = await getAllGoals();
      setUserGoals(goals);
      setAllowEdit([-1, '']);
    }
  }
  async function removeUserGoal(id: number) {
    await removeGoal(id);
    const goals: GoalItem[] = await getAllGoals();
    setShowOptionsOfGoalIndex(-1);
    setUserGoals(goals);
  }
  async function search(text: string) {
    const goals:GoalItem[] = await getAllGoals();
    setUserGoals(
      goals.filter(
        (goal) => goal.title.toUpperCase().includes(text.toUpperCase()),
      ),
    );
  }
  function debounceSearch(event) {
    const { value } = event.target;

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    debounceTimeout = setTimeout(() => {
      search(value);
    }, 300);
  }

  useEffect(() => {
    (async () => {
      const goals:GoalItem[] = await getAllGoals();
      console.log(goals);
      setUserGoals(goals);
    })();
  }, []);

  return (
    <div id="myGoals-container">
      <Container fluid>
        <input id="goal-searchBar" placeholder="Search" onChange={(e) => debounceSearch(e)} />
        <h1 id="myGoals_title">My Goals</h1>
        <div id="myGoals-list">
          {
            userGoals?.map((goal:GoalItem, index) => (
              <div
                key={`task-${index}`}
                style={{ backgroundColor: `#${(0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)}` }}
                className="user-goal"
                onClickCapture={() => { setShowOptionsOfGoalIndex(index); }}
                onBlur={() => { setShowOptionsOfGoalIndex(-1); }}
              >
                <input
                  className="goal-title"
                  value={allowEdit[0] === index ? allowEdit[1] : goal.title}
                  onChange={(e) => { setAllowEdit([index, e.target.value]); }}
                  onBlur={() => { updateUserGoals(goal, index); }}
                />
                {showOptionsOfGoalIndex === index
                  ? (
                    <div className="interactables">
                      <PlusLg />
                      <Trash3Fill onClick={() => { removeUserGoal(goal.id); }} />
                      <PencilSquare />
                      <CheckLg />
                    </div>
                  )
                  : null}
              </div>
            ))
          }

          <img id="addGoal-btn" src={addIcon} alt="add-goal" />
        </div>
      </Container>
    </div>
  );
};
