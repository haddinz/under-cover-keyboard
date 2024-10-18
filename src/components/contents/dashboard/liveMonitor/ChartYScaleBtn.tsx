import React, { Component } from 'react';
import { StampedeButton } from '../../../FmlxUi';
import { invokeLater } from '../../../../helper/EventHelper';

type Props = { onClick(): any, onDoubleClick(): any }

const GLOBAL = {
  doubleClickDuration: 200,
  defaultDate: new Date(1990, 1, 1),
};

export default class ChartYScaleBtn extends Component<Props, any> {
  private lastClick = GLOBAL.defaultDate;
  onClick = () => {
    const now = new Date();
    if (now.getTime() - this.lastClick.getTime() <= GLOBAL.doubleClickDuration) {
      // console.log('DOUBLE CLICK');
      this.props.onDoubleClick();
      this.lastClick = now;
      return;
    }
    this.lastClick = now;
    invokeLater(() => {
      if (new Date().getTime() - this.lastClick.getTime() > GLOBAL.doubleClickDuration) {
        // console.log('SINGLE CLICK');
        this.props.onClick();
        this.lastClick = GLOBAL.defaultDate;
      }
    }, 1.1 * GLOBAL.doubleClickDuration);
  }
  render() {
    return (
      <StampedeButton
        mode="button"
        label="AUTOSCALE-Y"
        type="positive"
        onClick={this.onClick}
      />
    );
  }
}
