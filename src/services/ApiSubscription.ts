import { HubConnection, ISubscription } from '@microsoft/signalr';
import CustomEventHandler from '../helper/CustomEventHandler';
import NumberHelper from '../helper/NumberHelper';
import ArrayHelper from '../helper/ArrayHelper';
import { invokeLater } from '../helper/EventHelper';

const MAX_INTERVAL_DUMP = 10;

export default class ApiSubscription<T> {
  private readonly listeners = new CustomEventHandler<T>();
  private subs: ISubscription<any> | undefined;
  private connection: HubConnection | undefined;
  private streamArgs: any[] = [];
  private debugger: Debugger | undefined;

  public format?:((x: T) => T);
  private enableDebug = false;

  constructor(private path: string, ...streamArgs: any[]) {
    this.listeners.onChange = this.onChange;
    if (streamArgs.length > 0) {
      this.streamArgs = streamArgs;
    }
  }
  public setDebugEnable = (enabled: boolean) => {
    this.enableDebug = enabled;
    if (enabled && !this.debugger) {
      this.debugger = new Debugger(this.path, MAX_INTERVAL_DUMP);
      return;
    }
    if (!enabled && this.debugger) {
      this.debugger = undefined;
    }
  }
  public add = (name: string, action: (t: T) => any) => {
    this.listeners.add(name, action);
  }
  public remove = (name: string) => {
    this.listeners.remove(name);
  }
  public init = (connection: HubConnection, format: null | ((x: T) => T)) => {
    this.connection = connection;
    if (format) {
      this.format = format;
    }
  }
  onChange = (mode: string, key: string, count: number) => {
    if (count <= 0) {
      if (this.subs) {
        this.subs.dispose();
        this.subs = undefined;
      }
    } else if (!this.subs) {
      this.startStream();
    }
  };

  startStream = () => {
    if (!this.connection) {
      return;
    }
    this.subs = this.connection.stream(this.path, ...this.streamArgs)
      .subscribe({
        next: (item) => {
          if (this.enableDebug) {
            this.debugger?.record();
          }
          this.listeners.invoke(this.format ? this.format(item) : item);
        },
        complete: () => { },
        error: console.error,
      });
  }
}

class Debugger {
  private lastUpdate: Date | undefined;
  private lastFpsDate: Date | undefined;
  private readonly intervals: number[];
  private frameCount = 0;
  constructor(private path: string, intervalCount: number) {
    this.intervals = ArrayHelper.create(0, intervalCount, (_) => 0);
  }
  private addInterval = (newValue: number) => {
    ArrayHelper.padLeft(this.intervals, newValue);
  }
  private getAverageInterval = () => NumberHelper.average(...this.intervals);
  record = () => {
    const now = new Date();
    invokeLater(() => {
      if (this.lastUpdate) {
        const interval = now.getTime() - this.lastUpdate.getTime();
        this.addInterval(interval);
        const avg = this.getAverageInterval();
        console.debug(this.path, 'interval', interval, 'Average:', avg.toFixed(2));
        this.lastUpdate = now;
        return;
      }
      this.lastUpdate = new Date();
    }, 1);
    invokeLater(() => {
      if (this.lastFpsDate) {
        this.frameCount += 1;
        const diff = now.getTime() - this.lastFpsDate.getTime();
        if (diff >= 1000) {
          console.debug('FPS', this.frameCount);
          this.frameCount = 0;
          this.lastFpsDate = now;
        }
        return;
      }
      this.lastFpsDate = new Date();
    }, 1);
  }
}
