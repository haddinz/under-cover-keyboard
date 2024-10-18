import { injectable } from 'inversify';

@injectable()
export default abstract class RunTestApi {
  abstract directRun(runId: string, protocol: string): Promise<any>;
  abstract abortSequence(runId: string): Promise<string>;
  abstract ensureUniqueId(runId: string): Promise<any>;
  abstract checkAvailability(): Promise<string>;
}
