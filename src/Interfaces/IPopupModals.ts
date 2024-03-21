export interface confirmActionState {
  open: boolean;
  goal: {
    archive: boolean;
    delete: boolean;
    shareAnonymously: boolean;
    shareWithOne: boolean;
    restore: boolean;
  };
  collaboration: {
    colabRequest: boolean;
    delete: boolean;
    archive: boolean;
    restore: boolean;
  };
}

export interface confirmGoalAction {
  actionCategory: "goal";
  actionName: "archive" | "delete" | "shareAnonymously" | "shareWithOne" | "restore";
}

export interface confirmColabGoalAction {
  actionCategory: "collaboration";
  actionName: "colabRequest" | "delete" | "archive" | "restore";
}

export interface ConfirmationModalProps {
  action: confirmGoalAction | confirmColabGoalAction;
  handleClick: (action: string) => Promise<void>;
}

export interface ICustomInputProps {
  placeholder?: string;
  value: string;
  handleChange: (value: string) => void;
  style?: React.CSSProperties;
}

export type confirmCategory = "goal" | "collaboration";
export type confirmAction = confirmGoalAction | confirmColabGoalAction;
