import { inject, injectable } from 'inversify';
import RestClient from '../../api/RestClient';
import config from '../../config';
import IGetParamsTable from '../../interfaces/IGetParamsTable';
import IRecordResult from '../../interfaces/IRecordResult';
import ServiceResponse from '../../models/ServiceResponse';
import ProtocolModel from '../../models/protocol/ProtocolModel';
import ProtocolService from '../ProtocolService';

@injectable()
export default class ProtocolServiceImpl extends ProtocolService {
  @inject(RestClient)
  private api: RestClient;

  getProtocols = (params: IGetParamsTable<ProtocolModel>) => {
    const { page: pageNumber, limit: pageSize, order: orderBy, orderDesc, searchTerm } = params;
    const apiPath = `${config.SERVICE_HOST}api/protocols?page=${pageNumber}&limit=${pageSize}&order=${orderBy}&orderDesc=${orderDesc}&search=${searchTerm}`;
    return new Promise<IRecordResult<ProtocolModel>>((resolve, reject) => {
      this.api.get<IRecordResult<ProtocolModel>>(apiPath, false)
        .then((resp) => {
          resp.items = resp.items.map(ProtocolModel.fromJson);
          resolve(resp);
        })
        .catch(reject);
    });
  }
  read = (name: string) => {
    const apiPath = `${config.SERVICE_HOST}api/protocols/read/${encodeURIComponent(name)}`;
    return new Promise<ProtocolModel>((resolve, reject) => {
      this.api.get<ProtocolModel>(apiPath, true, 'Editing protocol...')
        .then((resp) => resolve(ProtocolModel.fromJson(resp)))
        .catch(reject);
    });
  }
  getActiveProtocol = () => {
    const apiPath = `${config.SERVICE_HOST}api/protocols/active`;
    return new Promise<ProtocolModel>((resolve, reject) => {
      this.api.get<ProtocolModel>(apiPath, true, 'Loading active protocol...')
        .then((resp) => resolve(ProtocolModel.fromJson(resp)))
        .catch(reject);
    });
  }
  getDefault = () => {
    const apiPath = `${config.SERVICE_HOST}api/protocols/default`;
    return new Promise<ProtocolModel>((resolve, reject) => {
      this.api.get<ProtocolModel>(apiPath, true, 'Opening protocol...')
        .then((resp) => resolve(ProtocolModel.fromJson(resp)))
        .catch(reject);
    });
  }
  update = (name: string, model: ProtocolModel) => {
    const payload = model.toPlainJson();
    const apiPath = `${config.SERVICE_HOST}api/protocols/${encodeURIComponent(name)}`;
    return new Promise<ProtocolModel>((resolve, reject) => {
      this.api.put<ProtocolModel>(apiPath, payload, true, 'Saving protocol...')
        .then((resp) => resolve(ProtocolModel.fromJson(resp)))
        .catch(reject);
    });
  }
  create = async (model: ProtocolModel, seqFiles?: FileList) => {
    const payload = model.toPlainJson();
    const apiPath = `${config.SERVICE_HOST}api/protocols`;

    // Append sequence files
    if (seqFiles && seqFiles.length > 0) {
      const sequenceFiles: any[] = [];
      for (let i = 0; i < seqFiles.length; i += 1) {
        const element = seqFiles[i];
        const content = await readFileContent(element);
        if (content) {
          sequenceFiles.push({ name: element.name, content });
        }
      }
      payload.sequenceFiles = sequenceFiles;
    }

    const resp = await this.api.post<ProtocolModel>(apiPath, payload, true, 'Saving protocol...');
    return ProtocolModel.fromJson(resp);
  }
  activate = (name: string) => {
    const apiPath = `${config.SERVICE_HOST}api/protocols/activate/${encodeURIComponent(name)}`;
    return this.api.post<any>(apiPath, {}, true, 'Activating protocol...');
  }
  delete = (name: string) => {
    const apiPath = `${config.SERVICE_HOST}api/protocols/${encodeURIComponent(name)}`;
    return this.api.delete<any>(apiPath, true, 'Deleting protocols...');
  }
  deleteAll = (selectedItems: ProtocolModel[]) => {
    const names = selectedItems.map((item) => {
      return `names=${encodeURIComponent(item.name)}`;
    });
    const apiPath = `${config.SERVICE_HOST}api/protocols/delete-multiple?${names.join('&')}`;
    return this.api.delete<any>(apiPath, true, 'Deleting protocols...');
  }
  isExist = (name: string) => {
    const apiPath = `${config.SERVICE_HOST}api/protocols/exist/${encodeURI(name)}`;
    return this.api.post<ServiceResponse<boolean>>(apiPath, {}, true, 'Checking protocol Name...');
  }
}

const readFileContent = (file: File): Promise<string | undefined> => {
  return new Promise<string | undefined>((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function () { resolve(reader.result?.toString()); };
      reader.onerror = function (error) {
        reject(error);
      };
    } catch (e) {
      reject(e);
    }
  });
};
