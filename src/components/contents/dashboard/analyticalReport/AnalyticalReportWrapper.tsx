import { resolve } from 'inversify-react';
import React from 'react';
import CpanelUpdate, { SequenceRunProgress } from '../../../../models/CpanelUpdate';
import ReportModel from '../../../../postProcess/ReportModel';
import CPanelService from '../../../../services/CPanelService';
import DialogService from '../../../../services/DialogService';
import PostProcessService from '../../../../services/PostProcessService';
import AnalyticalReportView from './AnalyticalReportView';

const VIEW_NAME = 'analytical-report-wrapper';
type State = { progress: SequenceRunProgress | null, reportModel?: ReportModel }
type Props = { onLoadReportError(): any }

export default class AnalyticalReportWrapper extends React.Component<Props, State> {
  @resolve(PostProcessService)
  private postProcessService: PostProcessService;
  @resolve(DialogService)
  private dialog: DialogService;
  @resolve(CPanelService)
  private cPanelService: CPanelService;
  constructor(props) {
    super(props);
    this.state = {
      progress: null,
    };
  }
  componentDidMount() {
    this.cPanelService.subscribeCpanelUpdate(VIEW_NAME, this.onCpanelUpdate);
  }
  componentWillUnmount() {
    this.cPanelService.unsubscribeCpanelUpdate(VIEW_NAME);
  }
  get notRunning() {
    const { progress } = this.state;
    return progress === null || progress.runStatus === 'Completed' || progress.runStatus === 'Aborted';
  }
  onCpanelUpdate = (update: CpanelUpdate) => {
    const { runProgress } = update;
    this.setState({ progress: runProgress }, () => {
      if (runProgress && this.notRunning && !this.state.reportModel) {
        this.loadReport(runProgress.identifier);
      }
      if (this.state.reportModel && !this.notRunning) {
        this.setState({ reportModel: undefined });
      }
    });
  }
  loadReport = (id: string) => {
    this.postProcessService.getReport(id)
      .then((reportModel) => this.setState({ reportModel }))
      .catch((err) => {
        this.dialog.alertError(err);
        this.props.onLoadReportError();
      });
  }
  render() {
    const { reportModel } = this.state;
    if (!this.notRunning || !reportModel) {
      return <NoContent />;
    }
    const header = <TopContent lastRunId={reportModel.identifier} />;
    return <AnalyticalReportView customHeader={header} reportModel={reportModel} />;
  }
}

const TopContent: React.FC<{ lastRunId: string }> = function TopContent({ lastRunId }) {
  return (
    <div className="analytical-report-top px-2 pt-2 flex-common">
      <div className="w-100 flex-common-x-start">
        <span className="regular-label">Run ID:</span>
        <span className="ms-2 regular-label-bold">{lastRunId}</span>
      </div>
    </div>
  );
};

const NoContent: React.FC = function NoContent() {
  return (
    <div className="live-report-no-content flex-common">
      <div>The analysis report will appear at the end of execution.</div>
    </div>
  );
};
