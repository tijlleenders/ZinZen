export interface IGoalHint {
  id?: string;
  parentTitle: string;
  title: string;
  duration?: string | null;
}

export interface HintItem {
  id: string;
  hintOptionEnabled: boolean;
  availableGoalHints: IGoalHint[];
  lastCheckedDate: string;
  nextCheckDate: string;
  deletedGoalHints?: Omit<IGoalHint, "id">[];
}

export interface IHintRequestBody {
  method: string;
  installId: string | null;
  goal: {
    title: string;
    duration?: string | null;
  };
  parentTitle?: string;
}
