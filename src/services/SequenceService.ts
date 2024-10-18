import { injectable } from 'inversify';
import SequenceFile from '../models/SequenceFile';

@injectable()
export default abstract class SequenceService {
  abstract getSequences(protocol: string): Promise<SequenceFile[]>;
  abstract getDefaultSequences(): Promise<SequenceFile[]>;
  abstract upload(protocol: string, files: FileList): Promise<string>;
  abstract delete(name: string): Promise<any>;
  abstract download(protocol: string, sequence: string): any;
  abstract downloadAll(protocol: string, sequences: string[]): Promise<any>;
  abstract downloadDefaultAll(sequences: string[]): Promise<any>;
  abstract deleteAll(protocol: string, sequences: string[]): Promise<any>;
}
