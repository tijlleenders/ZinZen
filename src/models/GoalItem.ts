enum Repeat{
    'Once',
    'Daily'
}

export interface GoalItem{
    id?: number;
    title: string;
    duration: string;
    repeat: Repeat | string;
    start: Date;
    finish: Date;
    at: Date;
    createdAt: Date;
}
