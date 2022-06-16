"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.FeelingsDB = void 0;
const dexie_1 = __importDefault(require("dexie"));
class FeelingsDB extends dexie_1.default {
    feelingsCollection;
    goalsCollection;
    constructor() {
        super("FeelingsDB");
        this.version(1).stores({
            feelingsCollection: "++id, content, category, date, note",
            goalsCollection: "++id, title, duration, sublist, repeat, start, finish, createdAt",
        });
    }
}
exports.FeelingsDB = FeelingsDB;
exports.db = new FeelingsDB();
