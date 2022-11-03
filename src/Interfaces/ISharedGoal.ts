export interface ISharedGoal {
    id: any;
    title: string,
    duration?: number | null,
    repeat?: string | null;
    start: Date | null;
    due: Date | null;
    afterTime: number | null;
    beforeTime: number | null;
    createdAt?: string,
    goalColor?: string,
    language: string,
    link: string | null,
    parentTitle: string
  }
