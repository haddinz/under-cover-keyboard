import { inject, injectable } from 'inversify';
import RestClient from '../../api/RestClient';
import config from '../../config';
import SequenceFile from '../../models/SequenceFile';
import DialogService from '../DialogService';
import SequenceService from '../SequenceService';

@injectable()
export default class SequenceServiceImpl extends SequenceService {
  @inject(RestClient)
  private api: RestClient;
  @inject(DialogService)
  private dialog: DialogService;

  getSequences = (protocol: string) => {
    const apiPath = `${config.SERVICE_HOST}api/sequences/template/${protocol}`;
    return this.api.get<SequenceFile[]>(apiPath, false);
  }
  getDefaultSequences = () => {
    const apiPath = `${config.SERVICE_HOST}api/sequences/template-default`;
    return this.api.get<SequenceFile[]>(apiPath, false);
  }
  upload = (protocol: string, files: FileList) => {
    const apiPath = `${config.SERVICE_HOST}api/sequences/upload`;

    const data = new FormData();
    data.append('protocol', protocol);
    if (files.length > 0) {
      for (let x = 0; x < files.length; x += 1) {
        data.append('sequences', files[x]);
      }
    }

    return this.api.post<string>(apiPath, data, true, 'Uploading protocol...');
  }
  delete = (name: string) => {
    const apiPath = `${config.SERVICE_HOST}api/sequences/${encodeURIComponent(name)}`;
    return this.api.delete<any>(apiPath, true, 'Deleting protocol...');
  }
  download = (protocol: string, sequence: string) => {
    const apiPath = `${config.SERVICE_HOST}api/sequences/download/protocol/${protocol}/template/${encodeURIComponent(sequence)}`;
    this.api.downloadGetNamed(apiPath, sequence, 'Downloading protocol...')
      .then(null)
      .catch(this.dialog.alertError);
  }

  downloadAll(protocol: string, sequences: string[]) {
    const data = {
      protocol: protocol,
      sequences: sequences,
    };
    const apiPath = `${config.SERVICE_HOST}api/sequences/download-multiple`;

    return this.api.downloadPostNamed(apiPath, data, 'Sequence.zip', 'Downloading sequences...');
  }

  downloadDefaultAll(sequences: string[]) {
    const apiPath = `${config.SERVICE_HOST}api/sequences/download-default-multiple`;

    return this.api.downloadPostNamed(apiPath, sequences, 'Sequence.zip', 'Downloading sequences...');
  }

  deleteAll(protocol: string, sequences: string[]) {
    const data = {
      protocol: protocol,
      sequences: sequences,
    };
    const apiPath = `${config.SERVICE_HOST}api/sequences/remove-multiple`;

    return this.api.post<string>(apiPath, data, true, 'Removing protocol...');
  }
}
