import config from '../config';
import ChannelType from '../enums/ChannelType';
import CyclePeak from '../models/CyclePeak';
import DateHelper from './DateHelper';
import UrlHelper from './UrlHelper';

const setting = config.SETTING;
const createChartLabels = (): number[] => {
  const result: number[] = [];
  for (let i = 0; i < setting.MAX_CHART_X_AXIS; i += 1) {
    result.push(i + 1);
  }
  return result;
};
const createChannelData = (defaultValue = 0) => {
  const channelData: number[][] = [];
  const chartLabels = createChartLabels();
  for (let n = 0; n < setting.NUM_CHANNEL; n += 1) {
    channelData[n] = [];
    for (let i = 0; i < chartLabels.length; i += 1) {
      channelData[n].push(defaultValue);
    }
  }
  return channelData;
};

const getModeIndex = (mode: ChannelType) => {
  switch (mode) {
    case ChannelType.FAM: return 0;
    case ChannelType.ROX: return 1;
    default:
      return 2;
  }
};

const getModeLabel = (mode: ChannelType) => {
  switch (mode) {
    case ChannelType.FAM: return 'FAM';
    case ChannelType.ROX: return 'ROX';
    default:
      return 'FAM & ROX';
  }
};

const getBorderColor = (idx: number) => {
  switch (idx) {
    // FAM
    case 0:
      return 'red';
    case 1:
      return 'orange';
    case 2:
      return 'black';
    case 3:
      return 'green';
    case 4:
      return 'blue';
    // ROX, if display all
    case 5:
      return 'brown';
    case 6:
      return 'gray';
    case 7:
      return 'pink';
    case 8:
      return 'olive';
    case 9:
      return 'purple';
    default:
      return 'magenta';
  }
};

const SensorColors = Array.from(Array(10).keys()).map(getBorderColor);

const exportCsv = (values: Map<Date, number[]>, fileName = 'SensorValues.csv') => {
  const contents: string[] = ['no,time,fam-1,fam-2,fam-3,fam-4,fam-5,rox-1,rox-2,rox-3,rox-4,rox-5'];
  let no = 1;
  values.forEach((value, time) => {
    const timestamp = DateHelper.formatDateToString('YYYY_MM_DD_H_M_S_MS', time);
    const content: (string | number)[] = [no, timestamp, ...value];
    contents.push(content.map((c, i) => {
      const isValueRecord = i > 1;
      if (isValueRecord && typeof c === 'number') {
        return c.toFixed(3);
      }
      return c;
    }).join(','));
    no += 1;
  });
  UrlHelper.downloadFile(contents.join('\r\n'), fileName, 'text/plain');
};

const useActiveIndexes = (source: any[], activeIndexes: number[]) => {
  return source.filter((_, i) => activeIndexes.indexOf(i) >= 0);
};

const toggleActiveSeries = (activeSeries: number[], search: number | number[], active: boolean) => {
  const indexArr = typeof search === 'number' ? [search] : search;
  for (let i = 0; i < indexArr.length; i += 1) {
    const index = indexArr[i];
    const indexOf = activeSeries.indexOf(index);
    if (active && indexOf >= 0) {
      continue;
    }
    if (active && indexOf < 0) {
      activeSeries.push(index);
    } else if (!active && indexOf >= 0) {
      activeSeries.splice(indexOf, 1);
    }
  }
  return activeSeries;
};

const getMaxCyclePeakValue = (cyclePeaks: CyclePeak[][]) => {
  if (!cyclePeaks) {
    return 0;
  }
  return Math.max(...cyclePeaks.flat().map((c) => c.value));
};

const SensorChartHelper = {
  createChannelData,
  createChartLabels,
  getModeIndex,
  getModeLabel,
  exportCsv,
  withActiveIndexes: useActiveIndexes,
  toggleActiveSeries,
  SensorColors,
  getMaxCyclePeakValue,
};

export default SensorChartHelper;
