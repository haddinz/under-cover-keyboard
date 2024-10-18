import { resolve } from 'inversify-react';
import React, { Component } from 'react';
import ElementHelper from '../../../helper/ElementHelper';
import ToolTipComponent from '../../tooltip/ToolTipComponent';
import UIEventService from './../../../services/UIEventService';

type State = {
  width: string,
  isOverflow: boolean,
}

const ID_ACTIVE_PROTOCOL_LABEL = 'active-protocol-label';
const ID_DASHBOARD_TOP = 'dashboard-top';
const ID_DEBUG_PAGE_BTN = 'debug-page-btn-wrapper';

export default class ActiveProtocolLabel extends Component<{ activeProtocol: string | null }, State> {
  @resolve(UIEventService)
  private eventService: UIEventService;
  constructor(props) {
    super(props);
    this.state = {
      width: '10%',
      isOverflow: false,
    };
  }
  componentDidMount() {
    this.eventService.onResize.add(ID_ACTIVE_PROTOCOL_LABEL, this.onResize);
    this.onResize();
  }
  componentDidUpdate() {
    this.onResize();
  }
  componentWillUnmount() {
    this.eventService.onResize.remove(ID_ACTIVE_PROTOCOL_LABEL);
  }
  onResize = () => {
    const view = document.getElementById(ID_ACTIVE_PROTOCOL_LABEL);
    if (!view) {
      return;
    }
    const overflow = ElementHelper.isXOverflow(view, -5);
    const { isOverflow } = this.state;
    if (overflow !== isOverflow) {
      this.setState({ isOverflow: overflow }, this.updateWidth);
    } else {
      this.updateWidth();
    }
  }
  updateWidth = () => {
    const { width } = this.state;
    const debugBtnWidth = document.getElementById(ID_DEBUG_PAGE_BTN)?.clientWidth ?? 0;
    const dashboardTopWidth = document.getElementById(ID_DASHBOARD_TOP)?.clientWidth ?? 0;
    const newWidth = `${dashboardTopWidth - debugBtnWidth}px`;
    if (newWidth !== width) {
      this.setState({ width: newWidth });
    }
  }
  render() {
    const { activeProtocol } = this.props;
    const { isOverflow, width } = this.state;
    const label = <div className="tooltip-dark active-protocol-tooltip px-2 py-2">Active Protocol: {activeProtocol}</div>;
    return (
      <div className={isOverflow ? 'isOverflow' : 'not-isOverflow'} style={{ width: `${width}`, cursor: isOverflow ? 'pointer' : 'auto' }}>
        <ToolTipComponent tooltip={label} disabled={!isOverflow} position="start">
          <div id={ID_ACTIVE_PROTOCOL_LABEL} className="common-text-overflow">
            <span className="regular-label no-wrap">Active Protocol:</span>
            <span className="ms-2 regular-label-bold">{activeProtocol ?? '-'}</span>
          </div>
        </ToolTipComponent>
      </div>
    );
  }
}
