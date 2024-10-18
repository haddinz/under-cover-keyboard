import RfuChannelInfo from "../models/report/RfuChannelInfo";

export default interface PostProcessDataSet {
  amplification: AmplificationRecord[];
  melting?: MeltingRecord[];
}

interface AmplificationRecord {
  channel: RfuChannelInfo;
  spe: number;
  sdm: number;
  ct: number;
  amplified: boolean;
  metadata: any;
}
interface MeltingRecord {
  channel: RfuChannelInfo;
  t: number[];
  dfDt: number[];
  tm: number[];
}
