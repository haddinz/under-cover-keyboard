import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { injectable } from 'inversify';
import 'reflect-metadata';
import BaseTransport from '../api/transport/BaseTransport';
import config from '../config';
import CpanelUpdate from '../models/CpanelUpdate';
import LivePeakResponse from '../models/report/LivePeakResponse';
import ServiceError from '../models/ServiceError';
import ApiSubscription from './ApiSubscription';

const CPANEL_HUB_URL = config.SERVICE_URL;
let lastUpdate: Date | null;

@injectable()
export default class SignalrApiClient extends BaseTransport {
  private connection: HubConnection | undefined;
  public readonly updateListeners = new ApiSubscription<CpanelUpdate>('UpdateStream');
  public readonly sensorListeners = new ApiSubscription<number[]>('SensorStream');
  public readonly liveReportListeners = new ApiSubscription<LivePeakResponse>('LiveReportStream', 'Maximum');
  public readonly networkScanListeners = new ApiSubscription('ScanNetworkStream')
  get connected(): boolean {
    return this.connection !== undefined && this.connection.state === HubConnectionState.Connected;
  }
  get name() { return 'signalr-client'; }
  init(): void {
    if (this.connected) {
      return;
    }
    this.connection = new HubConnectionBuilder().withUrl(CPANEL_HUB_URL).build();
    this.connection.start().then(this.onconnect).catch(this.handleConnectionError);
    // for debugging purpose
    // (window as any).cpanelhub = this.connection;
  }
  handleConnectionError = (e: Error | undefined) => {
    console.info(`Connection closed with casue: ${e?.message}\nConnection will try to reconnect`);
    this.onDisconnect.invoke(e);
    this.init();
  }
  onconnect = () => {
    if (!this.connection) {
      return;
    }
    this.updateListeners.init(this.connection, CpanelUpdate.assign);
    this.sensorListeners.init(this.connection, null);
    this.liveReportListeners.init(this.connection, null);
    this.networkScanListeners.init(this.connection, null);

    this.connection.onclose(this.handleConnectionError);
    this.onConnect.invoke(null);
  }
  stop(): void {
    if (!this.connection) {
      return;
    }
    this.connection.stop();
  }
  send = <T>(method: string, ...args: any[]): Promise<T> => {
    return new Promise((resolve, reject) => {
      if (!this.connection || !this.connected) {
        reject(new Error('Not connected'));
        return;
      }
      this.connection.invoke(method, ...args)
        // response expected is json type
        .then((response: any) => {
          if (response.hasError || response.errorMsg) {
            reject(new ServiceError(response.code, response.errorMsg));
            return;
          }
          resolve(response);
        })
        .catch((err) => {
          reject(parseError(err));
        });
    });
  }

  on = (path: string, action: (...args: any[]) => any) => {
    if (!this.connection) {
      return;
    }
    this.connection.on(path, action);
  }

  off = (path: string) => {
    if (!this.connection) {
      return;
    }
    this.connection.off(path);
  }
}

const parseError = (err: any) => {
  if (err instanceof Error) {
    if (err.message === 'WebSocket closed with status code: 1006 (no reason given).') {
      return new Error('Connection lost. Try reloading your browser or checking your device if this still persist.');
    }
  }
  return err;
};
