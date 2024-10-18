import { resolve } from 'inversify-react';
import React from 'react';
import { TempControlContext } from '../../../../context/contexes';
import TempControllerId from '../../../../enums/TempControllerId';
import CpanelUpdate, { TemperatureProperty } from '../../../../models/CpanelUpdate';
import { DefaultServiceResponse } from '../../../../models/ServiceResponse';
import DialogService from '../../../../services/DialogService';
import CpanelUpdateAwareComponent from '../../../base/CpanelUpdateAwareComponent';
import { StampedeSwitch } from '../../../FmlxUi';
import './LedHeaterControl.scss';
import PcrTempSetting from './PcrTempSetting';

type State = {
  cpanelUpdate: CpanelUpdate;
  targetTempModel: TemperatureProperty<string>,
}

const defaultTargetTemp = () => {
  const target = new TemperatureProperty<string>();
  target.pcr1 = (0).toString();
  target.pcr2 = (0).toString();
  return target;
};

export default class LedHeaterControl extends CpanelUpdateAwareComponent<any, State> {
  @resolve(DialogService)
  private dialog: DialogService;
  private targetTempSync = false;
  constructor(props: any) {
    super(props);
    this.state = {
      cpanelUpdate: CpanelUpdate.defaultUpdate(),
      targetTempModel: defaultTargetTemp(),
    };
  }
  componentDidMount(): void {
    super.componentDidMount();
  }
  componentWillUnmount(): void {
    super.componentWillUnmount();
  }
  get name() { return 'LedHeaterControl'; }
  onCpanelUpdate = (cpanelUpdate: CpanelUpdate) => {
    if (this.targetTempSync) {
      this.setState({ cpanelUpdate });
    } else {
      this.targetTempSync = true;
      const { targetTempModel } = this.state;
      targetTempModel.pcr1 = cpanelUpdate.targetTemperature.pcr1.toFixed(1);
      targetTempModel.pcr2 = cpanelUpdate.targetTemperature.pcr2.toFixed(1);
      this.setState({
        cpanelUpdate,
        targetTempModel,
      });
    }
  }
  commonServiceCall = (action: Promise<DefaultServiceResponse>) => {
    action.then(null).catch(this.dialog.alertError);
  }
  togglePcr = (id: TempControllerId, enabled: boolean) => {
    this.commonServiceCall(this.cpanelService.setTempController(id, enabled));
  }
  toggleLed = (enabled: boolean) => {
    this.commonServiceCall(this.cpanelService.SetLedController(enabled));
  }
  setTemperatureTarget = (id: TempControllerId, target: string) => {
    const targetNumber = parseFloat(target);

    if (!isNaN(targetNumber)) {
      this.cpanelService.setTempControllerTarget(id, targetNumber)
        .then(() => this.onTemperatureTargetSet(id, targetNumber))
        .catch((e) => this.onTemperatureTargetNotSet(e, id));
    }
  }
  onTemperatureTargetNotSet = (e: any, id: TempControllerId) => {
    this.dialog.alertError(e);
    const { targetTemperature } = this.state.cpanelUpdate;
    const { targetTempModel } = this.state;
    targetTempModel.setValue(id, targetTemperature.getValue(id).toFixed(1));
    this.setState({ targetTempModel });
  }
  onTemperatureTargetSet = (id: TempControllerId, target: number) => {
    const { targetTempModel } = this.state;
    targetTempModel.setValue(id, target.toFixed(1));
    this.setState({ targetTempModel });
  }
  render() {
    const { temperatureEnabled, ledEnabled } = this.state.cpanelUpdate;
    const { targetTempModel } = this.state;
    const { PCR1, PCR2 } = TempControllerId;
    const CtxProvider = TempControlContext.Provider;
    const contextVal = { togglePcr: this.togglePcr, setTemperature: this.setTemperatureTarget };
    const rowClassName = 'flex-common-x-start led-heater-control-row';
    return (
      <div className="w-100">
        <div className={rowClassName}>
          <LedSetting label="LED 1" enabled={ledEnabled} onClick={this.toggleLed} />
          <CtxProvider value={contextVal}>
            <PcrTempSetting
              id={PCR1}
              label="PCR 1"
              enabled={temperatureEnabled.pcr1}
              target={targetTempModel.pcr1}
            />
          </CtxProvider>
        </div>
        <div className={rowClassName}>
          <LedSetting label="LED 2" enabled={ledEnabled} onClick={this.toggleLed} />
          <CtxProvider value={contextVal}>
            <PcrTempSetting
              id={PCR2}
              label="PCR 2"
              enabled={temperatureEnabled.pcr2}
              target={targetTempModel.pcr2}
            />
          </CtxProvider>
        </div>
      </div>
    );
  }
}

const LedSetting: React.FC<{
  label: string, enabled: boolean, onClick: (value: boolean) => any
}> = function LedSetting({ label, enabled, onClick }) {
  return (
    <div className="me-5 pe-5 no-wrap flex-common">
      <span className="led-heater-control-label me-3">{label}</span>
      <StampedeSwitch onChange={onClick} checked={enabled} size="lg" withIcon />
    </div>
  );
};
