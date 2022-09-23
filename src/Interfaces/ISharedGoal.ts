export interface ISharedGoal {
    id: any;
    title: string,
    duration?: number | null,
    repeat?: "Once" | "Daily" | "Weekly" | "Mondays" | "Tuesdays"| "Wednesdays"| "Thursdays" | "Fridays" | "Saturdays" | "Sundays" | null;
    start: Date | null;
    due: Date | null;
    startTime: number | null;
    endTime: number | null;
    createdAt?: string,
    goalColor?: string,
    language: string,
    link: string | null,
    parentTitle: string
  }
