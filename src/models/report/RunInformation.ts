export default interface RunInformation {
  runIdentifier: string;
  chipIdentifier: string;
  sampleIdentifier: string;
  type: string;
  expiredDate?: string;
  patientName: string;
  testerName: string;
  note: string;
}
