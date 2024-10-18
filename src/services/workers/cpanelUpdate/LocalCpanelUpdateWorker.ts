import { inject, injectable } from 'inversify';
import CPanelService from '../../CPanelService';
import CpanelUpdateWorker from './CpanelUpdateWorker';

@injectable()
export default class LocalCpanelUpdateWorker extends CpanelUpdateWorker {
  @inject(CPanelService)
  private service: CPanelService;

  get name() { return 'local-cpanel-update'; }
  start(): void {
    this.init();
    this.subscribeUpdate();
  }
  stop(): void {
    this.unsubscribeUpdate();
  }
  private unsubscribeUpdate = () => {
    this.service.unsubscribeCpanelUpdate(this.name);
  }
  private init = () => {
    this.service.subscribeOnDisconnect(this.name, this.unsubscribeUpdate);
  }
  private subscribeUpdate = () => {
    this.service.subscribeCpanelUpdate(this.name, this.invokeListener);
  }
}
