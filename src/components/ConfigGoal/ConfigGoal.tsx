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
import BudgetPerHr from "./BudgetPerHr";
import BudgetPerWeek from "./BudgetPerWeek";
import OnDays from "./OnDays";

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

  useEffect(() => {
    document.getElementById("title-field")?.focus();
  }, []);

  const defaultAfterTime = isEditMode ? (goal.afterTime ?? 9) : 9;
  const defaultBeforeTime = isEditMode ? (goal.beforeTime ?? 18) : 18;

  const timeDiff = (budgetGoal?.beforeTime ?? defaultBeforeTime) - (budgetGoal?.afterTime ?? defaultAfterTime);
  const weeklyRange = timeDiff * (numberOfDays ?? 5);
  const updatedPerDayHrs = {
    min: Math.min(budgetGoal?.perDayHrs.min ?? timeDiff, timeDiff),
    max: Math.min(budgetGoal?.perDayHrs.max ?? timeDiff, timeDiff),
  };
  const updatedPerWeekHrs = {
    min: Math.min(budgetGoal?.perWeekHrs.min ?? timeDiff, weeklyRange),
    max: Math.min(budgetGoal?.perWeekHrs.max ?? timeDiff, weeklyRange),
  };

  const budgetPerHrSummary = `${updatedPerDayHrs.min} - ${updatedPerDayHrs.max}`;

  const budgetPerWeekSummary =
    updatedPerWeekHrs.min === updatedPerWeekHrs.max
      ? `${updatedPerWeekHrs.min} hrs / week`
      : `${updatedPerWeekHrs.min} - ${updatedPerWeekHrs.max} hrs / week`;

  const minWeekValue = (budgetGoal?.perDayHrs.min ?? 0) * (numberOfDays ?? 0);
  const maxWeekValue = (budgetGoal?.perDayHrs.max ?? 0) * (numberOfDays ?? 0);

  const { openEditMode } = useGoalStore();

  const onSuggestionClick = async (selectedGoal: GoalItem) => {
    const updatedGoalsHistory = await getHistoryUptoGoal(selectedGoal.parentGoalId);

    const newState: ILocationState = {
      ...location.state,
      goalsHistory: updatedGoalsHistory,
    };

    openEditMode(selectedGoal, newState);
    setSuggestedGoal(selectedGoal);

    setFormState({
      goalColor: selectedGoal.goalColor,
      hintOption: false,
      title: selectedGoal.title,
      simpleGoal: {
        duration: selectedGoal.duration ?? undefined,
        due: selectedGoal.due ? new Date(selectedGoal.due).toISOString().slice(0, 10) : "",
      },
      budgetGoal: {
        on: selectedGoal.on || convertOnFilterToArray("weekdays"),
        afterTime: selectedGoal.afterTime ?? 9,
        beforeTime: selectedGoal.beforeTime ?? 18,
        perDayHrs: {
          min: selectedGoal.timeBudget?.perDay?.min ?? 0,
          max: selectedGoal.timeBudget?.perDay?.max ?? 0,
        },
        perWeekHrs: {
          min: selectedGoal.timeBudget?.perWeek?.min ?? 0,
          max: selectedGoal.timeBudget?.perWeek?.max ?? 0,
        },
      },
    });

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
    simpleGoal?.duration,
    budgetGoal?.afterTime,
    budgetGoal?.beforeTime,
    budgetGoal?.perDayHrs,
    budgetGoal?.perWeekHrs,
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
                        <BudgetPerHr
                          budgetPerHrSummary={budgetPerHrSummary}
                          first={updatedPerDayHrs.min}
                          second={updatedPerDayHrs.max}
                          max={timeDiff}
                          onChange={(val) => {
                            if (val[0] === 0 && val[1] < 1) {
                              setFormState((prev) => ({
                                ...prev,
                                budgetGoal: { ...prev.budgetGoal!, perDayHrs: { min: 0, max: 1 } },
                              }));
                            } else {
                              setFormState((prev) => ({
                                ...prev,
                                budgetGoal: { ...prev.budgetGoal!, perDayHrs: { min: val[0], max: val[1] } },
                              }));
                            }
                          }}
                        />
                      </div>
                      <BudgetPerWeek
                        budgetPerWeekSummary={budgetPerWeekSummary}
                        minWeekValue={minWeekValue}
                        maxWeekValue={maxWeekValue}
                        first={updatedPerWeekHrs.min}
                        second={updatedPerWeekHrs.max}
                        onChange={(val) =>
                          setFormState((prev) => ({
                            ...prev,
                            budgetGoal: { ...prev.budgetGoal!, perWeekHrs: { min: val[0], max: val[1] } },
                          }))
                        }
                      />
                    </div>
                  ),
                },
              ]}
            />
            <div className="place-middle gap-8 h-100">
              <OnDays onDays={onDays} setFormState={setFormState} budgetGoal={budgetGoal} />
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
