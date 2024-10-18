import { inject, injectable } from 'inversify';
import RestClient from '../../api/RestClient';
import config from '../../config';
import { LogType } from '../../enums/LogType';
import IGetParamsTable from '../../interfaces/IGetParamsTable';
import IRecordResult from '../../interfaces/IRecordResult';
import ProtocolModel from '../../models/protocol/ProtocolModel';
import ExperimentDetail from '../../models/report/ExperimentDetail';
import HistoryRecord from '../../postProcess/HistoryRecord';
import ReportModel from '../../postProcess/ReportModel';
import PostProcessService from '../PostProcessService';
import DialogService from './../DialogService';

const logSuffix = new Map<LogType, string>();
logSuffix.set(LogType.SequenceContent, 'protocol.yml');
logSuffix.set(LogType.SequenceLog, 'sequence.txt');
logSuffix.set(LogType.Report, 'report.json');
logSuffix.set(LogType.Sensor, 'sensor.csv');
logSuffix.set(LogType.DeviceConfig, 'device.json');

const reportUrl = `${config.SERVICE_HOST}api/post-process/reports`;

@injectable()
export default class PostProcessServiceImpl extends PostProcessService {
  @inject(RestClient)
  private api: RestClient;
  @inject(DialogService)
  private dialog: DialogService;

  getReport(id: string) {
    id = encodeURIComponent(id);
    const apiPath = `${config.SERVICE_HOST}api/post-process/reports/${id}`;
    return new Promise<ReportModel>((resolve, reject) => {
      this.api.get<ReportModel>(apiPath, true, 'Opening report...')
        .then((report) => {
          if (report.profile) {
            report.profile = ProtocolModel.fromJson(report.profile);
          }
          this.sortPostProcess(report);
          resolve(report);
        })
        .catch(reject);
    });
  }
  getExperimentDetail = (id: string) => {
    id = encodeURIComponent(id);
    const apiPath = `${config.SERVICE_HOST}api/post-process/experiment-detail/${id}`;
    return this.api.get<ExperimentDetail>(apiPath, true, 'Opening report...');
  }
  getReports(params: IGetParamsTable<ReportModel>) {
    const { page: pageNumber, limit: pageSize, order: orderBy, orderDesc, searchTerm } = params;
    const apiPath = `${reportUrl}?page=${pageNumber}&limit=${pageSize}&order=${orderBy}&orderDesc=${orderDesc}&search=${searchTerm}`;
    return this.api.get<IRecordResult<HistoryRecord>>(apiPath, false);
  }
  delete(id: string): Promise<any> {
    id = encodeURIComponent(id);
    const apiPath = `${reportUrl}/${id}`;
    return this.api.delete<any>(apiPath, true, 'Deleting report...');
  }
  deleteAll(selectedIds: string[]) {
    const ids = selectedIds.map((id) => {
      return `ids=${encodeURIComponent(id)}`;
    });
    const apiPath = `${reportUrl}/delete-multiple?${ids.join('&')}`;
    return this.api.delete<any>(apiPath, true, 'Deleting report...');
  }
  download(runId: string) {
    runId = encodeURIComponent(runId);
    const apiPath = `${reportUrl}/download/${runId}`;
    window.open(apiPath, 'Downloading report');
  }
  downloadLog(runId: string, type: LogType) {
    const apiPath = `${config.SERVICE_HOST}api/post-process/logs/${encodeURIComponent(runId)}?type=${type}`;
    const logName = `${runId}+${logSuffix.get(type)}`;
    this.api.downloadGetNamed(apiPath, logName, 'Downloading report...')
      .then(null)
      .catch(this.dialog.alertError);
  }
  downloadAll(runIdentifiers: string[]) {
    const ids = runIdentifiers.map((id) => {
      return `ids=${encodeURIComponent(id)}`;
    });
    const apiPath = `${reportUrl}/download-multiple?${ids.join('&')}`;
    const fileName = `${runIdentifiers.length} Reports.zip`;
    this.api.downloadGetNamed(apiPath, fileName, 'Downloading report...')
      .then(null)
      .catch(this.dialog.alertError);
  }

  sortPostProcess = (report: ReportModel) => {
    const { amplification, melting } = report.postProcess;
    amplification.sort((a, b) => a.channel.sensorId - b.channel.sensorId);
    if (melting) {
      melting.sort((a, b) => a.channel.sensorId - b.channel.sensorId);
    }
  }
}
