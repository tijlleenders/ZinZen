export interface ISharedGoal {
    id: string;
    title: string,
    duration: number | null,
    repeat: string | null;
    start: Date | null;
    due: Date | null;
    afterTime: number | null;
    beforeTime: number | null;
    goalColor: string,
    language: string,
    link: string | null,
    parentTitle: string
  }
