export default interface SelfDiagnoseResult {
  hasError: boolean;
  elementDiagnoseResults: ElementDiagnoseResult[];
}

interface ElementDiagnoseResult {
  name: string;
  date: string;
  errorCode: string;
  errorMessage: string;
}
