import { line } from 'billboard.js';
import React from 'react';
import BillboardChart from 'react-billboardjs';
import ChannelType from '../../../../../enums/ChannelType';
import ArrayHelper from '../../../../../helper/ArrayHelper';
import SensorChartHelper from '../../../../../helper/SensorChartHelper';
import ChartSeriesData from '../../../../../models/sensorChart/ChartSeriesData';
import ReportModel from '../../../../../postProcess/ReportModel';
import AnalyticCapture from '../helper/AnalyticCapture';
import { BaseSubContentRaw } from './BaseSubContent';
import ExportingGraphLoading from './ExportingGraphLoading';
import SubContentProps from './SubContentProps';
import SubContentState from './SubContentState';
import SubContentTitle from './SubContentTitle';

const xTicks = ArrayHelper.create(0, 9, (i) => (i + 1) * 5 - 1);

const channelSelections = new Map<ChannelType, boolean>();
channelSelections.set(ChannelType.FAM, true);
channelSelections.set(ChannelType.ROX, true);

const getChartData = (reportModel: ReportModel): ChartSeriesData => {
  const { profile } = reportModel;
  const cycleNum = profile.pcrCycleNum ?? 0;
  const columns = reportModel.dataSet.rfuMax.map((p) => {
    const label = `${p.header.channelType}-${p.header.channelId}`;
    return [label, ...ArrayHelper.fillMissing(p.values, cycleNum, NaN)];
  });
  const colors = SensorChartHelper.SensorColors;
  return { colors, columns };
};

export default class AmplificationContent extends BaseSubContentRaw<SubContentProps, SubContentState> {
  private readonly exportOptions: Record<string, () => any> = {};
  private chartData?: ChartSeriesData;
  constructor(props) {
    super(props, 'analytic-amplification-chart', 'analytical-amplification-content');
    this.state = {
      ...this.state,
    };
    this.exportOptions['Export Graph'] = this.exportGraph;
    this.exportOptions['Export CSV'] = () => this.exportPeak();
  }
  reset = () => {
    this.setState({ activeSeries: this.defaultActiveSeries });
  }
  getExportedGraphName = (report: ReportModel) => `Amplification-${report.identifier}`;
  exportPeak = () => {
    const id = this.props.reportModel.identifier;
    const fileName = `${id}+cycles.csv`;
    if (this.chartData) {
      AnalyticCapture.exportValuesCsv(this.chartData, fileName);
    }
  }
  render() {
    const { reportModel } = this.props;
    const { activeSeries, isExportingGraph, chartHeight } = this.state;
    this.chartData = getChartData(reportModel);
    return (
      <div>
        <SubContentTitle
          title="Amplification Graph"
          exportOptions={this.exportOptions}
          additionalDropdown={null}
        />
        <div className="pos-relative">
          {isExportingGraph && <ExportingGraphLoading />}
          <AmplificationChart
            id={this.chartId}
            chartHeight={chartHeight}
            chartData={this.chartData}
            activeSeries={activeSeries}
          />
        </div>
      </div>
    );
  }
}

type ChartProps = { id: string, chartData: ChartSeriesData, activeSeries: number[], chartHeight: number }
const AmplificationChart: React.FC<ChartProps> = function AmplificationChart({ activeSeries, chartData, id, chartHeight }) {
  const combine = SensorChartHelper.withActiveIndexes;
  const columns = combine(chartData.columns, activeSeries);
  return (
    <div id={id} style={{ height: chartHeight }}>
      <BillboardChart
        key={new Date().getTime()}
        data={{ columns, type: line() }}
        color={{ pattern: combine(chartData.colors, activeSeries) }}
        point={{
          show: false,
          focus: { only: true },
        }}
        tooltip={{
          show: true,
          format: {
            value: (value: any) => value?.toFixed(2) ?? '-',
          },
        }}
        transition={{ duration: 0 }}
        axis={{
          y: {
            max: getMaxCyclePeakValue(chartData.columns),
            min: 0,
            label: 'Values',
            tick: {
              values: columns.length === 0 ? [0] : undefined,
            },
          },
          x: {
            label: 'Cycle',
            tick: {
              fit: true,
              values: xTicks,
              format: (x) => x + 1,
            },
          },
        }}
        interaction={{ enabled: true }}
        size={{ height: chartHeight }}
        legend={{ show: false }}
      />
    </div>
  );
};

const getMaxCyclePeakValue = (arr: (string | number)[][]) => {
  let max = 0;
  for (let i = 0; i < arr.length; i += 1) {
    const arrLevel2 = arr[i];
    for (let j = 0; j < arrLevel2.length; j += 1) {
      const element = arrLevel2[j];
      if (typeof element !== 'number') {
        continue;
      }
      max = element > max ? element : max;
    }
  }
  return max;
};
