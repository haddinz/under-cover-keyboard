import NumberHelper from '../helper/NumberHelper';

export default class TemperatureChecking {
  public pcr1 = new TemperatureLimit();
  public pcr2 = new TemperatureLimit();

  static getWarningString(id: string, val: number, limit: TemperatureLimit) {
    const num = parseFloat(val.toFixed(1));
    if (NumberHelper.inRange(num, limit.min, limit.max)) {
      return null;
    }
    if (val < limit.min) {
      return `${id}: ${num} < ${limit.min}`;
    }
    return `${id}: ${num} > ${limit.max}`;
  }
}
class TemperatureLimit {
  max: number = Number.MAX_SAFE_INTEGER;
  min: number = Number.MIN_SAFE_INTEGER;
}
