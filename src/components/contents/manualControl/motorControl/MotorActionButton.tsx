import React, { Component } from 'react';
import { invokeLater } from '../../../../helper/EventHelper';

const MIN_HOLD_DURATION_MS = 200;
const WATCH_INTERVAL = 10;

interface Props {
  disabled: boolean,
  onClick: () => any,
  onMouseDown: () => any,
  onMouseUp: () => any,
  children: any,
  type: string,
  className: string,
}

export default class MotorActionButton extends Component<Props, any> {
  private isMouseDown = false;
  private lastMouseDown = new Date();

  componentDidMount() {
    this.watchMouseEvent();
  }

  watchMouseEvent = () => {
    const now = new Date();
    const holdDuration = now.getTime() - this.lastMouseDown.getTime();

    if (this.isMouseDown && holdDuration > MIN_HOLD_DURATION_MS && this.props.onMouseDown) {
      this.props.onMouseDown();
      this.isMouseDown = false;
    }
    invokeLater(this.watchMouseEvent, WATCH_INTERVAL);
  }

  onMouseDown = () => {
    this.isMouseDown = true;
    this.lastMouseDown = new Date();
  }

  onMouseUp = () => {
    this.isMouseDown = false;
    const now = new Date();
    const holdDuration = now.getTime() - this.lastMouseDown.getTime();

    if (holdDuration <= MIN_HOLD_DURATION_MS && this.props.onClick) {
      this.props.onClick();
    } else if (this.props.onMouseUp) {
      this.props.onMouseUp();
    }
  }

  render() {
    const { className, type, disabled, children } = this.props;
    const isSubmit = type === 'submit';
    if (disabled) {
      return (
        <button type="button" className={className} disabled>
          {children}
        </button>
      );
    }
    return (
      <button type={isSubmit ? 'submit' : 'button'} className={className} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp}>
        {children}
      </button>
    );
  }
}
