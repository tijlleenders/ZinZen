import { feelingListType } from "@src/global";
import { IFeelingItem } from "@src/models";

/* Add Feelings Page */
export interface AddFeelingsPageProps {
  feelingDate: Date | null;
}

export interface AddFeelingTemplate {
    feelingCategory: string;
    feelingsList: string[];
    feelingDate: Date;
  }

/* Show Feelings Page */

export interface ISetFeelingsListObject {
    feelingsList: feelingListType[];
    setFeelingsList: React.Dispatch<React.SetStateAction<feelingListType[]>>;
  }
export interface ISetSelectedFeeling {
    selectedFeeling: number;
    setSelectedFeeling: React.Dispatch<React.SetStateAction<number>>;
  }
export interface ShowFeelingTemplateProps {
    feelingsListObject: IFeelingItem[];
    setFeelingsListObject: ISetFeelingsListObject;
    currentFeelingsList: feelingListType[];
    handleFocus: ISetSelectedFeeling;
  }

/* MyGoals Page */
export interface ILocationProps {
    openGoalOfId: string,
    isRootGoal: boolean
}
