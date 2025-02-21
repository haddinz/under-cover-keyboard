import FormatDateEnum from '../enums/FormatDateEnum';
import NumberHelper from './NumberHelper';

const { validNumber } = NumberHelper;

const ArrayMonth = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const getHoursAmPm = (hours = 0) => (hours >= 12 ? hours - 12 : hours);

const getAmPm = (hours = 0) => (hours >= 12 ? 'PM' : 'AM');

const numberToHours = (number: number | string = 0) => {
  if (typeof number === 'string') number = parseInt(number, 10);
  return parseInt((number / 3_600).toString(), 10);
};

const formatDateToString = (
  type: keyof typeof FormatDateEnum,
  date: Date | string = new Date(),
) => {
  if (date === '' || !date) return '';
  const dateTemp = new Date(date);
  const fullHours = dateTemp.getHours();
  const fullHoursDoubleDigit = (`0${fullHours}`).slice(-2);
  const hours = getHoursAmPm(fullHours);
  const minutes = validNumber(dateTemp.getMinutes());
  const seconds = validNumber(dateTemp.getSeconds());
  const miliseconds = validNumber(dateTemp.getMilliseconds());
  const ampm = getAmPm(fullHours);
  const strTime = `${hours}:${minutes}:${dateTemp.getSeconds()} ${ampm}`;
  let result = '';
  const years = dateTemp.getFullYear();
  const months = validNumber(dateTemp.getMonth() + 1);
  const dates = validNumber(dateTemp.getDate());
  switch (type) {
    case FormatDateEnum.YYYY_MM_DD:
      result = `${years}-${months}-${dates}`;
      break;
    case FormatDateEnum.YYYY_MM_DD_H_M:
      result = `${years}-${months}-${dates} ${hours}:${minutes} ${ampm}`;
      break;
    case FormatDateEnum.HH_MM_AMPM:
      result = `${validNumber(hours)}:${minutes} ${ampm}`;
      break;
    case FormatDateEnum.YYYY_MM_DD_H_M_S_AMPM:
      result = `${years}-${months}-${dates} ${hours}:${minutes}:${seconds} ${ampm}`;
      break;
    case FormatDateEnum.YYYY_MM_DD_H_M_S:
      result = `${years}-${months}-${dates} ${fullHours}:${minutes}:${seconds}`;
      break;
    case FormatDateEnum.YYYY_MM_DD_H_M_S_MS:
      result = `${years}-${months}-${dates} ${hours}:${minutes}:${seconds}:${miliseconds} ${ampm}`;
      break;
    case FormatDateEnum.YYYY_MM_DDTHH_MM_SS:
      result = `${years}-${months}-${dates}T${fullHoursDoubleDigit}:${minutes}:${seconds}`;
      break;
    default:
      result = `${
        ArrayMonth[dateTemp.getUTCMonth()]
      } ${dateTemp.getDate()},${dateTemp.getFullYear()} ${strTime}`;
      break;
  }
  return result;
};

const getDateTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(new Date().getDate() + 1);
  return tomorrow;
};

const numberToMinutes = (number = 0) => {
  const minutes = number % 3_600;
  return parseInt((minutes / 60).toString(), 10);
};

const numberToSeconds = (number = 0) => {
  const minutes = number % 3_600;
  return minutes % 60;
};

const inMinutes = (timeStamps = 0) => Math.round(timeStamps / (1_000 * 60));

const timeToSeconds = (
  hours: number | string = 0,
  minutes: number | string = 0,
  seconds: number | string = 0,
) => {
  hours = parseInt((hours || 0).toString(), 10);
  minutes = parseInt((minutes || 0).toString(), 10);
  seconds = parseInt((seconds || 0).toString(), 10);
  return hours * 3_600 + minutes * 60 + seconds;
};

const numberToTimeString = (number = 0, format: 'm:s' | '' = '') => {
  switch (format) {
    case 'm:s':
      return `${validNumber(numberToMinutes(number))}:${validNumber(
        numberToSeconds(number),
      )}`;
    default:
      return `${validNumber(numberToHours(number))}:${validNumber(
        numberToMinutes(number),
      )}:${validNumber(numberToSeconds(number))}`;
  }
};

const isValidDate = (date) => typeof date === 'object';

const dateToFormatIsoString = (date: Date | string) => {
  const dateTemp = new Date(date);
  const years = dateTemp.getFullYear();
  const months = validNumber(dateTemp.getMonth() + 1);
  const dates = validNumber(dateTemp.getDate());
  const hours = validNumber(dateTemp.getHours());
  const minutes = validNumber(dateTemp.getMinutes());
  const seconds = validNumber(dateTemp.getSeconds());
  return `${years}-${months}-${dates}T${hours}:${minutes}:${seconds}.000Z`;
};

const getDateByTimeValue = (
  dateValue: string | Date,
  timeDefault = { hours: 0, minutes: 0, seconds: 0 }) => {
  let newDate;
  if (dateValue) {
    newDate = new Date(dateValue);
  } else {
    newDate = new Date();
  }
  newDate.setHours(timeDefault.hours);
  newDate.setMinutes(timeDefault.minutes);
  newDate.setSeconds(timeDefault.seconds);
  return newDate;
};

const formatTimeSpan = (fullTimeSpan: string, format: 'h:m:s' | 'h:m' | 'm:s') => {
  const split = fullTimeSpan.split(':');

  // check if more than 1 day. 2.10 means 2 days and 10 hours
  if (split[0].includes('.')) {
    const day = parseInt(split[0], 10);
    const hourOffset = parseInt(split[0].split('.')[1], 10);
    const totalHour = day * 24 + hourOffset;
    split[0] = totalHour.toString();
  }

  const [h, m, s] = split.map((i) => (isNaN(parseFloat(i)) ? 0 : parseFloat(i)));
  const td = (num: number) => {
    if (isNaN(num) || num < 0) {
      return '0';
    }
    if (num < 10) {
      return `0${num.toFixed(0)}`;
    }
    return num.toFixed(0);
  };
  const hFormatted = td(h);
  const mFormatted = format === 'm:s' ? td((h * 60) + m) : td(m);
  const sFormatted = td(s);
  if (format === 'h:m') {
    return [hFormatted, mFormatted].join(':');
  }
  if (format === 'h:m:s') {
    return [hFormatted, mFormatted, sFormatted].join(':');
  }
  return [mFormatted, sFormatted].join(':');
};

const DateHelper = {
  formatDateToString,
  getDateTomorrow,
  inMinutes,
  timeToSeconds,
  numberToTimeString,
  isValidDate,
  dateToFormatIsoString,
  getDateByTimeValue,
  formatTimeSpan,
};

export default DateHelper;
