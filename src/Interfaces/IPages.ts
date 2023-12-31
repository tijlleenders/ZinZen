import { feelingListType } from "@src/global";
import { IFeelingItem } from "@src/models";

/* Show Feelings Page */

export interface ISetFeelingsListObject {
  feelingsList: feelingListType;
  setFeelingsList: React.Dispatch<React.SetStateAction<feelingListType>>;
}
export interface ISetSelectedFeeling {
  selectedFeeling: number;
  setSelectedFeeling: React.Dispatch<React.SetStateAction<number>>;
}
export interface ShowFeelingTemplateProps {
  feelingsListObject: IFeelingItem[];
  setFeelingsListObject: ISetFeelingsListObject;
  currentFeelingsList: feelingListType;
  handleFocus?: ISetSelectedFeeling;
}

/* MyGoals Page */
export interface ILocationProps {
  openGoalOfId: string;
  isRootGoal: boolean;
}

/* MyTime Page */
export interface ITaskProgress {
  [goalId: string]: {
    total: number;
    completed: number;
    goalColor: string;
  };
}
