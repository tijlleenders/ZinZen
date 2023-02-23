import { GoalItem } from "@src/models/GoalItem";

export interface confirmActionState {
    open: boolean,
    goal: {
      archive: boolean,
      delete: boolean,
      shareAnonymously: boolean,
      shareWithOne: boolean
    },
    collaboration: {
      colabRequest: boolean,
      delete: boolean,
      archive: boolean
    }
}

export interface confirmGoalAction {
    actionCategory: "goal"
    actionName: "archive" | "delete" | "shareAnonymously" | "shareWithOne";
}

export interface confirmColabGoalAction {
    actionCategory: "collaboration"
    actionName: "colabRequest" | "delete" | "archive"
}

export interface ConfirmationModalProps {
    action: confirmGoalAction | confirmColabGoalAction
    handleClick: (action: string) => Promise<void>
}

export type confirmCategory = "goal" | "collaboration";
export type confirmAction = confirmGoalAction | confirmColabGoalAction;

export interface IShareGoalModalProps {
    goal: GoalItem
    showShareModal: string,
    setShowShareModal: React.Dispatch<React.SetStateAction<string>>
}
