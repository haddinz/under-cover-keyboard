import RfuColumnRecord from './RfuColumnRecord';

export default interface LivePeakResponse {
  identifier: string;
  peakType: 'Maximum' | 'Average';
  numberOfCycle: number;
  rfuColumnRecords: RfuColumnRecord[];
}
