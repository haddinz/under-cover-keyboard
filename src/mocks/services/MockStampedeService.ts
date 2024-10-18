import { injectable } from 'inversify';
import IGetParamsTable from '../../interfaces/IGetParamsTable';
import IRecordResult from '../../interfaces/IRecordResult';
import CyclePeak from '../../models/CyclePeak';
import ProtocolModel from '../../models/protocol/ProtocolModel';
import SequenceFile from '../../models/SequenceFile';
import ServiceResponse from '../../models/ServiceResponse';
import ReportModel from '../../postProcess/ReportModel';
import RunTestApi from '../../services/RunTestApi';

@injectable()
export default class MockStampedeService extends RunTestApi {
  checkAvailability(): Promise<string> {
    return Promise.resolve('available');
  }
  getReportModel(peaks: CyclePeak[][]): ReportModel {
    return Object.assign({});
  }
  private _pcrProfile = ProtocolModel.default();
  patchSequenceTemplate(...items: { path: string; value: any; }[]): Promise<ProtocolModel> {
    return Promise.resolve(this._pcrProfile);
  }
  getPcrProfile(): Promise<ProtocolModel> {
    return Promise.resolve(this._pcrProfile);
  }
  updatePcrProfile(model: ProtocolModel): Promise<ProtocolModel> {
    this._pcrProfile = model;
    return Promise.resolve(this._pcrProfile);
  }
  getSavedSequences(params: IGetParamsTable<SequenceFile>): Promise<IRecordResult<SequenceFile>> {
    const res: IRecordResult<SequenceFile> = {
      items: [
        new SequenceFile(),
        new SequenceFile(),
        new SequenceFile(),
      ],
      limit: params.limit,
      order: params.order,
      orderDesc: params.orderDesc,
      page: params.page,
      totalData: 3.
    };
    return Promise.resolve(res);
  }
  
  directRun(runId: string, protocol: string): Promise<any> {
    return Promise.resolve();
  }
  abortSequence(): Promise<any> {
    return Promise.resolve();
  }
  protocolExist(name: string): Promise<ServiceResponse<boolean>> {
    return Promise.resolve(new ServiceResponse<boolean>(false));
  }
  ensureUniqueId(runId: string): Promise<ServiceResponse<string>> {
    return Promise.resolve(new ServiceResponse<string>(''));
  }
}
