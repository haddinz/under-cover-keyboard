import React from 'react';
import { resolve } from 'inversify-react';
import config from '../../../config';
import { SectionEnum } from '../../../enums/SectionEnum';
import CpanelUpdate from '../../../models/CpanelUpdate';
import BrowserDataService from '../../../services/BrowserDataService';
import CPanelService from '../../../services/CPanelService';
import BaseContent from '../../base/BaseContent';
import { StampedeButton } from '../../FmlxUi';
import Footer from '../../layout/Footer';
import CameraView from '../cameraView/CameraView';
import ActiveProtocolLabel from './ActiveProtocolLabel';
import AnalyticalReportWrapper from './analyticalReport/AnalyticalReportWrapper';
import './Dashboard.scss';
import Tab, { DashboardTabContent as TabContent, DashboardTabItem as TabItem, DashboardTabList as TabList } from './DashboardTab';
import DashboardTabMode from './DashboardTabMode';
import ChartView from './liveMonitor/ChartView';
import LiveReportView from './liveReport/LiveReportView';
import ProgressView from './progress/ProgressView';

type State = {
  mode: DashboardTabMode,
  lastRunId: string | null,
  activeProtocol: string | null,
};

const DASHBOARD_MAIN = 'dashboard-main';
const ID_DASHBOARD_TOP = 'dashboard-top';

export default class Dashboard extends BaseContent<any, State> {
  @resolve(CPanelService)
  private service: CPanelService;
  @resolve(BrowserDataService)
  private clientData: BrowserDataService;
  constructor(props) {
    super(props);
    this.state = {
      mode: DashboardTabMode.ModeCamera,
      lastRunId: null,
      activeProtocol: null,
    };
  }
  componentDidMount() {
    this.setState({ mode: this.clientData.dashboardMode });
    this.service.subscribeCpanelUpdate(DASHBOARD_MAIN, this.onCPanelUpdate);
  }
  componentWillUnmount() {
    this.service.unsubscribeCpanelUpdate(DASHBOARD_MAIN);
  }
  get section() { return SectionEnum.Dashboard; }
  get headerContent() {
    return <ProgressView />;
  }
  get footerContent(): any {
    return this.state.mode === DashboardTabMode.AnalyticalReport ? null : <Footer />;
  }
  onCPanelUpdate = (update: CpanelUpdate) => {
    const { lastRunId, activeProtocol } = this.state;
    const { runProgress } = update;
    const setActiveProtocol = () => {
      if (activeProtocol !== update.activeProtocol) {
        this.setState({ activeProtocol: update.activeProtocol });
      }
    };
    const idFromLastUpdate = runProgress?.identifier ?? null;
    if (idFromLastUpdate !== lastRunId) {
      this.setState({ lastRunId: idFromLastUpdate }, setActiveProtocol);
    } else {
      setActiveProtocol();
    }
  }
  openDebugPage = () => {
    window.open(`${config.SERVICE_HOST}view/debug`, '_blank');
  }
  setMode = (mode: number) => {
    this.clientData.dashboardMode = mode;
    this.setState({ mode });
  }
  onLoadReportError = () => {
    this.setMode(DashboardTabMode.ModeCamera);
  }
  render = () => {
    const Container = this.commonTemplate;
    const { mode, activeProtocol, lastRunId } = this.state;
    return (
      <Container noPadding className="px-2 pb-2">
        <div className="dashboard-top" id={ID_DASHBOARD_TOP}>
          <ActiveProtocolLabel activeProtocol={activeProtocol} />
          <div className="flex-common-x-end me-2 h-100">
            
          </div>
        </div>
        <Tab>
          <TabList>
            <TabItem setActive={this.setMode} label="Camera View" id={DashboardTabMode.ModeCamera} activeId={mode} />
            <TabItem setActive={this.setMode} label="Live Report" id={DashboardTabMode.ModeReport} activeId={mode} />
            <TabItem setActive={this.setMode} label="Analytical Report" id={DashboardTabMode.AnalyticalReport} activeId={mode} />
          </TabList>
          <TabContent id={DashboardTabMode.ModeCamera} activeId={mode}>
            <CameraViewTab />
          </TabContent>
          <TabContent id={DashboardTabMode.ModeReport} activeId={mode}>
            {lastRunId && <LiveReportView lastRunId={lastRunId} />}
            {!lastRunId && <LiveReportNoContent />}
          </TabContent>
          <TabContent id={DashboardTabMode.AnalyticalReport} activeId={mode}>
            <AnalyticalReportWrapper onLoadReportError={this.onLoadReportError} />
          </TabContent>
        </Tab>
      </Container>
    );
  }
}

const LiveReportNoContent: React.FC = function LiveReportNoContent() {
  return (
    <div className="live-report-no-content flex-common">
      <div>No data can be shown. Perform a test to collect the data.</div>
    </div>
  );
};

const CameraViewTab: React.FC = function CameraViewTab() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-6">
          <ChartView />
        </div>
        <div className="col-md-6">
          <CameraView />
        </div>
      </div>
    </div>
  );
};
