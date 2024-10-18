import { inject, injectable } from 'inversify';
import RestClient from '../../api/RestClient';
import config from '../../config';
import RunTestApi from '../RunTestApi';

@injectable()
export default class RunTestApiImpl extends RunTestApi {
  @inject(RestClient)
  private api: RestClient;

  directRun = (runId: string, protocol: string) => {
    const apiPath = `${config.SERVICE_HOST}api/experiments/direct-run`;
    const form = new FormData();
    form.append('runId', runId);
    form.append('protocol', protocol);
    return this.api.post(apiPath, form, true, 'Running test...');
  }
  checkAvailability = () => {
    const apiPath = `${config.SERVICE_HOST}api/experiments/check-availability`;
    return this.api.post<string>(apiPath, {}, true, 'Preparing test...');
  }
  abortSequence = (runId: string) => {
    const apiPath = `${config.SERVICE_HOST}api/experiments/abort/${runId}`;
    return this.api.post<string>(apiPath, {}, true, 'Aborting test...');
  }
  ensureUniqueId = (runId: string) => {
    const apiPath = `${config.SERVICE_HOST}api/experiments/ensure-unique-id`;
    const data = new FormData();
    data.append('runId', runId);
    return this.api.post(apiPath, data, true, 'Preparing test...');
  }
}
