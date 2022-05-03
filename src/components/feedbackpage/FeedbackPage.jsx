import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { HeaderDashboard } from '../dashboard/HeaderDashboard';
import { darkModeState } from '../../store/DarkModeState';

import './feedbackpage.scss';

export function FeedbackPage() {
  const [userRating, setUserRating] = useState(0);
  const [userFeedback, setUserFeedback] = useState('');
  const darkModeStatus = useRecoilValue(darkModeState);

  async function submitToAPI(feedback) {
    const URL = 'https://tpzmoaw42e.execute-api.eu-west-1.amazonaws.com/prod/contact';
    const updatedFeedback = `Rating : ${userRating}\n${feedback}`;
    fetch(URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedFeedback),
    })
      .then((response) => response.json())
      .then(() => {
        alert('Thank you so much for your feedback! We will improve.');
        setUserFeedback('');
        setUserRating(0);
      })
      .catch(() => {
        alert("Aww... So sorry something went wrong. Please try emailing. We'd love to hear from you!");
      });
  }

  return (
    <div id="feedback-container">
      <Container fluid>
        <HeaderDashboard />
        <div style={{ color: `${darkModeStatus ? 'white' : 'black'}` }}>
          <p id="feedback-line-1"> We value your opinion.</p>
          <h1 id="feedback-line-2"> Please rate your experience</h1>
          <div className="rating">
            {[...Array(5)].map((star, index) => {
              const idx = index + 1;
              return (
                <button
                  id="userRating-btn"
                  type="button"
                  key={idx}
                  className={index <= userRating ? 'decided' : 'notDecided'}
                  onClick={() => setUserRating(idx)}
                >
                  <span className="star">&#9733;</span>
                </button>
              );
            })}
          </div>
          <h5 id="feedback-line-3">How can we make your experience better?</h5>
          <textarea
            id="feedback-textbox"
            value={userFeedback}
            onChange={(e) => { setUserFeedback(e.target.value); }}
            placeholder="Type your feedback here..."
          />
          <p id="feedback-line-4">Your feedback is anonymous. If you want a reply, please leave an email or a phone number.</p>
          <Button id="feedback-submit-btn" onClick={() => { submitToAPI(userFeedback); }}>Submit</Button>
        </div>
      </Container>
    </div>
  );
}
