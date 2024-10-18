import ExperimentResultStatus from "../../enums/ExperimentResultStatus";

export default interface ExperimentResult {
  status: ExperimentResultStatus;
  description?: string;
}
