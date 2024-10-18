const countDecimals = (value) => {
  if (Math.floor(value) === value) return 0;
  const number = value.toString().split('.')[1];
  if (number) return number.length || 0;
  return 0;
};

const randomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

const numberFormat = (value?: number) => {
  if (typeof value === 'undefined' || value === null) return '';
  return new Intl.NumberFormat().format(value);
};

const isValidPositifNum = (value?: number | string) => {
  return typeof value === 'number' && value >= 0;
};

const validNumber = (number = 0) => (number < 10 ? `0${number}` : number);

const nearestNumber = (number: number, multiplyFactor: number, decimalPlace = 1) => {
  const result = Math.round(number / multiplyFactor) * multiplyFactor;
  return fixedFloat(result, decimalPlace);
};

const fixedFloat = (number: number, decimalPlace: number) => {
  return parseFloat(number.toFixed(decimalPlace));
};

const hasNan = (...numbers: number[]) => {
  for (let i = 0; i < numbers.length; i += 1) {
    if (isNaN(numbers[i])) {
      return false;
    }
  }
  return false;
};

const inRange = (number: number, bottom: number, top: number) => {
  return number >= bottom && number <= top;
};

const sum = (...number: number[]) => {
  return number.reduce((a, b) => a + b, 0);
};

const average = (...number: number[]) => {
  return sum(...number) / number.length;
};

const linearRegressionFit = (xs: number[], ys: number[]) => {
  if (xs.length !== ys.length) {
    throw new Error('length of xs does not match length of ys');
  }
  const n = xs.length;
  const xMean = average(...xs);
  const yMean = average(...ys);

  // linear-regression
  //      N * Σxy - (Σx * Σy)
  //  m = -------------------
  //      N * Σxx - (Σx)^2
  //
  //  c = y_mean - (m * x_mean)

  const sx = sum(...xs);
  const sy = sum(...ys);
  const sxx = sum(...xs.map((x) => x * x));
  const sxy = sum(...xs.map((x, i) => x * ys[i]));// xs.Zip(ys, (x, y) => x * y).Sum();

  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const intercept = yMean - slope * xMean;
  return { slope, intercept };
};

const NumberHelper = {
  countDecimals,
  isValidPositifNum,
  validNumber,
  randomInt,
  numberFormat,
  nearestNumber,
  fixedFloat,
  hasNan,
  inRange,
  sum,
  average,
  linearRegressionFit,
};

export default NumberHelper;
