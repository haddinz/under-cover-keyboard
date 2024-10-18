import { inject, injectable } from 'inversify';
import RestClient from '../../api/RestClient';
import config from '../../config';
import NumberHelper from '../../helper/NumberHelper';
import CameraParameter from '../../models/CameraParameter';
import TemperatureChecking from '../../models/TemperatureChecking';
import DeviceSettingsService from '../DeviceSettingsService';

@injectable()
export default class DeviceSettingsServiceImpl extends DeviceSettingsService {
  @inject(RestClient)
  private api: RestClient;

  getCameraParameter = (): Promise<CameraParameter> => {
    const apiPath = `${config.SERVICE_HOST}api/device-settings/camera-parameter`;
    return this.api.get<any>(apiPath, false);
  }
  setCameraParameter = (param: CameraParameter): Promise<CameraParameter> => {
    const data = new FormData();
    const { exposure, gain, frameRate } = param;
    const { red, blue } = param.awbGains;
    data.set('exposure', exposure.toString());
    data.set('redAwbGains', red.toString());
    data.set('blueAwbGains', blue.toString());
    data.set('gain', gain.toString());
    data.set('frameRate', frameRate.toString());
    data.set('restartCamera', 'true');
    const apiPath = `${config.SERVICE_HOST}api/device-settings/camera-parameter`;
    return new Promise<CameraParameter>((resolve, reject) => {
      if (NumberHelper.hasNan(exposure, red, blue)) {
        reject(new Error('The given parameters contain NaN value'));
        return;
      }
      if (!NumberHelper.inRange(exposure, 0, 1000000)) {
        reject(new Error('The given exposure is out of range'));
        return;
      }
      if (!NumberHelper.inRange(red, 0, 30)) {
        reject(new Error('The given redAwbGains is out of range'));
        return;
      }
      if (!NumberHelper.inRange(blue, 0, 30)) {
        reject(new Error('The given blueAwbGains is out of range'));
        return;
      }
      if (!NumberHelper.inRange(frameRate, 0, 60)) {
        reject(new Error('The given frameRate is out of range'));
        return;
      }
      this.api.post<any>(apiPath, data, false)
        .then(resolve)
        .catch(reject);
    });
  }
  getCameraFrameRate = (): Promise<number> => {
    const apiPath = `${config.SERVICE_HOST}api/device-settings/camera-frame-rate`;
    return this.api.get<any>(apiPath, false);
  }
  getTemperatureLimit = () => {
    const apiPath = `${config.SERVICE_HOST}api/device-settings/temperature-limit`;
    return this.api.get<TemperatureChecking>(apiPath, true, 'Preparing test...');
  }
}
