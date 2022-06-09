import Dexie, { Table } from 'dexie';
import { FeelingItem } from './FeelingItem';
import { GoalItem } from './GoalItem';

export class FeelingsDB extends Dexie {
  feelingsCollection!: Table<FeelingItem, number>;

  goalsCollection!: Table<GoalItem, number>;

  constructor() {
    super('FeelingsDB');
    this.version(1).stores({
      feelingsCollection: '++id, content, category, date, note',
      goalsCollection: '++id, title, duration, sublist, repeat, start, finish, createdAt',
    });
  }
}

export const db = new FeelingsDB();
