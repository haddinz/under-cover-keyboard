import CustomEventHandler from './CustomEventHandler';

export default class EventHandlerSource<T> {
  constructor(private readonly handler: CustomEventHandler<T>) {
  }
  add = (key: string, callback: (t: T) => any) => {
    this.handler.add(key, callback);
  }
  remove = (key: string) => {
    this.handler.remove(key);
  }
}
