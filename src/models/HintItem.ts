export interface IGoalHint {
  id: string;
  parentTitle: string;
  title: string;
  duration?: string | null;
}

export interface HintItem {
  id: string;
  hint: boolean;
  goalHints: IGoalHint[];
  lastCheckedDate: string;
  nextCheckDate: string;
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
