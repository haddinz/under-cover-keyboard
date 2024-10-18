import React from 'react';
import ArrayHelper from '../../../../helper/ArrayHelper';
import CustomEventHandler from '../../../../helper/CustomEventHandler';
import ReportModel from '../../../../postProcess/ReportModel';
import AnalyticalDetaiItem from './AnalyticalDetailItem';
import './AnalyticalReport.scss';
import AnalyticalReportDetail from './AnalyticalReportDetail';
import analyticalReportHelper from './AnalyticalReportHelper';
import ToggleSeriesEvt from './helper/ToggleSeriesEvt';
import AmplificationContent from './subContent/AmplificationContent';
import MeltCurveContent from './subContent/MeltCurveContent';
import MeltPeakContent from './subContent/MeltPeakContent';

export default class AnalyticalReportView extends React.Component<{ reportModel: ReportModel, customHeader: any }, any> {
  private readonly onResetHandler = new CustomEventHandler<null>();
  reset = () => this.onResetHandler.invoke(null);
  render() {
    const { reportModel } = this.props;
    return (
      <div className="analytical-report">
        {this.props.customHeader}
        <MainContent onResetHandler={this.onResetHandler} reportModel={reportModel} />
      </div>
    );
  }
}

const TopButton = function TopButton(props: { onReset(): any, exportGraphs(): any }) {
  const className = 'analytical-report-common-buttons';
  return (
    <div className="flex-common-x-end mb-2">
      <button type="button" className={`${className} me-1`} onClick={props.exportGraphs}>DOWNLOAD GRAPHS</button>
      <button type="button" className={className} onClick={props.onReset}>RESET VIEW</button>
    </div>
  );
};

const MAIN_CONTENT_VIEW = 'analytical-view-main-content';

type MainContentProps = { onResetHandler: CustomEventHandler<null>, reportModel: ReportModel | undefined };
type MainContentState = { activeSeries: number[] }

class MainContent extends React.Component<MainContentProps, MainContentState> {
  private readonly setSeriesHandler = new CustomEventHandler<ToggleSeriesEvt>();
  private readonly onStartExportingGraph = new CustomEventHandler<null>();
  private readonly defaultSeries = ArrayHelper.create(0, 10, (i) => i);
  constructor(props) {
    super(props);
    this.state = {
      activeSeries: this.defaultSeries,
    };
  }
  componentDidMount() {
    this.props.onResetHandler.add(MAIN_CONTENT_VIEW, this.reset);
  }
  componentWillUnmount() {
    this.props.onResetHandler.remove(MAIN_CONTENT_VIEW);
  }
  get detailItems(): AnalyticalDetaiItem[] {
    const { reportModel } = this.props;
    if (!reportModel) {
      return [];
    }
    const items: AnalyticalDetaiItem[] = [];
    const { amplification } = reportModel.postProcess;
    if (!amplification) {
      return items;
    }
    const { melting } = reportModel.postProcess;
    for (let i = 0; i < amplification.length; i += 1) {
      const meltingRecord = melting ? melting[i] : undefined;
      const p = amplification[i];
      items.push({
        index: p.channel.sensorId,
        label: `${p.channel.channelType}-${p.channel.channelId}`,
        amp: NaN,
        ct: p.ct,
        meltTemp: meltingRecord ? meltingRecord.tm : [],
        channelType: p.channel.channelType,
      });
    }
    return items;
  }
  exportGraphs = () => {
    this.onStartExportingGraph.invoke(null);
  }
  reset = () => this.setState({ activeSeries: this.defaultSeries });
  toggleSeries = (enable: boolean, ...series: number[]) => {
    const { activeSeries } = this.state;
    const newSeries = analyticalReportHelper.toggleActiveSeries(enable, activeSeries, series);
    this.setSeriesHandler.invoke({ enable, series });
    this.setState({ activeSeries: newSeries });
  }
  render() {
    const { props } = this;
    const { reportModel: report } = props;
    const profile = report?.profile;
    const subContentClass = 'analytical-report-sub-content px-2 py-2';
    return (
      <div className="container-fluid pb-2">
        <div className="row">
          <div className="col-lg-7">
            <TopButton exportGraphs={this.exportGraphs} onReset={() => props.onResetHandler.invoke(null)} />
          </div>
          <div className="col-lg-5" />
          <div className="col-lg-7">
            <div className={subContentClass}>
              {props.reportModel && profile && profile.hasPcr ?
                (
                  <AmplificationContent
                    onStartExportingGraph={this.onStartExportingGraph.source}
                    setSeriesHandler={this.setSeriesHandler.source}
                    onResetHandler={props.onResetHandler.source}
                    reportModel={props.reportModel}
                  />
                ) :
                <SubContentNoData title="Amplification Graph" />}
            </div>
            <div className={`${subContentClass} mt-2`}>
              {props.reportModel && profile && profile.hasMeltCurve ?
                (
                  <MeltCurveContent
                    onStartExportingGraph={this.onStartExportingGraph.source}
                    setSeriesHandler={this.setSeriesHandler.source}
                    onResetHandler={props.onResetHandler.source}
                    reportModel={props.reportModel}
                  />
                ) :
                <SubContentNoData title="Melt Curve Graph" />}
            </div>
            <div className={`${subContentClass} mt-2`}>
              {props.reportModel && profile && profile.hasMeltCurve ?
                (
                  <MeltPeakContent
                    onStartExportingGraph={this.onStartExportingGraph.source}
                    setSeriesHandler={this.setSeriesHandler.source}
                    onResetHandler={props.onResetHandler.source}
                    reportModel={props.reportModel}
                  />
                ) :
                <SubContentNoData title="Melt Peaks Graph" />}
            </div>
          </div>
          <div className="col-lg-5">
            {props.reportModel ?
              (
                <AnalyticalReportDetail
                  reportModel={props.reportModel}
                  activeSeries={this.state.activeSeries}
                  items={this.detailItems}
                  onResetHandler={props.onResetHandler}
                  toggleSeries={this.toggleSeries}
                />
              ) :
              <i>No Data</i>}
          </div>
        </div>
      </div>
    );
  }
}

const SubContentNoData: React.FC<{ title: string }> = function SubContentNoData({ title }) {
  return (
    <div className="analytical-report-sub-content-empty">
      <div className="analytical-report-sub-content-title">{title}</div>
      <div className="flex-common h-100">
        <span>No Data Shown</span>
      </div>
    </div>
  );
};
