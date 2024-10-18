import { line } from 'billboard.js';
import 'billboard.js/dist/billboard.css';
import { resolve } from 'inversify-react';
import React, { Component, useContext } from 'react';
import BillboardChart from 'react-billboardjs';
import ChartDisplayCount from '../../../../enums/ChartDisplayCount';
import ArrayHelper from '../../../../helper/ArrayHelper';
import EventHandlerSource from '../../../../helper/EventHandlerSource';
import { invokeLater } from '../../../../helper/EventHelper';
import SensorChartHelper from '../../../../helper/SensorChartHelper';
import StringHelper from '../../../../helper/StringHelper';
import LivePeakResponse from '../../../../models/report/LivePeakResponse';
import CPanelService from '../../../../services/CPanelService';
import LoadingScreen from '../../../loading/LoadingScreen';
import AnalyticCapture from '../analyticalReport/helper/AnalyticCapture';
import config from './../../../../config';
import ExportGraphMode from './ExportGraphMode';

const SENSOR_COUNT = config.SETTING.NUM_CHANNEL * 2;
const VIEW_NAME = 'live-report-chart';
const UPDATE_INTERVAL = 500;
const EXPORT_GRAPH = { WIDTH: 800, HEIGHT: 300 };

type State = { isExportingGraph: boolean }
type Props = { activeSeries: number[], countMode: ChartDisplayCount, exportChartHandler: EventHandlerSource<ExportGraphMode> }
type ChartSeries = { label: string, values: number[] }
type ContextType = {
  chartData: { columns: any[], colors: string[] },
  mode: ChartDisplayCount,
  activeSeries: number[],
  livePeak: LivePeakResponse | undefined,
  chartRefs: React.RefObject<HTMLDivElement>[],
}

const ctxVal: ContextType = {
  chartData: {
    columns: ArrayHelper.create(0, SENSOR_COUNT, (i) => [`ch-${i}`, [0, 1, 2]]),
    colors: SensorChartHelper.SensorColors,
  },
  mode: ChartDisplayCount.Combined,
  activeSeries: ArrayHelper.create(0, SENSOR_COUNT, (i) => i),
  livePeak: undefined,
  chartRefs: [],
};

const ChartContext = React.createContext(ctxVal);

class LiveReportChartComponent extends Component<Props, State> {
  @resolve(CPanelService)
  private service: CPanelService;
  private chartKey = StringHelper.generateUUID();
  private peakResponse: LivePeakResponse | undefined;
  private tempActiveSeries: number[];
  private readonly chartRefs: React.RefObject<HTMLDivElement>[];
  private readonly peakResponseCtx: { peakResponse?: LivePeakResponse } = { peakResponse: undefined };
  private intervalHandle: NodeJS.Timeout | null = null;

  constructor(props) {
    super(props);
    this.state = {
      isExportingGraph: false,
    };
    this.tempActiveSeries = ArrayHelper.clone(this.props.activeSeries);
    this.chartRefs = [React.createRef(), React.createRef(), React.createRef()];
  }
  componentDidMount() {
    this.service.subscribeLiveReportUpdate(VIEW_NAME, this.onLiveReport);
    this.intervalHandle = setInterval(this.loop, UPDATE_INTERVAL);
    this.props.exportChartHandler.add(VIEW_NAME, this.handleExportGraph);
  }
  componentDidUpdate() {
  }
  componentWillUnmount() {
    this.service.unsubscribeLiveReportUpdate(VIEW_NAME);
    this.props.exportChartHandler.remove(VIEW_NAME);
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
    }
  }
  loop = () => {
    const noSeriesUpdate = ArrayHelper.equals(this.tempActiveSeries, this.props.activeSeries);
    const noReportContentUpdate = JSON.stringify(this.peakResponse ?? {}) === JSON.stringify(this.peakResponseCtx.peakResponse ?? {});

    if (noSeriesUpdate && noReportContentUpdate) {
      return;
    }
    this.chartKey = StringHelper.generateUUID();
    this.tempActiveSeries = ArrayHelper.clone(this.props.activeSeries);
    this.peakResponse = this.peakResponseCtx.peakResponse;
    this.forceUpdate();
  }
  onLiveReport = (response: LivePeakResponse) => {
    this.peakResponseCtx.peakResponse = response;
  }
  getChartData = () => {
    const { peakResponse } = this.peakResponseCtx;

    const getChartSeries = (): ChartSeries[] => {
      if (!peakResponse) return [];
      const { numberOfCycle } = peakResponse;
      return peakResponse.rfuColumnRecords.map((p) => {
        const label = `${p.header.channelType}-${p.header.channelId}`;
        return { label, values: ArrayHelper.fillMissing(p.values, numberOfCycle, NaN) };
      });
    };

    const series = getChartSeries();
    const columns = series.map((p) => [p.label, ...p.values]);
    const colors = SensorChartHelper.SensorColors;
    return { colors, columns };
  }
  handleExportGraph = (mode: ExportGraphMode) => {
    if (mode === ExportGraphMode.Graph) {
      this.exportGraph();
    } else if (mode === ExportGraphMode.Csv) {
      const { peakResponse } = this.peakResponseCtx;
      if (!peakResponse) {
        return;
      }
      const fileName = `${peakResponse.identifier}-Peak-Max.csv`;
      AnalyticCapture.exportValuesCsv(this.getChartData(), fileName);
    }
  }
  exportGraph = () => {
    const { peakResponse } = this.peakResponseCtx;
    if (!peakResponse) {
      return;
    }
    const htmls: HTMLDivElement[] = [];
    if (this.props.countMode === ChartDisplayCount.Combined) {
      if (this.chartRefs[0].current) {
        htmls.push(this.chartRefs[0].current);
      }
    } else {
      for (let index = 1; index <= 2; index += 1) {
        const element = this.chartRefs[index].current;
        if (element) {
          htmls.push(element);
        }
      }
    }
    initExportedChartElement(htmls, this.props.countMode);
    this.setState({ isExportingGraph: true }, () => {
      invokeLater(() => {
        AnalyticCapture.exportGraph(htmls, peakResponse, 'Live Cycle Peak')
          .finally(() => {
            resetChartElement(htmls);
            this.setState({ isExportingGraph: false });
          });
      }, 200);
    });
  }
  render() {
    const { peakResponse } = this.peakResponseCtx;
    const { countMode: mode, activeSeries } = this.props;
    const chartData = this.getChartData();
    const CtxProvider = ChartContext.Provider;
    if (!peakResponse) {
      return <div className="flex-common h-100"><LoadingScreen show showIconOnly /></div>;
    }
    return (
      <div className="live-report-chart py-2 container-fluid flex-common pos-relative">
        <CtxProvider
          value={{
            livePeak: peakResponse,
            chartRefs: this.chartRefs,
            activeSeries,
            chartData,
            mode,
          }}
        >
          {this.state.isExportingGraph && <ExportingChartLoading />}
          <ChartWrapper key={this.chartKey} />
        </CtxProvider>
      </div>
    );
  }
}

const ExportingChartLoading: React.FC = function ExportingChartLoading() {
  return <div className="regular-label pos-absolute w-100 h-100 flex-common"><LoadingScreen show showIconOnly /></div>;
};

const initExportedChartElement = (els: HTMLDivElement[], displayMode: ChartDisplayCount) => {
  let width = EXPORT_GRAPH.WIDTH;
  if (displayMode === ChartDisplayCount.Splitted) {
    width /= 1.5;
  }
  els.forEach((el) => {
    el.style.opacity = '0';
    el.style.width = `${width}px`;
    el.style.height = `${EXPORT_GRAPH.HEIGHT}px`;
  });
};

const resetChartElement = (els: HTMLDivElement[]) => {
  els.forEach((el) => {
    el.style.removeProperty('width');
    el.style.removeProperty('height');
    el.style.removeProperty('opacity');
  });
};
const getMaxChartValue = (peakResponse: LivePeakResponse): number => {
  const peaks = peakResponse.rfuColumnRecords.map((p) => p.values);
  return Math.max(...peaks.flat(2));
};

const ChartWrapper: React.FC = function ChartWrapper() {
  const { mode, activeSeries, livePeak, chartRefs } = useContext(ChartContext);
  if (!livePeak) {
    return null;
  }
  const maxVal = getMaxChartValue(livePeak);
  const content = mode === ChartDisplayCount.Combined ?
    (
      <ResultChart
        mode={mode}
        key="chart-display-combined"
        chartRef={chartRefs[0]}
        maxVal={maxVal}
        activeSeries={activeSeries}
        title="&nbsp;"
        containerClass="col-md-12"
      />
    ) :
    (
      <>
        <ResultChart
          mode={mode}
          key="chart-display-split-fam"
          chartRef={chartRefs[1]}
          title="FAM"
          activeSeries={activeSeries.filter((i) => i < 5)}
          maxVal={maxVal}
          containerClass="col-md-6"
        />
        <ResultChart
          mode={mode}
          key="chart-display-split-rox"
          chartRef={chartRefs[2]}
          title="ROX"
          activeSeries={activeSeries.filter((i) => i > 4)}
          maxVal={maxVal}
          containerClass="col-md-6"
        />
      </>
    );
  const className = mode === ChartDisplayCount.Combined ? 'live-report-chart-wrapper live-report-chart-wrapper-combined' : 'live-report-chart-wrapper live-report-chart-wrapper-splitted';
  return <div className={`row ${className}`}>{content}</div>
};

const ChartStaticSetting = {
  point: {
    show: false,
    focus: { only: true },
  },
  tooltip: {
    show: true,
    format: {
      value: (value: any) => value?.toFixed(2) ?? '-',
    },
  },
  transition: { duration: 0 },
  interaction: { enabled: true },
  size: { height: 250 },
  legend: { show: false },
};

const ResultChart: React.FC<{
  mode: ChartDisplayCount,
  maxVal: number,
  title: string | null,
  activeSeries: number[]
  containerClass: string,
  chartRef: React.RefObject<HTMLDivElement>,
}> = function ResultChart({ mode, activeSeries, title, containerClass, chartRef, maxVal }) {
  const { chartData: data, livePeak } = useContext(ChartContext);
  const combine = SensorChartHelper.withActiveIndexes;
  const titleClass = 'live-report-chart-title pb-3';
  const columns = combine(data.columns, activeSeries);
  const dumpCount = getIndexCount(livePeak);
  const xTicks = ArrayHelper.create(0, dumpCount / 10, (i) => (i + 1) * 10 - 1);
  return (
    <div ref={chartRef} className={containerClass}>
      {title !== null && title !== undefined && <div className={titleClass}>{title}</div>}
      <BillboardChart
        data={{ columns, type: line() }}
        color={{ pattern: combine(data.colors, activeSeries) }}
        point={ChartStaticSetting.point}
        tooltip={ChartStaticSetting.tooltip}
        transition={ChartStaticSetting.transition}
        axis={{
          y: {
            max: maxVal,
            min: 0,
            label: 'Value',
            tick: {
              values: columns.length === 0 ? [0] : undefined,
            },
          },
          x: {
            label: 'Cycle',
            tick: {
              fit: true,
              values: xTicks,
              format: (x) => {
                return x + 1;
              },
            },
          },
        }}
        interaction={ChartStaticSetting.interaction}
        legend={ChartStaticSetting.legend}
      />
    </div>
  );
};

const getIndexCount = (report?: LivePeakResponse) => {
  try {
    return report?.numberOfCycle ?? 0;
  } catch (e) {
    return 0;
  }
};

const LiveReportChart = LiveReportChartComponent;
export default LiveReportChart;
