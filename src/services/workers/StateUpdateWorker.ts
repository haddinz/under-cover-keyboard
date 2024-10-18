import { injectable } from 'inversify';
import CustomEventHandler from '../../helper/CustomEventHandler';

@injectable()
export default abstract class StateUpdateWorker<T> {
  public lastUpdate: T | null;
  public readonly listeners: CustomEventHandler<T> = new CustomEventHandler();
  abstract get name();
  abstract start(): void;
  abstract stop(): void;
  protected invokeListener = (payload: T) => {
    this.lastUpdate = payload;
    this.listeners.invoke(payload);
  }
}
