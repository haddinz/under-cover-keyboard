import { inject, injectable } from 'inversify';
import RestClient from '../../api/RestClient';
import config from '../../config';
import DeviceIndicator from '../DeviceIndicator';

@injectable()
export default class DeviceIndicatorImpl extends DeviceIndicator {
  @inject(RestClient)
  private api: RestClient;

  setReady = () => {
    const apiPath = `${config.SERVICE_HOST}api/indicators/set-ready`;
    return this.api.post(apiPath, {}, false);
  }
  setIdle = () => {
    const apiPath = `${config.SERVICE_HOST}api/indicators/set-idle`;
    return this.api.post(apiPath, {}, false);
  }
}
