import { LandingPage } from "@pages/LandingPage/LandingPage";
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { MyTimePage } from "@pages/MyTimePage/MyTimePage";
import { FeedbackPage } from "@pages/FeedbackPage/FeedbackPage";
import { MyGoals } from "@pages/GoalsPage/MyGoals";
import ContactsPage from "@pages/GoalsPage/ContactsPage";
import PartnerGoals from "@pages/GoalsPage/PartnerGoals";
import { FeelingsPage } from "@pages/FeelingsPage/FeelingsPage";
import { FAQPage } from "@pages/FAQPage/FAQPage";
import InvitePage from "@pages/InvitePage/InvitePage";
import InvestPage from "@pages/InvestPage/InvestPage";
import AppLayout from "./layouts/AppLayout";
import { PartnerProvider } from "./contexts/partner-context";
import useApp from "./hooks/useApp";
import { useProcessSharedGoalData } from "./hooks/useProcessSharedGoalData";
import { getAllInboxItems } from "./api/InboxAPI";
import { checkAndUpdateGoalNewUpdatesStatus } from "./helpers/InboxProcessor";

export const AppRoutes = () => {
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

  return (
    <Routes>
      {!isLanguageChosen ? <Route path="/" element={<LandingPage />} /> : <Route path="/" element={<MyTimePage />} />}
      <Route path="/Feedback" element={<FeedbackPage />} />
      <Route path="*" element={<MyGoals />} />
      <Route path="/goals/:parentId" element={<MyGoals />} />
      <Route path="/goals/:parentId/:activeGoalId" element={<MyGoals />} />

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
      {/* <Route path="/goals" element={<GoalsPage />} /> */}

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
