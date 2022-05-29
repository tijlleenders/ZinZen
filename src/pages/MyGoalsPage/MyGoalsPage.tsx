import React, { useState, useEffect } from 'react';
import { Container, Row, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
 PlusLg, Trash3Fill, PencilSquare, CheckLg,
} from 'react-bootstrap-icons';

import addIcon from '@assets/images/GoalsAddIcon.svg';
import {
  addGoal, getAllGoals, removeGoal, updateGoal,
} from '@api/GoalsAPI';
import { GoalItem } from '@src/models/GoalItem';

import './MyGoalsPage.scss';
import { HeaderDashboard } from '@components/HeaderDashboard/HeaderDashboard';

export const MyGoalsPage = () => {
  const [tapCount, setTapCount] = useState([-1, 0]);
  const navigate = useNavigate();
  const [userGoals, setUserGoals] = useState<GoalItem[]>();
  let debounceTimeout : ReturnType<typeof setTimeout>;

  async function populateDummyGoals() {
    const dummyData = ['shopping karni hai',
      'sabji lekr kaun ayega',
      'padosi ke ghar se aam leke ane hai',
    ];
    dummyData.map((goal:string) => (addGoal({
      title: goal,
      duration: 2,
      sublist: ['abc', 'xyz'],
      repeat: 'Daily',
      start: null,
      finish: null,
    })));
  }
  async function updateUserGoals(goal:GoalItem, index:number) {
    const updatedTitle = document.querySelector(`.goal-title:nth-child(${index + 1}`)?.textContent;
    if ( updatedTitle && tapCount[0] === index && updatedTitle !== goal.title) {
      await updateGoal(goal.id, { title: updatedTitle });
      const goals:GoalItem[] = await getAllGoals();
      setUserGoals(goals);
      console.log('update');
    }
  }
  async function removeUserGoal(id: number) {
    await removeGoal(id);
    const goals: GoalItem[] = await getAllGoals();
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
      await populateDummyGoals();
      const goals:GoalItem[] = await getAllGoals();
      console.log(goals);
      setUserGoals(goals);
    })();
  }, []);

  return (
    <div>
      <Container fluid>
        <Row>
          <HeaderDashboard />
        </Row>
      </Container>
      <div id="myGoals-container" onClickCapture={() => setTapCount([-1, 0])}>
        <Container fluid>
          <input id="goal-searchBar" onClickCapture={() => setTapCount([-1, 0])} placeholder="Search" onChange={(e) => debounceSearch(e)} />
          <h1 id="myGoals_title" onClickCapture={() => setTapCount([-1, 0])}>My Goals</h1>
          <div id="myGoals-list">
            {
            userGoals?.map((goal:GoalItem, index) => (
              <div
                key={`task-${index + 1}`}
                className="user-goal"
                onClickCapture={() => { setTapCount([index, tapCount[1] + 1]); }}
              >
                <div
                  className="goal-title"
                  contentEditable={tapCount[0] === index && tapCount[1] >= 1}
                  onClickCapture={() => setTapCount([index, tapCount[1] + 1])}
                  onBlur={() => { updateUserGoals(goal, index); }}
                  suppressContentEditableWarning
                >
                  {goal.title}
                </div>
                {tapCount[0] === index && tapCount[1] > 0
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
          </div>
          <Button
            onClick={() => {
              navigate('/Home/AddGoals');
            }}
          >
            <img
              id="addGoal-btn"
              src={addIcon}
              alt="add-goal"
            />
          </Button>

        </Container>
      </div>
    </div>
  );
};
