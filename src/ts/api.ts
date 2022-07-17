/**
 * A span of time with nanosecond precision. Each Duration is composed of a whole number of seconds and a fractional part represented in nanoseconds.
 */
export type Duration = [number, number];

/**
 * Converts time in hours to a Duration
 * @param timeInHours Time in hours
 * @returns A `Duration`, which is a type compatible with the wasm API
 */
export function durationFromHours(timeInHours: number): Duration {
  return [timeInHours * 3600, 0];
}

/**
 * Combined date and time
 * Contains Year, Ordinal Day (1-365), Hour, Minute, Second, Nanosecond
 */
export type DateTime = [number, number, number, number, number, number];

/**
 * Checks is a year is a leap year
 * @param year The year as a number, ie 2012, 1996, 2022
 * @returns true is the year is a leap year, false otherwise
 */
function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 25 !== 0 || year % 16 === 0);
}

/**
 * Converts a [Date] to a internal DateTime struct compatible with webassembly
 * @param date The JS `Date` value
 * @returns An internal type, `DateTime`
 */
export function jsDateToDateTime(date: Date): DateTime {
  // Simple substitutes
  const year = date.getFullYear();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Ordinal math is hard
  const DAYS_CUMULATIVE_COMMON_LEAP = [
    [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
    [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335],
  ];

  const day = date.getDate();
  const ordinal = DAYS_CUMULATIVE_COMMON_LEAP[isLeapYear(year) ? 1 : 0][date.getMonth()] + day;

  return [year, ordinal, hour, minutes, seconds, 0];
}

/**
 * The Goal interface
 */
export interface Goal {
    id: number,
    description: string,
    task_duration: Duration,

    start: null | DateTime,
    deadline: null | DateTime,

    interval: null | Duration,
    location_constraint: null | number
}

/**
 * An interface that describes a Task
 */
export interface Task {
    goal_id: number,
    start: DateTime,
    finish: DateTime,
    flexibility: number,
}

/**
 *  A schedule is just an array of tasks
 */
type Schedule = [Task];

/**
 * A goal id is just a number
 */
export type GoalID = number;

/**
 * Contains data required to generate a schedule
 */
export interface Plan {
    goals: Goal[],
    start: DateTime,
    finish: DateTime
}

/**
 * The wrapper API class
 */
export class API {
  private instance: WebAssembly.Instance;

  private textDecoder: TextDecoder;

  private textEncoder: TextEncoder;

  private ipcStart: number;

  private wasmMemory: WebAssembly.Memory;

  // Internal constructor for API class
  constructor(instance: WebAssembly.Instance, ipcStart: number, wasmMemory: WebAssembly.Memory) {
    this.instance = instance;
    this.textDecoder = new TextDecoder();
    this.textEncoder = new TextEncoder();
    this.ipcStart = ipcStart;
    this.wasmMemory = wasmMemory;
  }

  /**
    * Given an array of Goals, it will process the total number of tasks per Goal that can fit within the timeline
    * @param goals An array of Goals to be fitted into a timeline
    * @param start The start of the timeline
    * @param finish The end of the timeline
    * @returns A Map from a Goal's ID to how many tasks can fit within the timeline
    */
  public processTaskCount(goals: Goal[], start: Date, finish: Date): Map<GoalID, number> {
    // Encode data
    const string = JSON.stringify([goals, [jsDateToDateTime(start), jsDateToDateTime(finish)]]);
    const data = this.textEncoder.encode(string);

    // Send data
    const target = this.getIPCView(data.length);
    target.set(data);

    // Process
    const offset = (this.instance.exports.processTaskCount as CallableFunction)(data.length) as number;
    const buffer = this.getIPCView(offset);
    const readString = this.textDecoder.decode(buffer);
    const iterator = (JSON.parse(readString) as [[number, GoalID]]).map((a) => ([a[1], a[0]] as [number, number]));

    return new Map(iterator);
  }

  /**
    * A fundamental function, that parses Goals and produces a Schedule, which is just an array of tasks
    * @param goals The array of Goals to be processed
    * @param start The start of the timeline
    * @param finish The end of the timeline
    * @returns A schedule
    */
  public generateSchedule(goals: Goal[], start: Date, finish: Date): Schedule {
    // Serialize data
    const plan = { goals, start: jsDateToDateTime(start), finish: jsDateToDateTime(finish) };
    const string = JSON.stringify(plan);
    const bytes = this.textEncoder.encode(string);

    // Send data
    let view = this.getIPCView(bytes.length);
    view.set(bytes);

    // Call wasm function
    const result = (this.instance.exports.generateSchedule as CallableFunction)(view.length) as number;

    // Read result
    view = this.getIPCView(result);
    const resultString = this.textDecoder.decode(view);

    return JSON.parse(resultString);
  }

  /**
    * @returns A reference to the IPC buffer used for communication with WebAssembly
    */
  public getIPCView(offset: number): Uint8Array {
    return new Uint8Array(this.wasmMemory.buffer, this.ipcStart, offset);
  }
}

/**
 * Loads the WebAssembly api
 * @param path A valid path that is passed to `fetch` and is used to fetch the webassembly data
 * @returns A Promise that yields an API to the underlying wasm
 */
export async function loadAPI(path: string): Promise<API> {
  // Build instance
  let _wasmMemory: WebAssembly.Memory;
  let _ipcStart: number;
  const data = await fetch(path).then((dt) => dt.arrayBuffer());

  const { instance } = await WebAssembly.instantiate(
    data,
    {
      env: {
        console_log(isString: boolean, ipcOffset: number) {
          if (isString) {
            const readResult = new Uint8Array(_wasmMemory.buffer, _ipcStart, ipcOffset);
            const decoder = new TextDecoder();
            const string = decoder.decode(readResult);

            console.log(string);
          } else {
            const readResult = new Uint8Array(_wasmMemory.buffer, _ipcStart, ipcOffset);
            console.log(readResult);
          }
        },
        exit(errorCode: number, ipcOffset: number) {
          if (errorCode !== 0) {
            const readResult = new Uint8Array(_wasmMemory.buffer, _ipcStart, ipcOffset);
            const decoder = new TextDecoder();

            console.error(`[WASM_ERROR; ErrorCode:${errorCode}] ${decoder.decode(readResult)}`);
          } else {
            console.info("Webassembly has prematurely finished execution, without errors");
          }
        }
      },
    });

  // Build API
  _wasmMemory = instance.exports.memory as WebAssembly.Memory;
  _ipcStart = (instance.exports.IPC_BUFFER as WebAssembly.Global).value as number;

  return new API(instance, _ipcStart, _wasmMemory);
}
