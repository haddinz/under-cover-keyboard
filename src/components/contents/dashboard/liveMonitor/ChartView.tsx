import { resolve } from 'inversify-react';
import React from 'react';
import config from '../../../../config';
import ArrayHelper from '../../../../helper/ArrayHelper';
import DateHelper from '../../../../helper/DateHelper';
import { invokeLater, scrollTop } from '../../../../helper/EventHelper';
import SensorChartHelper from '../../../../helper/SensorChartHelper';
import LiveMonitorSeries from '../../../../models/sensorChart/LiveMonitorSeries';
import { TChannelData } from '../../../../models/sensorChart/TChannelData';
import CPanelService from '../../../../services/CPanelService';
import { StampedeButton } from '../../../FmlxUi';
import './ChartView.scss';
import UPlotSensorChart from './UPlotSensorChart';
import ChannelType from '../../../../enums/ChannelType';
import CpanelUpdate from '../../../../models/CpanelUpdate';

const GLOBAL = {
  renderInterval: config.SETTING.CHART_UPDATE_INTERVAL_MS,
  streamInterval: config.SETTING.STREAM_INTERVAL_MS,
  enableLoopIntervalLog: false,
  enableSensorIntervalLog: false,
  streamIntervalDumpSize: 10,
};

const sensorValHelper = SensorChartHelper;
const setting = config.SETTING;
const VIEW_NAME = 'chart-view';
type State = {
  activeChannel: ChannelType,
  recordingValues: boolean,
}

class ChartView extends React.Component<any, State> {
  @resolve(CPanelService)
  private cpanelService: CPanelService;

  // debug stuff
  private loopCounter = 0;
  private streamCounter = 0;
  private lastSensorUpdate = new Date();
  private lastUpdate = new Date();
  private lastStreamInterval = 0;

  private _isMounted = false;
  private readonly sensorValuesBuffer: TChannelData;
  private readonly liveMonitorSeries: LiveMonitorSeries[];
  private readonly chartWrapper = React.createRef<HTMLDivElement>();

  // sensor record
  private readonly sensorsRecord: Map<Date, number[]>;
  private sensorRecordStarted = new Date();
  constructor(props) {
    super(props);
    this.state = {
      activeChannel: ChannelType.FAM,
      recordingValues: false,
    };
    this.sensorValuesBuffer = {
      Fam: SensorChartHelper.createChannelData(NaN),
      Rox: SensorChartHelper.createChannelData(NaN),
    };
    this.sensorsRecord = new Map<Date, number[]>();
    this.liveMonitorSeries = [];
  }
  componentDidMount() {
    this._isMounted = true;
    this.cpanelService.subscribeCpanelUpdate(VIEW_NAME, this.onCPanelUpdate);
    this.cpanelService.subscribeSensorUpdate(VIEW_NAME, this.onSensorUpdate);
    this.loop();
  }
  componentWillUnmount() {
    this._isMounted = false;
    this.sensorsRecord.clear();
    this.cpanelService.unsubscribeSensorUpdate(VIEW_NAME);
    this.cpanelService.unsubscribeCpanelUpdate(VIEW_NAME);
  }  
  loop = () => {
    if (!this._isMounted) {
      return;
    }
    if (GLOBAL.enableLoopIntervalLog) {
      if (this.loopCounter < 99999) {
        this.loopCounter = 1;
      } else {
        this.loopCounter += 1;
      }
      const now = new Date();
      const duration = now.getTime() - this.lastUpdate.getTime();
      this.lastUpdate = now;
      const interval = getAdjustedInterval(duration);
      if (interval <= 0) {
        console.warn('Loop', this.loopCounter, `Update duration took more than ${GLOBAL.renderInterval}ms`, duration);
      }
      invokeLater(this.loop, interval);
    } else {
      invokeLater(this.loop, GLOBAL.renderInterval);
    }
    this.forceUpdate();
  }
  onCPanelUpdate = (update: CpanelUpdate) => {
    console.info('update.activeCameraStream', update.activeCameraStream);
    this.setState({ activeChannel: update.activeCameraStream });
  }
  onSensorUpdate = (update: number[]) => {
    // record interval
    const now = new Date();
    const interval = now.getTime() - this.lastSensorUpdate.getTime();
    this.lastStreamInterval = interval;
    this.lastSensorUpdate = now;

    if (GLOBAL.enableSensorIntervalLog) {
      if (this.streamCounter > 99999) {
        this.streamCounter = 1;
      } else {
        this.streamCounter += 1;
      }
      if (interval > GLOBAL.streamInterval) {
        console.warn(this.streamCounter, 'Stream interval mote than specified', GLOBAL.streamInterval, '=>', interval);
      }
    }
    this.updateChannelData(update);
  }
  updateChannelData = (values: number[]) => {
    for (let i = 0; i < setting.NUM_CHANNEL; i += 1) {
      ArrayHelper.padLeft(this.sensorValuesBuffer.Fam[i], values[i]);
      ArrayHelper.padLeft(this.sensorValuesBuffer.Rox[i], values[i + 5]);
    }
    if (this.state.recordingValues) {
      this.sensorsRecord.set(new Date(), values);
    }
    this.updateLiveMonitorData();
  }
  toggleMode = (active: ChannelType) => {
    this.cpanelService.SetDisplayedCameraStream(active);
    scrollTop(() => this.setState({ activeChannel: active }), 10);
  }
  updateLiveMonitorData = () => {
    const { sensorValuesBuffer } = this;
    if (this.liveMonitorSeries.length === 0) {
      for (let i = 0; i < setting.NUM_CHANNEL; i += 1) {
        const fam = sensorValuesBuffer.Fam[i];
        const rox = sensorValuesBuffer.Rox[i];
        const roxIndex = i + 5;
        this.liveMonitorSeries[i] = {
          header: { label: `Fam ${i}`, color: SensorChartHelper.SensorColors[i], sensodId: i },
          values: fam,
        };
        this.liveMonitorSeries[roxIndex] = {
          header: { label: `Rox ${i}`, color: SensorChartHelper.SensorColors[roxIndex], sensodId: roxIndex },
          values: rox,
        };
      }
    } else {
      // update only the values, not the label and colors
      for (let i = 0; i < setting.NUM_CHANNEL; i += 1) {
        const roxIndex = i + 5;
        this.liveMonitorSeries[i].values = sensorValuesBuffer.Fam[i];
        this.liveMonitorSeries[roxIndex].values = sensorValuesBuffer.Rox[i];
      }
    }
  }
  startSensorRecord = () => {
    this.sensorsRecord.clear();
    this.sensorRecordStarted = new Date();
    this.setState({ recordingValues: true });
  }
  stopSensorRecord = () => {
    sensorValHelper.exportCsv(this.sensorsRecord);
    this.setState({ recordingValues: false });
  }
  render() {
    const { recordingValues, activeChannel } = this.state;
    const chartData = filterSeries(this.liveMonitorSeries, activeChannel);
    if (chartData.length === 0) {
      return <div>No data</div>;
    }
    return (
      <div ref={this.chartWrapper} className="w-100 p-2">
        <span className="realtime-chart-sensor-title">Camera Sensor Value</span>
        <ControlButton
          active={activeChannel}
          toggleMode={this.toggleMode}
          recordingValues={recordingValues}
          recordStarted={this.sensorRecordStarted}
          startSensorRecord={this.startSensorRecord}
          stopSensorRecord={this.stopSensorRecord}
        />
        <UPlotSensorChart
          // HACK: the wrapper component is referenced by the chart for setting its size
          wrapperRef={this.chartWrapper}
          data={chartData}
          mode={activeChannel}
          lastSensorInterval={this.lastStreamInterval}
        />
      </div>
    );
  }
}

const filterSeries = (series: LiveMonitorSeries[], mode: ChannelType) => {
  switch (mode) {
    case ChannelType.FAM:
      return series.filter((s) => s.header.sensodId < 5);
    case ChannelType.ROX:
      return series.filter((s) => s.header.sensodId > 4);
    default:
      return series;
  }
};

type ControlButtonProps = {
  active: ChannelType,
  recordingValues: boolean,
  recordStarted: Date,
  toggleMode: (mode: ChannelType) => any,
  startSensorRecord(): any,
  stopSensorRecord(): any,
}
const ControlButton: React.FC<ControlButtonProps> =
  function ControlButton({ toggleMode, startSensorRecord, stopSensorRecord, recordStarted, recordingValues, active }) {
    return (
      <div className="row">
        <div className="col-md-6 flex-common-x-start">
          <div className="btn-group">
            <ChannelTypeButton active={active === ChannelType.FAM} mode={ChannelType.FAM} setMode={toggleMode} label="Fam" />
            <ChannelTypeButton active={active === ChannelType.ROX} mode={ChannelType.ROX} setMode={toggleMode} label="Rox" />
            <ChannelTypeButton active={active === ChannelType.ALL} mode={ChannelType.ALL} setMode={toggleMode} label="All" />
          </div>
        </div>
        <div className="col-md-6 flex-common-x-end" style={{ gap: 5 }}>
          {!recordingValues && <StampedeButton label="Start Recording" type="positive" onClick={startSensorRecord} size="sm" />}
          {recordingValues && <StampedeButton label="Stop Recording" type="danger" onClick={stopSensorRecord} size="sm" />}
          <StampedeButton
            type="basic"
            variant="outline"
            size="sm"
            label={recordingValues ? getDuration(recordStarted) : '00:00:00'}
            disabled
          />
        </div>
      </div>
    );
  };

const getDuration = (started: Date) => {
  const now = new Date();
  const durationSec = (now.getTime() - started.getTime()) / 1000;
  return DateHelper.numberToTimeString(Math.ceil(durationSec));
};

type ChannelTypeButtonProps = { active: boolean, mode: ChannelType, setMode(mode: ChannelType), label: string }
const ChannelTypeButton: React.FC<ChannelTypeButtonProps> = function ChannelTypeButton(props: ChannelTypeButtonProps) {
  return (
    <button
      type="button"
      className={`btn btn-sm btn-chart-mode ${props.active ? 'btn-primary' : 'btn-outline-primary'}`}
      onClick={() => props.setMode(props.mode)}
    >
      {props.label}
    </button>
  );
};

const configureUpdateInterval = () => {
  const response = prompt(
    'Please set update_interval, log_duration_enable(true/false)',
    `${GLOBAL.renderInterval},${GLOBAL.enableLoopIntervalLog}`,
  );
  if (!response || response.split(',').length !== 2) {
    return;
  }
  const split = response.split(',');
  const intervalNum = parseFloat(split[0].trim());
  const logDurationEnabled = split[1].trim().toLowerCase() === 'true';
  if (isNaN(intervalNum)) {
    return;
  }
  GLOBAL.enableLoopIntervalLog = logDurationEnabled;
  GLOBAL.renderInterval = intervalNum;
};

const getAdjustedInterval = (duration: number) => {
  const { renderInterval: interval } = GLOBAL;
  return interval > duration ? interval - duration : 0;
};

export default ChartView;
