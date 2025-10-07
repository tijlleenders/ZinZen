import { LandingPage } from "@pages/LandingPage/LandingPage";
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { MyTimePage } from "@pages/MyTimePage/MyTimePage";
import { FeedbackPage } from "@pages/FeedbackPage/FeedbackPage";
import ContactsPage from "@pages/GoalsPage/ContactsPage";
import PartnerGoals from "@pages/GoalsPage/PartnerGoals";
import { FeelingsPage } from "@pages/FeelingsPage/FeelingsPage";
import { FAQPage } from "@pages/FAQPage/FAQPage";
import InvitePage from "@pages/InvitePage/InvitePage";
import MyGoalsPage from "@pages/GoalsPage/MyGoalsPage";
import { useQueryClient } from "react-query";
import InvestPage from "@pages/InvestPage/InvestPage";
import SublistGoalsPage from "@pages/GoalsPage/SublistGoalsPage";
import AppLayout from "./layouts/AppLayout";
import { PartnerProvider } from "./contexts/partner-context";
import useApp from "./hooks/useApp";
import { useProcessSharedGoalData } from "./hooks/useProcessSharedGoalData";
import { getAllInboxItems } from "./api/InboxAPI";
import { checkAndUpdateGoalNewUpdatesStatus } from "./helpers/InboxProcessor";
import { GOAL_QUERY_KEYS } from "./factories/queryKeyFactory";
import { getActiveGoals, getGoalById } from "./api/GoalsAPI";

export const AppRoutes = () => {
  const queryClient = useQueryClient();

  const { isLanguageChosen } = useApp();
  useProcessSharedGoalData();

  useEffect(() => {
    getAllInboxItems().then((inboxItems) => {
      inboxItems.forEach((inboxItem) => {
        if (inboxItem.id !== "root" && Object.keys(inboxItem.changes).length > 0) {
          checkAndUpdateGoalNewUpdatesStatus(inboxItem.id);
        }
      });
    });
  }, []);

  const activeGoalsLoader = async (parentId: string) => {
    await queryClient.fetchQuery({
      queryKey: GOAL_QUERY_KEYS.list("active", parentId),
      queryFn: () => getActiveGoals(parentId),
    });
    return null;
  };

  const activeGoalLoader = async (activeGoalId: string) => {
    await queryClient.fetchQuery({
      queryKey: GOAL_QUERY_KEYS.detail(activeGoalId),
      queryFn: () => getGoalById(activeGoalId),
    });
    return null;
  };

  return (
    <Routes>
      {!isLanguageChosen ? <Route path="/" element={<LandingPage />} /> : <Route path="/" element={<MyTimePage />} />}
      <Route path="/Feedback" element={<FeedbackPage />} />
      <Route path="*" element={<MyGoalsPage />} loader={async () => activeGoalsLoader("root")} />
      <Route path="/goals/root" element={<MyGoalsPage />} loader={async () => activeGoalsLoader("root")} />
      <Route
        path="/goals/root/:activeGoalId"
        element={<MyGoalsPage />}
        loader={async ({ params }) => activeGoalLoader(params.activeGoalId || "")}
      />

      <Route path="/goals/:parentId" element={<SublistGoalsPage />} />
      <Route path="/goals/:parentId/:activeGoalId" element={<SublistGoalsPage />} />

      <Route
        path="/partners"
        element={
          <PartnerProvider>
            <ContactsPage />
          </PartnerProvider>
        }
      />
      <Route
        path="/partners/:partnerId"
        element={
          <PartnerProvider>
            <ContactsPage />
          </PartnerProvider>
        }
      />

      <Route
        path="partners/:partnerId/goals"
        element={
          <PartnerProvider>
            <PartnerGoals />
          </PartnerProvider>
        }
      />
      <Route
        path="partners/:partnerId/goals/:parentId"
        element={
          <PartnerProvider>
            <PartnerGoals />
          </PartnerProvider>
        }
      />
      <Route
        path="partners/:partnerId/goals/:parentId/:activeGoalId"
        element={
          <PartnerProvider>
            <PartnerGoals />
          </PartnerProvider>
        }
      />

      <Route
        path="/MyJournal"
        element={
          <AppLayout title="myJournal">
            <FeelingsPage />
          </AppLayout>
        }
      />
      <Route path="/ZinZenFAQ" element={<FAQPage />} />
      <Route path="/invite/:id" element={<InvitePage />} />
      <Route path="/Invest" element={<InvestPage />} />
      <Route
        path="/donate"
        Component={() => {
          window.location.href = "https://donate.stripe.com/6oE4jK1iPcPT1m89AA";
          return null;
        }}
      />
    </Routes>
  );
};
