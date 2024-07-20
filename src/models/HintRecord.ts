export interface HintRecord {
  id: string;
  goalItemId: string;
  hintEnabled: boolean;
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
