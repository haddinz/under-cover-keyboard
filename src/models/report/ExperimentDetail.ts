import ExperimentResult from './ExperimentResult';
import RunInformation from './RunInformation';

export default interface ExperimentDetail {
  sampleInformation: RunInformation;
  experimentResult?: ExperimentResult;
}
