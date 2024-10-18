import ChannelType from '../../../../enums/ChannelType';
import ArrayHelper from '../../../../helper/ArrayHelper';

const toggleActiveSeries = (active: boolean, activeSeries: number[], indexes: number[]) => {
  const newSeries = [...activeSeries];
  for (let i = 0; i < indexes.length; i += 1) {
    const index = indexes[i];
    const foundIndex = newSeries.indexOf(index);
    const exist = foundIndex >= 0;
    if (!active && exist) {
      newSeries.splice(foundIndex, 1);
    } else if (active && !exist) {
      newSeries.push(index);
    }
  }
  newSeries.sort((a, b) => { return a < b ? -1 : 1; });
  return newSeries;
};

const channelIndexes = new Map<ChannelType, number[]>();
channelIndexes.set(ChannelType.FAM, [0, 1, 2, 3, 4]);
channelIndexes.set(ChannelType.ROX, [5, 6, 7, 8, 9]);

const toActiveChannels = (indexes: number[]) => {
  const map = new Map<ChannelType, boolean>();
  map.set(ChannelType.FAM, ArrayHelper.containsAll(indexes, channelIndexes.get(ChannelType.FAM)));
  map.set(ChannelType.ROX, ArrayHelper.containsAll(indexes, channelIndexes.get(ChannelType.ROX)));
  return map;
};

const analyticalReportHelper = {
  toggleActiveSeries,
  toActiveChannels,
  channelIndexes,
};

export default analyticalReportHelper;
