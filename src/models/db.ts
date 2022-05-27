import Dexie, { Table } from 'dexie';
import { IFeelingItem } from './FeelingItem';
import { GoalItem } from './GoalItem';

export class FeelingsDB extends Dexie {
  feelingsCollection!: Table<IFeelingItem, number>;

  goalsCollection!: Table<GoalItem, number>;

  constructor() {
    super('FeelingsDB');
    this.version(1).stores({
      feelingsCollection: '++id, content, category, date',
      goalsCollection: '++id, title, duration, repeat, start, finish, createdAt',
    });
  }
}

export const db = new FeelingsDB();
