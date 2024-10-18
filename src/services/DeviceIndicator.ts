import { injectable } from 'inversify';

@injectable()
export default abstract class DeviceIndicator {
  abstract setReady(): Promise<any>;
  abstract setIdle(): Promise<any>;
}
