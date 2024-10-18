import { line } from 'billboard.js';
import React from 'react';
import BillboardChart from 'react-billboardjs';
import SensorChartHelper from '../../../../../helper/SensorChartHelper';
import ChartSeriesData from '../../../../../models/sensorChart/ChartSeriesData';
import ReportModel from '../../../../../postProcess/ReportModel';
import BaseSubContent from './BaseSubContent';
import ExportingGraphLoading from './ExportingGraphLoading';
import SubContentTitle from './SubContentTitle';

export default class MeltPeakContent extends BaseSubContent {
  private readonly exportOptions: Record<string, () => any> = {};
  constructor(props) {
    super(props, 'analytic-melt-peak-chart', 'MeltPeakContent');
    this.exportOptions['Export Graph'] = this.exportGraph;
  }
  getExportedGraphName = (reportModel: ReportModel) => `Melt Peak Graph-${reportModel.identifier}`;
  render() {
    const { reportModel } = this.props;
    const { activeSeries, isExportingGraph, chartHeight } = this.state;
    return (
      <div>
        <SubContentTitle
          title="Melt Peaks Graph"
          exportOptions={this.exportOptions}
          additionalDropdown={null}
        />
        <div className="pos-relative">
          {isExportingGraph && <ExportingGraphLoading />}
          <MeltPeaksChart
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

type ChartProps = { id: string, report: ReportModel, activeSeries: number[], chartHeight: number }
const MeltPeaksChart: React.FC<ChartProps> = function MeltPeaksChart({ activeSeries, report, id, chartHeight }) {
  const combine = SensorChartHelper.withActiveIndexes;
  const data = getChartData(report);
  const { melting } = report.postProcess;
  if (!melting) {
    return null;
  }
  const meltTemp = melting[0]?.t ?? undefined;
  const columns = combine(data.columns, activeSeries);
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
            max: getMaxValue(data.columns),
            min: getMinValue(data.columns),
            label: 'Derivative',
            tick: { values: columns.length === 0 ? [0] : undefined },
          },
          x: {
            label: 'Temp',
            tick: {
              fit: true,
              format: meltTemp ? (x) => meltTemp[x].toFixed(1) : undefined,
              values: melting[0] ? getXTicks(melting[0].t) : undefined,
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
const getXTicks = (points: any[]) => {
  if (points.length <= 10) {
    return points.map((_, i) => i);
  }
  // if (points.length)
  return points.map((_, i) => i).filter((i) => i % 3 === 0);
};
const getChartData = (report: ReportModel): ChartSeriesData => {
  if (!report.postProcess?.melting) {
    return { colors: [], columns: [] };
  }
  const { melting } = report.postProcess;
  const columns: (string | number)[][] = [];
  for (let i = 0; i < melting.length; i += 1) {
    const el = melting[i];
    const label = `${el.channel.channelType}-${el.channel.channelId}`;
    columns.push([label, ...el.dfDt]);
  }
  const colors = SensorChartHelper.SensorColors;
  return { colors, columns };
};
const getMaxValue = (points: (string | number)[][]) => {
  let max = 0;
  for (let i = 0; i < points.length; i += 1) {
    const itemMax = Math.max(...points[i].filter((_, pi) => pi > 0) as number[]);
    if (itemMax > max) {
      max = itemMax;
    }
  }
  return max;
};
const getMinValue = (points: (string | number)[][]) => {
  let min = 0;
  for (let i = 0; i < points.length; i += 1) {
    const itemMin = Math.min(...points[i].filter((_, pi) => pi > 0) as number[]);
    if (itemMin < min) {
      min = itemMin;
    }
  }
  return min;
};
