import CycleColumnRecord from '../models/report/CycleColumnRecord';
import RfuChannelInfo from '../models/report/RfuChannelInfo';
import ArrayHelper from './ArrayHelper';

const csvHeader = ArrayHelper.create(0, 10, (i) => { return i < 5 ? `Fam-${i}` : `Rox-${i - 5}`; }).join(',');
const getCsvContent = (peaks: CycleColumnRecord<RfuChannelInfo>[]) => {
  const rows = Math.max(...peaks.map((c) => c.values.length)) + 1;
  const cols = peaks.length;
  const content: string[] = [csvHeader];
  for (let row = 0; row < rows; row += 1) {
    const rowContent: any[] = [];
    for (let col = 0; col < cols; col += 1) {
      const colContent = peaks[col];
      if (colContent && colContent.values[row]) {
        rowContent.push(colContent.values[row]);
      }
    }
    content.push(rowContent.join(','));
  }
  return content.join('\r\n');
};

const peakDataHelper = {
  getCsvContent,
};

export default peakDataHelper;
