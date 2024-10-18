import { injectable } from 'inversify';
import IGetParamsTable from '../interfaces/IGetParamsTable';
import RecordResult from '../interfaces/IRecordResult';
import ProtocolModel from '../models/protocol/ProtocolModel';

@injectable()
export default abstract class ProtocolService {
  abstract getProtocols(params: IGetParamsTable<ProtocolModel>): Promise<RecordResult<ProtocolModel>>;
  abstract getDefault(): Promise<ProtocolModel>;
  abstract read(name: string): Promise<ProtocolModel>;
  abstract getActiveProtocol(): Promise<ProtocolModel>;
  abstract update(name: string, model: ProtocolModel): Promise<ProtocolModel>;
  abstract create(model: ProtocolModel, seqFiles?: FileList): Promise<ProtocolModel>;
  abstract activate(name: string): Promise<any>;
  abstract delete(name: string): Promise<any>;
  abstract deleteAll(selectedItems: ProtocolModel[]): Promise<any>;
  abstract isExist(templateName: string): Promise<any>;
}
