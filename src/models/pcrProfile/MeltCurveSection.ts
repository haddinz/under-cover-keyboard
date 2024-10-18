import ProtocolValidatorHelper from '../../components/contents/protocol/ProtocolValidatorHelper';
import PcrSection from './PcrSection';
import PcrSectionType from './PcrSectionType';
import PcrStep from './PcrStep';

export default class MeltCurveSection extends PcrSection {
  step1: PcrStep;
  step2: PcrStep;
  rampRate: number;
  holdTime: number;
  constructor(label: string) {
    super(label, PcrSectionType.MeltCurve);
    this.step1 = { temp: 0, holdTime: 0, motorMovement: { offset: 0, velocity: 0 } };
    this.step2 = { temp: 0, holdTime: 0, motorMovement: { offset: 0, velocity: 0 } };
  }
  tooltipString(): string {
    return this.enabled ? `MC = ${this.step1.temp} - ${this.step2.temp}` : 'MC = -';
  }
  clone = (): MeltCurveSection => {
    const json = JSON.stringify(this);
    const obj = JSON.parse(json);
    const result = Object.assign(new MeltCurveSection(obj.label), obj);
    result.updateViewID();
    return result;
  }
  isValid = () => {
    const helper = ProtocolValidatorHelper;
    const { step1, step2, numberOfCycle, rampRate } = this;
    const { motorMovement: motorMovement1, temp: temp1, holdTime: holdTime1 } = step1;
    const { motorMovement: motorMovement2, temp: temp2, holdTime: holdTime2 } = step2;

    const tempValid = helper.isTempValid(temp1).valid && helper.isTempValid(temp2).valid;
    const cycleValid = helper.isNumCycleValid(numberOfCycle).valid;
    const holdTimeValid = helper.isHoldtimeValid(holdTime1).valid && helper.isHoldtimeValid(holdTime2).valid;
    const motorOffsetValid = helper.isMotorOffsetValid(motorMovement1.offset).valid && helper.isMotorOffsetValid(motorMovement2.offset).valid;
    const motorVelValid = helper.isMotorVelocityValid(motorMovement1.velocity).valid && helper.isMotorVelocityValid(motorMovement2.velocity).valid;
    const rampRateValid = helper.isRampRateValid(rampRate).valid;
    return tempValid && cycleValid && holdTimeValid && motorOffsetValid && motorVelValid && rampRateValid;
  };
}
