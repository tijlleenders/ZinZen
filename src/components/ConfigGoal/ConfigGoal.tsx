/* eslint-disable complexity */
import { SliderMarks } from "antd/es/slider";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { Slider } from "antd";
import { useRecoilState } from "recoil";

import ColorPicker from "@components/ConfigGoal/components/ColorPicker";
import { GoalItem, TGoalCategory } from "@src/models/GoalItem";
import ZModal from "@src/common/ZModal";
import ZAccordion from "@src/common/Accordion";
import { getGoalHintItem } from "@src/api/HintsAPI";
import { TGoalConfigMode } from "@src/types";
import useGoalStore from "@src/hooks/useGoalStore";
import { unarchiveUserGoal } from "@src/api/GoalsAPI";
import { ILocationState, ScheduleStatus } from "@src/Interfaces";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { suggestedGoalState } from "@src/store/SuggestedGoalState";
import { getHistoryUptoGoal } from "@src/helpers/GoalProcessor";
import { ISchedulerOutput } from "@src/Interfaces/IScheduler";
import useScheduler from "@src/hooks/useScheduler";
import DefaultInput from "@src/common/DefaultInput";
import { useAddGoal } from "@src/hooks/api/Goals/mutations/useAddGoal";
import { useGetGoalById } from "@src/hooks/api/Goals/queries/useGetGoalById";
import { useEditGoal } from "@src/hooks/api/Goals/mutations/useEditGoal";
import { colorPalleteList, calDays, convertOnFilterToArray, getSelectedLanguage } from "../../utils";

import "./ConfigGoal.scss";
import CustomDatePicker from "./components/CustomDatePicker";
import HintToggle from "./components/HintToggle";
import useVirtualKeyboardOpen from "../../hooks/useVirtualKeyBoardOpen";
import ArchivedAutoComplete from "./components/ArchivedAutoComplete";
import useOnScreenKeyboardScrollFix from "../../hooks/useOnScreenKeyboardScrollFix";

const onDays = [...calDays.slice(1), "Sun"];

const roundOffHours = (hrsValue: string) => {
  return hrsValue === "" ? "" : String(Math.min(Math.max(Math.round(Number(hrsValue)), 0), 99));
};

interface ConfigGoalContentProps {
  type: TGoalCategory;
  mode: TGoalConfigMode;
  goal: GoalItem;
  onSave: () => Promise<void>;
  onCancel?: () => void;
}

const ConfigGoalContent = ({ type, goal, mode, onSave, onCancel }: ConfigGoalContentProps) => {
  const [suggestedGoal, setSuggestedGoal] = useRecoilState(suggestedGoalState);
  const isEditMode = mode === "edit";
  const action = isEditMode ? "Update" : "Create";
  const { addGoalMutation } = useAddGoal();
  const { editGoalMutation } = useEditGoal();

  const { parentId } = useParams();
  const { data: parentGoal } = useGetGoalById(parentId ?? "");

  const location = useLocation();
  const navigate = useNavigate();

  const { checkGoalSchedule } = useScheduler();
  const [scheduleStatus, setScheduleStatus] = useState<ScheduleStatus>(null);

  let defaultColorIndex = Math.floor(Math.random() * colorPalleteList.length - 1) + 1;
  let defaultAfterTime = isEditMode ? (goal.afterTime ?? 9) : 9;
  let defaultBeforeTime = isEditMode ? (goal.beforeTime ?? 18) : 18;

  if (isEditMode) {
    defaultColorIndex = colorPalleteList.indexOf(goal.goalColor);
  } else if (parentGoal) {
    defaultColorIndex = colorPalleteList.indexOf(parentGoal.goalColor);
    defaultAfterTime = parentGoal.afterTime ?? 18;
    defaultBeforeTime = parentGoal.beforeTime ?? 9;
  }

  const { t } = useTranslation();

  const isKeyboardOpen = useVirtualKeyboardOpen();
  useOnScreenKeyboardScrollFix();

  const [colorIndex, setColorIndex] = useState(defaultColorIndex);

  const [betweenSliderUpdated, setBetweenSliderUpdated] = useState(false);

  const [hintOption, setHintOption] = useState(false);

  useEffect(() => {
    getGoalHintItem(goal.id).then((hintItem) => {
      setHintOption(!!hintItem?.hintOptionEnabled);
    });
  }, [goal.id]);

  const [title, setTitle] = useState<string>(t(goal.title));
  const handleTitleChange = (value: string) => {
    setTitle(value);
  };
  const [due, setDue] = useState(goal.due ? new Date(goal.due).toISOString().slice(0, 10) : "");
  const [tags, setTags] = useState({
    on: goal.on || convertOnFilterToArray("weekdays"),
    repeatWeekly: goal.habit === "weekly",
    duration: goal.duration ?? "",
  });
  const numberOfDays = tags.on.length;

  const [afterTime, setAfterTime] = useState(defaultAfterTime);
  const [beforeTime, setBeforeTime] = useState(defaultBeforeTime);
  const timeDiff = beforeTime - afterTime;
  const perDayBudget = (goal.timeBudget?.perDay?.includes("-") ? goal.timeBudget.perDay : `${timeDiff}-${timeDiff}`)
    .split("-")
    .map((ele) => Number(ele));
  const perWeekBudget = (
    goal.timeBudget?.perWeek?.includes("-")
      ? goal.timeBudget.perWeek
      : `${timeDiff * numberOfDays}-${timeDiff * numberOfDays}`
  )
    .split("-")
    .map((ele) => Number(ele));

  const [perDayHrs, setPerDayHrs] = useState(perDayBudget);
  const [perWeekHrs, setPerWeekHrs] = useState(perWeekBudget);

  const [isBudgetAccordianOpen, setIsBudgetAccordianOpen] = useState(false);
  const marks: SliderMarks = { 0: "0", 24: "24" };

  const goalCategoryType = tags.duration !== "" ? "Standard" : "Cluster";
  const category = type === "Budget" ? "Budget" : goalCategoryType;

  const getFinalTags = (): GoalItem => ({
    ...goal,
    due: due && due !== "" ? new Date(due).toISOString() : null,
    duration: tags.duration !== "" ? `${tags.duration}` : null,
    afterTime: type === "Budget" ? afterTime : null,
    beforeTime: type === "Budget" ? beforeTime : null,
    habit: tags.repeatWeekly ? "weekly" : null,
    on: type === "Budget" ? calDays.filter((ele) => tags.on.includes(ele)) : null,
    timeBudget:
      type === "Budget"
        ? {
            perDay: perDayHrs.join("-"),
            perWeek: perWeekHrs.join("-"),
          }
        : undefined,
    category,
    title: title
      .split(" ")
      .filter((ele: string) => ele !== "")
      .join(" "),
    goalColor: colorPalleteList[colorIndex],
    parentGoalId: parentGoal?.id ?? "root",
    language: getSelectedLanguage(),
  });

  const handleSave = async () => {
    if (title.trim().length) {
      if (isEditMode) {
        editGoalMutation({ goal: getFinalTags(), hintOption });
      } else {
        addGoalMutation({
          newGoal: getFinalTags(),
          hintOption,
          parentGoal,
        });
      }
    }
    if (suggestedGoal) {
      await unarchiveUserGoal(suggestedGoal);
      navigate(`/goals/${suggestedGoal.parentGoalId === "root" ? "" : suggestedGoal.parentGoalId}`, {
        state: { ...location.state },
        replace: true,
      });
      setSuggestedGoal(null);
      return;
    }
    await onSave();
  };

  const handleSliderChange = (value: number[], setHours: React.Dispatch<React.SetStateAction<number[]>>) => {
    if (value[0] === 0 && value[1] === 0) {
      setHours([0, 1]);
    } else if (value[0] === 0 && value[1] < 1) {
      setHours([0, 1]);
    } else {
      setHours(value);
    }
  };

  useEffect(() => {
    document.getElementById("title-field")?.focus();
  }, []);

  useEffect(() => {
    if (betweenSliderUpdated) {
      const timeRange = beforeTime - afterTime;
      const weeklyRange = timeRange * numberOfDays;
      const updatedPerDayHrs = perDayHrs.map((hour) => Math.min(Math.max(hour, timeRange), timeRange));
      const updatedPerWeekHrs = perWeekHrs.map((hour) => Math.min(Math.max(hour, weeklyRange), weeklyRange));

      setPerDayHrs(updatedPerDayHrs);
      setPerWeekHrs(updatedPerWeekHrs);
      setBetweenSliderUpdated(false);
    }
  }, [afterTime, beforeTime, numberOfDays, betweenSliderUpdated]);

  const budgetPerHrSummary = perDayHrs[0] === perDayHrs[1] ? perDayHrs[0] : `${perDayHrs[0]} - ${perDayHrs[1]}`;
  const budgetPerWeekSummary =
    perWeekHrs[0] === perWeekHrs[1] ? `${perWeekHrs[0]} hrs / week` : `${perWeekHrs[0]} - ${perWeekHrs[1]} hrs / week`;

  const minWeekValue = perDayHrs[0] * numberOfDays;
  const maxWeekValue = perDayHrs[1] * numberOfDays;

  const handleWeekSliderChange = (value: number[]) => {
    let adjustedValue: number[] = value.slice();

    adjustedValue[0] = Math.max(adjustedValue[0], minWeekValue);
    adjustedValue[1] = Math.min(adjustedValue[1], maxWeekValue);

    if (adjustedValue[0] > adjustedValue[1]) {
      [adjustedValue[0], adjustedValue[1]] = [adjustedValue[1], adjustedValue[0]];
    }

    if (perDayHrs[0] === perDayHrs[1]) {
      adjustedValue = [minWeekValue, maxWeekValue];
    }

    adjustedValue = adjustedValue.map((val) => Math.max(minWeekValue, Math.min(val, maxWeekValue)));
    setPerWeekHrs(adjustedValue);
  };

  useEffect(() => {
    handleWeekSliderChange(perWeekHrs);
  }, [perDayHrs, setPerDayHrs, tags.on]);

  const { openEditMode } = useGoalStore();

  const onSuggestionClick = async (selectedGoal: GoalItem) => {
    const updatedGoalsHistory = await getHistoryUptoGoal(selectedGoal.parentGoalId);

    const newState: ILocationState = {
      ...location.state,
      goalsHistory: updatedGoalsHistory,
    };

    openEditMode(selectedGoal, newState);
    setSuggestedGoal(selectedGoal);
    setTitle(selectedGoal.title);
    setColorIndex(colorPalleteList.indexOf(selectedGoal.goalColor));
    setAfterTime(selectedGoal.afterTime ?? 9);
    setBeforeTime(selectedGoal.beforeTime ?? 18);
    setTags({
      on: selectedGoal.on || convertOnFilterToArray("weekdays"),
      repeatWeekly: selectedGoal.habit === "weekly",
      duration: selectedGoal.duration ?? "",
    });
    setDue(selectedGoal.due ? new Date(selectedGoal.due).toISOString().slice(0, 10) : "");
    if (type === "Budget") {
      if (selectedGoal.beforeTime == null || selectedGoal.afterTime == null) {
        return;
      }
      const selectedPerDayBudget = (
        selectedGoal.timeBudget?.perDay?.includes("-")
          ? selectedGoal.timeBudget.perDay
          : `${selectedGoal.beforeTime - selectedGoal.afterTime}-${selectedGoal.beforeTime - selectedGoal.afterTime}`
      )
        .split("-")
        .map((ele) => Number(ele));
      setPerDayHrs(selectedPerDayBudget);

      const selectedNumberOfDays = selectedGoal.on?.length ?? 7;
      const selectedPerWeekBudget = (
        selectedGoal.timeBudget?.perWeek?.includes("-")
          ? selectedGoal.timeBudget.perWeek
          : `${selectedPerDayBudget[0] * selectedNumberOfDays}-${selectedPerDayBudget[1] * selectedNumberOfDays}`
      )
        .split("-")
        .map((ele) => Number(ele));
      setPerWeekHrs(selectedPerWeekBudget);
    }
    const hint = await getGoalHintItem(selectedGoal.id);
    setHintOption(hint?.hintOptionEnabled || false);
  };

  const titlePlaceholder = t(`${type !== "Budget" ? "goal" : "budget"}Title`);

  const checkSchedulingStatus = async (schedulerOutput: ISchedulerOutput | undefined, goalId: string) => {
    if (!schedulerOutput) return "pending";

    const { scheduled, impossible } = schedulerOutput;

    if (impossible?.some((task) => task.id === goalId)) {
      return "impossible";
    }

    const isScheduledInNext7Days = scheduled.some((day) => day.tasks.some((task) => task.goalid === goalId));

    return isScheduledInNext7Days ? "scheduled" : "future";
  };

  const getScheduleStatusText = (status: ScheduleStatus) => {
    switch (status) {
      case "scheduled":
        return "Auto scheduled";
      case "impossible":
        return "! Impossible";
      case "future":
        return "Scheduled someday";
      default:
        return "";
    }
  };

  const checkSchedule = async () => {
    setScheduleStatus("pending");
    try {
      const result = await checkGoalSchedule(getFinalTags());
      const status = await checkSchedulingStatus(result || undefined, goal.id);
      setScheduleStatus(status);
    } catch (error) {
      setScheduleStatus(null);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      console.log("checking schedule");
      checkSchedule();
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [tags.duration, afterTime, beforeTime, perDayHrs, perWeekHrs]);

  const sliderTooltipAlignConfig = {
    points: ["bc", "tc"],
    offset: [0, -40],
    overflow: { adjustX: true, adjustY: true },
    useCssTransform: true,
  };

  return (
    <form
      className="configGoal"
      onSubmit={async (e) => {
        e.preventDefault();
        await handleSave();
      }}
    >
      <div style={{ textAlign: "left" }} className="header-title">
        <ColorPicker colorIndex={colorIndex} setColorIndex={setColorIndex} />
        <ArchivedAutoComplete
          placeholder={titlePlaceholder}
          inputValue={title}
          onGoalSelect={onSuggestionClick}
          onInputChange={handleTitleChange}
        />
      </div>
      <div
        className="d-flex f-col gap-20"
        style={{
          marginTop: 24,
          padding: "0 18px",
        }}
      >
        {type === "Budget" ? (
          <>
            <div>
              <span>Between</span>
              <Slider
                tooltip={{
                  align: sliderTooltipAlignConfig,
                }}
                min={0}
                max={24}
                marks={{
                  ...marks,
                  [afterTime]: `${afterTime}`,
                  [beforeTime]: `${beforeTime}`,
                }}
                range
                value={[afterTime, beforeTime]}
                onChange={(val) => {
                  setAfterTime(val[0]);
                  setBeforeTime(val[1]);
                  setBetweenSliderUpdated(true);
                }}
              />
            </div>
            <ZAccordion
              showCount={false}
              style={{
                border: "none",
                background: "var(--secondary-background)",
              }}
              onChange={() => setIsBudgetAccordianOpen(!isBudgetAccordianOpen)}
              panels={[
                {
                  header: isBudgetAccordianOpen ? "Budget" : `${budgetPerHrSummary} hr / day, ${budgetPerWeekSummary}`,
                  body: (
                    <div>
                      <div>
                        <span>{budgetPerHrSummary} hrs / day</span>
                        <Slider
                          tooltip={{
                            align: sliderTooltipAlignConfig,
                          }}
                          min={0}
                          max={beforeTime - afterTime}
                          marks={{
                            0: "0",
                            [perDayHrs[0]]: `${perDayHrs[0]}`,
                            [perDayHrs[1]]: `${perDayHrs[1]}`,
                            [beforeTime - afterTime]: `${beforeTime - afterTime}`,
                          }}
                          range
                          value={[perDayHrs[0], perDayHrs[1]]}
                          onChange={(val) => handleSliderChange(val, setPerDayHrs)}
                        />
                      </div>
                      <div>
                        <span>{budgetPerWeekSummary}</span>
                        <Slider
                          tooltip={{
                            align: sliderTooltipAlignConfig,
                          }}
                          min={minWeekValue}
                          max={maxWeekValue}
                          marks={{
                            [minWeekValue]: `${minWeekValue}`,
                            [perWeekHrs[0]]: `${perWeekHrs[0]}`,
                            [perWeekHrs[1]]: `${perWeekHrs[1]}`,
                            [maxWeekValue]: `${maxWeekValue}`,
                          }}
                          range
                          value={[perWeekHrs[0], perWeekHrs[1]]}
                          onChange={(val) => handleWeekSliderChange(val)}
                        />
                      </div>
                    </div>
                  ),
                },
              ]}
            />
            <div className="place-middle gap-8 h-100">
              {onDays.map((d) => (
                <span
                  onClickCapture={() => {
                    setTags({
                      ...tags,
                      on: tags.on.includes(d) ? [...tags.on.filter((ele) => ele !== d)] : [...tags.on, d],
                    });
                  }}
                  className={`on_day ${tags.on.includes(d) ? "selected" : ""}`}
                  key={d}
                >
                  {t(d)[0]}
                </span>
              ))}
            </div>
            <div className="action-btn-container">
              <HintToggle setHints={setHintOption} defaultValue={hintOption} />
              <button type="submit" className="action-btn place-middle gap-16">
                {t(`${action} Budget`)}
              </button>
            </div>
            {scheduleStatus && (
              <div className={`schedule-status ${scheduleStatus}`}>{getScheduleStatusText(scheduleStatus)}</div>
            )}
          </>
        ) : (
          <div className="d-flex f-col gap-16">
            <div className="action-btn-container">
              <HintToggle setHints={setHintOption} defaultValue={hintOption} />
              <button type="submit" className="action-btn place-middle gap-16">
                {t(`${action} Goal`)}
              </button>
            </div>
            <div className="place-middle justify-fs gap-16">
              <span>{t("duration")}</span>
              <DefaultInput
                type="number"
                value={tags.duration}
                width={20}
                textAlign="center"
                onChange={(e) => {
                  setTags({ ...tags, duration: roundOffHours(e.target.value) });
                }}
                customStyle={{ borderRadius: "4px", padding: "8px 8px" }}
              />
              <span>{t("dueDate")}</span>
              <CustomDatePicker
                dateValue={due}
                handleDateChange={(newDate) => {
                  setDue(newDate);
                }}
                timeValue={0}
                disablePastDates
              />
            </div>
            {scheduleStatus && tags.duration && (
              <div className={`schedule-status ${scheduleStatus}`}>{getScheduleStatusText(scheduleStatus)}</div>
            )}
          </div>
        )}
      </div>
    </form>
  );
};

interface ConfigGoalProps {
  type: TGoalCategory;
  mode: TGoalConfigMode;
  goal: GoalItem;
  useModal?: boolean;
  onSave?: () => Promise<void>;
  onCancel?: () => Promise<void>;
}

const ConfigGoal = ({ type, goal, mode, useModal = true, onSave, onCancel }: ConfigGoalProps) => {
  const isKeyboardOpen = useVirtualKeyboardOpen();
  const [title, setTitle] = useState<string>("");

  const handleSave = async () => {
    if (onSave) {
      await onSave();
    } else {
      window.history.back();
    }
  };

  const handleCancel = async () => {
    if (onCancel) {
      await onCancel();
    } else if (!title.trim().length) {
      window.history.back();
    } else {
      await handleSave();
    }
  };

  if (useModal) {
    return (
      <ZModal
        open
        type="configGoal"
        style={{
          transform: `translate(0, ${isKeyboardOpen ? "-45%" : "0"})`,
          transition: "transform 0.3s ease-in-out",
        }}
        width={360}
        onCancel={handleCancel}
      >
        <ConfigGoalContent type={type} mode={mode} goal={goal} onSave={handleSave} onCancel={handleCancel} />
      </ZModal>
    );
  }

  return <ConfigGoalContent type={type} mode={mode} goal={goal} onSave={handleSave} onCancel={handleCancel} />;
};

export default ConfigGoal;
