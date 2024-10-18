import { resolve } from 'inversify-react';
import CpanelUpdate from '../../models/CpanelUpdate';
import CPanelService from '../../services/CPanelService';
import ControlledComponent from './ControlledComponent';

export default abstract class CpanelUpdateAwareComponent<P, S> extends ControlledComponent<P, S> {
  @resolve(CPanelService)
  protected cpanelService: CPanelService;

  abstract get name(): string;

  componentDidMount() {
    this.cpanelService.subscribeCpanelUpdate(this.name, this.onCpanelUpdate);
  }
  componentWillUnmount() {
    this.cpanelService.unsubscribeCpanelUpdate(this.name);
  }

  abstract onCpanelUpdate(update: CpanelUpdate): any;
}
