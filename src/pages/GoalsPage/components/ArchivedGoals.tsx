import MyGoal from "@components/GoalsComponents/MyGoal/MyGoal";
import ActionDiv from "@components/GoalsComponents/MyGoalActions/ActionDiv";
import { unarchiveIcon } from "@src/assets";
import ZAccordion from "@src/common/Accordion";
import ZModal from "@src/common/ZModal";
import { useActiveGoalContext } from "@src/contexts/activeGoal-context";
import useGoalActions from "@src/hooks/useGoalActions";
import { GoalItem } from "@src/models/GoalItem";
import { darkModeState } from "@src/store";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

const Actions = ({ goal }: { goal: GoalItem }) => {
  const darkMode = useRecoilValue(darkModeState);
  const { restoreArchivedGoal, deleteGoalAction } = useGoalActions();
  const { t } = useTranslation();

  return (
    <ZModal open width={400} onCancel={() => window.history.back()} type="interactables-modal">
      <div style={{ textAlign: "left" }} className="header-title">
        <p className="ordinary-element" id="title-field">
          {t(`${goal.title}`)}
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <button
          type="button"
          className="goal-action-archive shareOptions-btn"
          onClick={async (e) => {
            e.stopPropagation();
            await restoreArchivedGoal(goal);
            window.history.back();
          }}
        >
          <ActionDiv
            label={t("Restore")}
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
        </button>

        <button
          type="button"
          className="goal-action-archive shareOptions-btn"
          onClick={async () => {
            await deleteGoalAction(goal);
            window.history.back();
          }}
        >
          <ActionDiv label={t("Delete")} icon="Delete" />
        </button>
      </div>
    </ZModal>
  );
};

const ArchivedGoals = ({ goals }: { goals: GoalItem[] }) => {
  const darkMode = useRecoilValue(darkModeState);
  const [searchParams] = useSearchParams();
  const { goal: activeGoal } = useActiveGoalContext();
  const showOptions = !!searchParams.get("showOptions") && activeGoal;
  console.log("🚀 ~ ArchivedGoals ~ showOptions:", showOptions);

  return (
    <div className="archived-drawer">
      {showOptions && <Actions goal={activeGoal} />}
      {goals.length > 0 && (
        <ZAccordion
          showCount
          style={{
            border: "none",
            background: darkMode ? "var(--secondary-background)" : "transparent",
          }}
          panels={[
            {
              header: "Done",
              body: goals.map((goal) => <MyGoal key={`goal-${goal.id}`} goal={goal} />),
            },
          ]}
        />
      )}
    </div>
  );
};

export default ArchivedGoals;
