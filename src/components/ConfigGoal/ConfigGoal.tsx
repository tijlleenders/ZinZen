/* eslint-disable complexity */
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import { GoalItem, TGoalCategory } from "@src/models/GoalItem";
import ZModal from "@src/common/ZModal";
import { getGoalHintItem } from "@src/api/HintsAPI";
import { TGoalConfigMode } from "@src/types";
import useGoalStore from "@src/hooks/useGoalStore";
import { ILocationState, ScheduleStatus } from "@src/Interfaces";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { suggestedGoalState } from "@src/store/SuggestedGoalState";
import { useGoalSave } from "@src/hooks/useGoalSave";
import { getHistoryUptoGoal } from "@src/helpers/GoalProcessor";
import useScheduler from "@src/hooks/useScheduler";
import ZAccordion from "@src/common/Accordion";
import { useGetGoalById } from "@src/hooks/api/Goals/queries/useGetGoalById";
import { useKeyPress } from "@src/hooks/useKeyPress";
import { useDebounce } from "@src/hooks/useDebounce";
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
import BetweenSlider from "./BetweenSlider";
import BudgetPerHr from "./BudgetPerHr";
import BudgetPerWeek from "./BudgetPerWeek";
import OnDays from "./OnDays";
import ColorPicker from "./components/ColorPicker";

const onDays = [...calDays.slice(1), "Sun"];

interface ConfigGoalContentProps {
  type: TGoalCategory;
  mode: TGoalConfigMode;
  goal: GoalItem;
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  onSave?: (editMode: boolean, formState: FormState) => Promise<void>;
  isModal?: boolean;
  onToggleConfig?: () => void;
}

const ConfigGoalContent = ({
  type,
  goal,
  mode,
  onSave,
  formState,
  setFormState,
  isModal,
  onToggleConfig,
}: ConfigGoalContentProps) => {
  const navigate = useNavigate();
  const setSuggestedGoal = useSetRecoilState(suggestedGoalState);
  const isEditMode = mode === "edit";

  const { parentId } = useParams();
  const { data: parentGoal } = useGetGoalById(parentId ?? "");

  const location = useLocation();

  const { checkGoalSchedule } = useScheduler();
  const [scheduleStatus, setScheduleStatus] = useState<ScheduleStatus>(null);
  const [isBudgetAccordianOpen, setIsBudgetAccordianOpen] = useState(false);

  useOnScreenKeyboardScrollFix();

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

  useEffect(() => {
    if (isModal) {
      document.getElementById("title-field-modal")?.focus();
    }
  }, []);

  const defaultAfterTime = isEditMode ? (goal.afterTime ?? 9) : 9;
  const defaultBeforeTime = isEditMode ? (goal.beforeTime ?? 18) : 18;

  const timeDiff = Math.abs(budgetGoal?.beforeTime ?? defaultBeforeTime) - (budgetGoal?.afterTime ?? defaultAfterTime);
  const weeklyRange = timeDiff * (numberOfDays ?? 5);
  const updatedPerDayHrs = {
    min: Math.min(budgetGoal?.perDayHrs.min ?? timeDiff, timeDiff),
    max: Math.min(budgetGoal?.perDayHrs.max ?? timeDiff, timeDiff),
  };
  const updatedPerWeekHrs = {
    min: Math.min(budgetGoal?.perWeekHrs.min ?? timeDiff, weeklyRange),
    max: Math.min(budgetGoal?.perWeekHrs.max ?? timeDiff, weeklyRange),
  };

  const budgetPerHrSummary =
    updatedPerDayHrs.min === updatedPerDayHrs.max
      ? `${updatedPerDayHrs.min} hrs / day`
      : `${updatedPerDayHrs.min} - ${updatedPerDayHrs.max} hrs / day`;

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
      const result = await checkGoalSchedule(getFinalTags({ goal, formState, type, parentGoal }));
      const status = await checkSchedulingStatus(result || undefined, goal.id);
      setScheduleStatus(status);
    } catch (error) {
      console.error("Failed to check schedule:", error);
      setScheduleStatus(null);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
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

  const debouncedSave = useDebounce(async (editMode: boolean, newFormState: FormState) => {
    if (isModal) return;
    if (onSave) {
      await onSave(editMode, newFormState);
    }
  }, 1000);

  const handleColorPickerAreaClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".goal-color") || (e.target as HTMLElement).closest(".color-palette-popup")) {
      return;
    }

    if (onToggleConfig) {
      onToggleConfig();
    }
  };

  const handleColorChange = (color: string) => {
    const newState = { ...formState, goalColor: color };
    setFormState(newState);
    if (!isModal) {
      const currentGoalsHistory = location.state?.goalsHistory || [];
      const updatedGoalsHistory =
        currentGoalsHistory.length > 0
          ? [
              ...currentGoalsHistory.slice(0, -1),
              {
                ...currentGoalsHistory[currentGoalsHistory.length - 1],
                goalColor: color,
              },
            ]
          : [
              {
                goalID: goal.id,
                goalTitle: goal.title,
                goalColor: color,
              },
            ];

      navigate(".", {
        replace: true,
        state: {
          goalsHistory: updatedGoalsHistory,
        },
      });
      debouncedSave(isEditMode, newState);
    }
  };

  return (
    <div className="configGoal">
      {!isModal && (
        <div className="color-picker-wrapper" onClickCapture={handleColorPickerAreaClick}>
          <ColorPicker
            color={formState.goalColor}
            setColor={(color: string) => handleColorChange(color)}
            className="inline-position"
          />
        </div>
      )}

      <ConfigGoalHeader
        formState={formState}
        setFormState={setFormState}
        onSuggestionClick={onSuggestionClick}
        isModal={isModal}
        debouncedSave={debouncedSave}
        isEditMode={isEditMode}
      />
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
            debouncedSave={debouncedSave}
            isEditMode={isEditMode}
          />
        ) : (
          <>
            <div>
              <BetweenSlider
                value={[budgetGoal?.afterTime ?? 9, budgetGoal?.beforeTime ?? 18]}
                onChange={(val) => {
                  const newState = {
                    ...formState,
                    budgetGoal: { ...budgetGoal!, afterTime: val[0], beforeTime: val[1] },
                  };
                  setFormState(newState);
                  debouncedSave(isEditMode, newState);
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
                  header: isBudgetAccordianOpen ? "Budget" : `${budgetPerHrSummary}, ${budgetPerWeekSummary}`,
                  body: (
                    <div>
                      <div>
                        <BudgetPerHr
                          budgetPerHrSummary={budgetPerHrSummary}
                          first={updatedPerDayHrs.min}
                          second={updatedPerDayHrs.max}
                          max={timeDiff}
                          onChange={(val) => {
                            const newState = { ...formState };
                            if (val[0] === 0 && val[1] < 1) {
                              newState.budgetGoal!.perDayHrs = { min: 0, max: 1 };
                              newState.budgetGoal!.perWeekHrs = { min: 0, max: 1 };
                              setFormState(newState);
                              debouncedSave(isEditMode, newState);
                            } else {
                              newState.budgetGoal!.perDayHrs = { min: val[0], max: val[1] };
                              newState.budgetGoal!.perWeekHrs = {
                                min: val[0] * (numberOfDays ?? 0),
                                max: val[1] * (numberOfDays ?? 0),
                              };
                              setFormState(newState);
                              debouncedSave(isEditMode, newState);
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
                        onChange={(val) => {
                          const newState = {
                            ...formState,
                            budgetGoal: { ...budgetGoal!, perWeekHrs: { min: val[0], max: val[1] } },
                          };
                          setFormState(newState);
                          debouncedSave(isEditMode, newState);
                        }}
                      />
                    </div>
                  ),
                },
              ]}
            />
            <div className="place-middle gap-8 h-100">
              <OnDays
                onDays={onDays}
                setFormState={setFormState}
                budgetGoal={budgetGoal}
                debouncedSave={debouncedSave}
                isEditMode={isEditMode}
                formState={formState}
              />
            </div>
            <div className="action-btn-container">
              <HintToggle
                setHints={(value: boolean) => setFormState((prev) => ({ ...prev, hintOption: value }))}
                defaultValue={formState.hintOption}
              />
            </div>
            {scheduleStatus && (
              <div className={`schedule-status ${scheduleStatus}`}>{getScheduleStatusText(scheduleStatus)}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface ConfigGoalProps {
  type: TGoalCategory;
  mode: TGoalConfigMode;
  goal: GoalItem;
  useModal?: boolean;
  onToggleConfig?: () => void;
}

const ConfigGoal = ({ type, goal, mode, useModal = true, onToggleConfig }: ConfigGoalProps) => {
  const { t } = useTranslation();
  const isKeyboardOpen = useVirtualKeyboardOpen();
  const setSuggestedGoal = useSetRecoilState(suggestedGoalState);
  const isEditMode = mode === "edit";
  const enterPress = useKeyPress("Enter");

  const { parentId = "", activeGoalId = "" } = useParams();
  const { data: parentGoal } = useGetGoalById(parentId ?? "");

  const [formState, setFormState] = useState<FormState>({
    goalColor: getDefaultColor(isEditMode, goal, parentGoal, colorPalleteList),
    hintOption: false,
    title: t(goal.title),
    ...(type === "Standard" || type === "Cluster"
      ? {
          simpleGoal: getDefaultFormStateForSimpleGoal(goal),
          budgetGoal: undefined,
        }
      : {
          simpleGoal: undefined,
          budgetGoal: getDefaultFormStateForBudgetGoal(goal, isEditMode),
        }),
  });

  const { handleSave } = useGoalSave({
    goal,
    parentGoal,
    type,
    activeGoalId: useModal ? activeGoalId : parentId,
    isModal: useModal,
  });

  const handleCancel = async () => {
    if (!formState.title.trim().length) {
      window.history.back();
      setSuggestedGoal(null);
    } else {
      await handleSave(isEditMode, formState);
      window.history.back();
    }
  };

  const handleInlineSave = async (editMode: boolean, form: FormState) => {
    await handleSave(editMode, form);
  };

  useEffect(() => {
    if (enterPress && useModal) {
      handleCancel();
    }
  }, [enterPress]);

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
        <ConfigGoalContent
          type={type}
          mode={mode}
          goal={goal}
          formState={formState}
          setFormState={setFormState}
          isModal
          onToggleConfig={onToggleConfig}
        />
      </ZModal>
    );
  }

  return (
    <ConfigGoalContent
      type={type}
      mode={mode}
      goal={goal}
      onSave={handleInlineSave}
      formState={formState}
      setFormState={setFormState}
      onToggleConfig={onToggleConfig}
    />
  );
};

export default ConfigGoal;
