import ChannelType from "../../../../enums/ChannelType";

export default interface AnalyticalDetaiItem {
  index: number;
  label: string;
  ct: number;
  amp: number;
  channelType: ChannelType;
  // preMeltValue: number;
  // postMeltValue: number;
  meltTemp: number[];
};
