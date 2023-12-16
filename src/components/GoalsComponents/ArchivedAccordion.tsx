import React from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";

import { GoalItem } from "@src/models/GoalItem";
import ZAccordion from "@src/common/Accordion";

import MyGoal from "./MyGoal/MyGoal";

interface IArchivedAccordionProps {
  archivedGoals: GoalItem[];
  showActions: {
    open: string;
    click: number;
  };
  setShowActions: React.Dispatch<
    React.SetStateAction<{
      open: string;
      click: number;
    }>
  >;
}
const ArchivedAccordion: React.FC<IArchivedAccordionProps> = ({ archivedGoals, showActions, setShowActions }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  return (
    <div className="archived-drawer">
      {archivedGoals.length > 0 && (
        <ZAccordion
          showCount
          style={{
            border: "none",
            background: darkModeStatus ? "var(--secondary-background)" : "transparent",
          }}
          panels={[
            {
              header: "Done",
              body: archivedGoals.map((goal: GoalItem) => (
                <MyGoal key={`goal-${goal.id}`} goal={goal} showActions={showActions} setShowActions={setShowActions} />
              )),
            },
          ]}
        />
      )}
    </div>
  );
};

export default ArchivedAccordion;
