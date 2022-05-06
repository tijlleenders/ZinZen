import Dexie, { Table } from 'dexie';
// @ts-ignore
import { FeelingItem } from './FeelingItem.ts';

export class FeelingsDB extends Dexie {
  feelingsCollection!: Table<FeelingItem, number>;

  constructor() {
    super('FeelingsDB');
    this.version(1).stores({
      feelingsCollection: '++id, content, category, date',
    });
  }
}

export const db = new FeelingsDB();
