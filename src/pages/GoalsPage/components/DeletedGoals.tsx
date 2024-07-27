import MyGoal from "@components/GoalsComponents/MyGoal/MyGoal";
import ActionDiv from "@components/GoalsComponents/MyGoalActions/ActionDiv";
import { unarchiveIcon } from "@src/assets";
import ZAccordion from "@src/common/Accordion";
import ZModal from "@src/common/ZModal";
import { useDeletedGoalContext } from "@src/contexts/deletedGoal-context";
import useGoalActions from "@src/hooks/useGoalActions";
import { TrashItem } from "@src/models/TrashItem";
import { darkModeState } from "@src/store";
import { t } from "i18next";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

const Actions = ({ goal }: { goal: TrashItem }) => {
  const darkMode = useRecoilValue(darkModeState);
  const { deleteGoalAction } = useGoalActions();

  return (
    <ZModal open width={400} onCancel={() => window.history.back()} type="interactables-modal">
      <div
        style={{ textAlign: "left" }}
        className="header-title"
        onClickCapture={() => {
          handleUpdateGoal(goal);
        }}
      >
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
          }}
        >
          <ActionDiv label={t("Delete")} icon="Delete" />
        </button>
      </div>
    </ZModal>
  );
};

const DeletedGoals = ({ goals }: { goals: TrashItem[] }) => {
  const darkMode = useRecoilValue(darkModeState);
  const [searchParams] = useSearchParams();

  const { goal: deletedGoal } = useDeletedGoalContext();

  const showOptions = !!searchParams.get("showOptions") && deletedGoal;

  return (
    <div className="archived-drawer">
      {showOptions && deletedGoal && <Actions goal={deletedGoal} />}
      {goals.length > 0 && (
        <ZAccordion
          showCount
          style={{
            border: "none",
            background: darkMode ? "var(--secondary-background)" : "transparent",
          }}
          panels={[
            {
              header: "Trash",
              body: goals.map(({ deletedAt: _, ...goal }) => <MyGoal key={`goal-${goal.id}`} goal={goal} />),
            },
          ]}
        />
      )}
    </div>
  );
};

export default DeletedGoals;
