export interface TConfirmActionState {
  open: boolean;
  goal: {
    archive: boolean;
    delete: boolean;
    shareAnonymously: boolean;
    shareWithOne: boolean;
    restore: boolean;
    addHint: boolean;
    deleteHint: boolean;
    reportHint: boolean;
  };
  collaboration: {
    colabRequest: boolean;
    delete: boolean;
    archive: boolean;
    restore: boolean;
  };
}

export interface TConfirmGoalAction {
  actionCategory: "goal";
  actionName: "archive" | "delete" | "shareAnonymously" | "shareWithOne" | "restore";
}

export interface TConfirmColabGoalAction {
  actionCategory: "collaboration";
  actionName: "colabRequest" | "delete" | "archive" | "restore";
}

export interface TConfirmHintAction {
  actionCategory: "goal";
  actionName: "addHint" | "deleteHint" | "reportHint";
}

export interface ConfirmationModalProps {
  action: TConfirmGoalAction | TConfirmColabGoalAction | TConfirmHintAction;
  handleClick: (action: string) => Promise<void>;
  handleClose: () => void;
}

export interface ICustomInputProps {
  placeholder?: string;
  value: string;
  handleChange: (value: string) => void;
  style?: React.CSSProperties;
}

export type confirmCategory = "goal" | "collaboration";
export type TConfirmAction = TConfirmGoalAction | TConfirmColabGoalAction | TConfirmHintAction;
