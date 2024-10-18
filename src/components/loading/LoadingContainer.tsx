import { resolve } from 'inversify-react';
import React, { Component } from 'react';
import { invokeLater } from '../../helper/EventHelper';
import LoadingService from '../../services/LoadingService';
import LoadingScreen from './LoadingScreen';

const TRANS_DURATION = 300;
type State = {
  open: boolean,
  opacity: number,
  label: string | undefined,
}

class LoadingContainer extends Component<any, State> {
  @resolve(LoadingService)
  private service: LoadingService;
  private isStopping = false;
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      label: undefined,
      opacity: 0,
    };
  }
  componentDidMount() {
    this.service.onStartLoading = this.start;
    this.service.onStopLoading = this.stop;
  }
  start = (label?: string) => {
    this.isStopping = false;
    this.setState({ open: true, opacity: 1, label });
  };
  stop = () => {
    this.setState({ opacity: 0 }, this.hideComponent);
  }
  hideComponent = () => {
    this.isStopping = true;
    invokeLater(() => {
      if (!this.isStopping) {
        return;
      }
      this.setState({ open: false });
    }, TRANS_DURATION);
  }
  render() {
    const { opacity, open, label } = this.state;
    return (
      <LoadingScreen
        transitionDuration={TRANS_DURATION}
        opacity={opacity}
        show={open}
        label={label}
      />
    );
  }
}

export default LoadingContainer;
