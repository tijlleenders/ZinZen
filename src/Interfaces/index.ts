import { ISubGoalHistory } from "@src/store/GoalsState";
import { GoalItem } from "@src/models/GoalItem";
import { ILanguage, ILanguageListProps } from "./ILanguage";
import { confirmActionState } from "./IPopupModals";

export { ILanguage, ILanguageListProps };

export interface ILocationState {
  goalsHistory?: ISubGoalHistory[]; // heirarchy history of a goal
  displayUpdateGoal?: string; // id of goal to be updated
  activeGoalId?: string; // selected goal id
  displayAddGoal?: string; // parent id of the goal to be added
  displayShareModal?: GoalItem; // show share modal
  displayConfirmation?: confirmActionState; // show confirmation modal
  displayBackResModal?: boolean; // show backup restore modal
  displayLangChangeModal?: boolean; // show language change modal
  displayAddFeeling?: boolean; // show add feeling modal
  displayNoteModal?: number; // show saved note of feeling id
  displayInputNoteModal?: number; // show input modal for adding note for id
  changeTheme?: boolean; // theme changer mode
  expandedGoalId?: string; // id of goal to be expanded
  displayGoalActions?: GoalItem; // id of goal whose actions have to be opened
  displayPartner?: boolean; // whether or not to display the partner goals
}
