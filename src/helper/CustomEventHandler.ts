import EventHandlerSource from './EventHandlerSource';
import { invokeLater } from './EventHelper';

export default class CustomEventHandler<T> {
  private readonly listeners: Map<string, (arg: T, sender?: any) => any> = new Map();
  public readonly source: EventHandlerSource<T>;
  constructor() {
    this.source = new EventHandlerSource(this);
  }
  public onChange: (mode: string, updatedKey: string, size: number) => any;

  get listenerCount() { return this.listeners.size; }
  add = (key: string, action: (arg: T, sender?: any) => any) => {
    this.listeners.set(key, action);
    this.invokeOnChange('add', key);
  }
  remove = (key: string) => {
    this.listeners.delete(key);
    this.invokeOnChange('remove', key);
  }
  private invokeOnChange = (mode: string, key: string) => {
    if (this.onChange) {
      this.onChange(mode, key, this.listeners.size);
    }
  }
  clear() {
    this.listeners.clear();
  }
  invoke = (arg: T, sender?: any) => {
    invokeLater(() => {
      this.listeners.forEach((action) => {
        action(arg, sender);
      });
    }, 1);
  }
  invokeSync = (arg: T, sender?: any) => {
    this.listeners.forEach((action) => {
      action(arg, sender);
    });
  }
}
