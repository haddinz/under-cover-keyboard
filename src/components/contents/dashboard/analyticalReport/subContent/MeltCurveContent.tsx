import { line } from 'billboard.js';
import React from 'react';
import BillboardChart from 'react-billboardjs';
import ArrayHelper from '../../../../../helper/ArrayHelper';
import SensorChartHelper from '../../../../../helper/SensorChartHelper';
import ChartSeriesData from '../../../../../models/sensorChart/ChartSeriesData';
import ReportModel from '../../../../../postProcess/ReportModel';
import BaseSubContent from './BaseSubContent';
import ExportingGraphLoading from './ExportingGraphLoading';
import SubContentTitle from './SubContentTitle';

export default class MeltCurveContent extends BaseSubContent {
  private readonly exportOptions: Record<string, () => any> = {};
  constructor(props) {
    super(props, 'analytic-melt-curve-chart', 'melt-curve-content');
    this.exportOptions['Export Graph'] = this.exportGraph;
  }
  getExportedGraphName = (report: ReportModel) => `Melt Curve Graph-${report.identifier}`;
  render() {
    const { reportModel } = this.props;
    const { activeSeries, isExportingGraph, chartHeight } = this.state;
    return (
      <div>
        <SubContentTitle
          title="Melt Curve Graph"
          exportOptions={this.exportOptions}
          additionalDropdown={null}
        />
        <div className="pos-relative">
          {isExportingGraph && <ExportingGraphLoading />}
          <MeltCurveChart
            id={this.chartId}
            chartHeight={chartHeight}
            report={reportModel}
            activeSeries={activeSeries}
          />
        </div>
      </div>
    );
  }
}
const getChartData = (report: ReportModel): { temp: number[] } & ChartSeriesData => {
  const columns: (string | number)[][] = [];
  const temp: number[] = [];
  const pcrCycle = report.profile.pcrCycleNum;
  const meltCurveCycle = report.profile.meltCurveCycleNum;
  const endMeltcurve = pcrCycle + meltCurveCycle;

  for (let sensor = 0; sensor < report.dataSet.rfuMax.length; sensor += 1) {
    const rfuCol = report.dataSet.rfuMax[sensor];
    const rfuVals: number[] = [];
    for (let i = pcrCycle; i < endMeltcurve; i += 1) {
      rfuVals.push(rfuCol.values[i] ?? NaN);
    }
    const label = `${rfuCol.header.channelType}-${rfuCol.header.channelId}`;
    columns.push([label, ...rfuVals]);
  }
  for (let i = pcrCycle; i < endMeltcurve; i += 1) {
    // Block1
    temp.push(report.dataSet.temperature[0].values[i]);
  }
  const colors = SensorChartHelper.SensorColors;
  return { colors, columns, temp };
};
type ChartProps = { id: string, report: ReportModel, activeSeries: number[], chartHeight: number }
const MeltCurveChart: React.FC<ChartProps> = function MeltCurveChart({ activeSeries, report, id, chartHeight }) {
  const combine = SensorChartHelper.withActiveIndexes;
  const data = getChartData(report);
  const columns = combine(data.columns, activeSeries);
  const maxVal = getMaxValue(data.columns);
  const xTicks = getXTicks(data.columns[0].length - 1);
  return (
    <div id={id}>
      <BillboardChart
        key={new Date().getTime()}
        data={{ columns, type: line() }}
        color={{ pattern: combine(data.colors, activeSeries) }}
        point={{
          show: false,
          focus: { only: true },
        }}
        tooltip={{
          show: true,
          format: {
            value: (value: any) => {
              return value?.toFixed(2) ?? '-';
            },
          },
        }}
        transition={{ duration: 0 }}
        axis={{
          y: {
            max: maxVal,
            min: 0,
            label: 'Values',
            tick: { values: columns.length === 0 ? [0] : undefined },
          },
          x: {
            label: 'Temp',
            tick: {
              fit: true,
              values: xTicks,
              format: (x) => data.temp[x]?.toFixed(1) ?? x,
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
const getXTicks = (length: number) => {
  const points = ArrayHelper.create(0, length, (x) => x);
  if (points.length <= 10) {
    return points.map((_, i) => i);
  }
  return points.map((_, i) => i).filter((i) => i % 3 === 0);
};
const getMaxValue = (points: (string | number)[][]) => {
  let max = 0;
  for (let i = 0; i < points.length; i += 1) {
    const cols = points[i].filter((p) => typeof p === 'number' && !isNaN(p)) as number[];
    const itemMax = Math.max(...cols);
    if (itemMax > max) {
      max = itemMax;
    }
  }
  return max;
};
