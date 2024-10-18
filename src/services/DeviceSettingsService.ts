import { injectable } from 'inversify';
import CameraParameter from '../models/CameraParameter';
import TemperatureChecking from '../models/TemperatureChecking';

@injectable()
export default abstract class DeviceSettingsService {
  abstract getCameraParameter(): Promise<CameraParameter>;
  abstract setCameraParameter(param: CameraParameter): Promise<CameraParameter>;
  abstract getCameraFrameRate(): Promise<number>;
  abstract getTemperatureLimit(): Promise<TemperatureChecking>;
}
