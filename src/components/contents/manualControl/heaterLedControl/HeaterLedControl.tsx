import { resolve } from 'inversify-react';
import React from 'react';
import ArrayHelper from '../../../../helper/ArrayHelper';
import CpanelUpdate from '../../../../models/CpanelUpdate';
import CPanelService from '../../../../services/CPanelService';
import { StampedeSwitch } from '../../../FmlxUi';
import './HeaterLedControl.scss';

type State = {
  update: CpanelUpdate;
}

const VIEW_NAME = 'heater-leds-control';
const ledIndexes = ArrayHelper.create(0, 5, (i) => i);

export default class HeaterLedControl extends React.Component<any, State> {
  @resolve(CPanelService)
  private service: CPanelService;
  constructor(props) {
    super(props);
    this.state = {
      update: CpanelUpdate.defaultUpdate(),
    };
  }
  componentDidMount() {
    this.service.subscribeCpanelUpdate(VIEW_NAME, this.onCPanelUpdate);
  }
  componentWillUnmount() {
    this.service.unsubscribeCpanelUpdate(VIEW_NAME);
  }
  onCPanelUpdate = (update: CpanelUpdate) => this.setState({ update });
  setEnable = (index: number, enable: boolean) => this.service.SetHeaterLedEnable(index, enable);
  render() {
    const { heaterLedPwmDutyValues } = this.state.update;
    return (
      <div className="px-2" style={{ marginTop: '-1.3rem' }}>
        <div className="heater-led-title">Heater Led</div>
        <div className="flex-common-x-start py-3">
          {ledIndexes.map((i) => {
            return (
              <div key={`slug-adjuster-${i}`}>
                <ControlItem
                  index={i}
                  value={heaterLedPwmDutyValues[i]}
                  onClick={this.setEnable}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const ControlItem: React.FC<{
  index: number, value: number, onClick(index: number, enable: boolean): any
}> = function ControlItem({ index, value, onClick }) {
  const enabled = value > 0;
  const click = () => onClick(index, !enabled);
  return (
    <div className="me-5 no-wrap flex-common">
      <span title={`Value: ${value}`} className="led-heater-control-label me-3">Ch {index}</span>
      <StampedeSwitch onChange={click} checked={enabled} size="lg" withIcon />
    </div>
  );
};
