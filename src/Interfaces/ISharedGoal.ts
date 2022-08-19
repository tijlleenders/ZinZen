export interface ISharedGoal {
    title: string,
    duration?: number | null,
    repeat?: "Once" | "Daily" | "Weekly" | null,
    start: string | null,
    finish: string | null,
    createdAt?: string,
    goalColor?: string,
    language: string,
    link: string | null,
    parentTitle: string
  }
