import ChannelType from '../../enums/ChannelType';

export default interface RfuChannelInfo {
  channelType: ChannelType;
  channelId: number;
  sensorId: number;
}
