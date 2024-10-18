import { injectable } from 'inversify';
import CustomEventHandler from '../../helper/CustomEventHandler';

@injectable()
export default abstract class BaseTransport {
  /**
   *  on data incoming listener
   */
  public readonly listeners: CustomEventHandler<any> = new CustomEventHandler();

  public readonly onConnect: CustomEventHandler<any> = new CustomEventHandler();
  public readonly onDisconnect: CustomEventHandler<any> = new CustomEventHandler();

  abstract get name(): string;
  abstract get connected(): boolean;

  abstract init(arg?: any): void;
  abstract stop(): void;
  abstract send(payload: any, ...args: any[]): void;

  /**
   * invoke on data incoming listeners
   * @param message
   */
  protected invokeListeners = (message: any) => {
    this.listeners.invoke(message);
  }
}
