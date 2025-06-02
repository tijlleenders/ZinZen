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
import { colorPalleteList, getSelectedLanguage } from "../../utils";

import "./ConfigGoal.scss";
import CustomDatePicker from "./components/CustomDatePicker";
import HintToggle from "./components/HintToggle";
import useVirtualKeyboardOpen from "../../hooks/useVirtualKeyBoardOpen";
import ArchivedAutoComplete from "./components/ArchivedAutoComplete";
import useOnScreenKeyboardScrollFix from "../../hooks/useOnScreenKeyboardScrollFix";
import { calDays, convertOnFilterToArray, roundOffHours, getDefaultColorIndex } from "./ConfigGoal.helper";

const onDays = [...calDays.slice(1), "Sun"];

interface FormState {
  colorIndex: number;
  hintOption: boolean;
  title: string;
  due: string;
  on: string[];
  duration: string;
  afterTime: number;
  beforeTime: number;
  perDayHrs: number[];
  perWeekHrs: number[];
}

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
  const [isBudgetAccordianOpen, setIsBudgetAccordianOpen] = useState(false);

  const defaultAfterTime = isEditMode ? (goal.afterTime ?? 9) : 9;
  const defaultBeforeTime = isEditMode ? (goal.beforeTime ?? 18) : 18;

  const { t } = useTranslation();

  const isKeyboardOpen = useVirtualKeyboardOpen();
  useOnScreenKeyboardScrollFix();

  const timeDiff = defaultBeforeTime - defaultAfterTime;
  const perDayBudget = (goal.timeBudget?.perDay?.includes("-") ? goal.timeBudget.perDay : `${timeDiff}-${timeDiff}`)
    .split("-")
    .map((ele) => Number(ele));
  const perWeekBudget = (
    goal.timeBudget?.perWeek?.includes("-")
      ? goal.timeBudget.perWeek
      : `${timeDiff * (goal.on?.length ?? 7)}-${timeDiff * (goal.on?.length ?? 7)}`
  )
    .split("-")
    .map((ele) => Number(ele));

  const [formState, setFormState] = useState<FormState>({
    colorIndex: getDefaultColorIndex(isEditMode, goal, parentGoal, colorPalleteList),
    hintOption: false,
    title: t(goal.title),
    due: goal.due ? new Date(goal.due).toISOString().slice(0, 10) : "",
    on: goal.on || convertOnFilterToArray("weekdays"),
    duration: goal.duration ?? "",
    afterTime: defaultAfterTime,
    beforeTime: defaultBeforeTime,
    perDayHrs: perDayBudget,
    perWeekHrs: perWeekBudget,
  });

  useEffect(() => {
    getGoalHintItem(goal.id).then((hintItem) => {
      setFormState((prev) => ({
        ...prev,
        hintOption: !!hintItem?.hintOptionEnabled,
      }));
    });
  }, [goal.id]);

  const handleTitleChange = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      title: value,
    }));
  };

  const numberOfDays = formState.on.length;

  const marks: SliderMarks = { 0: "0", 24: "24" };

  const goalCategoryType = formState.duration !== "" ? "Standard" : "Cluster";
  const category = type === "Budget" ? "Budget" : goalCategoryType;

  const getFinalTags = (): GoalItem => ({
    ...goal,
    due: formState.due && formState.due !== "" ? new Date(formState.due).toISOString() : null,
    duration: formState.duration !== "" ? `${formState.duration}` : null,
    afterTime: type === "Budget" ? formState.afterTime : null,
    beforeTime: type === "Budget" ? formState.beforeTime : null,
    on: type === "Budget" ? calDays.filter((ele) => formState.on.includes(ele)) : null,
    timeBudget:
      type === "Budget"
        ? {
            perDay: formState.perDayHrs.join("-"),
            perWeek: formState.perWeekHrs.join("-"),
          }
        : undefined,
    category,
    title: formState.title
      .split(" ")
      .filter((ele: string) => ele !== "")
      .join(" "),
    goalColor: colorPalleteList[formState.colorIndex],
    parentGoalId: parentGoal?.id ?? "root",
    language: getSelectedLanguage(),
  });

  const handleSave = async () => {
    if (formState.title.trim().length) {
      if (isEditMode) {
        editGoalMutation({ goal: getFinalTags(), hintOption: formState.hintOption });
      } else {
        addGoalMutation({
          newGoal: getFinalTags(),
          hintOption: formState.hintOption,
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
    const timeRange = formState.beforeTime - formState.afterTime;
    const weeklyRange = timeRange * numberOfDays;
    const updatedPerDayHrs = formState.perDayHrs.map((hour) => Math.min(Math.max(hour, timeRange), timeRange));
    const updatedPerWeekHrs = formState.perWeekHrs.map((hour) => Math.min(Math.max(hour, weeklyRange), weeklyRange));

    setFormState((prev) => ({
      ...prev,
      perDayHrs: updatedPerDayHrs,
      perWeekHrs: updatedPerWeekHrs,
    }));
  }, [formState.afterTime, formState.beforeTime, numberOfDays]);

  const budgetPerHrSummary =
    formState.perDayHrs[0] === formState.perDayHrs[1]
      ? formState.perDayHrs[0]
      : `${formState.perDayHrs[0]} - ${formState.perDayHrs[1]}`;
  const budgetPerWeekSummary =
    formState.perWeekHrs[0] === formState.perWeekHrs[1]
      ? `${formState.perWeekHrs[0]} hrs / week`
      : `${formState.perWeekHrs[0]} - ${formState.perWeekHrs[1]} hrs / week`;

  const minWeekValue = formState.perDayHrs[0] * numberOfDays;
  const maxWeekValue = formState.perDayHrs[1] * numberOfDays;

  const handleWeekSliderChange = (value: number[]) => {
    let adjustedValue: number[] = value.slice();

    adjustedValue[0] = Math.max(adjustedValue[0], minWeekValue);
    adjustedValue[1] = Math.min(adjustedValue[1], maxWeekValue);

    if (adjustedValue[0] > adjustedValue[1]) {
      [adjustedValue[0], adjustedValue[1]] = [adjustedValue[1], adjustedValue[0]];
    }

    if (formState.perDayHrs[0] === formState.perDayHrs[1]) {
      adjustedValue = [minWeekValue, maxWeekValue];
    }

    adjustedValue = adjustedValue.map((val) => Math.max(minWeekValue, Math.min(val, maxWeekValue)));
    setFormState((prev) => ({
      ...prev,
      perWeekHrs: adjustedValue,
    }));
  };

  useEffect(() => {
    handleWeekSliderChange(formState.perWeekHrs);
  }, [formState.perDayHrs, formState.on]);

  const { openEditMode } = useGoalStore();

  const onSuggestionClick = async (selectedGoal: GoalItem) => {
    const updatedGoalsHistory = await getHistoryUptoGoal(selectedGoal.parentGoalId);

    const newState: ILocationState = {
      ...location.state,
      goalsHistory: updatedGoalsHistory,
    };

    openEditMode(selectedGoal, newState);
    setSuggestedGoal(selectedGoal);

    const selectedPerDayBudget =
      selectedGoal.beforeTime && selectedGoal.afterTime
        ? (selectedGoal.timeBudget?.perDay?.includes("-")
            ? selectedGoal.timeBudget.perDay
            : `${selectedGoal.beforeTime - selectedGoal.afterTime}-${selectedGoal.beforeTime - selectedGoal.afterTime}`
          )
            .split("-")
            .map((ele) => Number(ele))
        : [0, 0];

    const selectedNumberOfDays = selectedGoal.on?.length ?? 7;
    const selectedPerWeekBudget =
      selectedGoal.beforeTime && selectedGoal.afterTime
        ? (selectedGoal.timeBudget?.perWeek?.includes("-")
            ? selectedGoal.timeBudget.perWeek
            : `${selectedPerDayBudget[0] * selectedNumberOfDays}-${selectedPerDayBudget[1] * selectedNumberOfDays}`
          )
            .split("-")
            .map((ele) => Number(ele))
        : [0, 0];

    setFormState({
      colorIndex: colorPalleteList.indexOf(selectedGoal.goalColor),
      hintOption: false,
      title: selectedGoal.title,
      due: selectedGoal.due ? new Date(selectedGoal.due).toISOString().slice(0, 10) : "",
      on: selectedGoal.on || convertOnFilterToArray("weekdays"),
      duration: selectedGoal.duration ?? "",
      afterTime: selectedGoal.afterTime ?? 9,
      beforeTime: selectedGoal.beforeTime ?? 18,
      perDayHrs: selectedPerDayBudget,
      perWeekHrs: selectedPerWeekBudget,
    });

    const hint = await getGoalHintItem(selectedGoal.id);
    setFormState((prev) => ({
      ...prev,
      hintOption: hint?.hintOptionEnabled || false,
    }));
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
  }, [formState.duration, formState.afterTime, formState.beforeTime, formState.perDayHrs, formState.perWeekHrs]);

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
        <ColorPicker
          colorIndex={formState.colorIndex}
          setColorIndex={(index: number) => setFormState((prev) => ({ ...prev, colorIndex: index }))}
        />
        <ArchivedAutoComplete
          placeholder={titlePlaceholder}
          inputValue={formState.title}
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
                  [formState.afterTime]: `${formState.afterTime}`,
                  [formState.beforeTime]: `${formState.beforeTime}`,
                }}
                range
                value={[formState.afterTime, formState.beforeTime]}
                onChange={(val) => {
                  setFormState((prev) => ({
                    ...prev,
                    afterTime: val[0],
                    beforeTime: val[1],
                  }));
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
                          max={formState.beforeTime - formState.afterTime}
                          marks={{
                            0: "0",
                            [formState.perDayHrs[0]]: `${formState.perDayHrs[0]}`,
                            [formState.perDayHrs[1]]: `${formState.perDayHrs[1]}`,
                            [formState.beforeTime - formState.afterTime]:
                              `${formState.beforeTime - formState.afterTime}`,
                          }}
                          range
                          value={[formState.perDayHrs[0], formState.perDayHrs[1]]}
                          onChange={(val) =>
                            handleSliderChange(val, (hours: number[]) =>
                              setFormState((prev) => ({ ...prev, perDayHrs: hours })),
                            )
                          }
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
                            [formState.perWeekHrs[0]]: `${formState.perWeekHrs[0]}`,
                            [formState.perWeekHrs[1]]: `${formState.perWeekHrs[1]}`,
                            [maxWeekValue]: `${maxWeekValue}`,
                          }}
                          range
                          value={[formState.perWeekHrs[0], formState.perWeekHrs[1]]}
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
                    setFormState((prev) => ({
                      ...prev,
                      on: prev.on.includes(d) ? [...prev.on.filter((ele) => ele !== d)] : [...prev.on, d],
                    }));
                  }}
                  className={`on_day ${formState.on.includes(d) ? "selected" : ""}`}
                  key={d}
                >
                  {t(d)[0]}
                </span>
              ))}
            </div>
            <div className="action-btn-container">
              <HintToggle
                setHints={(value: boolean) => setFormState((prev) => ({ ...prev, hintOption: value }))}
                defaultValue={formState.hintOption}
              />
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
              <HintToggle
                setHints={(value: boolean) => setFormState((prev) => ({ ...prev, hintOption: value }))}
                defaultValue={formState.hintOption}
              />
              <button type="submit" className="action-btn place-middle gap-16">
                {t(`${action} Goal`)}
              </button>
            </div>
            <div className="place-middle justify-fs gap-16">
              <span>{t("duration")}</span>
              <DefaultInput
                type="number"
                value={formState.duration}
                width={20}
                textAlign="center"
                onChange={(e) => {
                  setFormState((prev) => ({
                    ...prev,
                    duration: roundOffHours(e.target.value),
                  }));
                }}
                customStyle={{ borderRadius: "4px", padding: "8px 8px" }}
              />
              <span>{t("dueDate")}</span>
              <CustomDatePicker
                dateValue={formState.due}
                handleDateChange={(newDate) => {
                  setFormState((prev) => ({
                    ...prev,
                    due: newDate,
                  }));
                }}
                timeValue={0}
                disablePastDates
              />
            </div>
            {scheduleStatus && formState.duration && (
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
