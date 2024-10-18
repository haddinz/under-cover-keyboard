import 'billboard.js/dist/billboard.css';
import { resolve, useInjection } from 'inversify-react';
import React, { Component, MutableRefObject, useEffect } from 'react';
import icons from '../../../_assets/icons';
import { LogType } from '../../../enums/LogType';
import DateHelper from '../../../helper/DateHelper';
import ReportModel from '../../../postProcess/ReportModel';
import DialogService from '../../../services/DialogService';
import PostProcessService from '../../../services/PostProcessService';
import UIEventService from '../../../services/UIEventService';
import FmlxIcon from '../../icon/FmlxIcon';
import { withParams } from '../../wrappers';
import AnalyticalReportView from '../dashboard/analyticalReport/AnalyticalReportView';
import '../history/ReportExplorer.scss';
import ProtocolParameterForm from '../protocolEditor/ProtocolParameterForm';
import './ReportDetail.scss';
import '../protocolEditor/ProtocolEditor.scss';

const VIEW_NAME = 'report-detail-view';

type State = {
  error: string | undefined;
  report: ReportModel | undefined;
}

type Props = {
  params: { reportId: string }, // injected from react router
}

class ReportDetailView extends Component<Props, State> {
  @resolve(PostProcessService)
  private service: PostProcessService;
  @resolve(DialogService)
  private dialog: DialogService;

  constructor(props) {
    super(props);
    this.state = {
      error: undefined,
      report: undefined,
    };
  }
  componentDidMount() {
    const { reportId } = this.props.params;
    this.service.getReport(reportId)
      .then(this.handleReportLoaded)
      .catch(this.handleReportNotLoaded);
  }
  handleReportLoaded = (report: ReportModel) => {
    document.title = report.identifier;
    this.setState({ report, error: undefined });
  }
  handleReportNotLoaded = (e: any) => {
    this.dialog.alertError(e);
    this.setState({ error: 'Report Not Found' });
  }
  render() {
    const { error, report } = this.state;
    if (error || !report) {
      return (
        <div className="flex-common" style={{ width: '100vw', height: '100vh' }}>
          <h4 className="text-danger text-center">{error}</h4>
        </div>
      );
    }
    const header = <ReportHeader report={report} />;
    return (
      <div className="bg-white">
        <div className="mb-5 pb-2">
          <AnalyticalReportView customHeader={header} reportModel={report} />
          {report?.profile && (
            <div className="report-detail-protocol-view">
              <p>Protocol: <strong>{report.profile.name}</strong></p>
              <ProtocolParameterForm
                model={report.profile}
                sectionFieldChange={() => {}}
                addSection={() => {}}
                moveSection={() => {}}
                removeSection={() => {}}
                readOnly
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

const ReportHeader: React.FC<{ report: ReportModel }> = function ReportHeader({ report }) {
  const additionalFilesEl = React.useRef() as MutableRefObject<HTMLDivElement>;
  const service = useInjection(PostProcessService);
  const evtService = useInjection(UIEventService);
  const [showAdditionalFilesBtn, setShowAdditionalFilesBtn] = React.useState(false);
  const downloadLog = (type: LogType) => {
    service.downloadLog(report.identifier, type);
  };
  const toggleAdditionalFiles = () => {
    setShowAdditionalFilesBtn(!showAdditionalFilesBtn);
  };
  const onDocClick = (e: MouseEvent) => {
    if (!additionalFilesEl.current) {
      return;
    }
    if (!additionalFilesEl.current.contains(e.target as any)) {
      setShowAdditionalFilesBtn(false);
    }
  };
  const onLoad = () => {
    evtService.onDocumentClick.add(VIEW_NAME, onDocClick);
  };
  const onUnLoad = () => {
    evtService.onDocumentClick.remove(VIEW_NAME);
  };
  useEffect(() => {
    onLoad();
    return () => onUnLoad();
  }, []);
  return (
    <div className="report-detail-header mb-2">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 flex-common-x-start">
            <span className="regular-label">Active Protocol:</span>
            <span className="ms-3 report-detail-header-value">{report.protocolVersion}</span>
          </div>
          <div className="col-lg-1 regular-label flex-common-x-start">
            <span>Run ID</span>
          </div>
          <div className="col-lg-11 report-detail-header-value flex-common-x-start">
            <span>{report.identifier}</span>
          </div>
          <div className="col-lg-1 regular-label flex-common-x-start">
            <span>Duration</span>
          </div>
          <div className="col-lg-2 report-detail-header-value flex-common-x-start">
            <span>{DateHelper.formatTimeSpan(report.runDuration, 'm:s')}</span>
          </div>
          <div className="col-lg-9 flex-common-x-end">
            <div ref={additionalFilesEl} className="report-detail-button-additional-files pos-relative">
              <button type="button" className="report-detail-additional-files-btn ps-2 flex-common" onClick={toggleAdditionalFiles}>
                <div>Additional Files</div>
                <div className="ps-2 report-detail-additional-files-btn-icon flex-common">
                  <FmlxIcon
                    name="AngleDown"
                    customColor="#fff"
                    fontSize="xs"
                  />
                </div>
              </button>
              {
                showAdditionalFilesBtn &&
                (
                  <div className="report-detail-additional-files">
                    <LogDownloadBtn iconName="Instrument" label="Device Config" onClick={() => downloadLog(LogType.DeviceConfig)} />
                    <LogDownloadBtn iconName="FileJson" label="JSON" onClick={() => downloadLog(LogType.Report)} />
                    <LogDownloadBtn iconName="Explorer" label="Protocol" onClick={() => downloadLog(LogType.SequenceContent)} />
                    <LogDownloadBtn iconName="Camera" label="Sensor" onClick={() => downloadLog(LogType.Sensor)} />
                    <LogDownloadBtn iconName="Sequence" label="Sequence" onClick={() => downloadLog(LogType.SequenceLog)} />
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LogDownloadBtn: React.FC<{
  iconName: keyof typeof icons, label: string, onClick(): any
}> = function LogDownloadBtn({ iconName, label, onClick }) {
  return (
    <div
      className="report-detail-additional-files-item ps-4"
      onClick={onClick}
    >
      <FmlxIcon name={iconName} customColor="rgba(49, 49, 49, 1)" fontSize="xs" />
      <span className="ps-4">{label}</span>
    </div>
  );
};

export default withParams(ReportDetailView);
