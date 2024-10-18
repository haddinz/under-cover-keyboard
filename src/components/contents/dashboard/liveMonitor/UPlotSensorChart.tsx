import 'billboard.js/dist/billboard.css';
import React from 'react';
import { UPlot } from 'react-uplot/Dist/UI/UPlot';
// import { AlignedData, Options, Series } from 'uplot';
import ArrayHelper from '../../../../helper/ArrayHelper';
import SensorChartHelper from '../../../../helper/SensorChartHelper';
import LiveMonitorSeries from '../../../../models/sensorChart/LiveMonitorSeries';
import './SensorChart.scss';
import { InputMaxYAxis, SeriesControl } from './seriesControl';
import config from '../../../../config';
import ChannelType from '../../../../enums/ChannelType';

const CHART_BORDER = { show: true, stroke: '#000' };
const xAxisArray = ArrayHelper.create(0, config.SETTING.MAX_CHART_X_AXIS, (i) => i);

type State = {
  activeSeries: number[],
  maxYAxis: number | undefined,
}
type Props = {
  wrapperRef: React.RefObject<HTMLDivElement>,
  data: LiveMonitorSeries[],
  mode: ChannelType,
  lastSensorInterval: number
}

class UPlotSensorChart extends React.Component<Props, State> {
  private fps = 0;
  private capturedFps = 0;
  private lastFpsTick = new Date();
  private readonly totalChannel: number;
  private readonly chartOption: uPlot.Options;
  constructor(props) {
    super(props);
    this.totalChannel = config.SETTING.NUM_CHANNEL * 2;
    this.state = {
      activeSeries: ArrayHelper.create(0, this.totalChannel, (i) => i),
      maxYAxis: undefined,
    };
    this.chartOption = {
      height: 300,
      width: 480, // updated when render
      axes: [
        { label: undefined, scale: 'x', labelGap: -10, border: CHART_BORDER },
        { label: undefined, scale: 'y', labelGap: -20, border: CHART_BORDER, ticks: { show: false } },
      ],
      scales: {
        // updated when render
      },
      series: [],
      cursor: { show: false },
      legend: { show: false },
    };
  }
  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (prevProps.mode !== this.props.mode) {
      const allSeries = ArrayHelper.create(0, this.totalChannel, (i) => i);
      this.setState({ activeSeries: allSeries });
    }
  }
  updateMaxAxis = (maxYAxis: number | undefined) => {
    this.setState({ maxYAxis });
  }
  toggleActiveSeries = (i: number, active: boolean) => {
    const { activeSeries } = this.state;
    SensorChartHelper.toggleActiveSeries(activeSeries, i, active);
    this.setState({ activeSeries });
  }
  getChartRange = () => {
    const { maxYAxis } = this.state;
    if (maxYAxis === 0) {
      return [-1, 1];
    }
    if (!maxYAxis) {
      return [0, undefined];
    }
    return [0, maxYAxis];
  }
  render() {
    const { activeSeries, maxYAxis } = this.state;
    const { data } = this.props;
    const series: uPlot.Series[] = [{ label: 'RFU' }];
    const chartData: uPlot.AlignedData = [xAxisArray];
    data.forEach((c, seriesId) => {
      if (activeSeries.includes(seriesId)) {
        chartData.push(c.values.map((v) => {
          if (isNaN(v) && !isFinite(v)) {
            // Make data point not appear in the chart
            return undefined;
          }
          return v;
        }));
        series.push({
          label: c.header.label,
          stroke: c.header.color,
        });
      }
    });
    const range = this.getChartRange() as number[];

    const { chartOption } = this;
    // HACK: width prop is mandatory and no autosize for the width. So it refers to the wrapper width
    chartOption.width = this.props.wrapperRef.current?.clientWidth ?? 480;
    chartOption.scales = {
      x: { time: false },
      y: {
        auto: maxYAxis === undefined,
        range: [range[0], range[1]],
      },
    };
    chartOption.series = series;

    const labels = data.map((d) => d.header.label);
    const colors = data.map((d) => d.header.color);

    // FPS
    this.fps += 1;
    const now = new Date();
    const diff = now.getTime() - this.lastFpsTick.getTime();
    if (diff >= 1000) {
      this.capturedFps = this.fps;
      this.fps = 0;
      this.lastFpsTick = now;
    }
    return (
      <div id="uplot_sensor_chart" className="py-2 pos-relative">
        <div className="pos-absolute text-light bg-secondary fps-overlay">
          <span className="d-inline-block text-end" style={{ width: 50 }}>{this.props.lastSensorInterval} ms</span>
          <span className="mx-1">|</span>
          <span className="d-inline-block text-end" style={{ width: 40 }}>{this.capturedFps} fps</span>
        </div>
        <UPlot
          data={chartData}
          options={chartOption}
        />
        <SeriesControl active={activeSeries} labels={labels} colors={colors} setActive={this.toggleActiveSeries} />
        <InputMaxYAxis onSubmit={this.updateMaxAxis} data={data} />
      </div>
    );
  }
}

export default UPlotSensorChart;
