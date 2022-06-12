import React from 'react';
import { RecoilRoot } from 'recoil';
import {
  act, fireEvent, render,
} from '@testing-library/react';

import * as api from '@api/FeedbackAPI';
import { FeedbackPage } from '@pages/FeedbackPage/FeedbackPage';
import { expect } from '@jest/globals';

global.alert = jest.fn();
global.fetch = jest.fn(() => {
  Promise.resolve({
    json: () => Promise.resolve({
      status: 'success',
      message: 'Thank you so much for your feedback!',
    }),
  });
});

beforeEach(() => {
  fetch.mockClear();
});

describe('Feedback Page', () => {
  it('submitFeedback API success flow', async () => {
    const res = await api.submitFeedback('this is a jest call');
    expect(res.status).toEqual('success');
  });
  it('submitFeedback API failure flow', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Api error')));
    const res = await api.submitFeedback('this is a jest call');
    expect(res.status).toEqual('error');
  });
  it('Feedback Page success flow  ', async () => {
    const { findAllByText, getByText } = render(
      <RecoilRoot>
        <FeedbackPage />
      </RecoilRoot>,
    );
    const button = getByText('submit');
    fireEvent.click(button);
    act(async () => render(
      <RecoilRoot>
        <FeedbackPage />
      </RecoilRoot>,
    ));

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(global.alert).toHaveBeenCalledTimes(1);
    const boxes = await findAllByText('★');
    expect(boxes[0].parentElement).toHaveClass('notDecided');
  });

  it('Feedback Page Failure flow  ', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Api error')));

    const { findAllByText, getByText } = render(
      <RecoilRoot>
        <FeedbackPage />
      </RecoilRoot>,
    );
    const button = getByText('submit');
    fireEvent.click(button);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(global.alert).toHaveBeenCalledTimes(1);
    const boxes = await findAllByText('★');
    expect(boxes[0].parentElement).toHaveClass('decided');
  });
});
