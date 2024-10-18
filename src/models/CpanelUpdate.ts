import ChannelType from '../enums/ChannelType';
import TempControllerId from '../enums/TempControllerId';

export default class CpanelUpdate {
  date?: string;
  m0Position = 0;
  cameraFramerate = 0;
  temperature = new TemperatureProperty<number>();
  targetTemperature = new TemperatureProperty<number>();
  temperatureEnabled = new TemperatureProperty<boolean>();
  ledEnabled = false;
  chipDetected = false;
  runProgress: SequenceRunProgress | null = null;
  activeProtocol: string | null;
  heaterLedPwmDutyValues = [0, 0, 0, 0, 0];
  activeCameraStream: ChannelType;
  ambientTemperature = 0;

  static defaultUpdate = () => {
    const update = new CpanelUpdate();
    update.temperature.pcr1 = 0;
    update.temperature.pcr2 = 0;

    update.targetTemperature.pcr1 = 0;
    update.targetTemperature.pcr2 = 0;

    update.temperatureEnabled.pcr1 = false;
    update.temperatureEnabled.pcr2 = false;
    update.runProgress = null;

    return update;
  }

  static assign = (item: any): CpanelUpdate => {
    const update: CpanelUpdate = Object.assign(new CpanelUpdate(), item);
    update.targetTemperature = Object.assign(new TemperatureProperty<number>(), update.targetTemperature);
    update.temperature = Object.assign(new TemperatureProperty<number>(), update.temperature);
    update.temperatureEnabled = Object.assign(new TemperatureProperty<number>(), update.temperatureEnabled);

    if (update.runProgress !== null && update.runProgress !== undefined) {
      update.runProgress = Object.assign(new SequenceRunProgress(), update.runProgress);
    }
    return update;
  }
}

export class SequenceRunProgress {
  identifier: string;
  completed: number;
  remaining: number;
  totalStep: number;
  message: string;
  desc: string;
  runStatus: RunStatus;

  get progress() {
    if (this.completed === 0 && this.remaining === 0) {
      return 0;
    }
    return (this.completed / this.totalStep);
  }
}

export enum RunStatus {
  Completed = 'Completed',
  Running = 'Running',
  Aborted = 'Aborted',
  FailedToStart = 'FailedToStart',
  GeneratingCompletedReport = 'GeneratingCompletedReport',
  GeneratingAbortedReport = 'GeneratingAbortedReport',
}

export class TemperatureProperty<T> {
  pcr1: T;
  pcr2: T;
  constructor(val1?: T, val2?: T) {
    if (val1 !== undefined) {
      this.pcr1 = val1;
    }
    if (val2 !== undefined) {
      this.pcr2 = val2;
    }
  }

  getValue = (id: TempControllerId) => {
    if (id === TempControllerId.PCR1) {
      return this.pcr1;
    }
    return this.pcr2;
  }
  setValue = (id: TempControllerId, value: T) => {
    if (id === TempControllerId.PCR1) {
      this.pcr1 = value;
      return this;
    }
    this.pcr2 = value;
    return this;
  }
}
