import config from '../../../config';
import NumberHelper from '../../../helper/NumberHelper';
import { ValidationResult } from '../../../models/ValidationResult';

const isHoldtimeValid = (val: any, inMillisecond = false): ValidationResult => {
  const setting = config.SETTING.PCR_PROFILE_SETTING;
  if (inMillisecond) {
    val /= 1000;
  }
  const valid = NumberHelper.inRange(val, 0, setting.maxHoldTimeSec);
  return {
    valid,
    message: valid ? '' : `Not valid, range value min: 0, max: ${setting.maxHoldTimeSec.toLocaleString()}`,
    isError: !valid,
    isWarning: !valid,
  };
};
const isTempValid = (val: any): ValidationResult => {
  const setting = config.SETTING.PCR_PROFILE_SETTING;
  const valid = NumberHelper.inRange(val, setting.temp.min, setting.temp.max);
  const { min, max } = setting.temp;
  return {
    valid,
    message: valid ? '' : `Not valid, range value min: ${min}°C, max: ${max}°C`,
    isError: !valid,
    isWarning: !valid,
  };
};
const isNumCycleValid = (val: any): ValidationResult => {
  const setting = config.SETTING.PCR_PROFILE_SETTING;
  const valid = NumberHelper.inRange(val, 0, setting.maxCycle);
  return {
    valid,
    message: valid ? '' : `Not valid, range value min: 0, max: ${setting.maxCycle}`,
    isError: !valid,
    isWarning: !valid,
  };
};
const isMotorOffsetValid = (val: any) : ValidationResult => {
  const limit = config.SETTING.PCR_PROFILE_SETTING.motorOffset;
  const { min, max, step } = limit;
  const valid = val !== '' && !isNaN(val) && isMultiplicationOf(val, step) && NumberHelper.inRange(val, min, max);
  return {
    valid,
    message: valid ? '' : `Not valid, range value min: ${min}, max: ${max}, and multiplication of ${step}`,
    isError: !valid,
    isWarning: !valid,
  };
};
const isMotorVelocityValid = (val: any) : ValidationResult => {
  const limit = config.SETTING.PCR_PROFILE_SETTING.motorVel;
  const { min, max, step } = limit;
  const valid = val !== '' && !isNaN(val) && isMultiplicationOf(val, step) && NumberHelper.inRange(val, min, max);
  return {
    valid,
    message: valid ? '' : `Not valid, range value min: ${min}, max: ${max}, and multiplication of ${step}`,
    isError: !valid,
    isWarning: !valid,
  };
};
const isRampRateValid = (val: any) : ValidationResult => {
  const { max } = config.SETTING.PCR_PROFILE_SETTING.temp;
  const valid = val !== '' && !isNaN(val) && NumberHelper.inRange(val, 0, max);
  return {
    valid,
    message: valid ? '' : `Not valid, range value min: 0, max: ${max}`,
    isError: !valid,
    isWarning: !valid,
  };
};

const isMultiplicationOf = (val: number, mult: number) => {
  // HACK: scale value to avoid not-precise decimal calculation
  const scale = 1000000;
  val *= scale;
  mult *= scale;
  return val % mult === 0;
}

const ProtocolValidatorHelper = {
  isHoldtimeValid,
  isTempValid,
  isNumCycleValid,
  isMotorOffsetValid,
  isMotorVelocityValid,
  isRampRateValid,
};

export default ProtocolValidatorHelper;
