import { injectable } from 'inversify';
import IGetParamsTable from '../interfaces/IGetParamsTable';
import ReportModel from '../postProcess/ReportModel';
import RecordResult from '../interfaces/IRecordResult';
import HistoryRecord from '../postProcess/HistoryRecord';
import { LogType } from '../enums/LogType';
import ExperimentDetail from '../models/report/ExperimentDetail';

@injectable()
export default abstract class PostProcessService {
  abstract getReport(id: string) : Promise<ReportModel>;
  abstract getReports(params: IGetParamsTable<ReportModel>): Promise<RecordResult<HistoryRecord>>;
  abstract delete(id: string): Promise<any>;
  abstract deleteAll(selectedIds: string[]): Promise<any>;
  abstract download(runId: string): any;
  abstract downloadAll(selectedIds: string[]): any;
  abstract downloadLog(id: string, type: LogType): any;
  abstract getExperimentDetail(id: string) : Promise<ExperimentDetail>;
}
