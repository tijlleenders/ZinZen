import { IFinalOutputSlot } from "@src/Interfaces/IScheduler";
import { darkModeState } from "@src/store";
import { getHrFromDateString } from "@src/utils/SchedulerUtils";
import React from "react";
import { useRecoilValue } from "recoil";
import { v4 as uuidv4 } from "uuid";

const ScheduledSlots = ({
  tasks,
  selectedHr,
  selectedDate,
  setSelectedHr,
  targetDuration,
  setOverridenTasks,
}: {
  selectedDate: Date;
  selectedHr: number;
  setSelectedHr: React.Dispatch<React.SetStateAction<number>>;
  tasks: IFinalOutputSlot[];
  targetDuration: number;
  setOverridenTasks: React.Dispatch<React.SetStateAction<IFinalOutputSlot[]>>;
}) => {
  const start = selectedDate.toLocaleDateString() === new Date().toLocaleDateString() ? new Date().getHours() : 0;
  const darkModeStatus = useRecoilValue(darkModeState);
  let slots: IFinalOutputSlot[] = [];
  tasks.forEach((task) => {
    const startHr = getHrFromDateString(task.start);
    const endHr = getHrFromDateString(task.deadline);
    slots = [...slots, ...Array((endHr || 24) - startHr).fill(task)];
  });
  return (
    <>
      {slots.slice(start).map((_slot, index) => (
        <button
          onClick={() => {
            setSelectedHr(index);
            const added = new Set();
            const overridenTasks: IFinalOutputSlot[] = [];
            slots.slice(index, index + targetDuration).forEach((item) => {
              if (!added.has(item.title)) {
                added.add(item.title);
                overridenTasks.push(item);
              }
            });
            setOverridenTasks([...overridenTasks]);
          }}
          type="button"
          key={uuidv4()}
          className={`slot-card ${index > selectedHr && index < targetDuration + selectedHr ? "booked" : ""} ${
            index === selectedHr ? "selected" : ""
          }`}
        >
          <p style={index === selectedHr ? { color: !darkModeStatus ? "#CD6E51" : "#9E9E9E" } : {}}>
            {index}
            <sup>00</sup>
          </p>
        </button>
      ))}
    </>
  );
};

export default ScheduledSlots;
