import { resolve } from 'inversify-react';
import React, { Component, CSSProperties } from 'react';
import DialogService from '../../services/DialogService';
import PositionFormat from './PositionFormat';
import './ToolTipContainer.scss';

type State = {
  show: boolean;
  content: any;
  style: CSSProperties;
  className: string;
}

export default class ToolTipContainer extends Component<any, State> {
  @resolve(DialogService)
  private dialog: DialogService;
  private tooltipRef = React.createRef<HTMLDivElement>();

  private posFormat: PositionFormat;
  private elementRect?: DOMRect;

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      content: '',
      style: {},
      className: '',
    };
    this.posFormat = {};
  }
  componentDidMount() {
    this.dialog.onShowTooltip = this.show;
    this.dialog.onHideTooltip = this.hide;
  }
  private show = (
    refEl: string | HTMLElement,
    content: any,
    className: string,
    formatStyle: (s: CSSProperties, rect: DOMRect, el?: HTMLElement) => void,
    posFormat?: PositionFormat,
  ) => {
    const el = typeof refEl === 'string' ? document.getElementById(refEl) : refEl;
    if (!el) {
      return;
    }
    const style: CSSProperties = {};
    this.elementRect = el.getBoundingClientRect();
    formatStyle(style, this.elementRect, el);

    this.posFormat.left = posFormat?.left;
    this.posFormat.top = posFormat?.top;
    this.posFormat.bottom = posFormat?.bottom;
    this.posFormat.right = posFormat?.right;

    this.setState({ show: true, style, content, className }, this.formatStyle);
  }
  private hide = () => {
    this.elementRect = undefined;
    this.setState({ show: false, content: undefined, className: '', style: {} });
  }
  formatStyle = () => {
    const tooltipRect = this.tooltipRef.current?.getBoundingClientRect();
    if (!tooltipRect || !this.elementRect) {
      return;
    }
    const { style: stStyle } = this.state;
    // Prevent error not extensible object
    const style = { ...stStyle };
    const fmt = this.posFormat;
    if (fmt.top) {
      style.top = fmt.top(this.elementRect, tooltipRect);
    }
    if (fmt.right) {
      style.right = fmt.right(this.elementRect, tooltipRect);
    }
    if (fmt.bottom) {
      style.bottom = fmt.bottom(this.elementRect, tooltipRect);
    }
    if (fmt.left) {
      style.left = fmt.left(this.elementRect, tooltipRect);
    }
    this.setState({ style });
  }
  render() {
    const { show, content, style, className } = this.state;
    if (!show) {
      return null;
    }
    return (
      <div ref={this.tooltipRef} className={`custom-tooltip ${className}`} style={style}>
        {content}
      </div>
    );
  }
}
