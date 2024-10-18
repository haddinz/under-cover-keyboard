import ProtocolValidatorHelper from '../../components/contents/protocol/ProtocolValidatorHelper';
import PcrSection from './PcrSection';
import PcrSectionType from './PcrSectionType';
import PcrStep from './PcrStep';

export default class ThermoCycleSection extends PcrSection {
  step1: PcrStep;
  step2: PcrStep;
  numberOfCycle = 10;
  rampRate = 0;
  constructor(label: string) {
    super(label, PcrSectionType.Pcr);
    this.step1 = { temp: 0, holdTime: 0, motorMovement: { offset: 0, velocity: 0 } };
    this.step2 = { temp: 0, holdTime: 0, motorMovement: { offset: 0, velocity: 0 } };
  }

  public static emotyInstance(label: string) {
    const result = new ThermoCycleSection(label);
    result.step1 = { temp: NaN, holdTime: NaN, motorMovement: { offset: NaN, velocity: NaN } };
    result.step2 = { temp: NaN, holdTime: NaN, motorMovement: { offset: NaN, velocity: NaN } };
    result.numberOfCycle = NaN;
    return result;
  }
  clone = (): ThermoCycleSection => {
    const json = JSON.stringify(this);
    const obj = JSON.parse(json);
    const result = Object.assign(new ThermoCycleSection(obj.label), obj);
    result.updateViewID();
    return result;
  }

  tooltipString = () => {
    return this.enabled ? `PCR = ${this.step1.temp} - ${this.step2.temp} (${this.numberOfCycle}x)` : 'PCR = -';
  }

  isValid = () => {
    const helper = ProtocolValidatorHelper;
    const { step1, step2, numberOfCycle } = this;
    const { motorMovement: motorMovement1, temp: temp1, holdTime: holdTime1 } = step1;
    const { motorMovement: motorMovement2, temp: temp2, holdTime: holdTime2 } = step2;

    const tempValid = helper.isTempValid(temp1).valid && helper.isTempValid(temp2).valid;
    const cycleValid = helper.isNumCycleValid(numberOfCycle).valid;
    const holdTimeValid = helper.isHoldtimeValid(holdTime1, true).valid && helper.isHoldtimeValid(holdTime2, true).valid;
    const motorOffsetValid = helper.isMotorOffsetValid(motorMovement1.offset).valid && helper.isMotorOffsetValid(motorMovement2.offset).valid;
    const motorVelValid = helper.isMotorVelocityValid(motorMovement1.velocity).valid && helper.isMotorVelocityValid(motorMovement2.velocity).valid;
    return tempValid && cycleValid && holdTimeValid && motorOffsetValid && motorVelValid;
  }
}
