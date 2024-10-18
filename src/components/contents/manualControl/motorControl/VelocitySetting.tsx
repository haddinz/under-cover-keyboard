import { resolve } from 'inversify-react';
import React, { ChangeEvent, Component, KeyboardEvent, RefObject } from 'react';
import { invokeLater } from '../../../../helper/EventHelper';
import CPanelService from '../../../../services/CPanelService';
import UIEventService from '../../../../services/UIEventService';
import './VelocitySetting.scss';

type State = {
  background: string;
  value: string;
  opacity: number;
  maxVelocity: number;
  minVelocity: number;
}
type Props = {
  value: number,
  onChange: (e: number) => any,
  setOpen: (open: boolean) => any,
}
const PROGRESS_COLOR = '#F7A246';
const TRANSITION_DURATION = 400;

const intersectRectangle = (rect: DOMRect, x: number, y: number) => {
  return (
    x >= rect.x && x <= (rect.x + rect.width) &&
    y >= rect.y && y <= (rect.y + rect.height)
  );
};
const COMPONENT_NAME = 'velocity_setting';

export default class VelocitySetting extends Component<Props, State> {
  @resolve(UIEventService)
  private htmlEventService: UIEventService;
  @resolve(CPanelService)
  private cpanelService: CPanelService;

  private formRef: RefObject<HTMLFormElement> = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      background: '',
      value: '0',
      opacity: 0,
      minVelocity: 1,
      maxVelocity: 1,
    };
  }

  componentDidMount() {
    invokeLater(() => {
      this.htmlEventService.onDocumentClick.add(COMPONENT_NAME, this.handleOnDocumentClick);
      this.setState({ opacity: 1 });
    }, 100);
    this.loadVelocityConstraints();
  }
  componentWillUnmount() {
    this.htmlEventService.onDocumentClick.remove(COMPONENT_NAME);
  }
  get velocityRange() { return this.state.maxVelocity - this.state.minVelocity; }
  loadVelocityConstraints = async () => {
    const response = await this.cpanelService.GetMotorVelocityLimit();
    const { min, max } = response.content;
    const middleValue = min + (max - min) / 2;
    const velocityValue = this.props.value > 0 ? this.props.value : middleValue;

    this.setState({
      maxVelocity: max,
      minVelocity: min,
      value: velocityValue.toFixed(2),
    }, this.initializeStyle);

    this.propsOnChange(velocityValue.toFixed(2));
  }
  validVelocityValue = (val: number) => {
    return val >= this.state.minVelocity && val <= this.state.maxVelocity;
  }
  handleOnDocumentClick = (e: MouseEvent) => {
    if (!this.formRef.current) {
      return;
    }
    const { clientX, clientY } = e;
    const rect = this.formRef.current.getBoundingClientRect();
    if (!intersectRectangle(rect, clientX, clientY)) {
      this.close();
    }
  }
  close = () => {
    this.setState({ opacity: 0 }, () => {
      invokeLater(() => this.props.setOpen(false), TRANSITION_DURATION);
    });
  }
  initializeStyle = () => {
    const { value } = this.props;
    this.updateInputBackground((value / this.state.maxVelocity) * 100);
  }
  updateInputBackground = (value: any) => {
    const diff = value - this.state.minVelocity;
    const percentage = (diff / this.velocityRange) * 100;
    const background = `linear-gradient(to right, ${PROGRESS_COLOR} 0%, ${PROGRESS_COLOR} ${percentage}%, #fff ${percentage}%, #fff 100%)`;
    this.setState({ background });
  }
  onManualInputChange = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    if (!target) {
      return;
    }
    this.propsOnChange(target.value);
  }
  onSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    if (!target) {
      return;
    }
    const number = parseFloat(target.value);
    if (isNaN(number)) {
      return;
    }
    const val = this.state.minVelocity + (number / 100) * this.velocityRange;
    this.propsOnChange((val).toString());
  }
  propsOnChange = (value: string) => {
    this.setState({ value }, () => {
      const number = parseFloat(value);
      if (isNaN(number)) {
        return;
      }
      const valid = this.validVelocityValue(number);
      if (valid) {
        this.props.onChange(number);
        this.updateInputBackground(number);
      }
    });
  }
  onKeyup = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      this.close();
    }
  }
  render() {
    const { value } = this.props;
    const { maxVelocity, minVelocity, opacity } = this.state;
    const silderValue = ((value - minVelocity) / this.velocityRange) * 100;
    return (
      <form
        ref={this.formRef}
        id="form-velocity-setting"
        onSubmit={(e) => e.preventDefault()}
        className="motor-velocity-setting-container"
        style={{
          transitionDuration: `${TRANSITION_DURATION}ms`,
          opacity: opacity,
        }}
      >
        <span className="motor-velocity-input-label">
          Fast
        </span>
        <div className="motor-velocity-input-container">
          <input
            value={silderValue}
            onChange={this.onSliderChange}
            style={{ background: this.state.background }}
            className="motor-velocity-input"
            type="range"
            min={0}
            max={100}
          />
        </div>
        <span className="motor-velocity-input-label motor-velocity-input-label-bottom">
          Slow
        </span>
        <div className="motor-velocity-manual-input-container">
          <input
            className="motor-velocity-manual-input"
            value={this.state.value}
            min={minVelocity}
            max={maxVelocity}
            onChange={this.onManualInputChange}
            step="1"
            onKeyUp={this.onKeyup}
          />
          <span>
            &#176;/s
          </span>
        </div>
      </form>
    );
  }
}
