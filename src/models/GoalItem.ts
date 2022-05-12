enum Repeat{
    'Once',
    'Daily'
}

export interface GoalItem{
    id?: number;
    title: string;
    duration: Number;
    repeat: Repeat | string;
    start: Date;
    finish: Date;
    at: Date;
    createdAt: Date;
}
