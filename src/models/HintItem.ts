export interface HintItem {
  id: string;
  hint: boolean;
}

export interface HintRequestBody {
  method: string;
  installId: string | null;
  goal: {
    title: string;
    duration?: string | null;
  };
  parentTitle?: string;
}
