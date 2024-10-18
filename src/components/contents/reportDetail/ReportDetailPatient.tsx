import 'billboard.js/dist/billboard.css';
import { resolve } from 'inversify-react';
import React, { Component } from 'react';
import ExperimentResultStatus from '../../../enums/ExperimentResultStatus';
import { SectionEnum } from '../../../enums/SectionEnum';
import DateHelper from '../../../helper/DateHelper';
import ExperimentDetail from '../../../models/report/ExperimentDetail';
import ExperimentResult from '../../../models/report/ExperimentResult';
import ReportModel from '../../../postProcess/ReportModel';
import DialogService from '../../../services/DialogService';
import PostProcessService from '../../../services/PostProcessService';
import Header from '../../layout/Header';
import { withParams } from '../../wrappers';
import AnalyticalReportView from '../dashboard/analyticalReport/AnalyticalReportView';
import '../history/ReportExplorer.scss';
import './ReportDetailPatient.scss';
import ArrayHelper from '../../../helper/ArrayHelper';
import AssayTestSummary from '../../../enums/AssayTestSummary';

type State = {
  error: string | undefined;
  report: ReportModel | undefined;
  experimentDetail: ExperimentDetail | undefined;
  showGraph: boolean;
}
type Props = { params: { reportId: string } /* injected from react router */ }
type AntibioticsResistance = { name: string, value?: string }

class ReportDetailPatient extends Component<Props, State> {
  @resolve(PostProcessService)
  private service: PostProcessService;
  @resolve(DialogService)
  private dialog: DialogService;

  constructor(props) {
    super(props);
    this.state = {
      error: undefined,
      report: undefined,
      experimentDetail: undefined,
      showGraph: false,
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
    this.setState({ report, error: undefined }, this.loadRunInformation);
  }
  handleReportNotLoaded = (e: any) => {
    this.dialog.alertError(e);
    this.setState({ error: 'Report Not Found' });
  }
  loadRunInformation = () => {
    const { reportId } = this.props.params;
    this.service.getExperimentDetail(reportId)
      .then(this.handleRunInfo)
      .catch(this.dialog.alertError);
  }
  handleRunInfo = (detail: ExperimentDetail) => {
    this.setState({ experimentDetail: detail });
  }
  toggleGraph = () => {
    const { showGraph } = this.state;
    this.setState({ showGraph: !showGraph });
  }
  render() {
    const { error, report, experimentDetail: detail, showGraph } = this.state;
    if (error || !report) {
      return (
        <div className="flex-common" style={{ width: '100vw', height: '100vh' }}>
          <h4 className="text-danger text-center">{error}</h4>
        </div>
      );
    }
    return (
      <div className="test-result-container px-3">
        <Header section={SectionEnum.Stampede} content={null} />
        <div className="main-content mt-2 py-2">
          {detail && <TestResultStatus result={detail.experimentResult} />}
          {detail && <TestResult detail={detail} report={report} />}
          <ToggleGraphButton onClick={this.toggleGraph} graphShown={showGraph} />
          {showGraph && (
            <div className="px-4">
              <AnalyticalReportView customHeader={null} reportModel={report} />
            </div>
          )}
          <MessageBanner />
        </div>
      </div>
    );
  }
}

const MessageBanner: React.FC = function MessageBanner() {
  return (
    <div className="test-result-banner">
      <div className="test-result-banner-title">
        You can eject the chip now. Insert a new chip to initiate another run.
      </div>
      <div className="test-result-banner-description">
        You can keep this window to review the latest report from your previous test while running another one
      </div>
    </div>
  );
};

const ToggleGraphButton: React.FC<{ onClick(): any, graphShown: boolean }> = function ToggleGraphButton({ onClick, graphShown }) {
  return (
    <div className="flex-common-x-end px-5">
      <button type="button" onClick={onClick} className="test-result-graph-toggle-btn">
        {graphShown ? 'Hide Graphs...' : 'Show Graphs...'}
      </button>
    </div>
  );
};

const TestResult: React.FC<{ detail: ExperimentDetail, report: ReportModel }> = function TestResult({ detail, report }) {
  const { sampleInformation: runInfo } = detail;
  return (
    <div className="test-result my-4">
      <div className="run-information">
        <div className="mb-5">
          <RunInfoField label="Chip S/N" value={runInfo.chipIdentifier} />
          <RunInfoField label="Test Type" value={runInfo.type} />
          <RunInfoField label="Expired Date" value={runInfo.expiredDate} />
        </div>

        <div className="mb-5">
          <RunInfoField label="Sample ID" value={runInfo.sampleIdentifier} />
          <RunInfoField label="Patient Name" value={runInfo.patientName} />
        </div>

        <div className="mb-5">
          <RunInfoField label="Tester Name" value={runInfo.testerName} />
          <RunInfoField label="Note" value={runInfo.note} />
          <RunInfoField label="Run Started" value={report.runStartedAt ? DateHelper.formatDateToString('YYYY_MM_DD_H_M_S', new Date(report.runStartedAt)) : ''} />
        </div>
      </div>
      <div className="antibiotics-resistances">
        <div className="antibiotics-resistances-header px-3 py-2">
          Antibiotics Resistances
        </div>
        <AntibioticsResistances values={parseAntibioticsResistances(report)} />
      </div>
    </div>
  );
};

const AntibioticsResistances: React.FC<{ values: AntibioticsResistance[] }> = function AntibioticsResistances({ values }) {
  const valuesFilled = values.length >= 10 ? values : ArrayHelper.fillMissing(values, 10, null);
  return (
    <div className="antibiotics-resistances-body px-3 py-2">
      {valuesFilled.map((v) => {
        if (v === null) {
          return <div className="antibiotics-resistances-item" />;
        }
        return (
          <div className="antibiotics-resistances-item" key={v.name}>
            <div className="antibiotics-resistances-title">{v.name}</div>
            {v.value && <div className="antibiotics-resistances-value">({v.value})</div>}
          </div>
        );
      })}
    </div>
  );
};

const RunInfoField: React.FC<{ label: string, value?: string }> = function RunInfoField({ label, value }) {
  return (
    <div className="run-information-field mb-2">
      <div className="run-information-label">{label}</div>
      <div className="run-information-value">: {!value || value.trim() === '' ? '-' : value}</div>
    </div>
  );
};
RunInfoField.defaultProps = { value: '' };

const TestResultStatus: React.FC<{ result: ExperimentResult | undefined }> = function TestResultStatus({ result }) {
  let label = '';
  let className = '';
  switch (result?.status) {
    case ExperimentResultStatus.Positive:
      label = 'TARGET DETECTED';
      className = 'test-result-status test-result-status-positive';
      break;
    case ExperimentResultStatus.Negative:
      label = 'NO TARGET DETECTED';
      className = 'test-result-status test-result-status-negative';
      break;
    case ExperimentResultStatus.Inconclusive:
      label = 'INDETERMINATE';
      className = 'test-result-status test-result-status-indeterminate';
      break;
    case ExperimentResultStatus.Failed:
    default:
      label = 'ERROR';
      className = 'test-result-status test-result-status-error';
      break;
  }
  return (
    <div className={`flex-common ${className}`}>
      <div className="d-flex">
        <div className="test-result-status-label">Test Result: </div>
        <div className="test-result-status-value ms-3">{label}</div>
      </div>
    </div>
  );
};

const getAntibioticsName = (sum: AssayTestSummary) : string | null => {
  switch (sum) {
    case AssayTestSummary.IsoResistant:
    case AssayTestSummary.IsoSensitive:
      return 'Isoniazid';
    case AssayTestSummary.RifResistant:
    case AssayTestSummary.RifSensitive:
      return 'Rifamphicin';
    default:
      break;
  }
  return null;
};
const getAntibioticsValue = (sum: AssayTestSummary) : string | null => {
  switch (sum) {
    case AssayTestSummary.IsoResistant:
    case AssayTestSummary.RifResistant:
      return 'Resistant';
    case AssayTestSummary.IsoSensitive:
    case AssayTestSummary.RifSensitive:
      return 'Resistant';
    default:
      break;
  }
  return null;
};
const parseAntibioticsResistances = (report: ReportModel) => {
  const values: AntibioticsResistance[] = [];
  if (!report.assayTestSummary) {
    return values;
  }
  const item1 = report.assayTestSummary[0];
  if (item1 !== AssayTestSummary.MtbPositive) {
    return values;
  }
  const otherItems = report.assayTestSummary.filter((_, i) => i > 0);
  return otherItems.map((sum) => {
    const name = getAntibioticsName(sum);
    if (name == null) {
      return null;
    }
    const value = getAntibioticsValue(sum);
    return { name, value }
  }).filter((a) => a != null) as AntibioticsResistance[];
}

export default withParams(ReportDetailPatient);
