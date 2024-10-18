import ProtocolValidatorHelper from '../../components/contents/protocol/ProtocolValidatorHelper';
import config from '../../config';
import NumberHelper from '../../helper/NumberHelper';
import PcrSection from './PcrSection';
import PcrSectionType from './PcrSectionType';
import PcrStep from './PcrStep';

export default class PrimerMixingSection extends PcrSection {
  step1: PcrStep;
  step2: PcrStep;
  numberOfCycle = 10;
  constructor(label: string) {
    super(label, PcrSectionType.PrimerMixing);
    this.step1 = { temp: 0, holdTime: 0, motorMovement: { offset: 0, velocity: 0 } };
    this.step2 = { temp: 0, holdTime: 0, motorMovement: { offset: 0, velocity: 0 } };
  }
  clone = (): PrimerMixingSection => {
    const json = JSON.stringify(this);
    const obj = JSON.parse(json);
    const result = Object.assign(new PrimerMixingSection(obj.label), obj);
    result.updateViewID();
    return result;
  }

  tooltipString = () => {
    return this.enabled ? `Primer Mixing = (${this.numberOfCycle}x)` : 'Primer Mixing = -';
  }

  isValid = () => {
    const helper = ProtocolValidatorHelper;
    const { step1, step2, numberOfCycle } = this;
    const { motorMovement: motorMovement1 } = step1;
    const { motorMovement: motorMovement2 } = step2;

    const cycleValid = helper.isNumCycleValid(numberOfCycle).valid;
    const motorOffsetValid = helper.isMotorOffsetValid(motorMovement1.offset).valid && helper.isMotorOffsetValid(motorMovement2.offset).valid;
    const motorVelValid = helper.isMotorVelocityValid(motorMovement1.velocity).valid && helper.isMotorVelocityValid(motorMovement2.velocity).valid;
    return cycleValid && motorOffsetValid && motorVelValid;
  }
}
