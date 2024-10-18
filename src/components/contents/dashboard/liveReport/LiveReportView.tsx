import React, { useContext } from 'react';
import config from '../../../../config';
import { LiveReportContext } from '../../../../context/contexes';
import ChartDisplayCount from '../../../../enums/ChartDisplayCount';
import SensorChartHelper from '../../../../helper/SensorChartHelper';
import LiveReportChart from './LiveReportChart';
import LiveReportLegend from './LiveReportLegend';

import '../liveMonitor/SensorChart.scss';
import './LiveReport.scss';
import { StampedeButton } from '../../../FmlxUi';
import FmlxIcon from '../../../icon/FmlxIcon';
import CustomEventHandler from '../../../../helper/CustomEventHandler';
import ExportGraphMode from './ExportGraphMode';

type State = {
  mode: ChartDisplayCount;
  activeSeries: number[];
};

type Props = { customHeader?: any, lastRunId: string };

const SENSOR_LENGTH = config.SETTING.NUM_CHANNEL * 2;

export default class LiveReportView extends React.Component<Props, State> {
  public static defaultProps = { customHeader: undefined };
  private readonly exportChartHandler = new CustomEventHandler<ExportGraphMode>();
  constructor(props) {
    super(props);
    this.state = {
      mode: ChartDisplayCount.Combined,
      activeSeries: Array.from(Array(SENSOR_LENGTH).keys()),
    };
  }
  setMode = (mode: ChartDisplayCount) => this.setState({ mode });
  toggleActiveSeries = (index: number | number[], active: boolean) => {
    const { activeSeries } = this.state;
    SensorChartHelper.toggleActiveSeries(activeSeries, index, active);
    this.setState({ activeSeries });
  }
  exportCSV = () => this.exportChartHandler.invoke(ExportGraphMode.Csv);
  exportGraph = () => this.exportChartHandler.invoke(ExportGraphMode.Graph);
  render() {
    const { mode, activeSeries } = this.state;
    const { customHeader, lastRunId } = this.props;
    const { setMode, toggleActiveSeries } = this;
    const contextVal = { mode, setMode, activeSeries, toggleActiveSeries };
    const CtxProvider = LiveReportContext.Provider;
    return (
      <div className="live-report px-2 pt-2">
        {customHeader}
        <div className="d-flex mb-2">
          <div className="live-report-main" id="live-report-main">
            <div className="live-report-top">
              {!customHeader && <RunIdLabel lastRunId={lastRunId} />}
              {customHeader && <div />}
              <div className="flex-common-x-end mt-1">
                <CtxProvider value={contextVal}>
                  <ChartViewButton mode={ChartDisplayCount.Combined} label="Combined" />
                  <ChartViewButton mode={ChartDisplayCount.Splitted} label="Splitted" />
                </CtxProvider>
              </div>
            </div>
            <LiveReportChart
              exportChartHandler={this.exportChartHandler.source}
              countMode={mode}
              activeSeries={activeSeries}
            />
          </div>
          <div className="live-report-control-wrapper">
            <div className="live-report-control regular-label">
              <ControlTitle title="Settings" />
              <CaptureButton exportCsv={this.exportCSV} exportGraph={this.exportGraph} />
              <div>
                <CtxProvider value={contextVal}>
                  <LiveReportLegend />
                </CtxProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const CaptureButton: React.FC<{ exportCsv(): any, exportGraph(): any }> = function CaptureButton({ exportCsv, exportGraph }) {
  return (
    <div className="d-flex my-4" style={{ margin: 'auto', width: 'min-content' }}>
      <div className="me-2">
        <StampedeButton
          mode="button"
          type="primary"
          variant="outline"
          label="EXPORT GRAPH"
          size="sm"
          onClick={exportGraph}
        />
      </div>
      <div>
        <StampedeButton
          mode="button"
          type="primary"
          variant="outline"
          withIcon="start"
          label="EXPORT CSV"
          size="sm"
          icon={<FmlxIcon name="ExportCsv" />}
          onClick={exportCsv}
        />
      </div>
    </div>
  );
};

const ControlTitle: React.FC<{ title: string }> = function ControlTitle({ title }) {
  return <div className="live-report-control-title flex-common"><span>{title}</span></div>;
};

const ChartViewButton: React.FC<{
  mode: ChartDisplayCount,
  label: string,
}> = function ChartViewButton({ mode, label }) {
  const context = useContext(LiveReportContext);
  const isActive = context.mode === mode;
  const onClick = () => context.setMode(mode);
  const className = `live-report-chart-mode-btn ${isActive ? 'live-report-chart-mode-btn-active' : ''}`;
  return (
    <button type="button" className={className} onClick={onClick}>
      <span>
        {label}
      </span>
    </button>
  );
};

const RunIdLabel: React.FC<{ lastRunId: string }> = function RunIdLabel({ lastRunId }) {
  return (
    <div>
      <span className="regular-label">Run ID:</span>
      <span className="ms-2 regular-label-bold">{lastRunId}</span>
    </div>
  );
};
