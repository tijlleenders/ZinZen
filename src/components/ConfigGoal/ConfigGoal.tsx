/* eslint-disable complexity */
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { GoalItem, TGoalCategory } from "@src/models/GoalItem";
import ZModal from "@src/common/ZModal";
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
import { useAddGoal } from "@src/hooks/api/Goals/mutations/useAddGoal";
import { useGetGoalById } from "@src/hooks/api/Goals/queries/useGetGoalById";
import { useEditGoal } from "@src/hooks/api/Goals/mutations/useEditGoal";
import { colorPalleteList } from "../../utils";

import "./ConfigGoal.scss";
import useVirtualKeyboardOpen from "../../hooks/useVirtualKeyBoardOpen";
import useOnScreenKeyboardScrollFix from "../../hooks/useOnScreenKeyboardScrollFix";
import {
  calDays,
  convertOnFilterToArray,
  getDefaultColor,
  FormState,
  getDefaultFormStateForSimpleGoal,
  getFinalTags,
  checkSchedulingStatus,
  getDefaultFormStateForBudgetGoal,
} from "./ConfigGoal.helper";
import ConfigGoalHeader from "./components/ConfigGoalHeader";
import SimpleGoal from "./components/SimpleGoal";
import HintToggle from "./components/HintToggle";
import ZAccordion from "@src/common/Accordion";
import { Slider } from "antd";
import BetweenSlider from "./BetweenSlider";

const onDays = [...calDays.slice(1), "Sun"];

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

  const { t } = useTranslation();

  const isKeyboardOpen = useVirtualKeyboardOpen();
  useOnScreenKeyboardScrollFix();

  const [formState, setFormState] = useState<FormState>({
    goalColor: getDefaultColor(isEditMode, goal, parentGoal, colorPalleteList),
    hintOption: false,
    title: t(goal.title),
    ...(type === "Standard"
      ? {
          simpleGoal: getDefaultFormStateForSimpleGoal(goal),
          budgetGoal: undefined,
        }
      : {
          simpleGoal: undefined,
          budgetGoal: getDefaultFormStateForBudgetGoal(goal, isEditMode),
        }),
  });

  useEffect(() => {
    getGoalHintItem(goal.id).then((hintItem) => {
      setFormState((prev) => ({
        ...prev,
        hintOption: !!hintItem?.hintOptionEnabled,
      }));
    });
  }, [goal.id]);

  const { simpleGoal, budgetGoal } = formState;

  const numberOfDays = budgetGoal?.on.length;

  const goalCategoryType = simpleGoal?.duration !== null ? "Standard" : "Cluster";
  const category = type === "Budget" ? "Budget" : goalCategoryType;

  const handleSave = async () => {
    console.log("formState", formState);
    if (formState.title.trim().length) {
      if (isEditMode) {
        editGoalMutation({
          goal: getFinalTags({ goal, formState, parentGoal }),
          hintOption: formState.hintOption,
        });
      } else {
        addGoalMutation({
          newGoal: getFinalTags({ goal, formState, parentGoal }),
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
    if (!budgetGoal?.beforeTime || !budgetGoal?.afterTime) return;

    const timeRange = budgetGoal.beforeTime - budgetGoal.afterTime;
    const weeklyRange = timeRange * (numberOfDays ?? 0);
    const updatedPerDayHrs = budgetGoal.perDayHrs.map((hour) => Math.min(Math.max(hour, timeRange), timeRange));
    const updatedPerWeekHrs = budgetGoal.perWeekHrs.map((hour) => Math.min(Math.max(hour, weeklyRange), weeklyRange));

    setFormState((prev) => ({
      ...prev,
      budgetGoal: {
        ...prev.budgetGoal!,
        perDayHrs: updatedPerDayHrs,
        perWeekHrs: updatedPerWeekHrs,
      },
    }));
  }, [budgetGoal?.afterTime, budgetGoal?.beforeTime, numberOfDays]);

  const budgetPerHrSummary =
    budgetGoal?.perDayHrs[0] === budgetGoal?.perDayHrs[1]
      ? budgetGoal?.perDayHrs[0]
      : `${budgetGoal?.perDayHrs[0]} - ${budgetGoal?.perDayHrs[1]}`;
  const budgetPerWeekSummary =
    budgetGoal?.perWeekHrs[0] === budgetGoal?.perWeekHrs[1]
      ? `${budgetGoal?.perWeekHrs[0]} hrs / week`
      : `${budgetGoal?.perWeekHrs[0]} - ${budgetGoal?.perWeekHrs[1]} hrs / week`;

  const minWeekValue = budgetGoal?.perDayHrs[0] * (numberOfDays ?? 0);
  const maxWeekValue = budgetGoal?.perDayHrs[1] * (numberOfDays ?? 0);

  const handleWeekSliderChange = (value: number[]) => {
    let adjustedValue: number[] = value.slice();

    adjustedValue[0] = Math.max(adjustedValue[0], minWeekValue);
    adjustedValue[1] = Math.min(adjustedValue[1], maxWeekValue);

    if (adjustedValue[0] > adjustedValue[1]) {
      [adjustedValue[0], adjustedValue[1]] = [adjustedValue[1], adjustedValue[0]];
    }

    if (budgetGoal?.perDayHrs[0] === budgetGoal?.perDayHrs[1]) {
      adjustedValue = [minWeekValue, maxWeekValue];
    }

    adjustedValue = adjustedValue.map((val) => Math.max(minWeekValue, Math.min(val, maxWeekValue)));
    setFormState((prev) => ({
      ...prev,
      perWeekHrs: adjustedValue,
    }));
  };

  useEffect(() => {
    handleWeekSliderChange(budgetGoal?.perWeekHrs ?? []);
  }, [budgetGoal?.perDayHrs, budgetGoal?.on]);

  const { openEditMode } = useGoalStore();

  const onSuggestionClick = async (selectedGoal: GoalItem) => {
    const updatedGoalsHistory = await getHistoryUptoGoal(selectedGoal.parentGoalId);

    const newState: ILocationState = {
      ...location.state,
      goalsHistory: updatedGoalsHistory,
    };

    openEditMode(selectedGoal, newState);
    setSuggestedGoal(selectedGoal);

    // const selectedPerDayBudget =
    //   selectedGoal.beforeTime && selectedGoal.afterTime
    //     ? (selectedGoal.timeBudget?.perDay?.includes("-")
    //         ? selectedGoal.timeBudget.perDay
    //         : `${selectedGoal.beforeTime - selectedGoal.afterTime}-${selectedGoal.beforeTime - selectedGoal.afterTime}`
    //       )
    //         .split("-")
    //         .map((ele) => Number(ele))
    //     : [0, 0];

    // const selectedNumberOfDays = selectedGoal.on?.length ?? 7;
    // const selectedPerWeekBudget =
    //   selectedGoal.beforeTime && selectedGoal.afterTime
    //     ? (selectedGoal.timeBudget?.perWeek?.includes("-")
    //         ? selectedGoal.timeBudget.perWeek
    //         : `${selectedPerDayBudget[0] * selectedNumberOfDays}-${selectedPerDayBudget[1] * selectedNumberOfDays}`
    //       )
    //         .split("-")
    //         .map((ele) => Number(ele))
    //     : [0, 0];

    // setFormState({
    //   goalColor: selectedGoal.goalColor,
    //   hintOption: false,
    //   title: selectedGoal.title,
    //   simpleGoal: {
    //     duration: selectedGoal.duration ?? null,
    //     due: selectedGoal.due ? new Date(selectedGoal.due).toISOString().slice(0, 10) : "",
    //   },
    //   // budgetGoal: {
    //   //   on: selectedGoal.on || convertOnFilterToArray("weekdays"),
    //   //   afterTime: selectedGoal.afterTime ?? 9,
    //   //   beforeTime: selectedGoal.beforeTime ?? 18,
    //   // //on: selectedGoal.on || convertOnFilterToArray("weekdays"),
    //   // //afterTime: selectedGoal.afterTime ?? 9,
    //   //beforeTime: selectedGoal.beforeTime ?? 18,
    //   //perDayHrs: selectedPerDayBudget,
    //   //perWeekHrs: selectedPerWeekBudget,
    // });

    const hint = await getGoalHintItem(selectedGoal.id);
    setFormState((prev) => ({
      ...prev,
      hintOption: hint?.hintOptionEnabled || false,
    }));
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
      const result = await checkGoalSchedule(getFinalTags({ goal, formState, parentGoal }));
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
  }, [
    formState.simpleGoal?.duration,
    formState.budgetGoal?.afterTime,
    formState.budgetGoal?.beforeTime,
    formState.budgetGoal?.perDayHrs,
    formState.budgetGoal?.perWeekHrs,
  ]);

  return (
    <form
      className="configGoal"
      onSubmit={async (e) => {
        e.preventDefault();
        await handleSave();
      }}
    >
      <ConfigGoalHeader formState={formState} setFormState={setFormState} onSuggestionClick={onSuggestionClick} />
      <div
        className="d-flex f-col gap-20"
        style={{
          marginTop: 24,
          padding: "0 18px",
        }}
      >
        {type === "Standard" || type === "Cluster" ? (
          <SimpleGoal
            formState={formState}
            setFormState={setFormState}
            scheduleStatus={scheduleStatus}
            getScheduleStatusText={getScheduleStatusText}
          />
        ) : (
          <>
            <div>
              <BetweenSlider
                value={[budgetGoal?.afterTime ?? 9, budgetGoal?.beforeTime ?? 18]}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    budgetGoal: { ...prev.budgetGoal!, afterTime: val[0], beforeTime: val[1] },
                  }))
                }
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
                      {/* <div>
                        <span>{budgetPerWeekSummary}</span>
                        <Slider
                          tooltip={{
                            align: sliderTooltipAlignConfig,
                          }}
                          min={minWeekValue}
                          max={maxWeekValue}
                          marks={{
                            [minWeekValue]: `${minWeekValue}`,
                            [budgetGoal?.perWeekHrs[0]]: `${budgetGoal?.perWeekHrs[0]}`,
                            [budgetGoal?.perWeekHrs[1]]: `${budgetGoal?.perWeekHrs[1]}`,
                            [maxWeekValue]: `${maxWeekValue}`,
                          }}
                          range
                          value={[budgetGoal?.perWeekHrs[0], budgetGoal?.perWeekHrs[1]]}
                          onChange={(val) => handleWeekSliderChange(val)}
                        />
                      </div> */}
                    </div>
                  ),
                },
              ]}
            />
            {/* <div className="place-middle gap-8 h-100">
              {onDays.map((d) => (
                <span
                  onClickCapture={() => {
                    setFormState((prev) => ({
                      ...prev,
                      budgetGoal: {
                        ...prev.budgetGoal!,
                        on: prev.budgetGoal?.on.includes(d)
                          ? [...prev.budgetGoal?.on.filter((ele) => ele !== d)]
                          : [...prev.budgetGoal?.on, d],
                      },
                    }));
                  }}
                  className={`on_day ${budgetGoal?.on.includes(d) ? "selected" : ""}`}
                  key={d}
                >
                  {t(d)[0]}
                </span>
              ))}
            </div> */}
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
