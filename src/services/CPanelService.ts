import { injectable } from 'inversify';
import ChannelType from '../enums/ChannelType';
import TempControllerId from '../enums/TempControllerId';
import CpanelUpdate from '../models/CpanelUpdate';
import LivePeakResponse from '../models/report/LivePeakResponse';
import SelfDiagnoseResult from '../models/SelfDiagnoseResult';
import ServiceResponse, { DefaultServiceResponse } from '../models/ServiceResponse';
import VelocityLimit from '../models/VelocityLimit';

@injectable()
export default abstract class CPanelService {
  abstract get connected();
  abstract get name();
  abstract start(): void;
  abstract close(): void;

  abstract subscribeCpanelUpdate: (name: string, action: (update: CpanelUpdate) => any) => void;
  abstract unsubscribeCpanelUpdate: (name: string) => void;

  abstract subscribeSensorUpdate: (name: string, action: (value: number[]) => any) => void;
  abstract unsubscribeSensorUpdate: (name: string) => void;

  abstract subscribeLiveReportUpdate: (name: string, action: (value: LivePeakResponse) => any) => void;
  abstract unsubscribeLiveReportUpdate: (name: string) => void;

  abstract subscribeOnConnect: (name: string, action: () => any) => void;
  abstract unsubscribeOnConnect: (name: string) => void;

  abstract subscribeOnDisconnect: (name: string, action: (e: Error) => any) => void;
  abstract unsubscribeOnDisconnect: (name: string) => void;

  // Heater

  abstract setTempController(id: TempControllerId, enable: boolean): Promise<DefaultServiceResponse>;
  abstract setTempControllerTarget(id: TempControllerId, target: number): Promise<DefaultServiceResponse>;

  // Led

  abstract SetLedController(enable: boolean): Promise<DefaultServiceResponse>;
  abstract SetHeaterLedEnable(index: number, enable: boolean): Promise<DefaultServiceResponse>;
  abstract GetLedControllerEnable(): Promise<ServiceResponse<boolean>>;

  // Motor

  abstract HomeMotor(): Promise<DefaultServiceResponse>;
  abstract MoveMotorAbsolute(pos: number, velocity: number): Promise<DefaultServiceResponse>;
  abstract MoveMotorRelative(increment: number, velocity: number): Promise<DefaultServiceResponse>;
  abstract WaitMotorMove(): Promise<DefaultServiceResponse>;
  abstract StopMotorMove(): Promise<DefaultServiceResponse>;
  abstract StartMotorMove(velocity: number, direction: boolean): Promise<DefaultServiceResponse>;
  abstract GetMotorVelocityLimit(): Promise<ServiceResponse<VelocityLimit>>;
  abstract GetMotorPosition(): Promise<ServiceResponse<number>>;
  abstract GetMaxMotorPosition(): Promise<ServiceResponse<number>>;

  // Camera
  abstract RestartCameraMjpeg(): Promise<DefaultServiceResponse>;
  abstract SetDisplayedCameraStream(channel: ChannelType): Promise<DefaultServiceResponse>;

  // Etc
  abstract GetHostName(): Promise<ServiceResponse<string>>;
  abstract GetSelfDiagnoseResult(): Promise<ServiceResponse<SelfDiagnoseResult|null>>;
  abstract GetSoftwareVersion(): Promise<ServiceResponse<string>>;
}
