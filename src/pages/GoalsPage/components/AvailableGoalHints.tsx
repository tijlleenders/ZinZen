import MyGoal from "@components/GoalsComponents/MyGoal/MyGoal";
import ActionDiv from "@components/GoalsComponents/MyGoalActions/ActionDiv";
import { unarchiveIcon } from "@src/assets";
import ZAccordion from "@src/common/Accordion";
import ZModal from "@src/common/ZModal";
import { darkModeState } from "@src/store";
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { GoalItem } from "@src/models/GoalItem";
import ModalActionButton from "@components/Buttons/ModalActionButton";
import { useGetGoalHints } from "../../../hooks/api/Hints/queries/useGetGoalHints";
import { useDeleteGoalHint } from "../../../hooks/api/Hints/mutations/useDeleteGoalHint";
import { useReportGoalHints } from "../../../hooks/api/Hints/mutations/useReportGoalHints";
import { useAddGoalHintsToMyGoal } from "../../../hooks/api/Hints/mutations/useAddGoalHintsToMyGoal";

const Actions = ({ goal }: { goal: GoalItem }) => {
  const { t } = useTranslation();
  const darkMode = useRecoilValue(darkModeState);

  const { deleteGoalHint } = useDeleteGoalHint();
  const { reportGoalHint, isReportingGoalHint } = useReportGoalHints();
  const { addGoalHintToMyGoal } = useAddGoalHintsToMyGoal();

  return (
    <ZModal open width={400} type="interactables-modal">
      <div style={{ textAlign: "left" }} className="header-title">
        <p className="ordinary-element" id="title-field">
          {t(`${goal.title}`)}
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <ModalActionButton
          onClick={async () => {
            await deleteGoalHint();
          }}
        >
          <ActionDiv label={t("Delete")} icon="Delete" />
        </ModalActionButton>

        <ModalActionButton
          onClick={async () => {
            await addGoalHintToMyGoal(goal);
          }}
        >
          <ActionDiv label={t("Add")} icon="Add" />
        </ModalActionButton>
        <ModalActionButton loading={isReportingGoalHint} onClick={() => reportGoalHint(goal)}>
          <ActionDiv
            label={t("Report")}
            icon={
              <img
                alt="archived goal"
                src={unarchiveIcon}
                width={24}
                height={25}
                style={{ filter: darkMode ? "invert(1)" : "none" }}
              />
            }
          />
        </ModalActionButton>
      </div>
    </ZModal>
  );
};

const AvailableGoalHints = () => {
  const darkMode = useRecoilValue(darkModeState);
  const [searchParams] = useSearchParams();
  const { activeGoalId } = useParams();
  const { hints: goalHints, isLoading: goalHintsLoading } = useGetGoalHints();

  const goalHint = goalHints?.find((goal) => goal.id === activeGoalId);
  const showOptions = !!searchParams.get("showOptions") && goalHint;

  if (goalHintsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="archived-drawer">
      {showOptions && <Actions goal={goalHint} />}
      {goalHints && goalHints.length > 0 && (
        <ZAccordion
          showCount
          style={{
            border: "none",
            background: darkMode ? "var(--secondary-background)" : "transparent",
          }}
          panels={[
            {
              header: "Hints",
              body: goalHints.map((goal) => <MyGoal key={`goal-${goal.id}`} goal={{ ...goal, impossible: false }} />),
            },
          ]}
        />
      )}
    </div>
  );
};

export default AvailableGoalHints;
