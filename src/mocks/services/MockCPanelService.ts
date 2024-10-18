import { injectable } from 'inversify';
import ChannelType from '../../enums/ChannelType';
import TempControllerId from '../../enums/TempControllerId';
import CustomEventHandler from '../../helper/CustomEventHandler';
import CpanelUpdate from '../../models/CpanelUpdate';
import ServiceResponse, { DefaultServiceResponse } from '../../models/ServiceResponse';
import VelocityLimit from '../../models/VelocityLimit';
import CPanelService from '../../services/CPanelService';
import SelfDiagnoseResult from '../../models/SelfDiagnoseResult';

let LED_ENABLE = true;
const resolved = Promise.resolve(new DefaultServiceResponse());

@injectable()
export default class MockCPanelService extends CPanelService {
  private _connected = true;
  private readonly _onConnect = new CustomEventHandler<any>();
  private readonly _onDisConnect = new CustomEventHandler<any>();
  get connected(): boolean {
    return this._connected;
  }
  get name() { return 'mock-cpanel'; }
  start = () => {
    this._onConnect.invoke(null);
    this._connected = true;
  }
  close = () => {
    this._onDisConnect.invoke(null);
    // this._connected = false;
  }
  subscribeCpanelUpdate = (name: string, action: (update: CpanelUpdate) => any) => {
    // TODO implement simulation
  }
  unsubscribeCpanelUpdate = (name: string) => {
    // TODO implement simulation
  }
  subscribeSensorUpdate = (name: string, action: (value: number[]) => any) => {
    // TODO implement simulation
  }
  unsubscribeSensorUpdate = (name: string) => {
    //
  }  
  subscribeLiveReportUpdate: (name: string, action: (value: any) => any) => {
    //
  }
  unsubscribeLiveReportUpdate: (name: string) => {
    //
  }
  subscribeOnConnect = (name: string, action: () => any) => {
    this._onConnect.add(name, action);
  }
  unsubscribeOnConnect = (name: string) => {
    this._onConnect.remove(name);
  }
  subscribeOnDisconnect = (name: string, action: (e: Error) => any) => {
    this._onDisConnect.add(name, action);
  }
  unsubscribeOnDisconnect = (name: string) => {
    this._onDisConnect.remove(name);
  }
  setTempController = (id: TempControllerId, enable: boolean) => resolved;
  setTempControllerTarget = (id: TempControllerId, target: number) => resolved;
  SetHeaterLedEnable = (index: number, enable: boolean) => resolved;
  SetLedController = (enable: boolean) => resolved;
  GetLedControllerEnable = () => Promise.resolve(new ServiceResponse(LED_ENABLE));
  HomeMotor = () => resolved;
  MoveMotorAbsolute = (pos: number, velocity: number) => resolved;
  MoveMotorRelative = (increment: number, velocity: number) => resolved;
  WaitMotorMove = () => resolved;
  StopMotorMove = () => resolved;
  StartMotorMove = (velocity: number, direction: boolean) => resolved;
  GetMotorVelocityLimit = () => {
    const lim = new VelocityLimit();
    lim.max = 100;
    lim.min = 0.1
    return Promise.resolve(new ServiceResponse(lim));
  }
  GetMotorPosition = () => Promise.resolve(new ServiceResponse(50));
  RestartCameraMjpeg = () => Promise.resolve(new DefaultServiceResponse());
  SetDisplayedCameraStream = (channel: ChannelType) => Promise.resolve(new DefaultServiceResponse());
  GetHostName = ()=> Promise.resolve(new ServiceResponse('MockDevice'));
  GetMaxMotorPosition = () => Promise.resolve(new ServiceResponse(360));
  GetSelfDiagnoseResult = () => Promise.resolve(new ServiceResponse<SelfDiagnoseResult>({ hasError: false, elementDiagnoseResults: [] }));
  GetSoftwareVersion = ()=> Promise.resolve(new ServiceResponse('0.0.test'));
}
