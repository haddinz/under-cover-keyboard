import React from 'react';
import { invokeLater } from '../../../../../helper/EventHelper';
import ReportModel from '../../../../../postProcess/ReportModel';
import analyticalReportHelper from '../AnalyticalReportHelper';
import AnalyticCapture from '../helper/AnalyticCapture';
import SubContentProps from './SubContentProps';
import SubContentState from './SubContentState';

const EXPORT_GRAPH = {
  WIDTH: 1000,
  HEIGHT: 400,
};
const DSIPLAYED_GRAPH = { HEIGHT: 300 };

export abstract class BaseSubContentRaw<P extends SubContentProps, S extends SubContentState> extends React.Component<P, S> {
  protected readonly defaultActiveSeries = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  constructor(props, protected chartId: string, protected viewName: string) {
    super(props);
    this.state = { activeSeries: this.defaultActiveSeries, isExportingGraph: false, chartHeight: DSIPLAYED_GRAPH.HEIGHT } as any;
  }
  componentDidMount() {
    this.props.onStartExportingGraph.add(this.viewName, this.onStartExportingGraph);
    // this.props.onFinishExportingGraph.add(this.viewName, this.onFinishExportingGraph);
    this.props.onResetHandler.add(this.viewName, this.reset);
    this.props.setSeriesHandler.add(this.viewName, (e) => this.toggleSeries(e.enable, ...e.series));
  }
  componentWillUnmount() {
    this.props.onStartExportingGraph.remove(this.viewName);
    // this.props.onFinishExportingGraph.remove(this.viewName);
    this.props.onResetHandler.remove(this.viewName);
    this.props.setSeriesHandler.remove(this.viewName);
  }
  abstract getExportedGraphName(report: ReportModel): string;
  exportGraph = () => {
    const { reportModel } = this.props;
    const el = document.getElementById(this.chartId) as HTMLDivElement;
    this.modifyChartElement(el);
    this.setState({ isExportingGraph: true, chartHeight: EXPORT_GRAPH.HEIGHT }, () => {
      invokeLater(() => {
        AnalyticCapture.exportGraph([el], reportModel, this.getExportedGraphName(reportModel))
          .finally(() => {
            this.rollbackChartModification(el);
          });
      }, 200);
    });
  }
  rollbackChartModification = (el: HTMLDivElement) => {
    el.style.removeProperty('width');
    el.style.removeProperty('height');
    el.style.removeProperty('opacity');
    this.setState({ isExportingGraph: false, chartHeight: DSIPLAYED_GRAPH.HEIGHT });
  }
  // Modify the chart element so bacause the exported image duplicates current view
  modifyChartElement = (el: HTMLDivElement) => {
    el.style.opacity = '0';
    el.style.width = `${EXPORT_GRAPH.WIDTH}px`;
    el.style.height = `${EXPORT_GRAPH.HEIGHT}px`;
  }
  onStartExportingGraph = () => {
    this.exportGraph();
  }
  onFinishExportingGraph = () => {
    const el = document.getElementById(this.chartId) as HTMLDivElement;
    el.style.removeProperty('width');
    el.style.removeProperty('height');
    el.style.removeProperty('opacity');

    this.setState({ isExportingGraph: false });
  }
  reset = () => {
    this.setState({ activeSeries: this.defaultActiveSeries });
  }
  toggleSeries = (active: boolean, ...indexes: number[]) => {
    const { activeSeries } = this.state;
    const newSeries = analyticalReportHelper.toggleActiveSeries(active, activeSeries, indexes);
    this.setState({ activeSeries: newSeries });
  }
}

export default abstract class BaseSubContent extends BaseSubContentRaw<SubContentProps, SubContentState> {
  //
}
