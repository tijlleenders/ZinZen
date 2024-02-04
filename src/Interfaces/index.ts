import { ISubGoalHistory, TDisplayGoalActions } from "@src/store/GoalsState";
import { GoalItem, IParticipant } from "@src/models/GoalItem";
import ContactItem from "@src/models/ContactItem";
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
  displayGoalActions?: TDisplayGoalActions; // id of goal whose actions have to be opened
  displayPartnerMode?: boolean; // whether or not to display the partner goals
  displayAddContact?: boolean; // whether or not to display the add contact form
  displayParticipants?: string; // id of goal whose participants have to be displayed
  displayPartner?: ContactItem; // to show this partner
  displayChanges?: GoalItem; // to show the changes under goal
  goalType?: "Budget" | "Goal"; // characteristic of the goal
  displayAddGoalOptions: boolean; // whether to show the add goal options
  displayFocus: boolean; // whether to show the focus component
}
