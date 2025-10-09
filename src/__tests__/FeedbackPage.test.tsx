// @ts-nocheck
import React from "react";
import { RecoilRoot } from "recoil";
import { act, fireEvent, render } from "@testing-library/react";

import * as api from "@api/FeedbackAPI";
import { FeedbackPage } from "@pages/FeedbackPage/FeedbackPage";
import { expect } from "@jest/globals";
import { RouterProvider, createMemoryHistory, createRootRoute, createRouter } from "@tanstack/react-router";

global.alert = jest.fn();
global.fetch = jest.fn(() => {
  Promise.resolve({
    json: () =>
      Promise.resolve({
        status: "success",
        message: "Thank you so much for your feedback!",
      }),
  });
});

beforeEach(() => {
  fetch.mockClear();
});

describe("Feedback Page", () => {
  const createTestRouter = () => {
    const rootRoute = createRootRoute({
      component: FeedbackPage,
    });
    const memoryHistory = createMemoryHistory({
      initialEntries: ["/"],
    });
    return createRouter({
      routeTree: rootRoute,
      history: memoryHistory,
    });
  };

  it("submitFeedback API success flow", async () => {
    const res = await api.submitFeedback("this is a jest call");
    expect(res.status).toEqual("success");
  });
  it("submitFeedback API failure flow", async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error("Api error")));
    const res = await api.submitFeedback("this is a jest call");
    expect(res.status).toEqual("error");
  });
  it("Feedback Page success flow  ", async () => {
    const router = createTestRouter();
    const { findAllByText, getByText } = render(
      <RecoilRoot>
        <RouterProvider router={router} />
      </RecoilRoot>,
    );
    const button = getByText("Submit");
    fireEvent.click(button);
    await act(async () => {
      const router2 = createTestRouter();
      render(
        <RecoilRoot>
          <RouterProvider router={router2} />
        </RecoilRoot>,
      );
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    const boxes = await findAllByText("★");
    expect(boxes[0].parentElement).toHaveClass("notDecided");
  });

  it("Feedback Page Failure flow  ", async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error("Api error")));
    const router = createTestRouter();

    const { findAllByText, getByText } = render(
      <RecoilRoot>
        <RouterProvider router={router} />
      </RecoilRoot>,
    );
    const button = getByText("Submit");
    fireEvent.click(button);

    expect(fetch).toHaveBeenCalledTimes(1);
    const boxes = await findAllByText("★");
    expect(boxes[0].parentElement).toHaveClass("decided");
  });
});
