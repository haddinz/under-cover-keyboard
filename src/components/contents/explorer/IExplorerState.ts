import IRecordResult from '../../../interfaces/IRecordResult';

export default interface IExplorerState<T> {
  items: T[];
  selectedItems: T[];
  getParams: IRecordResult<T>;
  itemsLoaded: boolean;
  isRecordsEmpty: boolean;
  isNoRecordsMatch: boolean;
}
