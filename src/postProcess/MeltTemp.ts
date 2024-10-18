import ChannelType from '../enums/ChannelType';

export default class MeltTemp {
  public readonly label: string;
  constructor(public sensorIndex: number, public channelType: ChannelType, public tm: number) {
    const chIndex = channelType === ChannelType.FAM ? sensorIndex : sensorIndex - 5;
    this.label = `${channelType}-${chIndex}`;
  }
}
