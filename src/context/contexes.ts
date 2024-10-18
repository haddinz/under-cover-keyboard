import React, { ChangeEvent } from 'react';
import PcrProfileField from '../models/pcrProfile/PcrProfileFields';
import config from '../config';
import ChartDisplayCount from '../enums/ChartDisplayCount';
import TempControllerId from '../enums/TempControllerId';
import ArrayHelper from '../helper/ArrayHelper';
import { SequenceRunProgress } from '../models/CpanelUpdate';
import PcrSection from '../models/pcrProfile/PcrSection';
import PcrSectionKey from '../models/pcrProfile/PcrSectionKey';
import ProtocolModel from '../models/protocol/ProtocolModel';
import PcrSectionType from './../models/pcrProfile/PcrSectionType';

export const LiveReportContext = React.createContext({
  mode: ChartDisplayCount.Combined,
  setMode: (mode: ChartDisplayCount) => { },
  activeSeries: ArrayHelper.create(0, config.SETTING.NUM_CHANNEL * 2, (i) => i),
  toggleActiveSeries: (i: number | number[], active: boolean) => { },
});
export const MotorControlContext = React.createContext({
  isHoming: false,
  position: 0,
  maxMotorPosition: 0,
  moveAbsDisabled: false,
  moveRelDisabled: false,
  moveRelative: (increment: number, clockwise: boolean) => { },
  startMotorMove: (clockwise: boolean) => { },
  stopContinousMove: (clockwise: boolean) => { },
  moveAbsolute: () => { },
  handleInputChange: (e: ChangeEvent) => { },
  homeMotor: () => { },
});
export const TempControlContext = React.createContext({
  togglePcr: (id: TempControllerId, enabled: boolean) => { },
  setTemperature: (id: TempControllerId, target: string) => { },
});

type TRunProgressContext = { runProgress: SequenceRunProgress | null }
const SampleRunProgressContext: TRunProgressContext = { runProgress: null };
export const RunProgressContext = React.createContext(SampleRunProgressContext);

export const ProtocolInputContext = React.createContext({
  originalModel: ProtocolModel.fromJson({}),
  model: ProtocolModel.fromJson({}),
  readonly: false,
  removeSection: (section: PcrSection) => { },
  addSection: (type: PcrSectionType) => { },
  updateSectionField: (sectionKey: PcrSectionKey, field: PcrProfileField, value: any) => { },
});
