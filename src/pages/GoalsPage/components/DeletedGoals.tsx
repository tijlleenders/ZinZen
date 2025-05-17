import MyGoal from "@components/GoalsComponents/MyGoal/MyGoal";
import ActionDiv from "@components/GoalsComponents/MyGoalActions/ActionDiv";
import { unarchiveIcon } from "@src/assets";
import ZAccordion from "@src/common/Accordion";
import ZModal from "@src/common/ZModal";
import { useDeletedGoalContext } from "@src/contexts/deletedGoal-context";
import { TrashItem } from "@src/models/TrashItem";
import { darkModeState } from "@src/store";
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useDeleteGoal } from "@src/hooks/api/Goals/useDeleteGoal";
import { useRestoreDeletedGoal } from "@src/hooks/api/Goals/useRestoreDeletedGoal";
import { useGetDeletedGoals } from "@src/hooks/api/Goals/useGetDeletedGoals";

const Actions = ({ goal }: { goal: TrashItem }) => {
  const darkMode = useRecoilValue(darkModeState);
  const { restoreDeletedGoalMutation } = useRestoreDeletedGoal();
  const { deleteGoalMutation } = useDeleteGoal();
  const { t } = useTranslation();

  return (
    <ZModal open width={400} type="interactables-modal">
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
            await restoreDeletedGoalMutation({ goal });
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
            await deleteGoalMutation(goal);
            window.history.back();
          }}
        >
          <ActionDiv label={t("Delete")} icon="Delete" />
        </button>
      </div>
    </ZModal>
  );
};

const DeletedGoals = () => {
  const { parentId } = useParams();
  const darkMode = useRecoilValue(darkModeState);
  const [searchParams] = useSearchParams();
  const { goal: deletedGoal } = useDeletedGoalContext();
  const { deletedGoals } = useGetDeletedGoals(parentId || "root");

  const showOptions = !!searchParams.get("showOptions") && deletedGoal;

  if (!deletedGoals) {
    return null;
  }

  return (
    <div className="archived-drawer">
      {showOptions && <Actions goal={deletedGoal} />}
      {deletedGoals.length > 0 && (
        <ZAccordion
          showCount
          style={{
            border: "none",
            background: darkMode ? "var(--secondary-background)" : "transparent",
          }}
          panels={[
            {
              header: "Trash",
              body: deletedGoals.map(({ deletedAt: _, ...goal }) => (
                <MyGoal key={`goal-${goal.id}`} goal={{ ...goal, impossible: false }} />
              )),
            },
          ]}
        />
      )}
    </div>
  );
};

export default DeletedGoals;
