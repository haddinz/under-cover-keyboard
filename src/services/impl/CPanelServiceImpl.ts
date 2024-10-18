import { inject, injectable } from 'inversify';
import ChannelType from '../../enums/ChannelType';
import TempControllerId from '../../enums/TempControllerId';
import CpanelUpdate from '../../models/CpanelUpdate';
import LivePeakResponse from '../../models/report/LivePeakResponse';
import SelfDiagnoseResult from '../../models/SelfDiagnoseResult';
import ServiceResponse, { DefaultServiceResponse } from '../../models/ServiceResponse';
import VelocityLimit from '../../models/VelocityLimit';
import CPanelService from '../CPanelService';
import SignalrApiClient from '../SignalrApiClient';

@injectable()
export default class CPanelServiceImpl extends CPanelService {
  @inject(SignalrApiClient)
  private apiClient: SignalrApiClient;
  private velocityLimit: VelocityLimit | undefined;

  get connected() { return this.apiClient.connected; }
  get name() { return 'cpanel-service'; }
  start = () => this.apiClient.init();
  close = () => this.apiClient.stop();

  // ON UPDATE
  subscribeCpanelUpdate = (name: string, action: (update: CpanelUpdate) => any) => {
    this.apiClient.updateListeners.add(name, action);
  }
  unsubscribeCpanelUpdate = (name: string) => {
    this.apiClient.updateListeners.remove(name);
  }
  // ON SENSOR UPDATE
  subscribeSensorUpdate = (name: string, action: (value: number[]) => any) => {
    this.apiClient.sensorListeners.add(name, action);
  }
  unsubscribeSensorUpdate = (name: string) => {
    this.apiClient.sensorListeners.remove(name);
  }
  // ON LIVE REPORT UPDATE
  subscribeLiveReportUpdate = (name: string, action: (value: LivePeakResponse) => any) => {
    const subs = this.apiClient.liveReportListeners;
    subs.add(name, action);
  }
  unsubscribeLiveReportUpdate = (name: string) => {
    const subs = this.apiClient.liveReportListeners;
    subs.remove(name);
  }
  // ON CONNECT
  subscribeOnConnect = (name: string, action: () => any) => {
    this.apiClient.onConnect.add(name, action);
  }
  unsubscribeOnConnect = (name: string) => {
    this.apiClient.onConnect.remove(name);
  }
  // ON DISCONNECT
  subscribeOnDisconnect = (name: string, action: (error: Error) => any) => {
    this.apiClient.onDisconnect.add(name, action);
  }
  unsubscribeOnDisconnect = (name: string) => {
    this.apiClient.onDisconnect.remove(name);
  }

  // Heater

  setTempController = (id: TempControllerId, enable: boolean): Promise<DefaultServiceResponse> => {
    return this.apiClient.send('SetTempController', id, enable);
  }
  setTempControllerTarget = (id: TempControllerId, target: number): Promise<DefaultServiceResponse> => {
    return this.apiClient.send('SetTempControllerTarget', id, target);
  }

  // Led

  SetLedController(enable: boolean): Promise<DefaultServiceResponse> {
    return this.apiClient.send('SetLedController', enable);
  }
  SetHeaterLedEnable(index: number, enable: boolean): Promise<DefaultServiceResponse> {
    return this.apiClient.send('SetHeaterLedEnable', index, enable);
  }
  GetLedControllerEnable(): Promise<ServiceResponse<boolean>> {
    return this.apiClient.send('GetLedControllerEnable');
  }

  // Motor

  HomeMotor = (): Promise<DefaultServiceResponse> => {
    return this.apiClient.send('home-motor');
  }
  MoveMotorAbsolute = (pos: number, velocity: number): Promise<DefaultServiceResponse> => {
    return this.apiClient.send('SetMotorPositionExactVel', parseFloat(pos.toString()), parseFloat(velocity.toString()));
  }
  MoveMotorRelative = (increment: number, velocity: number): Promise<DefaultServiceResponse> => {
    return this.apiClient.send('MoveRelativeExactVel', parseFloat(increment.toString()), parseFloat(velocity.toString()));
  }
  WaitMotorMove = (): Promise<DefaultServiceResponse> => {
    return this.apiClient.send('WaitMotorMove');
  }
  StopMotorMove = (): Promise<DefaultServiceResponse> => {
    return this.apiClient.send('StopMotorMove');
  }
  StartMotorMove = (velocity: number, direction: boolean): Promise<DefaultServiceResponse> => {
    return this.apiClient.send('StartMotorMoveExactVel', parseFloat(velocity.toString()), direction);
  }
  GetMotorVelocityLimit = (): Promise<ServiceResponse<VelocityLimit>> => {
    if (this.velocityLimit) {
      const response = new ServiceResponse<VelocityLimit>(this.velocityLimit);
      return Promise.resolve<ServiceResponse<VelocityLimit>>(response);
    }
    return new Promise((resolve, reject) => {
      this.apiClient.send<ServiceResponse<VelocityLimit>>('get-motor-velocity-limit')
        .then((response) => {
          this.velocityLimit = Object.assign(new VelocityLimit(), response.content);
          resolve(response);
        })
        .catch(reject);
    });
  }
  GetMotorPosition = (): Promise<ServiceResponse<number>> => {
    return this.apiClient.send('get-motor-position');
  }
  GetMaxMotorPosition = (): Promise<ServiceResponse<number>> => {
    return this.apiClient.send('GetMaxMotorPosition');
  }

  // Etc
  GetHostName = (): Promise<ServiceResponse<string>> => {
    return this.apiClient.send('GetHostName');
  }
  RestartCameraMjpeg = (): Promise<DefaultServiceResponse> => {
    return this.apiClient.send('RestartMjpegWriter');
  }
  SetDisplayedCameraStream = (ch: ChannelType): Promise<DefaultServiceResponse> => {
    return this.apiClient.send('SetDisplayedCameraStream', ch);
  }

  GetSelfDiagnoseResult = (): Promise<ServiceResponse<SelfDiagnoseResult|null>> => {
    return this.apiClient.send('GetSelfDiagnoseResult');
  }
  GetSoftwareVersion = (): Promise<ServiceResponse<string>> => {
    return this.apiClient.send('GetSoftwareVersion');
  }
}
